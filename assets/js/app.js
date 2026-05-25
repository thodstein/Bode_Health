document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }

    const state = { stack: [], plan: [], currentWeek: 1, trust: 0, xp: 0 };

    // Навигация
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Инициализация селектов
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
            if (esters && esters.length > 0) {
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
            
            if (!dose || !weeks) return alert("Заполните дозу и недели!");

            state.stack.push({ substanceId: subId, esterId, dose, duration: weeks });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-ester').disabled = true;
            alert("Препарат добавлен! Нажмите 'Рассчитать план'.");
        },

        renderStack: () => {
            const list = document.getElementById('stack-list');
            list.innerHTML = '';
            if (state.stack.length === 0) {
                list.innerHTML = '<div class="empty-state">Стек пуст</div>';
                return;
            }
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
            if (state.stack.length === 0) return alert("Сначала добавьте препараты!");
            
            state.plan = Engine.generateWeeklyPlan(state.stack);
            const out = document.getElementById('weekly-plan-output');
            out.innerHTML = `<h3>План курса (${state.plan.length} недель)</h3>`;
            
            state.plan.forEach((w, idx) => {
                const raw = w.risks;
                const net = Engine.calculateNetRisks(raw);
                
                // Средний риск
                let sumRaw = 0, count = 0;
                for(let s in raw) for(let m in raw[s]) { sumRaw += raw[s][m]; count++; }
                const avgRaw = Math.round(sumRaw / count);
                
                let sumNet = 0;
                for(let s in net) for(let m in net[s]) { sumNet += net[s][m]; }
                const avgNet = Math.round(sumNet / count);

                const color = avgNet > 50 ? '#cf6679' : (avgNet > 30 ? '#ff9f40' : '#03dac6');
                const isActive = w.isOnCycle ? '🟢 На курсе' : '🟡 Выведение';

                out.innerHTML += `
                    <div class="week-card" style="border-left: 4px solid ${color}">
                        <div style="display:flex; justify-content:space-between;">
                            <h4>Неделя ${w.week} <small>(${isActive})</small></h4>
                            <span style="font-weight:bold; color:${color}">Risk: ${avgRaw}% → ${avgNet}%</span>
                        </div>
                        <p style="font-size:0.9em; color:#aaa">Активные препараты: ${w.activeDrugs.length ? w.activeDrugs.map(d => DB.substances.find(s=>s.id===d.substanceId).name).join(', ') : 'Нет (пост-курс)'}</p>
                        
                        <details>
                            <summary>Детали рисков и поддержка</summary>
                            <div style="margin-top:10px; font-size:0.85em;">
                                <p><strong>Ключевые риски:</strong> Печень: ${raw.liver.cholestasis}%, Кровь: ${raw.hemato.erythrocytosis}%, Сердце: ${raw.cardio.lipids}%</p>
                                <p><strong>Рекомендации:</strong> ${DB.supportProtocol.map(b => `${b.title}: ${b.items.slice(0,2).map(i=>i.name).join(', ')}`).join('; ')}</p>
                            </div>
                        </details>
                    </div>
                `;
            });

            App.renderMatrixTable(state.plan[0]); // Показать первую неделю
            App.updateTrendChart(state.plan);
            
            state.xp += 100;
            document.getElementById('xp-display').textContent = `XP: ${state.xp}`;
            document.getElementById('dash-risk').textContent = state.plan[0] ? Math.round(state.plan[0].risks.liver.cholestasis) + '%' : '--';
        },

        renderMatrixTable: (weekData) => {
            const table = document.getElementById('risk-matrix-table');
            if (!weekData) return;
            
            const raw = weekData.risks;
            const net = Engine.calculateNetRisks(raw);
            
            const systems = {
                liver: 'Печень', cardio: 'Сердце', kidney: 'Почки', neuro: 'Невро', hemato: 'Кровь', endo: 'Эндо', repro: 'Репро'
            };
            
            let html = `<thead><tr><th>Система / Механизм</th>`;
            for (let mech in raw.liver) html += `<th>${mech}</th>`;
            html += `</tr></thead><tbody>`;

            for (let sys in raw) {
                html += `<tr><td class="sys-name">${systems[sys]}</td>`;
                for (let mech in raw[sys]) {
                    const rVal = raw[sys][mech];
                    const nVal = net[sys][mech];
                    const diff = rVal - nVal;
                    const color = nVal > 50 ? 'bg-red' : (nVal > 30 ? 'bg-orange' : 'bg-green');
                    
                    html += `
                        <td class="matrix-cell ${color}">
                            <div class="cell-val">${nVal}%</div>
                            <div class="cell-diff">${diff > 0 ? '↓'+diff : ''}</div>
                        </td>
                    `;
                }
                html += `</tr>`;
            }
            html += `</tbody>`;
            table.innerHTML = html;
        },

        updateTrendChart: (plan) => {
            const ctx = document.getElementById('risk-trend-chart');
            if (!ctx) return;
            if (window.trendChart) window.trendChart.destroy();

            const labels = plan.map(p => `W${p.week}`);
            // Берем среднее по всем системам для каждой недели
            const dataAvg = plan.map(p => {
                let sum = 0, cnt = 0;
                const net = Engine.calculateNetRisks(p.risks);
                for(let s in net) for(let m in net[s]) { sum += net[s][m]; cnt++; }
                return Math.round(sum/cnt);
            });

            window.trendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Средний Net Risk',
                        data: dataAvg,
                        borderColor: '#03dac6',
                        backgroundColor: 'rgba(3, 218, 198, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { labels: { color: 'white' } } },
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } },
                        x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
                    }
                }
            });
        },

        calcFertility: () => {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            if (!vol || !conc) return alert("Введите данные");
            const ifScore = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr, morphology: morph });
            document.getElementById('fertility-result').innerHTML = `<h3>IF: ${ifScore}/100</h3><p>${ifScore > 60 ? '✅ Норма' : '⚠️ Требуется внимание'}</p>`;
        },

        exportJSON: () => {
            const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr);
            node.setAttribute("download", "bode_health_plan.json");
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
                            <div><span style="color:#03dac6">${item.price}</span> <a href="${item.url}" class="btn-primary" style="padding:5px 10px; font-size:0.8em; margin-left:10px; text-decoration:none;">Buy</a></div>
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

    // Привязка событий
    document.getElementById('add-drug-form').addEventListener('submit', App.addDrug);
    document.getElementById('btn-generate-plan').addEventListener('click', App.generatePlan);
    
    // Init
    App.renderStack();
    App.renderShop();
    App.renderGlossary();
});
