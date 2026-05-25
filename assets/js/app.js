document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }
    
    const state = { stack: [], plan: [], currentWeek: 1, visibleDatasets: ['liver', 'cardio', 'hemato', 'endo'] };
    let trendChartInstance = null;

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
        opt.value = s.id; opt.textContent = s.name;
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
                    opt.value = e.id; opt.textContent = `${e.name} (T1/2: ${e.halfLife}д)`;
                    estSelect.appendChild(opt);
                });
            } else {
                estSelect.disabled = true;
                estSelect.innerHTML = '<option>Без эфира</option>';
            }
        },
        addDrug: (e) => {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const start = parseInt(document.getElementById('drug-start').value);
            const duration = parseInt(document.getElementById('drug-duration').value);
            
            state.stack.push({ substanceId: subId, esterId, dose, startWeek: start, duration });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-start').value = 1;
            document.getElementById('drug-ester').disabled = true;
        },
        renderStack: () => {
            const list = document.getElementById('stack-list');
            list.innerHTML = '';
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const endWeek = item.startWeek + item.duration - 1;
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div>
                        <strong>${sub.name}</strong> ${ester ? '('+ester.name+')' : ''}
                        <br><small>${item.dose}мг | С ${item.startWeek} по ${endWeek} нед.</small>
                    </div>
                    <button class="btn-delete" onclick="state.stack.splice(${idx},1); App.renderStack()">✕</button>
                `;
                list.appendChild(div);
            });
        },
        generatePlan: () => {
            state.plan = Engine.generateWeeklyPlan(state.stack);
            if (state.plan.length === 0) return alert('Добавьте препараты');
            
            // Fill Week Selector
            const sel = document.getElementById('week-selector');
            sel.innerHTML = '';
            state.plan.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.week;
                opt.textContent = `Неделя ${p.week} ${p.isWashout ? '(Выведение)' : ''}`;
                sel.appendChild(opt);
            });

            // Render Trend Chart
            App.renderTrendChart();
            // Render First Week Details
            state.currentWeek = 1;
            App.renderWeekDetails();
            
            // Update Dashboard
            const maxRisk = Math.max(...state.plan.map(p => (p.risks.liver+p.risks.cardio+p.risks.hemato)/3));
            document.getElementById('dash-max-risk').textContent = Math.round(maxRisk) + '%';
            document.getElementById('dash-duration').textContent = state.plan.length + ' нед.';
            document.getElementById('dash-status').textContent = maxRisk > 50 ? '⚠️ Высокий риск' : '✅ Относительно безопасно';
            
            state.xp += 150;
            document.getElementById('xp-display').textContent = `XP: ${state.xp}`;
        },
        renderTrendChart: () => {
            const ctx = document.getElementById('risk-trend-chart');
            if (trendChartInstance) trendChartInstance.destroy();
            
            const labels = state.plan.map(p => `W${p.week}`);
            const datasets = [];
            const colors = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', endo: '#4bc0c0', kidney: '#9966ff', neuro: '#c9cbcf', repro: '#e7e9ed' };
            
            ['liver', 'cardio', 'kidney', 'neuro', 'hemato', 'endo', 'repro'].forEach(key => {
                datasets.push({
                    label: key.toUpperCase(),
                    data: state.plan.map(p => p.risks[key]),
                    borderColor: colors[key],
                    backgroundColor: colors[key],
                    hidden: !state.visibleDatasets.includes(key),
                    tension: 0.3
                });
            });

            trendChartInstance = new Chart(ctx, {
                type: 'line',
                 { labels, datasets },
                options: {
                    responsive: true,
                    interaction: { mode: 'index', intersect: false },
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, max: 100, grid: { color: '#333' }, ticks: { color: '#aaa' } }, x: { grid: { color: '#333' }, ticks: { color: '#aaa' } } }
                }
            });
        },
        toggleDataset: (key) => {
            if (state.visibleDatasets.includes(key)) {
                state.visibleDatasets = state.visibleDatasets.filter(k => k !== key);
            } else {
                state.visibleDatasets.push(key);
            }
            if (trendChartInstance) {
                trendChartInstance.data.datasets.forEach(ds => {
                    ds.hidden = !state.visibleDatasets.includes(ds.label.toLowerCase());
                });
                trendChartInstance.update();
            }
        },
        renderWeekDetails: () => {
            const weekNum = parseInt(document.getElementById('week-selector').value);
            const data = state.plan.find(p => p.week === weekNum);
            if (!data) return;

            // Render Heatmap
            const container = document.getElementById('risk-heatmap');
            container.innerHTML = '';
            
            const systems = ['liver', 'cardio', 'kidney', 'neuro', 'hemato', 'endo', 'repro'];
            const sysNames = { liver: 'Печень', cardio: 'Сердце', kidney: 'Почки', neuro: 'Невро', hemato: 'Кровь', endo: 'Эндо', repro: 'Репро' };

            systems.forEach(sys => {
                const row = document.createElement('div');
                row.className = 'heatmap-row';
                row.innerHTML = `<div class="hm-label">${sysNames[sys]}</div>`;
                
                const mechanisms = DB.riskMatrixDef[sys];
                mechanisms.forEach(mech => {
                    // Имитация распределения общего риска системы по механизмам (для визуализации)
                    // В реальной версии нужно хранить детальные риски в плане
                    const baseRisk = data.risks[sys];
                    const mechRisk = Math.round(baseRisk * (0.5 + Math.random()*0.5)); // Вариация
                    
                    const cell = document.createElement('div');
                    cell.className = `hm-cell risk-${mechRisk > 60 ? 'high' : mechRisk > 30 ? 'med' : 'low'}`;
                    cell.title = mech;
                    cell.textContent = mechRisk + '%';
                    row.appendChild(cell);
                });
                container.appendChild(row);
            });
        },
        calcFertility: () => {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            const ifScore = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr, morphology: morph });
            document.getElementById('fertility-result').innerHTML = `<h3>IF: ${ifScore}/100</h3><p>${ifScore > 60 ? 'Норма' : 'Внимание'}</p>`;
        },
        renderShop: () => {
            const list = document.getElementById('shop-list');
            list.innerHTML = '';
            for (const [key, items] of Object.entries(DB.shopItems)) {
                items.forEach(item => {
                    list.innerHTML += `<div class="drug-card"><div><strong>${key}</strong><br><small>${item.platform}</small></div><div><span>${item.price}</span> <a href="${item.url}" class="btn-primary" style="padding:5px;">Buy</a></div></div>`;
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
});
