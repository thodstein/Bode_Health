document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }

    const state = { stack: [], currentWeek: 1, trust: 0, xp: 0 };

    // Tabs
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
                opt.textContent = "Без эфира";
                estSelect.appendChild(opt);
            }
        },
        addDrug: (e) => {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const startW = parseInt(document.getElementById('drug-start').value);
            const endW = parseInt(document.getElementById('drug-end').value);
            
            if (startW >= endW) return alert("Неделя окончания должна быть больше начала!");

            state.stack.push({ substanceId: subId, esterId, dose, startWeek: startW, endWeek: endW });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-start').value = 1;
            document.getElementById('drug-end').value = 12;
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
                        <br><small>${item.dose} мг/нед | С ${item.startWeek} по ${item.endWeek} нед.</small>
                    </div>
                    <button class="btn-delete" onclick="state.stack.splice(${idx},1); App.renderStack()">✕</button>
                `;
                list.appendChild(div);
            });
        },
        generatePlan: () => {
            const plan = Engine.generateCoursePlan(state.stack);
            const out = document.getElementById('weekly-plan-output');
            out.innerHTML = '<h3>План курса и выведения</h3>';
            
            plan.forEach(w => {
                const r = w.risks;
                const avgRisk = (r.liver+r.cardio+r.kidney+r.neuro+r.hemato+r.endo+r.repro)/7;
                const color = avgRisk > 50 ? '#cf6679' : (avgRisk > 30 ? '#ffeb3b' : '#03dac6');
                const status = w.isPostCycle ? '(ПКТ/Вывод)' : '';
                
                out.innerHTML += `
                    <div class="week-card" style="border-left: 4px solid ${color}">
                        <h4>Неделя ${w.week} ${status}</h4>
                        <p>Препараты: ${w.activeDrugs.length ? w.activeDrugs.map(d => DB.substances.find(s=>s.id===d.substanceId).name).join(', ') : 'Нет активных'}</p>
                        <div class="mini-stats">
                            <span>Печень: ${r.liver}%</span>
                            <span>Сердце: ${r.cardio}%</span>
                            <span>Кровь: ${r.hemato}%</span>
                            <span style="color:${color}; font-weight:bold">Avg: ${Math.round(avgRisk)}%</span>
                        </div>
                    </div>
                `;
            });
            
            App.updateCharts(plan);
            state.xp += 100;
            document.getElementById('xp-display').textContent = `XP: ${state.xp}`;
            alert('План рассчитан! Перейдите во вкладку "Риски" для графиков.');
        },
        updateCharts: (plan) => {
            // 1. Trend Chart (Line)
            const ctxTrend = document.getElementById('risk-trend-chart');
            if (ctxTrend) {
                if (window.trendChart) window.trendChart.destroy();
                const labels = plan.map(p => `W${p.week}`);
                const dataLiver = plan.map(p => p.risks.liver);
                const dataCardio = plan.map(p => p.risks.cardio);
                const dataHemato = plan.map(p => p.risks.hemato);
                const dataNeuro = plan.map(p => p.risks.neuro);
                
                window.trendChart = new Chart(ctxTrend, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            { label: 'Печень', data: dataLiver, borderColor: '#ff6384', tension: 0.3 },
                            { label: 'Сердце', data: dataCardio, borderColor: '#36a2eb', tension: 0.3 },
                            { label: 'Кровь', data: dataHemato, borderColor: '#ff9f40', tension: 0.3 },
                            { label: 'Невро', data: dataNeuro, borderColor: '#9966ff', tension: 0.3 }
                        ]
                    },
                    options: { 
                        responsive: true, 
                        plugins: { legend: { labels: { color: 'white' } } }, 
                        scales: { y: { beginAtZero: true, max: 100, ticks: { color: 'gray' } }, x: { ticks: { color: 'gray' } } } 
                    }
                });
            }
            
            // 2. Radar Chart (Current Week or Max Risk)
            const curr = plan[state.currentWeek-1] || plan[0];
            const ctxRadar = document.getElementById('risk-radar-chart');
            if (ctxRadar) {
                if (window.radarChart) window.radarChart.destroy();
                const r = curr.risks;
                window.radarChart = new Chart(ctxRadar, {
                    type: 'radar',
                    data: {
                        labels: ['Печень', 'Сердце', 'Почки', 'Невро', 'Кровь', 'Эндо', 'Репро'],
                        datasets: [{
                            label: `Неделя ${curr.week}`,
                            data: [r.liver, r.cardio, r.kidney, r.neuro, r.hemato, r.endo, r.repro],
                            backgroundColor: 'rgba(3, 218, 198, 0.4)',
                            borderColor: '#03dac6',
                            borderWidth: 2
                        }]
                    },
                    options: { 
                        scales: { r: { beginAtZero: true, max: 100, ticks: { color: 'gray', backdropColor: 'transparent' }, grid: { color: '#444' } } }, 
                        plugins: { legend: { labels: { color: 'white' } } } 
                    }
                });
                
                // Update Dashboard
                const avg = (r.liver+r.cardio+r.kidney+r.neuro+r.hemato+r.endo+r.repro)/7;
                document.getElementById('dash-risk').textContent = Math.round(avg) + '%';
                document.getElementById('dash-readiness').textContent = Math.max(10, 100 - Math.round(avg));
                document.getElementById('dash-fatigue').textContent = Math.min(90, Math.round(avg * 0.8));
                
                // Render Mechanism Details (Text List)
                const details = Engine.getMechanismBreakdown(state.stack, curr.week);
                const detDiv = document.getElementById('mechanism-details');
                detDiv.innerHTML = '<h4>Детализация механизмов (Неделя '+curr.week+')</h4>';
                for (const [sys, mechanisms] of Object.entries(details)) {
                    detDiv.innerHTML += `<div class="drug-card"><strong>${sys.toUpperCase()}</strong><br>` + 
                        mechanisms.map(m => `<small>${m.name}: ${m.value}%</small>`).join(' | ') + '</div>';
                }
            }
        },
        calcFertility: () => {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            const ifScore = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr, morphology: morph });
            const res = document.getElementById('fertility-result');
            res.innerHTML = `<h3>IF: ${ifScore}/100</h3><p>${ifScore > 60 ? '✅ Норма' : '⚠️ Требуется внимание'}</p>`;
        },
        exportJSON: () => {
            const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr);
            node.setAttribute("download", "bode_health_course.json");
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
                            <div><strong>${key.toUpperCase()}</strong><br><small>${item.platform}</small></div>
                            <div><span style="color:#03dac6">${item.price}</span> <a href="${item.url}" class="btn-primary" style="font-size:0.7em; padding:4px 8px; margin-left:5px; text-decoration:none;">Buy</a></div>
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
    App.renderStack();
    App.renderShop();
    App.renderGlossary();
    document.getElementById('trust-score-display').textContent = `Trust: ${Engine.calculateFertilityIndex({volume:2, conc:20}) > 0 ? 50 : 0}`; // Mock
});
