document.addEventListener('DOMContentLoaded', () => {
    const state = { 
        stack: [], 
        plan: [], 
        currentWeekIdx: 0, 
        chartVisibility: { liver:true, cardio:true, hemato:true, neuro:false, kidney:false, endo:false, repro:false },
        xp: 0
    };

    // Tabs Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // Init Substance Select
    const subSelect = document.getElementById('drug-substance');
    if(DB && DB.substances) {
        DB.substances.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            subSelect.appendChild(opt);
        });
    }

    window.App = {
        loadEsters: function() {
            const subId = document.getElementById('drug-substance').value;
            const estSelect = document.getElementById('drug-ester');
            estSelect.innerHTML = '';
            
            // Проверка: есть ли эфиры у этого вещества
            if (DB.esters && DB.esters[subId] && DB.esters[subId].length > 0) {
                estSelect.disabled = false;
                DB.esters[subId].forEach(e => {
                    const opt = document.createElement('option');
                    opt.value = e.id;
                    opt.textContent = `${e.name} (T1/2: ${e.hl} дн.)`;
                    estSelect.appendChild(opt);
                });
            } else {
                // Для оралов и пептидов без эфиров
                estSelect.disabled = true;
                const opt = document.createElement('option');
                opt.value = 'none';
                opt.textContent = 'Таблетки / Пептид';
                estSelect.appendChild(opt);
            }
        },
        
        addDrug: function(e) {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            let esterId = document.getElementById('drug-ester').value;
            if (esterId === 'none') esterId = null;
            
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const start = parseInt(document.getElementById('drug-start').value);
            const end = parseInt(document.getElementById('drug-end').value);
            
            if (start >= end) return alert('Неделя финиша должна быть больше старта!');
            
            state.stack.push({ substanceId: subId, esterId, dose, startWeek: start, endWeek: end });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-ester').disabled = true;
            document.getElementById('drug-start').value = 1;
            document.getElementById('drug-end').value = 8;
            // Сброс выбора эфира визуально
            App.loadEsters(); 
        },
        
        renderStack: function() {
            const list = document.getElementById('stack-list');
            list.innerHTML = '';
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                let esterName = '';
                if (item.esterId && DB.esters[item.substanceId]) {
                    const ester = DB.esters[item.substanceId].find(e => e.id === item.esterId);
                    if (ester) esterName = '(' + ester.name + ')';
                }
                
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div><strong>${sub.name}</strong> ${esterName}<br><small>${item.dose}мг | Недели ${item.startWeek}-${item.endWeek}</small></div>
                    <button class="btn-delete" onclick="App.removeDrug(${idx})">✕</button>
                `;
                list.appendChild(div);
            });
        },
        
        removeDrug: function(idx) {
            state.stack.splice(idx, 1);
            App.renderStack();
        },
        
        generatePlan: function() {
            if (state.stack.length === 0) return alert('Добавьте препараты!');
            state.plan = Engine.generatePlan(state.stack, 20);
            state.currentWeekIdx = 0;
            
            document.getElementById('weekly-plan-output').innerHTML = `<p style="color:#03dac6; text-align:center;">Курс рассчитан на ${state.plan.length} недель.</p>`;
            
            App.renderHeatmap();
            App.renderTrendChart();
            
            state.xp += 150;
            document.getElementById('xp-display').textContent = `XP: ${state.xp}`;
        },
        
        changeWeek: function(dir) {
            if (!state.plan.length) return;
            state.currentWeekIdx += dir;
            if (state.currentWeekIdx < 0) state.currentWeekIdx = 0;
            if (state.currentWeekIdx >= state.plan.length) state.currentWeekIdx = state.plan.length - 1;
            App.renderHeatmap();
        },
        
        toggleChart: function(sys) {
            state.chartVisibility[sys] = !state.chartVisibility[sys];
            App.renderTrendChart();
        },
        
        renderHeatmap: function() {
            if (!state.plan.length) return;
            const weekData = state.plan[state.currentWeekIdx];
            document.getElementById('current-week-display').textContent = `Неделя ${weekData.week}`;
            
            const container = document.getElementById('heatmap-container');
            container.innerHTML = '';
            
            for (let sys in DB.riskMatrix) {
                const sysDiv = document.createElement('div');
                sysDiv.style.gridColumn = '1 / -1';
                sysDiv.style.marginTop = '10px';
                sysDiv.style.color = '#bb86fc';
                sysDiv.style.fontWeight = 'bold';
                sysDiv.textContent = sys.toUpperCase();
                container.appendChild(sysDiv);

                DB.riskMatrix[sys].forEach(mech => {
                    const val = weekData.risks[sys][mech.id] || 0;
                    const cell = document.createElement('div');
                    cell.className = 'heatmap-cell';
                    cell.style.backgroundColor = Engine.getRiskColor(val);
                    cell.style.padding = '10px';
                    cell.style.borderRadius = '4px';
                    cell.style.color = val > 50 ? '#000' : '#fff';
                    cell.style.textAlign = 'center';
                    cell.style.fontSize = '0.8em';
                    cell.innerHTML = `<div>${mech.name}</div><div style="font-weight:bold">${val}%</div>`;
                    cell.title = mech.desc;
                    container.appendChild(cell);
                });
            }
        },
        
        renderTrendChart: function() {
            const ctx = document.getElementById('risk-trend-chart');
            if (!ctx || !state.plan.length) return;
            if (window.trendChartInstance) window.trendChartInstance.destroy();

            const labels = state.plan.map(p => `W${p.week}`);
            const datasets = [];
            const colors = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', neuro: '#9966ff', kidney: '#4bc0c0', endo: '#c9cbcf', repro: '#e7e9ed' };

            for (let sys in state.chartVisibility) {
                if (state.chartVisibility[sys]) {
                    const data = state.plan.map(p => {
                        let sum = 0, cnt = 0;
                        for(let m in p.risks[sys]) { sum += p.risks[sys][m]; cnt++; }
                        return cnt ? Math.round(sum/cnt) : 0;
                    });
                    datasets.push({
                        label: sys.toUpperCase(),
                        data: data,
                        borderColor: colors[sys],
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    });
                }
            }

            window.trendChartInstance = new Chart(ctx, {
                type: 'line',
                data: { labels, datasets },
                options: {
                    responsive: true,
                    interaction: { mode: 'index', intersect: false },
                    plugins: { legend: { labels: { color: 'white' } } },
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } },
                        x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
                    }
                }
            });
        },
        
        calcFertility: function() {
            const vol = parseFloat(document.getElementById('semen-vol').value) || 0;
            const conc = parseFloat(document.getElementById('semen-conc').value) || 0;
            const pr = parseFloat(document.getElementById('semen-pr').value) || 0;
            const morph = parseFloat(document.getElementById('semen-morph').value) || 0;
            
            // Простая формула WHO
            const score = Math.round((Math.min(1, vol/1.5)*15) + (Math.min(1, conc/16)*20) + (Math.min(1, pr/30)*25) + (Math.min(1, morph/4)*20));
            const res = document.getElementById('fertility-result');
            res.innerHTML = `<h3>IF: ${score}/100</h3><p>${score > 60 ? 'Норма' : 'Требуется внимание'}</p>`;
        },
        
        renderSupport: function() {
            const container = document.getElementById('support-schedule');
            container.innerHTML = '';
            if(!DB.supportProtocol) return;
            
            DB.supportProtocol.forEach(block => {
                const blockDiv = document.createElement('div');
                blockDiv.className = 'time-block';
                blockDiv.innerHTML = `<h3>${block.title}</h3>`;
                block.items.forEach(item => {
                    blockDiv.innerHTML += `
                        <div class="support-item">
                            <div class="item-header"><span class="item-name">${item.name}</span><span class="item-dose">${item.dose}</span></div>
                            <div class="item-mechanism">${item.mechanism}</div>
                        </div>
                    `;
                });
                container.appendChild(blockDiv);
            });
        },
        
        renderShop: function() {
            const list = document.getElementById('shop-list');
            list.innerHTML = '';
            if(!DB.shopItems) return;
            for (const [key, items] of Object.entries(DB.shopItems)) {
                items.forEach(item => {
                    list.innerHTML += `<div class="drug-card"><div><strong>${key}</strong><br><small>${item.platform}</small></div><div><span style="color:#03dac6">${item.price}</span></div></div>`;
                });
            }
        },
        
        renderGlossary: function() {
            const list = document.getElementById('glossary-list');
            list.innerHTML = '';
            if(!DB.glossary) return;
            for (const [term, def] of Object.entries(DB.glossary)) {
                list.innerHTML += `<div class="drug-card"><strong>${term}</strong><p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${def}</p></div>`;
            }
        }
    };

    // Form Submit Listener
    document.getElementById('add-drug-form').addEventListener('submit', App.addDrug);

    // Initial Renders
    App.renderStack();
    App.renderSupport();
    App.renderShop();
    App.renderGlossary();
    App.loadEsters(); // Init esters select
});
