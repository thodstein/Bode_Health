const App = {
    state: {stack:[], plan:[], wIdx:0, xp:0, charts:{liver:true, cardio:true, hemato:true, kidney:false, neuro:false, endo:false, repro:false}},
    init: function() {
        const sel = document.getElementById('sub-select');
        if(sel && typeof DB !== 'undefined') {
            sel.innerHTML = '';
            DB.substances.forEach(s => {
                let o = document.createElement('option'); o.value=s.id; o.innerText=s.name; sel.appendChild(o);
            });
        }
        this.renderSupport(); this.renderArticles(); this.renderShop(); this.renderGlossary(); this.renderControls();
        console.log("App Initialized");
    },
    switchTab: function(id) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        event.currentTarget.classList.add('active');
        if(id === 'risks' && this.state.plan.length) setTimeout(() => this.renderChart(), 100);
    },
    loadEsters: function() {
        const subId = document.getElementById('sub-select').value;
        const estSel = document.getElementById('est-select');
        estSel.innerHTML = '';
        if(typeof DB === 'undefined' || !DB.esters[subId]) { estSel.disabled = true; return; }
        const list = DB.esters[subId];
        if(list && list.length) {
            estSel.disabled = false;
            list.forEach(e => { let o = document.createElement('option'); o.value=e.id; o.innerText=e.name+' ('+e.hl+'д)'; estSel.appendChild(o); });
        } else { estSel.disabled = true; }
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
        const div = document.getElementById('stack-list'); div.innerHTML = '';
        this.state.stack.forEach((it, idx) => {
            const s = DB.substances.find(x => x.id === it.sub);
            const e = DB.esters[it.sub] ? DB.esters[it.sub].find(x => x.id === it.est) : null;
            const name = e ? (s.name + ' (' + e.name + ')') : s.name;
            div.innerHTML += '<div class="item"><div><b>'+name+'</b><br><small>'+it.dose+'мг | Нед '+it.start+'-'+it.end+'</small></div><button class="btn-del" onclick="App.state.stack.splice('+idx+',1);App.renderStack()" style="background:none;border:none;color:red;cursor:pointer">X</button></div>';
        });
    },
    calcPlan: function() {
        if(!this.state.stack.length) return alert('Добавьте препараты!');
        if(typeof Engine === 'undefined') return alert('Ошибка движка!');
        this.state.plan = Engine.generatePlan(this.state.stack);
        this.state.wIdx = 0;
        this.renderHeatmap(); this.renderChart();
        document.getElementById('plan-msg').innerText = 'Расчет на '+this.state.plan.length+' недель!';
        this.state.xp += 100; document.getElementById('xp-display').innerText = 'XP: '+this.state.xp;
        let sumRisk=0, count=0;
        for(let sys in this.state.plan[0].r) for(let k in this.state.plan[0].r[sys]) { sumRisk+=this.state.plan[0].r[sys][k]; count++; }
        const avg = count>0 ? sumRisk/count : 0;
        document.getElementById('d-risk').innerText = Math.round(avg)+'%';
        document.getElementById('d-readiness').innerText = Math.max(10, 100-Math.round(avg));
    },
    changeWeek: function(dir) {
        if(!this.state.plan.length) return;
        this.state.wIdx += dir;
        if(this.state.wIdx<0) this.state.wIdx=0;
        if(this.state.wIdx>=this.state.plan.length) this.state.wIdx=this.state.plan.length-1;
        this.renderHeatmap();
    },
    renderHeatmap: function() {
        if(!this.state.plan.length) return;
        const data = this.state.plan[this.state.wIdx];
        document.getElementById('week-label').innerText = 'Неделя '+data.w;
        const div = document.getElementById('heatmap'); div.innerHTML = '';
        for(let sys in DB.risks) {
            div.innerHTML += '<div style="grid-column:1/-1;color:var(--pri);font-weight:bold;margin-top:10px">'+sys.toUpperCase()+'</div>';
            DB.risks[sys].forEach(m => {
                const val = data.r[sys][m.id]||0;
                const col = Engine.getColor(val);
                const txt = val>50?'#000':'#fff';
                div.innerHTML += '<div class="hm-cell" style="background:'+col+';color:'+txt+'"><b>'+m.n+'</b><br>'+val+'%</div>';
            });
        }
    },
    renderChart: function() {
        const ctx = document.getElementById('trend-chart'); if(!ctx) return;
        if(window.myChart) window.myChart.destroy();
        const labels = this.state.plan.map(p => 'W'+p.w);
        const datasets = [];
        const colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40', kidney:'#4bc0c0', neuro:'#9966ff', endo:'#c9cbcf', repro:'#e7e9ed'};
        
        for(let sys in this.state.charts) {
            if(this.state.charts[sys]) {
                const d = this.state.plan.map(p => { let sum=0,cnt=0; for(let k in p.r[sys]){sum+=p.r[sys][k];cnt++;} return cnt?Math.round(sum/cnt):0; });
                datasets.push({label:sys.toUpperCase(), data:d, borderColor:colors[sys], borderWidth:2, fill:false, tension:0.4});
            }
        }
        
        // ИСПРАВЛЕННЫЙ СИНТАКСИС CHART.JS
        window.myChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#aaa' } }
                },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } },
                    x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
                }
            }
        });
    },
    toggleChart: function(sys) { this.state.charts[sys] = !this.state.charts[sys]; this.renderChart(); },
    renderControls: function() {
        const div = document.getElementById('chart-controls'); if(!div) return;
        const names = {liver:'Печень', cardio:'Сердце', hemato:'Кровь', kidney:'Почки', neuro:'Невро', endo:'Эндо', repro:'Репро'};
        div.innerHTML = '';
        for(let k in names) div.innerHTML += '<label style="margin-right:10px;color:#fff"><input type="checkbox" '+(this.state.charts[k]?'checked':'')+' onchange="App.toggleChart(\''+k+'\')"> '+names[k]+'</label>';
    },
    renderSupport: function() {
        const div = document.getElementById('support-list'); if(!div) return;
        if(typeof DB === 'undefined') return;
        DB.support.forEach(b => {
            let html = '<div class="time-block" style="background:#252525;padding:15px;margin:10px 0;border-radius:8px"><h3 style="color:var(--pri);margin:0 0 10px">'+b.t+'</h3>';
            b.items.forEach(i => { html += '<div class="item" style="margin:5px 0;padding:10px"><div><b>'+i.n+'</b> '+i.d+'<br><small>'+i.m+'</small></div></div>'; });
            div.innerHTML += html+'</div>';
        });
    },
    calcFert: function() {
        const v = parseFloat(document.getElementById('lab-vol').value)||0;
        const c = parseFloat(document.getElementById('lab-conc').value)||0;
        const res = Math.round((v/1.5)*20 + (c/16)*30);
        const el = document.getElementById('fert-res');
        if(el) el.innerHTML = '<span style="color:'+(res>50?'var(--sec)':'var(--err)')+';font-size:1.2rem;font-weight:bold">IF: '+res+'/100</span>';
    },
    renderArticles: function() {
        const div = document.getElementById('articles-list'); if(!div) return;
        if(typeof DB === 'undefined') return;
        DB.articles.forEach(a => div.innerHTML += '<div class="item"><div><b>'+a.t+'</b><br><small>'+a.c+' | 👁'+a.v+'</small></div></div>');
    },
    renderShop: function() {
        const div = document.getElementById('shop-list'); if(!div) return;
        if(typeof DB === 'undefined') return;
        for(let k in DB.shop) DB.shop[k].forEach(i => div.innerHTML += '<div class="item"><div><b>'+k.toUpperCase()+'</b><br>'+i.p+'</div><div style="color:var(--sec)">'+i.pr+'</div></div>');
    },
    renderGlossary: function() {
        const div = document.getElementById('glossary-list'); if(!div) return;
        if(typeof DB === 'undefined') return;
        for(let k in DB.glossary) div.innerHTML += '<div class="item"><b>'+k+'</b><br><small>'+DB.glossary[k]+'</small></div>';
    },
    updateProfile: function() {
        const xpEl = document.getElementById('prof-xp');
        const trustEl = document.getElementById('prof-trust');
        if(xpEl) xpEl.innerText = this.state.xp;
        if(trustEl) trustEl.innerText = Math.min(100, Math.floor(this.state.xp/10));
    }
};

document.addEventListener('DOMContentLoaded', () => { 
    if(typeof DB !== 'undefined' && typeof Engine !== 'undefined') {
        App.init(); 
        setInterval(() => App.updateProfile(), 1000); 
    } else {
        console.error("DB or Engine not loaded!");
    }
});
