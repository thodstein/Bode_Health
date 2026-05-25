document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized");
    
    // State
    const state = { stack: [], plan: [], currentWeekIdx: 0, chartVisibility: { liver:true, cardio:true, hemato:true, neuro:false, kidney:false, endo:false, repro:false } };

    // 1. Tabs Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Refresh charts if switching to Risks tab
            if (tabId === 'risks' && state.plan.length) {
                App.renderHeatmap();
                App.renderTrendChart();
            }
        });
    });

    // 2. Substance Select Init
    const subSelect = document.getElementById('drug-substance');
    if (subSelect) {
        DB.substances.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            subSelect.appendChild(opt);
        });
        // Trigger initial load
        App.loadEsters();
    }

    // 3. Form Submit
    const form = document.getElementById('add-drug-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            App.addDrug(e);
        });
    }

    // Global App Object
    window.App = {
        loadEsters: () => {
            const subId = document.getElementById('drug-substance').value;
            const estSelect = document.getElementById('drug-ester');
            if (!estSelect) return;
            
            estSelect.innerHTML = '';
            const esters = DB.esters[subId];
            
            if (esters && esters.length > 0) {
                estSelect.disabled = false;
                esters.forEach(e => {
                    const opt = document.createElement('option');
                    opt.value = e.id;
                    opt.textContent = `${e.name} (${e.halfLife}д)`;
                    estSelect.appendChild(opt);
                });
            } else {
                estSelect.disabled = true;
                const opt = document.createElement('option');
                opt.textContent = "Нет эфира (Орал/Пептид)";
                estSelect.appendChild(opt);
            }
        },

        addDrug: (e) => {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const start = parseInt(document.getElementById('drug-start').value);
            const end = parseInt(document.getElementById('drug-end').value);

            if (!subId || !dose || !start || !end) return alert("Заполните все поля");
            if (start >= end) return alert("Финиш должен быть больше старта");

            state.stack.push({ substanceId: subId, esterId, dose, startWeek: start, endWeek: end });
            App.renderStack();
            
            // Reset form partially
            document.getElementById('drug-dose').value = '';
            document.getElementById('drug-end').value = parseInt(start) + 8;
        },

        renderStack: () => {
            const list = document.getElementById('stack-list');
            if (!list) return;
            list.innerHTML = '';
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div>
                        <strong>${sub.name}</strong> ${ester ? '('+ester.name+')' : ''}
                        <br><small>${item.dose}мг | Нед ${item.startWeek}-${item.endWeek}</small>
                    </div>
                    <button class="btn-delete" onclick="window.App.removeDrug(${idx})">✕</button>
                `;
                list.appendChild(div);
            });
        },

        removeDrug: (idx) => {
            state.stack.splice(idx, 1);
            App.renderStack();
            if (state.plan.length) App.generatePlan(); // Recalc
        },

        generatePlan: () => {
            if (!state.stack.length) return alert("Добавьте препараты");
            state.plan = Engine.generateWeeklyPlan(state.stack);
            state.currentWeekIdx = 0;
            
            const out = document.getElementById('weekly-plan-output');
            if (out) out.innerHTML = `<div style="padding:15px; background:#222; border-radius:8px; color:#03dac6; margin-top:10px;">
                ✅ Рассчитано на ${state.plan.length} недель. Перейдите во вкладку "Риски".
            </div>`;
            
            App.renderHeatmap();
            App.renderTrendChart();
        },

        changeWeek: (dir) => {
            if (!state.plan.length) return;
            state.currentWeekIdx += dir;
            if (state.currentWeekIdx < 0) state.currentWeekIdx = 0;
            if (state.currentWeekIdx >= state.plan.length) state.currentWeekIdx = state.plan.length - 1;
            App.renderHeatmap();
        },

        toggleChart: (sys) => {
            state.chartVisibility[sys] = !state.chartVisibility[sys];
            App.renderTrendChart();
        },

        renderHeatmap: () => {
            const container = document.getElementById('heatmap-container');
            const weekLabel = document.getElementById('current-week-display');
            if (!container || !state.plan.length) return;

            const data = state.plan[state.currentWeekIdx];
            weekLabel.textContent = `Неделя ${data.week}`;
            container.innerHTML = '';
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(90px, 1fr))';
            container.style.gap = '8px';

            for (let sys in DB.riskMatrix) {
                // System Header
                const head = document.createElement('div');
                head.style.gridColumn = '1 / -1';
                head.style.color = '#bb86fc';
                head.style.fontWeight = 'bold';
                head.style.marginTop = '10px';
                head.textContent = sys.toUpperCase();
                container.appendChild(head);

                // Mechanisms
                DB.riskMatrix[sys].mechanisms.forEach(m => {
                    const val = data.risks[sys][m.id] || 0;
                    const cell = document.createElement('div');
                    cell.className = 'heatmap-cell';
                    cell.style.backgroundColor = Engine.getRiskColor(val);
                    cell.style.color = val > 50 ? '#fff' : '#eee';
                    cell.style.padding = '8px';
                    cell.style.borderRadius = '6px';
                    cell.style.textAlign = 'center';
                    cell.style.fontSize = '0.75em';
                    cell.innerHTML = `<div>${m.name}</div><strong>${val}%</strong>`;
                    container.appendChild(cell);
                });
            }
        },

        renderTrendChart: () => {
            const ctx = document.getElementById('risk-trend-chart');
            if (!ctx || !state.plan.length) return;
            if (window.trendChartInstance) window.trendChartInstance.destroy();

            const labels = state.plan.map(p => `W${p.week}`);
            const datasets = [];
            const colors = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', neuro: '#9966ff', kidney: '#4bc0c0', endo: '#c9cbcf', repro: '#e7e9ed' };

            for (let sys in state.chartVisibility) {
                if (!state.chartVisibility[sys]) continue;
                const sysData = state.plan.map(p => {
                    let sum=0, cnt=0;
                    for(let k in p.risks[sys]) { sum+=p.risks[sys][k]; cnt++; }
                    return cnt ? Math.round(sum/cnt) : 0;
                });
                datasets.push({
                    label: sys.toUpperCase(),
                    data: sysData,
                    borderColor: colors[sys],
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 0
                });
            }

            window.trendChartInstance = new Chart(ctx, {
                type: 'line',
                 { labels, datasets },
                options: {
                    responsive: true,
                    plugins: { legend: { labels: { color: '#ccc' } } },
                    scales: {
                        y: { beginAtZero: true, max: 100, grid: { color: '#333' }, ticks: { color: '#aaa' } },
                        x: { grid: { color: '#333' }, ticks: { color: '#aaa' } }
                    }
                }
            });
        },
        
        renderShop: () => {
            const list = document.getElementById('shop-list');
            if(!list) return;
            list.innerHTML = '';
            for(const [key, items] of Object.entries(DB.shopItems || {})) {
                items.forEach(i => {
                    list.innerHTML += `<div class="drug-card"><div><b>${key}</b><br><small>${i.platform}</small></div><div><span style="color:#03dac6">${i.price}</span></div></div>`;
                });
            }
        },
        
        renderGlossary: () => {
            const list = document.getElementById('glossary-list');
            if(!list) return;
            list.innerHTML = '';
            for(const [k,v] of Object.entries(DB.glossary || {})) {
                list.innerHTML += `<div class="drug-card"><b>${k}</b><p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${v}</p></div>`;
            }
        }
    };

    // Init Lists
    App.renderStack();
    App.renderShop();
    App.renderGlossary();
});
    // Render Support Static
    const supCont = document.getElementById('support-schedule');
    if(supCont) {
        supCont.innerHTML = '';
        DB.supportProtocol.forEach(block => {
            let html = `<div class="time-block"><h3>${block.title}</h3>`;
            block.items.forEach(i => {
                html += `<div style="border-bottom:1px solid #333; padding:5px 0;"><b>${i.name}</b> ${i.dose} <div style="font-size:0.8em; color:#aaa">${i.mechanism}</div></div>`;
            });
            html += '</div>';
            supCont.innerHTML += html;
        });
    }
