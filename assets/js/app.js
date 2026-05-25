document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized");
    if (window.Telegram && window.Telegram.WebApp) { 
        window.Telegram.WebApp.ready(); 
        window.Telegram.WebApp.expand(); 
    }

    const state = { 
        stack: [], 
        plan: [], 
        currentWeekIdx: 0, 
        chartVisibility: { liver:true, cardio:true, hemato:true, neuro:false, kidney:false, endo:false, repro:false },
        xp: 0
    };

    // --- TABS ---
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // --- SUBSTANCE SELECT INIT ---
    const subSelect = document.getElementById('drug-substance');
    if (subSelect) {
        DB.substances.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            subSelect.appendChild(opt);
        });
    }

    // --- GLOBAL APP OBJECT ---
    window.App = {
        loadEsters: function() {
            console.log("Loading esters...");
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
                    opt.textContent = `${e.name} (T1/2: ${e.halfLife} дн.)`;
                    estSelect.appendChild(opt);
                });
            } else {
                estSelect.disabled = true;
                const opt = document.createElement('option');
                opt.textContent = "Нет эфиров (Орал/Пептид)";
                estSelect.appendChild(opt);
            }
        },

        addDrug: function(e) {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const doseVal = document.getElementById('drug-dose').value;
            const startVal = document.getElementById('drug-start').value;
            const endVal = document.getElementById('drug-end').value;

            if (!subId || !doseVal) return alert('Заполните название и дозу!');
            
            const dose = parseFloat(doseVal);
            const start = parseInt(startVal);
            const end = parseInt(endVal);
            
            if (start >= end) return alert('Неделя финиша должна быть больше старта!');
            
            state.stack.push({ 
                substanceId: subId, 
                esterId: (esterId && esterId !== 'undefined') ? esterId : null, 
                dose, 
                startWeek: start, 
                endWeek: end 
            });
            
            App.renderStack();
            e.target.reset();
            // Reset defaults
            document.getElementById('drug-start').value = 1;
            document.getElementById('drug-end').value = 8;
            App.loadEsters(); // Reset ester select state
        },

        renderStack: function() {
            const list = document.getElementById('stack-list');
            if (!list) return;
            list.innerHTML = '';
            if (state.stack.length === 0) {
                list.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Стек пуст</div>';
                return;
            }
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = item.esterId ? DB.esters[item.substanceId]?.find(e => e.id === item.esterId) : null;
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div>
                        <strong>${sub ? sub.name : 'Unknown'}</strong> 
                        ${ester ? '('+ester.name+')' : ''}
                        <br><small>${item.dose}мг | Недели ${item.startWeek}-${item.endWeek}</small>
                    </div>
                    <button class="btn-delete" onclick="window.App.removeDrug(${idx})">✕</button>
                `;
                list.appendChild(div);
            });
        },

        removeDrug: function(idx) {
            state.stack.splice(idx, 1);
            App.renderStack();
        },

        generatePlan: function() {
            if (state.stack.length === 0) return alert('Сначала добавьте препараты!');
            state.plan = Engine.generateWeeklyPlan(state.stack, 20);
            state.currentWeekIdx = 0;
            App.renderHeatmap();
            App.renderTrendChart();
            
            const out = document.getElementById('weekly-plan-output');
            if (out) out.innerHTML = `<p style="color:#03dac6; text-align:center; font-weight:bold;">Курс рассчитан на ${state.plan.length} недель (включая выведение).</p>`;
            
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
            const display = document.getElementById('current-week-display');
            if (display) display.textContent = `Неделя ${weekData.week}`;
            
            const container = document.getElementById('heatmap-container');
            if (!container) return;
            container.innerHTML = '';
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(110px, 1fr))';
            container.style.gap = '8px';

            for (let sys in DB.riskMatrix) {
                const sysDiv = document.createElement('div');
                sysDiv.style.gridColumn = '1 / -1';
                sysDiv.style.marginTop = '15px';
                sysDiv.style.color = '#bb86fc';
                sysDiv.style.fontWeight = 'bold';
                sysDiv.style.textTransform = 'uppercase';
                sysDiv.style.fontSize = '0.9em';
                sysDiv.textContent = sys;
                container.appendChild(sysDiv);

                DB.riskMatrix[sys].mechanisms.forEach(mech => {
                    const val = weekData.risks[sys][mech.id] || 0;
                    const cell = document.createElement('div');
                    cell.className = 'heatmap-cell';
                    cell.style.backgroundColor = Engine.getRiskColor(val);
                    cell.style.padding = '12px';
                    cell.style.borderRadius = '6px';
                    cell.style.color = val > 50 ? '#000' : '#fff';
                    cell.style.textAlign = 'center';
                    cell.style.fontSize = '0.85em';
                    cell.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                    cell.innerHTML = `<div style="font-weight:600; margin-bottom:4px;">${mech.name}</div><div style="font-size:1.1em; font-weight:bold;">${val}%</div>`;
                    cell.title = `${mech.name}: ${mech.desc}`;
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
                        tension: 0.3,
                        pointRadius: 2
                    });
                }
            }

            window.trendChartInstance = new Chart(ctx, {
                type: 'line',
                data: { labels, datasets },
                options: {
                    responsive: true,
                    interaction: { mode: 'index', intersect: false },
                    plugins: { legend: { labels: { color: '#fff' } } },
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } },
                        x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
                    }
                }
            });
        },

        calcFertility: function() {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            
            // Mock calculation if engine func missing
            let score = 0;
            if(vol) score += (vol/1.5)*20;
            if(conc) score += (conc/16)*30;
            if(pr) score += (pr/30)*30;
            if(morph) score += (morph/4)*20;
            
            const res = document.getElementById('fertility-result');
            if(res) res.innerHTML = `<h3 style="color:${score>60?'#03dac6':'#ff6384'}">IF: ${Math.round(score)}/100</h3>`;
        },

        exportJSON: function() {
            const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr);
            node.setAttribute("download", "bode_health_course.json");
            document.body.appendChild(node);
            node.click();
            node.remove();
        },

        renderShop: function() {
            const list = document.getElementById('shop-list');
            if(!list) return;
            list.innerHTML = '';
            if(DB.shopItems) {
                for (const [key, items] of Object.entries(DB.shopItems)) {
                    items.forEach(item => {
                        list.innerHTML += `<div class="drug-card"><div><strong>${key.toUpperCase()}</strong><br><small>${item.platform}</small></div><div><span style="color:#03dac6">${item.price}</span> <a href="${item.url}" class="btn-primary" style="padding:5px 10px; font-size:0.8em; margin-left:10px; text-decoration:none;">Buy</a></div></div>`;
                    });
                }
            }
        },

        renderGlossary: function() {
            const list = document.getElementById('glossary-list');
            if(!list) return;
            list.innerHTML = '';
            for (const [term, def] of Object.entries(DB.glossary || {})) {
                list.innerHTML += `<div class="drug-card" style="display:block;"><strong style="color:#bb86fc">${term}</strong><p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${def}</p></div>`;
            }
        }
    };

    // Bind Form
    const form = document.getElementById('add-drug-form');
    if(form) form.addEventListener('submit', window.App.addDrug);

    // Init Views
    window.App.renderStack();
    window.App.renderShop();
    window.App.renderGlossary();
});
