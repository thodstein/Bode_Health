document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }

    const state = { stack: [], currentWeek: 1, trust: 0, xp: 0 };

    // Init Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Init Substance Select
    const subSelect = document.getElementById('drug-substance');
    DB.substances.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.name;
        subSelect.appendChild(opt);
    });

    // App Functions
    window.App = {
        loadEsters: () => {
            const subId = document.getElementById('drug-substance').value;
            const estSelect = document.getElementById('drug-ester');
            estSelect.innerHTML = '';
            const esters = DB.esters[subId];
            if (esters) {
                estSelect.disabled = false;
                esters.forEach(e => {
                    const opt = document.createElement('option');
                    opt.value = e.id;
                    opt.textContent = `${e.name} (T1/2: ${e.halfLife} дн.)`;
                    estSelect.appendChild(opt);
                });
            } else {
                estSelect.disabled = true;
                const opt = document.createElement('option');
                opt.textContent = "Без эфира (Орал/Пептид)";
                estSelect.appendChild(opt);
            }
        },
        addDrug: (e) => {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const weeks = parseInt(document.getElementById('drug-weeks').value);
            
            state.stack.push({ substanceId: subId, esterId, dose, duration: weeks });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-ester').disabled = true;
        },
        renderStack: () => {
            const list = document.getElementById('stack-list');
            list.innerHTML = '';
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div>
                        <strong>${sub.name}</strong> ${ester ? '('+ester.name+')' : ''}
                        <br><small>${item.dose} мг/нед | ${item.duration} нед.</small>
                    </div>
                    <button class="btn-delete" onclick="state.stack.splice(${idx},1); App.renderStack()">✕</button>
                `;
                list.appendChild(div);
            });
        },
        generatePlan: () => {
            const plan = Engine.generateWeeklyPlan(state.stack);
            const out = document.getElementById('weekly-plan-output');
            out.innerHTML = '<h3>План курса</h3>';
            
            plan.forEach(w => {
                const r = w.risks;
                const avgRisk = (r.liver+r.cardio+r.kidney+r.neuro+r.hemato+r.endo+r.repro)/7;
                const color = avgRisk > 50 ? 'red' : (avgRisk > 30 ? 'orange' : 'green');
                
                out.innerHTML += `
                    <div class="week-card" style="border-left: 4px solid ${color}">
                        <h4>Неделя ${w.week}</h4>
                        <p>Препараты: ${w.drugs.join(', ') || 'Нет'}</p>
                        <div class="mini-stats">
                            <span>Печень: ${r.liver}%</span>
                            <span>Сердце: ${r.cardio}%</span>
                            <span>Кровь: ${r.hemato}%</span>
                            <span style="color:${color}; font-weight:bold">Avg Risk: ${Math.round(avgRisk)}%</span>
                        </div>
                        <details>
                            <summary>Рекомендации поддержки</summary>
                            <ul>${DB.supportProtocol.map(b => `<li>${b.title}: ${b.items.map(i=>i.name).join(', ')}</li>`).join('')}</ul>
                        </details>
                    </div>
                `;
            });
            
            // Update Charts
            App.updateCharts(plan);
            // Gamification
            state.xp += 100;
            document.getElementById('xp-display').textContent = `XP: ${state.xp}`;
        },
        updateCharts: (plan) => {
            // Trend Chart
            const ctxTrend = document.getElementById('risk-trend-chart');
            if (ctxTrend) {
                if (window.trendChart) window.trendChart.destroy();
                const labels = plan.map(p => `W${p.week}`);
                const dataLiver = plan.map(p => p.risks.liver);
                const dataCardio = plan.map(p => p.risks.cardio);
                const dataHemato = plan.map(p => p.risks.hemato);
                
                window.trendChart = new Chart(ctxTrend, {
                    type: 'line',
                     {
                        labels: labels,
                        datasets: [
                            { label: 'Печень', data: dataLiver, borderColor: '#ff6384' },
                            { label: 'Сердце', data: dataCardio, borderColor: '#36a2eb' },
                            { label: 'Кровь', data: dataHemato, borderColor: '#ff9f40' }
                        ]
                    },
                    options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } }, scales: { y: { ticks: { color: 'gray' } }, x: { ticks: { color: 'gray' } } } }
                });
            }
            
            // Radar for current week
            const curr = plan[state.currentWeek-1] || plan[0];
            const ctxRadar = document.getElementById('risk-radar-chart');
            if (ctxRadar) {
                if (window.radarChart) window.radarChart.destroy();
                const r = curr.risks;
                window.radarChart = new Chart(ctxRadar, {
                    type: 'radar',
                     {
                        labels: ['Печень', 'Сердце', 'Почки', 'Невро', 'Кровь', 'Эндо', 'Репро'],
                        datasets: [{
                            label: `Неделя ${curr.week}`,
                             [r.liver, r.cardio, r.kidney, r.neuro, r.hemato, r.endo, r.repro],
                            backgroundColor: 'rgba(0, 218, 198, 0.4)',
                            borderColor: '#03dac6'
                        }]
                    },
                    options: { scales: { r: { ticks: { color: 'gray' }, grid: { color: '#444' } } }, plugins: { legend: { labels: { color: 'white' } } } }
                });
                document.getElementById('dash-risk').textContent = Math.round((r.liver+r.cardio+r.kidney+r.neuro+r.hemato+r.endo+r.repro)/7) + '%';
            }
        },
        calcFertility: () => {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            const ifScore = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr, morphology: morph });
            const res = document.getElementById('fertility-result');
            res.innerHTML = `<h3>IF: ${ifScore}/100</h3><p>${ifScore > 60 ? 'Норма' : 'Требуется внимание'}</p>`;
        },
        exportJSON: () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr);
            node.setAttribute("download", "bode_health_backup.json");
            document.body.appendChild(node);
            node.click();
            node.remove();
        },
        renderShop: () => {
            const list = document.getElementById('shop-list');
            list.innerHTML = '';
            for (const [key, items] of Object.entries(DB.shopItems)) {
                items.forEach(item => {
                    list.innerHTML += `
                        <div class="drug-card">
                            <div>
                                <strong>${key.toUpperCase()}</strong><br>
                                <small>${item.platform}</small>
                            </div>
                            <div>
                                <span style="color:#03dac6">${item.price}</span>
                                <a href="${item.url}" target="_blank" class="btn-primary" style="font-size:0.8em; padding:5px 10px; margin-left:10px; text-decoration:none;">Купить</a>
                            </div>
                        </div>
                    `;
                });
            }
        },
        renderGlossary: () => {
            const list = document.getElementById('glossary-list');
            list.innerHTML = '';
            for (const [term, def] of Object.entries(DB.glossary)) {
                list.innerHTML += `<div class="drug-card"><strong>${term}</strong><p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${def}</p></div>`;
            }
        }
    };

    document.getElementById('add-drug-form').addEventListener('submit', App.addDrug);
    
    // Init
    App.renderStack();
    App.renderShop();
    App.renderGlossary();
    document.getElementById('trust-score-display').textContent = `Trust: ${Engine.calculateTrustScore({ daysLogged: 10, labsUploaded: true, supportCompliance: 0.9 })}`;
});
