const App = {
    state: {
        stack: [], 
        plan: [], 
        wIdx: 0, 
        xp: 0, 
        charts: {liver:true, cardio:true, hemato:true, kidney:false, neuro:false, endo:false, repro:false}
    },

    init: function() {
        console.log("App Starting...");
        const sel = document.getElementById('sub-select');
        if(sel && DB.substances) {
            sel.innerHTML = '';
            DB.substances.forEach(s => {
                const o = document.createElement('option');
                o.value = s.id;
                o.innerText = s.name;
                sel.appendChild(o);
            });
        }
        this.renderSupport();
        this.renderArticles();
        this.renderShop();
        this.renderGlossary();
        this.renderControls();
        console.log("App Initialized.");
    },

    switchTab: function(id) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        
        // Подсветка активной кнопки
        const btns = document.querySelectorAll('.tab-btn');
        if(id === 'dashboard') btns[0].classList.add('active');
        if(id === 'stack') btns[1].classList.add('active');
        if(id === 'risks') {
            btns[2].classList.add('active');
            if(this.state.plan.length) setTimeout(() => this.renderChart(), 100);
        }
        if(id === 'support') btns[3].classList.add('active');
        if(id === 'labs') btns[4].classList.add('active');
        if(id === 'articles') btns[5].classList.add('active');
        if(id === 'shop') btns[6].classList.add('active');
        if(id === 'profile') {
            btns[7].classList.add('active');
            this.updateProfile();
        }
    },

    loadEsters: function() {
        const subId = document.getElementById('sub-select').value;
        const estSel = document.getElementById('est-select');
        estSel.innerHTML = '';
        const list = DB.esters[subId];
        if(list && list.length) {
            estSel.disabled = false;
            list.forEach(e => {
                const o = document.createElement('option');
                o.value = e.id;
                o.innerText = e.name + ' (' + e.hl + ' дн.)';
                estSel.appendChild(o);
            });
        } else {
            estSel.disabled = true;
        }
    },

    addDrug: function() {
        const sub = document.getElementById('sub-select').value;
        const est = document.getElementById('est-select').value;
        const dose = parseFloat(document.getElementById('in-dose').value);
        const start = parseInt(document.getElementById('in-start').value);
        const end = parseInt(document.getElementById('in-end').value);

        if(!dose || start >= end) return alert('Ошибка ввода! Проверьте дозу и недели.');
        
        this.state.stack.push({sub, est, dose, start, end});
        this.renderStack();
        document.getElementById('in-dose').value = '';
    },

    renderStack: function() {
        const div = document.getElementById('stack-list');
        if(!div) return;
        div.innerHTML = '';
        this.state.stack.forEach((it, idx) => {
            const s = DB.substances.find(x => x.id === it.sub);
            const esterList = DB.esters[it.sub];
            const e = esterList ? esterList.find(x => x.id === it.est) : null;
            const name = e ? (s.name + ' (' + e.name + ')') : s.name;
            
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <div>
                    <b>${name}</b><br>
                    <small>${it.dose}мг | Нед ${it.start}-${it.end}</small>
                </div>
                <button class="btn-del" onclick="App.removeDrug(${idx})">X</button>
            `;
            div.appendChild(item);
        });
    },

    removeDrug: function(idx) {
        this.state.stack.splice(idx, 1);
        this.renderStack();
    },

    calcPlan: function() {
        if(!this.state.stack.length) return alert('Добавьте препараты!');
        this.state.plan = Engine.generatePlan(this.state.stack);
        this.state.wIdx = 0;
        this.renderHeatmap();
        this.renderChart();
        document.getElementById('plan-msg').innerText = 'Расчет на ' + this.state.plan.length + ' недель!';
        this.state.xp += 100;
        document.getElementById('xp-display').innerText = 'XP: ' + this.state.xp;
        
        // Расчет среднего риска для дашборда
        const firstWeek = this.state.plan[0].r;
        let sum = 0, count = 0;
        for(let sys in firstWeek) {
            for(let k in firstWeek[sys]) {
                sum += firstWeek[sys][k];
                count++;
            }
        }
        const avg = count > 0 ? sum / count : 0;
        
        document.getElementById('d-risk').innerText = Math.round(avg) + '%';
        document.getElementById('d-readiness').innerText = Math.max(10, 100 - Math.round(avg));
    },

    changeWeek: function(dir) {
        if(!this.state.plan.length) return;
        this.state.wIdx += dir;
        if(this.state.wIdx < 0) this.state.wIdx = 0;
        if(this.state.wIdx >= this.state.plan.length) this.state.wIdx = this.state.plan.length - 1;
        this.renderHeatmap();
    },

    renderHeatmap: function() {
        if(!this.state.plan.length) return;
        const data = this.state.plan[this.state.wIdx];
        document.getElementById('week-label').innerText = 'Неделя ' + data.w;
        const div = document.getElementById('heatmap');
        if(!div) return;
        div.innerHTML = '';
        
        for(let sys in DB.risks) {
            const header = document.createElement('div');
            header.style.gridColumn = '1/-1';
            header.style.color = 'var(--pri)';
            header.style.fontWeight = 'bold';
            header.style.marginTop = '10px';
            header.innerText = sys.toUpperCase();
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
                div.appendChild(cell);
            });
        }
    },

    renderChart: function() {
        const ctx = document.getElementById('trend-chart');
        if(!ctx) return;
        if(window.myChart) window.myChart.destroy();
        
        const labels = this.state.plan.map(p => 'W' + p.w);
        const datasets = [];
        const colors = {
            liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40', 
            kidney:'#4bc0c0', neuro:'#9966ff', endo:'#c9cbcf', repro:'#e7e9ed'
        };

        for(let sys in this.state.charts) {
            if(this.state.charts[sys]) {
                const d = this.state.plan.map(p => {
                    let sum=0, cnt=0;
                    for(let k in p.r[sys]){sum+=p.r[sys][k];cnt++;}
                    return cnt ? Math.round(sum/cnt) : 0;
                });
                datasets.push({
                    label: sys.toUpperCase(), 
                    data: d, 
                    borderColor: colors[sys], 
                    borderWidth: 2, 
                    fill: false, 
                    tension: 0.4
                });
            }
        }
        
        window.myChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true, 
                plugins: { legend: { labels: { color: '#aaa' } } }, 
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } }, 
                    x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
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
        if(!div) return;
        const names = {
            liver:'Печень', cardio:'Сердце', hemato:'Кровь', 
            kidney:'Почки', neuro:'Невро', endo:'Эндо', repro:'Репро'
        };
        div.innerHTML = '';
        for(let k in names) {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '5px';
            label.style.margin = '0';
            label.style.color = '#fff';
            label.style.fontSize = '0.85rem';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = this.state.charts[k];
            input.onchange = () => this.toggleChart(k);
            
            label.appendChild(input);
            label.appendChild(document.createTextNode(names[k]));
            div.appendChild(label);
        }
    },

    renderSupport: function() {
        const div = document.getElementById('support-list');
        if(!div) return;
        div.innerHTML = '';
        DB.support.forEach(b => {
            const block = document.createElement('div');
            block.className = 'time-block';
            let html = `<h3>${b.t}</h3>`;
            b.items.forEach(i => {
                html += `<div class="item" style="margin:5px 0;padding:10px"><div><b>${i.n}</b> ${i.d}<br><small>${i.m}</small></div></div>`;
            });
            block.innerHTML = html;
            div.appendChild(block);
        });
    },

    calcFert: function() {
        const v = parseFloat(document.getElementById('lab-vol').value)||0;
        const c = parseFloat(document.getElementById('lab-conc').value)||0;
        const res = Math.round((v/1.5)*20 + (c/16)*30);
        const el = document.getElementById('fert-res');
        if(el) {
            const color = res > 50 ? 'var(--sec)' : 'var(--err)';
            el.innerHTML = `<span style="color:${color}">IF: ${res}/100</span>`;
        }
    },

    renderArticles: function() {
        const div = document.getElementById('articles-list');
        if(!div) return;
        div.innerHTML = '';
        DB.articles.forEach(a => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `<div><b>${a.t}</b><br><small>${a.c} | 👁${a.v}</small></div>`;
            div.appendChild(item);
        });
    },

    renderShop: function() {
        const div = document.getElementById('shop-list');
        if(!div) return;
        div.innerHTML = '';
        for(let k in DB.shop) {
            DB.shop[k].forEach(i => {
                const item = document.createElement('div');
                item.className = 'item';
                item.innerHTML = `<div><b>${k.toUpperCase()}</b><br>${i.p}</div><div style="color:var(--sec)">${i.pr}</div>`;
                div.appendChild(item);
            });
        }
    },

    renderGlossary: function() {
        const div = document.getElementById('glossary-list');
        if(!div) return;
        div.innerHTML = '';
        for(let k in DB.glossary) {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `<b>${k}</b><br><small>${DB.glossary[k]}</small>`;
            div.appendChild(item);
        }
    },

    updateProfile: function() {
        const xpEl = document.getElementById('prof-xp');
        const trustEl = document.getElementById('prof-trust');
        if(xpEl) xpEl.innerText = this.state.xp;
        if(trustEl) trustEl.innerText = Math.min(100, Math.floor(this.state.xp / 10));
    }
};

document.addEventListener('DOMContentLoaded', () => { 
    console.log('DOM Ready.'); 
    App.init(); 
});
