document.addEventListener('DOMContentLoaded', () => {
    const state = { stack: [], plan: [], currentWeekIdx: 0, chartVisibility: {} };
    
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

    // Chart Controls Init
    const controlsDiv = document.getElementById('chart-controls');
    const colors = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', neuro: '#9966ff', kidney: '#4bc0c0', endo: '#c9cbcf', repro: '#e7e9ed' };
    Object.keys(colors).forEach(sys => {
        state.chartVisibility[sys] = true; // Default visible
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" checked data-sys="${sys}"> ${sys.toUpperCase()}`;
        label.style.marginRight = '10px';
        label.style.color = colors[sys];
        controlsDiv.appendChild(label);
    });

    // Event Listeners for Buttons
    document.getElementById('btn-calc').addEventListener('click', App.generatePlan);
    document.getElementById('btn-prev-week').addEventListener('click', () => App.changeWeek(-1));
    document.getElementById('btn-next-week').addEventListener('click', () => App.changeWeek(1));
    document.getElementById('btn-calc-fert').addEventListener('click', App.calcFertility);
    document.getElementById('btn-export').addEventListener('click', App.exportJSON);
    
    document.querySelectorAll('#chart-controls input').forEach(chk => {
        chk.addEventListener('change', (e) => {
            state.chartVisibility[e.target.dataset.sys] = e.target.checked;
            App.renderTrendChart();
        });
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
                    opt.value = e.id; opt.textContent = `${e.name} (${e.halfLife}д)`;
                    estSelect.appendChild(opt);
                });
            } else { estSelect.disabled = true; }
        },
        addDrug: (e) => {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const start = parseInt(document.getElementById('drug-start').value);
            const end = parseInt(document.getElementById('drug-end').value);
            if (start >= end) return alert('Финиш должен быть больше старта!');
            state.stack.push({ substanceId: subId, esterId, dose, startWeek: start, endWeek: end });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-ester').disabled = true;
            document.getElementById('drug-start').value = 1;
            document.getElementById('drug-end').value = 8;
        },
        renderStack: () => {
            const list = document.getElementById('stack-list');
            list.innerHTML = '';
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `<div><strong>${sub.name}</strong> ${ester?'('+ester.name+')':''}<br><small>${item.dose}мг | ${item.startWeek}-${item.endWeek} нед.</small></div>
                <button class="btn-delete" onclick="state.stack.splice(${idx},1); App.renderStack()">✕</button>`;
                list.appendChild(div);
            });
        },
        generatePlan: () => {
            state.plan = Engine.generateWeeklyPlan(state.stack, 20);
            state.currentWeekIdx = 0;
            App.renderHeatmap();
            App.renderTrendChart();
            document.getElementById('weekly-plan-output').innerHTML = `<p style="color:#03dac6">Курс рассчитан на ${state.plan.length} недель.</p>`;
            document.getElementById('xp-display').textContent = `XP: ${parseInt(document.getElementById('xp-display').innerText.split(':')[1])+150}`;
        },
        changeWeek: (dir) => {
            if (!state.plan.length) return;
            state.currentWeekIdx += dir;
            if (state.currentWeekIdx < 0) state.currentWeekIdx = 0;
            if (state.currentWeekIdx >= state.plan.length) state.currentWeekIdx = state.plan.length - 1;
            App.renderHeatmap();
        },
        renderHeatmap: () => {
            if (!state.plan.length) return;
            const weekData = state.plan[state.currentWeekIdx];
            document.getElementById('current-week-display').textContent = `Неделя ${weekData.week}`;
            const container = document.getElementById('heatmap-container');
            container.innerHTML = '';
            for (let sys in DB.riskMatrix) {
                const sysDiv = document.createElement('div');
                sysDiv.style.gridColumn = '1 / -1'; sysDiv.style.marginTop = '10px'; sysDiv.style.color = '#bb86fc'; sysDiv.style.fontWeight = 'bold';
                sysDiv.textContent = sys.toUpperCase(); container.appendChild(sysDiv);
                DB.riskMatrix[sys].mechanisms.forEach(mech => {
                    const val = weekData.risks[sys][mech.id] || 0;
                    const cell = document.createElement('div');
                    cell.className = 'heatmap-cell';
                    cell.style.backgroundColor = Engine.getRiskColor(val);
                    cell.style.padding = '10px'; cell.style.borderRadius = '4px';
                    cell.style.color = val > 50 ? '#000' : '#fff'; cell.style.textAlign = 'center'; cell.style.fontSize = '0.8em';
                    cell.innerHTML = `<div>${mech.name}</div><div style="font-weight:bold">${val}%</div>`;
                    cell.title = mech.desc; container.appendChild(cell);
                });
            }
        },
        renderTrendChart: () => {
            const ctx = document.getElementById('risk-trend-chart');
            if (!ctx || !state.plan.length) return;
            if (window.trendChart) window.trendChart.destroy();
            const labels = state.plan.map(p => `W${p.week}`);
            const datasets = [];
            const cols = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', neuro: '#9966ff', kidney: '#4bc0c0', endo: '#c9cbcf', repro: '#e7e9ed' };
            for (let sys in state.chartVisibility) {
                if (state.chartVisibility[sys]) {
                    const data = state.plan.map(p => {
                        let sum = 0, cnt = 0;
                        for(let m in p.risks[sys]) { sum += p.risks[sys][m]; cnt++; }
                        return cnt ? Math.round(sum/cnt) : 0;
                    });
                    datasets.push({ label: sys.toUpperCase(), data, borderColor: cols[sys], borderWidth: 2, fill: false, tension: 0.4 });
                }
            }
            window.trendChart = new Chart(ctx, { type: 'line',  { labels, datasets }, options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } }, x: { ticks: { color: '#aaa' }, grid: { color: '#333' } } } } });
        },
        calcFertility: () => {
            const v = parseFloat(document.getElementById('semen-vol').value)||0;
            const c = parseFloat(document.getElementById('semen-conc').value)||0;
            const p = parseFloat(document.getElementById('semen-pr').value)||0;
            const m = parseFloat(document.getElementById('semen-morph').value)||0;
            const score = v ? Math.round((v/1.5)*20 + (c/16)*30 + (p/30)*30 + (m/4)*20) : 0;
            document.getElementById('fertility-result').innerHTML = `<h3>IF: ${score}/100</h3>`;
        },
        exportJSON: () => {
            const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr); node.setAttribute("download", "bode_health.json");
            document.body.appendChild(node); node.click(); node.remove();
        }
    };

    document.getElementById('add-drug-form').addEventListener('submit', App.addDrug);
    document.getElementById('drug-substance').addEventListener('change', App.loadEsters);
    
    // Render Support
    const supList = document.getElementById('support-schedule');
    DB.supportProtocol.forEach(b => {
        const div = document.createElement('div'); div.className = 'time-block';
        div.innerHTML = `<h3>${b.title}</h3>` + b.items.map(i => `<div class="support-item"><strong>${i.name}</strong> ${i.dose}<br><small>${i.mechanism}</small></div>`).join('');
        supList.appendChild(div);
    });
    App.renderStack();
});
