document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized");
    if (window.Telegram && window.Telegram.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }

    const state = { 
        stack: [], 
        plan: [], 
        currentWeekIdx: 0, 
        chartVisibility: { liver:true, cardio:true, hemato:true, neuro:false, kidney:false, endo:false, repro:false },
        xp: 0
    };

    // Tab Switching
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
    if(subSelect && DB.substances) {
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
                opt.textContent = "Без эфира";
                estSelect.appendChild(opt);
            }
        },

        addDrug: function(e) {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const start = parseInt(document.getElementById('drug-start').value);
            const end = parseInt(document.getElementById('drug-end').value);
            
            if (!subId) return alert('Выберите вещество');
            if (start >= end) return alert('Неделя финиша должна быть больше старта!');
            
            state.stack.push({ substanceId: subId, esterId, dose, startWeek: start, endWeek: end });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-ester').disabled = true;
            document.getElementById('drug-start').value = 1;
            document.getElementById('drug-end').value = 8;
            alert('Препарат добавлен! Нажмите "Рассчитать динамику".');
        },

        renderStack: function() {
            const list = document.getElementById('stack-list');
            if(!list) return;
            list.innerHTML = '';
            if(state.stack.length === 0) {
                list.innerHTML = '<div class="empty-state">Стек пуст</div>';
                return;
            }
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div><strong>${sub ? sub.name : 'Unknown'}</strong> ${ester ? '('+ester.name+')':''}<br><small>${item.dose}мг | Недели ${item.startWeek}-${item.endWeek}</small></div>
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
            if(state.stack.length === 0) return alert('Сначала добавьте препараты!');
            state.plan = Engine.generateWeeklyPlan(state.stack, 20);
            state.currentWeekIdx = 0;
            App.renderHeatmap();
            App.renderTrendChart();
            document.getElementById('weekly-plan-output').innerHTML = `<p style="color:#03dac6; text-align:center;">Курс рассчитан на ${state.plan.length} недель (включая выведение).</p>`;
            
            // Update Dashboard
            const avgRisk = Math.round(state.plan[0].risks.liver.cholestasis / 2); // Mock for now
            document.getElementById('dash-risk').textContent = avgRisk + '%';
            document.getElementById('dash-readiness').textContent = (100 - avgRisk) + '%';
            
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
            if(display) display.textContent = `Неделя ${weekData.week}`;
            
            const container = document.getElementById('heatmap-container');
            if(!container) return;
            container.innerHTML = '';
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(100px, 1fr))';
            container.style.gap = '5px';

            for (let sys in DB.riskMatrix) {
                const sysDiv = document.createElement('div');
                sysDiv.style.gridColumn = '1 / -1';
                sysDiv.style.marginTop = '10px';
                sysDiv.style.color = '#bb86fc';
                sysDiv.style.fontWeight = 'bold';
                sysDiv.textContent = sys.toUpperCase();
                container.appendChild(sysDiv);

                DB.riskMatrix[sys].mechanisms.forEach(mech => {
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
                    datasets.push({
                        label: sys.toUpperCase(),
                        data: data,
                        borderColor: colors[sys],
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3
                    });
                }
            }

            window.trendChart = new Chart(ctx, {
                type: 'line',
                 { labels, datasets },
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
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            
            if(!vol && !conc) return alert('Введите данные');
            
            // Mock calculation if engine function missing
            let score = 0;
            if(vol) score += (vol/1.5)*20;
            if(conc) score += (conc/16)*30;
            if(pr) score += (pr/30)*30;
            if(morph) score += (morph/4)*20;
            const finalScore = Math.min(100, Math.round(score));
            
            const res = document.getElementById('fertility-result');
            res.innerHTML = `<h3 style="color:${finalScore>60?'#03dac6':'#cf6679'}">IF: ${finalScore}/100</h3><p>${finalScore>60?'Норма':'Требуется внимание'}</p>`;
        },

        renderArticles: function() {
            const list = document.getElementById('articles-list');
            if(!list || !DB.articles) return;
            list.innerHTML = '';
            DB.articles.forEach(art => {
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.style.cursor = 'pointer';
                div.onclick = () => App.openArticle(art);
                div.innerHTML = `<div><strong>${art.title}</strong><br><small style="color:#aaa">${art.category}</small></div><div style="color:var(--primary)">Читать →</div>`;
                list.appendChild(div);
            });
        },

        openArticle: function(art) {
            document.getElementById('articles-list').style.display = 'none';
            const viewer = document.getElementById('article-viewer');
            document.getElementById('article-title').textContent = art.title;
            document.getElementById('article-content').textContent = art.content;
            viewer.style.display = 'block';
        },

        renderShop: function() {
            const list = document.getElementById('shop-list');
            if(!list || !DB.shopItems) return;
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

        renderGlossary: function() {
            const list = document.getElementById('glossary-list');
            if(!list || !DB.glossary) return;
            list.innerHTML = '';
            for (const [term, def] of Object.entries(DB.glossary)) {
                list.innerHTML += `<div class="drug-card"><strong>${term}</strong><p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${def}</p></div>`;
            }
        },
        
        renderSupport: function() {
            const container = document.getElementById('support-schedule');
            if(!container || !DB.supportProtocol) return;
            container.innerHTML = '';
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
        }
    };

    // Bind Form
    const form = document.getElementById('add-drug-form');
    if(form) form.addEventListener('submit', App.addDrug);

    // Init Views
    App.renderStack();
    App.renderArticles();
    App.renderShop();
    App.renderGlossary();
    App.renderSupport();
    
    console.log("App Ready");
});
