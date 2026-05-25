console.log("Bode Health App Starting...");

const App = {
    state: {
        stack: [],
        plan: [],
        wIdx: 0,
        xp: 0,
        charts: { liver: true, cardio: true, hemato: true, kidney: false, neuro: false, endo: false, repro: false }
    },

    init: function() {
        console.log("App Initialized. DB Loaded:", typeof DB !== 'undefined');
        
        if (typeof DB === 'undefined') {
            alert("CRITICAL ERROR: Database not loaded! Check network tab.");
            return;
        }

        // Fill Substance Select
        const sel = document.getElementById('sub-select');
        if (sel) {
            sel.innerHTML = '';
            DB.substances.forEach(s => {
                let o = document.createElement('option');
                o.value = s.id;
                o.innerText = s.name;
                sel.appendChild(o);
            });
        }

        // Initial Renders
        this.renderSupport();
        this.renderArticles();
        this.renderShop();
        this.renderGlossary();
        this.renderControls();
        
        // Force initial dashboard update if needed
        this.updateDashboard();
        
        console.log("App Init Complete. Views rendered.");
    },

    switchTab: function(tabId) {
        console.log("Switching to tab:", tabId);
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        
        const target = document.getElementById(tabId);
        if (target) target.classList.add('active');
        
        // Highlight button logic
        const map = { 'dashboard':0, 'stack':1, 'risks':2, 'support':3, 'labs':4, 'articles':5, 'shop':6 };
        const btns = document.querySelectorAll('.tab-btn');
        if (btns[map[tabId]]) btns[map[tabId]].classList.add('active');

        // Specific tab actions
        if (tabId === 'risks' && this.state.plan.length > 0) {
            setTimeout(() => {
                this.renderChart();
                this.renderHeatmap();
            }, 100);
        }
    },

    loadEsters: function() {
        const subId = document.getElementById('sub-select').value;
        const estSel = document.getElementById('est-select');
        if (!estSel) return;
        
        estSel.innerHTML = '';
        const list = DB.esters[subId];
        
        if (list && list.length > 0) {
            estSel.disabled = false;
            list.forEach(e => {
                let o = document.createElement('option');
                o.value = e.id;
                o.innerText = e.name + ' (' + e.hl + ' дн.)';
                estSel.appendChild(o);
            });
        } else {
            estSel.disabled = true;
            let o = document.createElement('option');
            o.innerText = "Без эфира";
            estSel.appendChild(o);
        }
    },

    addDrug: function() {
        const sub = document.getElementById('sub-select').value;
        const est = document.getElementById('est-select').value;
        const doseVal = document.getElementById('in-dose').value;
        const startVal = document.getElementById('in-start').value;
        const endVal = document.getElementById('in-end').value;

        const dose = parseFloat(doseVal);
        const start = parseInt(startVal);
        const end = parseInt(endVal);

        if (!dose || dose <= 0) return alert('Введите корректную дозу!');
        if (start >= end) return alert('Неделя финиша должна быть больше старта!');

        this.state.stack.push({ sub, est, dose, start, end });
        this.renderStack();
        this.updateDashboard();
        
        // Reset form
        document.getElementById('in-dose').value = '';
    },

    renderStack: function() {
        const div = document.getElementById('stack-list');
        if (!div) return;
        div.innerHTML = '';
        
        if (this.state.stack.length === 0) {
            div.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Стек пуст</div>';
            return;
        }

        this.state.stack.forEach((it, idx) => {
            const s = DB.substances.find(x => x.id === it.sub);
            const e = DB.esters[it.sub] ? DB.esters[it.sub].find(x => x.id === it.est) : null;
            
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <div>
                    <b>${s ? s.name : 'Unknown'}</b> ${e ? '(' + e.name + ')' : ''}
                    <br><small style="color:#aaa">${it.dose}мг | Недели ${it.start} - ${it.end}</small>
                </div>
                <button class="btn-del" onclick="App.removeDrug(${idx})">✕</button>
            `;
            div.appendChild(item);
        });
    },

    removeDrug: function(idx) {
        this.state.stack.splice(idx, 1);
        this.renderStack();
        this.updateDashboard();
    },

    calcPlan: function() {
        if (this.state.stack.length === 0) return alert('Сначала добавьте препараты в стек!');
        
        console.log("Calculating plan...");
        this.state.plan = Engine.generatePlan(this.state.stack);
        this.state.wIdx = 0;
        
        this.renderHeatmap();
        this.renderChart();
        
        const msg = document.getElementById('plan-msg');
        if (msg) msg.innerText = `Расчет выполнен! Прогноз на ${this.state.plan.length} недель.`;
        
        this.state.xp += 100;
        const xpEl = document.getElementById('xp-display');
        if (xpEl) xpEl.innerText = 'XP: ' + this.state.xp;
        
        this.updateDashboard();
        
        // Auto switch to risks tab
        // this.switchTab('risks'); 
        alert("Расчет завершен! Перейдите во вкладку 'Риски' для просмотра.");
    },

    updateDashboard: function() {
        const rEl = document.getElementById('d-risk');
        const readEl = document.getElementById('d-readiness');
        
        if (this.state.stack.length === 0) {
            if(rEl) rEl.innerText = '--';
            if(readEl) readEl.innerText = '--';
            return;
        }
        
        // Если план еще не считан, считаем превью
        let avgRisk = 0;
        if (this.state.plan.length > 0) {
             const firstWeek = this.state.plan[0];
             let sum = 0, count = 0;
             for(let sys in firstWeek.r) {
                 for(let k in firstWeek.r[sys]) { sum += firstWeek.r[sys][k]; count++; }
             }
             avgRisk = count ? sum / count : 0;
        } else {
            // Грубая оценка без полного плана
            avgRisk = this.state.stack.length * 15; 
        }
        
        if(rEl) rEl.innerText = Math.round(avgRisk) + '%';
        if(readEl) readEl.innerText = Math.max(10, 100 - Math.round(avgRisk));
    },

    changeWeek: function(dir) {
        if (!this.state.plan.length) return;
        this.state.wIdx += dir;
        if (this.state.wIdx < 0) this.state.wIdx = 0;
        if (this.state.wIdx >= this.state.plan.length) this.state.wIdx = this.state.plan.length - 1;
        this.renderHeatmap();
    },

    renderHeatmap: function() {
        const div = document.getElementById('heatmap');
        const label = document.getElementById('week-label');
        if (!div || !this.state.plan.length) return;
        
        const data = this.state.plan[this.state.wIdx];
        if (label) label.innerText = 'Неделя ' + data.w;
        
        div.innerHTML = '';
        
        for (let sys in DB.risks) {
            const header = document.createElement('div');
            header.style.gridColumn = '1 / -1';
            header.style.color = 'var(--pri)';
            header.style.fontWeight = 'bold';
            header.style.marginTop = '10px';
            header.style.textTransform = 'uppercase';
            header.style.fontSize = '0.8rem';
            header.innerText = sys;
            div.appendChild(header);
            
            DB.risks[sys].forEach(m => {
                const val = data.r[sys][m.id] || 0;
                const col = Engine.getColor(val);
                const txt = val > 50 ? '#000' : '#fff';
                
                const cell = document.createElement('div');
                cell.className = 'hm-cell';
                cell.style.background = col;
                cell.style.color = txt;
                cell.innerHTML = `<b>${m.n}</b><br>${val}%`;
                cell.title = m.id; // Tooltip
                div.appendChild(cell);
            });
        }
    },

    renderChart: function() {
        const ctxCanvas = document.getElementById('trend-chart');
        if (!ctxCanvas || !this.state.plan.length) return;
        
        if (window.myChart) window.myChart.destroy();
        
        const ctx = ctxCanvas.getContext('2d');
        const labels = this.state.plan.map(p => 'W' + p.w);
        const datasets = [];
        const colors = {
            liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40',
            kidney: '#4bc0c0', neuro: '#9966ff', endo: '#c9cbcf', repro: '#e7e9ed'
        };
        
        for (let sys in this.state.charts) {
            if (this.state.charts[sys]) {
                const d = this.state.plan.map(p => {
                    let sum = 0, cnt = 0;
                    for (let k in p.r[sys]) { sum += p.r[sys][k]; cnt++; }
                    return cnt ? Math.round(sum / cnt) : 0;
                });
                datasets.push({
                    label: sys.toUpperCase(),
                    data: d,
                    borderColor: colors[sys],
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0
                });
            }
        }
        
        window.myChart = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#aaa', font: {size: 10} } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#aaa', stepSize: 20 },
                        grid: { color: '#333' }
                    },
                    x: {
                        ticks: { color: '#aaa' },
                        grid: { color: '#333' }
                    }
                }
            }
        });
    },

    toggleChart: function(sys) {
        this.state.charts[sys] = !this.state.charts[sys];
        this.renderChart();
    },

    renderControls: function() {
        const div = document.getElementById('chart-controls');
        if (!div) return;
        const names = {
            liver: 'Печень', cardio: 'Сердце', hemato: 'Кровь',
            kidney: 'Почки', neuro: 'Невро', endo: 'Эндо', repro: 'Репро'
        };
        div.innerHTML = '';
        for (let k in names) {
            const lbl = document.createElement('label');
            lbl.innerHTML = `
                <input type="checkbox" ${this.state.charts[k] ? 'checked' : ''} onchange="App.toggleChart('${k}')">
                ${names[k]}
            `;
            div.appendChild(lbl);
        }
    },

    renderSupport: function() {
        const div = document.getElementById('support-list');
        if (!div) return;
        div.innerHTML = '';
        DB.support.forEach(b => {
            const block = document.createElement('div');
            block.className = 'time-block';
            let itemsHtml = '';
            b.items.forEach(i => {
                itemsHtml += `
                    <div class="item" style="margin:5px 0; padding:10px; border-left-width:2px;">
                        <div>
                            <b>${i.n}</b> <span style="color:var(--sec)">${i.d}</span>
                            <br><small style="color:#888">${i.m}</small>
                        </div>
                    </div>
                `;
            });
            block.innerHTML = `<h3>${b.t}</h3>${itemsHtml}`;
            div.appendChild(block);
        });
    },

    calcFert: function() {
        const v = parseFloat(document.getElementById('lab-vol').value) || 0;
        const c = parseFloat(document.getElementById('lab-conc').value) || 0;
        const res = Math.round((v / 1.5) * 20 + (c / 16) * 30);
        const el = document.getElementById('fert-res');
        if (el) {
            const color = res > 50 ? 'var(--sec)' : (res > 30 ? '#ffeb3b' : 'var(--err)');
            el.innerHTML = `<span style="color:${color}; font-size:1.5rem">IF: ${res}/100</span>`;
        }
    },

    renderArticles: function() {
        const div = document.getElementById('articles-list');
        if (!div) return;
        div.innerHTML = '';
        DB.articles.forEach(a => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <div>
                    <b>${a.t}</b>
                    <br><small style="color:#aaa">${a.c} • 👁 ${a.v}</small>
                </div>
                <div style="color:var(--pri); font-size:1.2rem">›</div>
            `;
            div.appendChild(item);
        });
    },

    renderShop: function() {
        const div = document.getElementById('shop-list');
        if (!div) return;
        div.innerHTML = '';
        for (let k in DB.shop) {
            DB.shop[k].forEach(i => {
                const item = document.createElement('div');
                item.className = 'item';
                item.innerHTML = `
                    <div>
                        <b>${k.toUpperCase()}</b>
                        <br><small>${i.p}</small>
                    </div>
                    <div style="color:var(--sec); font-weight:bold">${i.pr}</div>
                `;
                div.appendChild(item);
            });
        }
    },

    renderGlossary: function() {
        const div = document.getElementById('glossary-list');
        if (!div) return;
        div.innerHTML = '';
        for (let k in DB.glossary) {
            const item = document.createElement('div');
            item.className = 'item';
            item.style.display = 'block';
            item.innerHTML = `
                <b style="color:var(--pri)">${k}</b>
                <br><small style="color:#ccc; margin-top:5px; display:block">${DB.glossary[k]}</small>
            `;
            div.appendChild(item);
        }
    }
};

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Ready. Starting App...");
    // Небольшая задержка чтобы убедиться что database.js точно загрузился
    setTimeout(() => {
        App.init();
    }, 100);
});
