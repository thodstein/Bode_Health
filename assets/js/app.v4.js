const App = {
    state: { stack:[], plan:[], wIdx:0, xp:0, charts:{liver:true, cardio:true, hemato:true} },
    init: function() {
        console.log("App v4 Init");
        const sel = document.getElementById('sub-select');
        if(sel) {
            sel.innerHTML = '';
            DB.substances.forEach(s => {
                let o = document.createElement('option'); o.value=s.id; o.innerText=s.name; sel.appendChild(o);
            });
        }
        this.renderSupport();
        this.renderArticles();
        this.renderShop();
        this.renderGlossary();
        this.renderWorkouts();
        this.renderControls();
    },
    switchTab: function(id) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        event.currentTarget.classList.add('active');
        if(id === 'risks' && this.state.plan.length) setTimeout(()=>this.renderChart(), 50);
    },
    loadEsters: function() {
        const subId = document.getElementById('sub-select').value;
        const estSel = document.getElementById('est-select');
        estSel.innerHTML = '';
        const list = DB.esters[subId];
        if(list && list.length) {
            estSel.disabled = false;
            list.forEach(e => {
                let o = document.createElement('option'); o.value=e.id; o.innerText=e.name+' ('+e.hl+' дн.)'; estSel.appendChild(o);
            });
        } else { estSel.disabled = true; }
    },
    addDrug: function() {
        const sub = document.getElementById('sub-select').value;
        const est = document.getElementById('est-select').value;
        const dose = parseFloat(document.getElementById('in-dose').value);
        const start = parseInt(document.getElementById('in-start').value);
        const end = parseInt(document.getElementById('in-end').value);
        if(!dose || start>=end) return alert('Ошибка ввода!');
        this.state.stack.push({sub, est, dose, start, end});
        this.renderStack();
        document.getElementById('in-dose').value = '';
    },
    renderStack: function() {
        const div = document.getElementById('stack-list');
        div.innerHTML = '';
        this.state.stack.forEach((it, idx) => {
            const s = DB.substances.find(x=>x.id===it.sub);
            const e = DB.esters[it.sub]?.find(x=>x.id===it.est);
            div.innerHTML += `<div class="item"><div><b>${s.name}</b> ${e?'('+e.name+')':''}<br><small>${it.dose}мг | Нед ${it.start}-${it.end}</small></div><button class="btn-del" onclick="App.state.stack.splice(${idx},1);App.renderStack()">✕</button></div>`;
        });
    },
    calcPlan: function() {
        if(!this.state.stack.length) return alert('Добавьте препараты!');
        this.state.plan = Engine.generatePlan(this.state.stack);
        this.state.wIdx = 0;
        this.renderHeatmap();
        this.renderChart();
        document.getElementById('plan-msg').innerText = `Расчет на ${this.state.plan.length} недель!`;
        this.state.xp += 100;
        document.getElementById('xp-display').innerText = 'XP: '+this.state.xp;
        const avg = Object.values(this.state.plan[0].r).reduce((a,b)=>a+Object.values(b).reduce((x,y)=>x+y,0),0) / 49;
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
        const div = document.getElementById('heatmap');
        div.innerHTML = '';
        for(let sys in DB.risks) {
            div.innerHTML += `<div style="grid-column:1/-1; color:var(--pri); font-weight:bold; margin-top:10px">${sys.toUpperCase()}</div>`;
            DB.risks[sys].forEach(m => {
                const val = data.r[sys][m.id]||0;
                let col = Engine.getColor(val);
                let el = document.createElement('div');
                el.className = 'hm-cell';
                el.style.background = col; el.style.color = val>50?'#000':'#fff';
                el.innerHTML = `<b>${m.n}</b><br>${val}%`;
                div.appendChild(el);
            });
        }
    },
    renderChart: function() {
        const ctx = document.getElementById('trend-chart');
        if(!ctx) return;
        if(window.myChart) window.myChart.destroy();
        const labels = this.state.plan.map(p=>'W'+p.w);
        const datasets = [];
        const colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40'};
        for(let sys in this.state.charts) {
            if(this.state.charts[sys]) {
                const d = this.state.plan.map(p => {
                    let sum=0, cnt=0;
                    for(let k in p.r[sys]){sum+=p.r[sys][k];cnt++;}
                    return cnt?Math.round(sum/cnt):0;
                });
                datasets.push({label:sys.toUpperCase(), data:d, borderColor:colors[sys], borderWidth:2, fill:false});
            }
        }
        window.myChart = new Chart(ctx.getContext('2d'), {
            type:'line', data: {labels, datasets},
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
        const names = {liver:'Печень', cardio:'Сердце', hemato:'Кровь'};
        div.innerHTML = '';
        for(let k in names) {
            div.innerHTML += `<label><input type="checkbox" ${this.state.charts[k]?'checked':''} onchange="App.toggleChart('${k}')"> ${names[k]}</label>`;
        }
    },
    renderSupport: function() {
        const div = document.getElementById('support-list');
        if(!div) return;
        DB.support.forEach(b => {
            div.innerHTML += `<div class="time-block"><h3>${b.t}</h3>` + b.items.map(i=>`<div class="item" style="margin:5px 0; padding:10px"><div><b>${i.n}</b> ${i.d}<br><small>${i.m}</small></div></div>`).join('') + `</div>`;
        });
    },
    calcFert: function() {
        const v = parseFloat(document.getElementById('lab-vol').value)||0;
        const c = parseFloat(document.getElementById('lab-conc').value)||0;
        const p = parseFloat(document.getElementById('lab-pr').value)||0;
        const m = parseFloat(document.getElementById('lab-morph').value)||0;
        const res = Engine.calcFert({vol:v, conc:c, pr:p, morph:m});
        const el = document.getElementById('fert-res');
        if(el) el.innerHTML = `<span style="color:${res>60?'var(--sec)':'var(--err)'}">IF: ${res}/100</span>`;
    },
    renderArticles: function() {
        const div = document.getElementById('articles-list');
        if(!div) return;
        DB.articles.forEach(a => div.innerHTML += `<div class="item"><div><b>${a.t}</b><br><small>${a.c} | 👁${a.v}</small><p style="font-size:0.8em; color:#aaa; margin-top:5px">${a.txt}</p></div></div>`);
    },
    renderShop: function() {
        const div = document.getElementById('shop-list');
        if(!div) return;
        for(let k in DB.shop) {
            DB.shop[k].forEach(i => div.innerHTML += `<div class="item"><div><b>${k.toUpperCase()}</b><br>${i.p}</div><a href="${i.u}" class="btn-del" style="text-decoration:none">Купить</a></div>`);
        }
    },
    renderGlossary: function() {
        const div = document.getElementById('glossary-list');
        if(!div) return;
        for(let k in DB.glossary) div.innerHTML += `<div class="item"><b>${k}</b><br><small>${DB.glossary[k]}</small></div>`;
    },
    renderWorkouts: function() {
        const div = document.getElementById('workout-list');
        if(!div) return;
        DB.workouts.forEach(w => {
            div.innerHTML += `<div class="time-block"><h3>${w.name}</h3><ul>` + w.exercises.map(e=>`<li>${e}</li>`).join('') + `</ul></div>`;
        });
    }
};
document.addEventListener('DOMContentLoaded', () => App.init());
