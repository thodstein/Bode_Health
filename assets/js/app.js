const App = {
    state: {stack:[], plan:[], wIdx:0, xp:0, charts:{liver:true, cardio:true, hemato:true, kidney:false, neuro:false, endo:false, repro:false}},
    
    init: function() {
        console.log("App Started");
        const sel = document.getElementById('sub-select');
        if(sel && DB.substances) {
            sel.innerHTML = '';
            DB.substances.forEach(s => {
                let o = document.createElement('option');
                o.value = s.id;
                o.textContent = s.name;
                sel.appendChild(o);
            });
        }
        this.renderSupport();
        this.renderArticles();
        this.renderShop();
        this.renderGlossary();
        this.renderControls();
    },

    switchTab: function(id) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        event.currentTarget.classList.add('active');
        if(id === 'risks' && this.state.plan.length) setTimeout(() => this.renderChart(), 50);
        if(id === 'profile') this.updateProfile();
    },

    loadEsters: function() {
        const subId = document.getElementById('sub-select').value;
        const estSel = document.getElementById('est-select');
        estSel.innerHTML = '';
        const list = DB.esters[subId];
        if(list && list.length) {
            estSel.disabled = false;
            list.forEach(e => {
                let o = document.createElement('option');
                o.value = e.id;
                o.textContent = e.name + ' (' + e.hl + ' дн.)';
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
        
        if(!dose || start >= end) return alert('Ошибка ввода!');
        
        this.state.stack.push({sub, est, dose, start, end});
        this.renderStack();
        document.getElementById('in-dose').value = '';
    },

    renderStack: function() {
        const div = document.getElementById('stack-list');
        div.innerHTML = '';
        this.state.stack.forEach((it, idx) => {
            const s = DB.substances.find(x => x.id === it.sub);
            const e = DB.esters[it.sub] ? DB.esters[it.sub].find(x => x.id === it.est) : null;
            const name = e ? (s.name + ' (' + e.name + ')') : s.name;
            
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = '<div><b>' + name + '</b><br><small>' + it.dose + 'мг | Нед ' + it.start + '-' + it.end + '</small></div>';
            
            const btn = document.createElement('button');
            btn.className = 'btn-del';
            btn.textContent = 'X';
            btn.onclick = () => { this.state.stack.splice(idx, 1); this.renderStack(); };
            
            item.appendChild(btn);
            div.appendChild(item);
        });
    },

    calcPlan: function() {
        if(!this.state.stack.length) return alert('Добавьте препараты!');
        this.state.plan = Engine.generatePlan(this.state.stack);
        this.state.wIdx = 0;
        this.renderHeatmap();
        this.renderChart();
        document.getElementById('plan-msg').textContent = 'Расчет на ' + this.state.plan.length + ' недель!';
        this.state.xp += 100;
        
        const avg = Object.values(this.state.plan[0].r).reduce((a,b) => a + Object.values(b).reduce((x,y) => x+y, 0), 0) / 49;
        document.getElementById('d-risk').textContent = Math.round(avg) + '%';
        document.getElementById('d-readiness').textContent = Math.max(10, 100 - Math.round(avg));
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
        document.getElementById('week-label').textContent = 'Неделя ' + data.w;
        const div = document.getElementById('heatmap');
        div.innerHTML = '';
        
        for(let sys in DB.risks) {
            const header = document.createElement('div');
            header.style.gridColumn = '1/-1';
            header.style.color = 'var(--pri)';
            header.style.fontWeight = 'bold';
            header.style.marginTop = '10px';
            header.textContent = sys.toUpperCase();
            div.appendChild(header);
            
            DB.risks[sys].forEach(m => {
                const val = data.r[sys][m.id] || 0;
                const cell = document.createElement('div');
                cell.className = 'hm-cell';
                cell.style.backgroundColor = Engine.getColor(val);
                cell.style.color = val > 50 ? '#000' : '#fff';
                cell.innerHTML = '<b>' + m.n + '</b><br>' + val + '%';
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
        const colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40', kidney:'#4bc0c0', neuro:'#9966ff', endo:'#c9cbcf', repro:'#e7e9ed'};
        
        for(let sys in this.state.charts) {
            if(this.state.charts[sys]) {
                const d = this.state.plan.map(p => {
                    let sum=0, cnt=0;
                    for(let k in p.r[sys]){sum+=p.r[sys][k];cnt++;}
                    return cnt ? Math.round(sum/cnt) : 0;
                });
                datasets.push({label:sys.toUpperCase(), data:d, borderColor:colors[sys], borderWidth:2, fill:false, tension:0.4});
            }
        }
        
        window.myChart = new Chart(ctx.getContext('2d'), {
            type:'line',
            data: {labels, datasets},
            options:{responsive:true, plugins:{legend:{labels:{color:'#aaa'}}}, scales:{y:{beginAtZero:true, max:100, ticks:{color:'#aaa'},grid:{color:'#333'}}, x:{ticks:{color:'#aaa'},grid:{color:'#333'}}}}
        );
    },

    toggleChart: function(sys) {
        this.state.charts[sys] = !this.state.charts[sys];
        this.renderChart();
    },

    renderControls: function() {
        const div = document.getElementById('chart-controls');
        if(!div) return;
        const names = {liver:'Печень', cardio:'Сердце', hemato:'Кровь', kidney:'Почки', neuro:'Невро', endo:'Эндо', repro:'Репро'};
        div.innerHTML = '';
        for(let k in names) {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '5px';
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
        DB.support.forEach(b => {
            const block = document.createElement('div');
            block.className = 'time-block';
            const h3 = document.createElement('h3');
            h3.textContent = b.t;
            block.appendChild(h3);
            
            b.items.forEach(i => {
                const item = document.createElement('div');
                item.className = 'item';
                item.style.margin = '5px 0';
                item.style.padding = '10px';
                item.innerHTML = '<div><b>' + i.n + '</b> ' + i.d + '<br><small>' + i.m + '</small></div>';
                block.appendChild(item);
            });
            div.appendChild(block);
        });
    },

    calcFert: function() {
        const v = parseFloat(document.getElementById('lab-vol').value)||0;
        const c = parseFloat(document.getElementById('lab-conc').value)||0;
        const res = Math.round((v/1.5)*20 + (c/16)*30);
        const el = document.getElementById('fert-res');
        if(el) el.innerHTML = '<span style="color:'+(res>50?'var(--sec)':'var(--err)')+'">IF: '+res+'/100</span>';
    },

    renderArticles: function() {
        const div = document.getElementById('articles-list');
        if(!div) return;
        DB.articles.forEach(a => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = '<div><b>' + a.t + '</b><br><small>' + a.c + ' | 👁' + a.v + '</small></div>';
            div.appendChild(item);
        });
    },

    renderShop: function() {
        const div = document.getElementById('shop-list');
        if(!div) return;
        for(let k in DB.shop) {
            DB.shop[k].forEach(i => {
                const item = document.createElement('div');
                item.className = 'item';
                item.innerHTML = '<div><b>' + k.toUpperCase() + '</b><br>' + i.p + '</div><div style="color:var(--sec)">' + i.pr + '</div>';
                div.appendChild(item);
            });
        }
    },

    renderGlossary: function() {
        const div = document.getElementById('glossary-list');
        if(!div) return;
        for(let k in DB.glossary) {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = '<b>' + k + '</b><br><small>' + DB.glossary[k] + '</small>';
            div.appendChild(item);
        }
    },
    
    updateProfile: function() {
        document.getElementById('prof-xp').textContent = this.state.xp;
        document.getElementById('prof-trust').textContent = Math.min(100, Math.floor(this.state.xp / 5));
    }
};

document.addEventListener('DOMContentLoaded', () => { 
    console.log('DOM Ready'); 
    App.init(); 
});
