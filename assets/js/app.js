document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }
    const state = { stack: [], plan: [], currentWeekIdx: 0, chartVisibility: { liver:true, cardio:true, hemato:true, neuro:false, kidney:false, endo:false, repro:false }, xp: 0 };

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

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
                    opt.value = e.id; opt.textContent = `${e.name} (T1/2: ${e.halfLife} дн.)`;
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
            if (start >= end) return alert('Неделя финиша должна быть больше старта!');
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
                div.innerHTML = `<div><strong>${sub.name}</strong> ${ester? '('+ester.name+')':''}<br><small>${item.dose}мг | Недели ${item.startWeek}-${item.endWeek}</small></div><button class="btn-delete" onclick="state.stack.splice(${idx},1); App.renderStack()">✕</button>`;
                list.appendChild(div);
            });
        },
        generatePlan: () => {
            state.plan = Engine.generateWeeklyPlan(state.stack, 20);
            state.currentWeekIdx = 0;
            App.renderHeatmap();
            App.renderTrendChart();
            document.getElementById('weekly-plan-output').innerHTML = `<p style="color:#03dac6">Курс рассчитан на ${state.plan.length} недель (включая выведение).</p>`;
            state.xp += 150;
            document.getElementById('xp-display').textContent = `XP: ${state.xp}`;
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
            if (!state.plan.length) return;
            const weekData = state.plan[state.currentWeekIdx];
            document.getElementById('current-week-display').textContent = `Неделя ${weekData.week}`;
            const container = document.getElementById('heatmap-container');
            container.innerHTML = '';
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(100px, 1fr))';
            container.style.gap = '5px';
            for (let sys in DB.riskMatrix) {
                const sysDiv = document.createElement('div');
                sysDiv.style.gridColumn = '1 / -1'; sysDiv.style.marginTop = '10px';
                sysDiv.style.color = '#bb86fc'; sysDiv.style.fontWeight = 'bold';
                sysDiv.textContent = sys.toUpperCase();
                container.appendChild(sysDiv);
                DB.riskMatrix[sys].mechanisms.forEach(mech => {
                    const val = weekData.risks[sys][mech.id] || 0;
                    const cell = document.createElement('div');
                    cell.className = 'heatmap-cell';
                    cell.style.backgroundColor = Engine.getRiskColor(val);
                    cell.style.padding = '10px'; cell.style.borderRadius = '4px';
                    cell.style.color = val > 50 ? '#000' : '#fff';
                    cell.style.textAlign = 'center'; cell.style.fontSize = '0.8em';
                    cell.innerHTML = `<div>${mech.name}</div><div style="font-weight:bold">${val}%</div>`;
                    cell.title = mech.desc;
                    container.appendChild(cell);
                });
            }
        },
        renderTrendChart: () => {
            const ctx = document.getElementById('risk-trend-chart');
            if (!ctx || !state.plan.length) return;
            if (window.trendChart) window.trendChart.destroy();
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
                    datasets.push({ label: sys.toUpperCase(), data: data, borderColor: colors[sys], borderWidth: 2, fill: false, tension: 0.4 });
                }
            }
            window.trendChart = new Chart(ctx, {
                type: 'line',
                 { labels, datasets },
                options: { responsive: true, interaction: { mode: 'index', intersect: false }, plugins: { legend: { labels: { color: 'white' } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } }, x: { ticks: { color: '#aaa' }, grid: { color: '#333' } } } }
            });
        },
        calcFertility: () => {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            const ifScore = Engine.calculateFertilityIndex ? Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr, morphology: morph }) : 0;
            document.getElementById('fertility-result').innerHTML = `<h3>IF: ${ifScore||0}/100</h3>`;
        },
        exportJSON: () => {
            const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr); node.setAttribute("download", "bode_health_course.json");
            document.body.appendChild(node); node.click(); node.remove();
        },
        renderShop: () => {
            const list = document.getElementById('shop-list'); list.innerHTML = '';
            if(DB.shopItems) {
                for (const [key, items] of Object.entries(DB.shopItems)) {
                    items.forEach(item => {
                        list.innerHTML += `<div class="drug-card"><div><strong>${key}</strong><br><small>${item.platform}</small></div><div><span style="color:#03dac6">${item.price}</span> <a href="${item.url}" class="btn-primary" style="padding:5px 10px; font-size:0.8em; margin-left:10px; text-decoration:none;">Buy</a></div></div>`;
                    });
                }
            }
        },
        renderGlossary: () => {
            const list = document.getElementById('glossary-list'); list.innerHTML = '';
            for (const [term, def] of Object.entries(DB.glossary || {})) {
                list.innerHTML += `<div class="drug-card"><strong>${term}</strong><p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${def}</p></div>`;
            }
        }
    };

    Engine.calculateFertilityIndex = (d) => d.volume ? Math.round((d.volume/1.5)*20 + (d.conc/16)*30 + (d.pr/30)*30 + (d.morph/4)*20) : 0;

    document.getElementById('add-drug-form').addEventListener('submit', App.addDrug);
    document.getElementById('calc-plan-btn').addEventListener('click', App.generatePlan);
    document.getElementById('prev-week-btn').addEventListener('click', () => App.changeWeek(-1));
    document.getElementById('next-week-btn').addEventListener('click', () => App.changeWeek(1));
    document.getElementById('calc-fert-btn').addEventListener('click', App.calcFertility);
    document.getElementById('export-json-btn').addEventListener('click', App.exportJSON);

    App.renderStack();
    App.renderShop();
    App.renderGlossary();
});
