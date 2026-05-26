console.log("App.v3 Loading...");

const App = {
    state: { stack:[], plan:[], wIdx:0, xp:0, charts:{liver:true, cardio:true, hemato:true, kidney:false, neuro:false, endo:false, repro:false} },
    
    init: function() {
        console.log("App Init Started");
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
        this.renderControls();
        this.renderWorkouts();
        this.updateDashboard();
        console.log("App Init Complete");
    },

    switchTab: function(tabId) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        
        const target = document.getElementById(tabId);
        if(target) target.classList.add('active');
        
        // Highlight button
        const btns = document.querySelectorAll('.tab-btn');
        btns.forEach(b => {
            if(b.getAttribute('onclick').includes(tabId)) b.classList.add('active');
        });

        // Render charts only when visible
        if(tabId === 'risks') {
            setTimeout(() => {
                this.renderChart();
                this.renderHeatmap();
            }, 100);
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
        
        if(!dose || start>=end) return alert('Проверьте дозу и недели!');
        
        this.state.stack.push({sub, est, dose, start, end});
        this.renderStack();
        document.getElementById('in-dose').value = '';
    },

    renderStack: function() {
        const div = document.getElementById('stack-list');
        if(!div) return;
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
        document.getElementById('plan-msg').innerText = `Расчет на ${this.state.plan.length} недель выполнен!`;
        this.state.xp += 100;
        document.getElementById('xp-display').innerText = 'XP: '+this.state.xp;
        this.updateDashboard();
    },

    updateDashboard: function() {
        if(this.state.plan.length > 0) {
            const current = this.state.plan[this.state.wIdx];
            let sum = 0, cnt = 0;
            for(let sys in current.r) {
                for(let k in current.r[sys]) { sum += current.r[sys][k]; cnt++; }
            }
            const avg = cnt ? Math.round(sum/cnt) : 0;
            document.getElementById('d-risk').innerText = avg + '%';
            document.getElementById('d-readiness').innerText = Math.max(10, 100 - avg);
        }
    },

    changeWeek: function(dir) {
        if(!this.state.plan.length) return;
        this.state.wIdx += dir;
        if(this.state.wIdx<0) this.state.wIdx=0;
        if(this.state.wIdx>=this.state.plan.length) this.state.wIdx=this.state.plan.length-1;
        this.renderHeatmap();
        this.updateDashboard();
    },

    renderHeatmap: function() {
        if(!this.state.plan.length) return;
        const data = this.state.plan[this.state.wIdx];
        const label = document.getElementById('week-label');
        if(label) label.innerText = 'Неделя '+data.w;
        
        const div = document.getElementById('heatmap');
        if(!div) return;
        div.innerHTML = '';
        
        for(let sys in DB.risks) {
            div.innerHTML += `<div style="grid-column:1/-1; color:var(--pri); font-weight:bold; margin-top:10px; border-bottom:1px solid #333; padding-bottom:5px">${sys.toUpperCase()}</div>`;
            DB.risks[sys].forEach(m => {
                const val = data.r[sys][m.id]||0;
                let col = Engine.getColor(val);
                let txt = val>50?'#000':'#fff';
                let el = document.createElement('div');
                el.className = 'hm-cell';
                el.style.background = col; el.style.color = txt;
                el.title = m.d; // Tooltip
                el.innerHTML = `<b>${m.n}</b><br>${val}%`;
                div.appendChild(el);
            });
        }
    },

    renderChart: function() {
        const ctxCanvas = document.getElementById('trend-chart');
        if(!ctxCanvas || !this.state.plan.length) return;
        
        if(window.myChart) window.myChart.destroy();
        
        const ctx = ctxCanvas.getContext('2d');
        const labels = this.state.plan.map(p=>'W'+p.w);
        const datasets = [];
        const colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40', kidney:'#4bc0c0', neuro:'#9966ff', endo:'#c9cbcf', repro:'#e7e9ed'};
        
        for(let sys in this.state.charts) {
            if(this.state.charts[sys]) {
                const d = this.state.plan.map(p => {
                    let sum=0, cnt=0;
                    for(let k in p.r[sys]){sum+=p.r[sys][k];cnt++;}
                    return cnt?Math.round(sum/cnt):0;
                });
                datasets.push({label:sys.toUpperCase(), data:d, borderColor:colors[sys], borderWidth:2, fill:false, tension:0.4});
            }
        }
        
        window.myChart = new Chart(ctx, {
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
            div.innerHTML += `<label><input type="checkbox" ${this.state.charts[k]?'checked':''} onchange="App.toggleChart('${k}')"> ${names[k]}</label>`;
        }
    },

    renderSupport: function() {
        const div = document.getElementById('support-list');
        if(!div) return;
        div.innerHTML = '';
        DB.support.forEach(b => {
            let html = `<div class="time-block"><h3>${b.t}</h3>`;
            b.items.forEach(i => {
                html += `<div class="item" style="margin:5px 0; padding:10px; flex-direction:column; align-items:flex-start">
                    <div style="display:flex; justify-content:space-between; width:100%">
                        <b>${i.n}</b> <span style="color:var(--sec)">${i.d}</span>
                    </div>
                    <small style="color:#aaa; margin-top:4px">${i.m}</small>
                    <div style="font-size:0.7em; color:var(--pri); margin-top:2px">🛡️ ${i.r.join(', ')}</div>
                </div>`;
            });
            html += `</div>`;
            div.innerHTML += html;
        });
    },

    calcFert: function() {
        const v = parseFloat(document.getElementById('lab-vol').value)||0;
        const c = parseFloat(document.getElementById('lab-conc').value)||0;
        const pr = parseFloat(document.getElementById('lab-pr').value)||0;
        const morph = parseFloat(document.getElementById('lab-morph').value)||0;
        
        const res = Engine.calcFertility({volume:v, concentration:c, pr:pr, morphology:morph});
        const el = document.getElementById('fert-res');
        if(el) el.innerHTML = `<span style="color:${res>60?'var(--sec)':(res>30?'#ffeb3b':'var(--err)')}">IF: ${res}/100 <small>(${res>60?'Норма':(res>30?'Средне':'Низко')})</small></span>`;
    },

    renderArticles: function() {
        const div = document.getElementById('articles-list');
        if(!div) return;
        div.innerHTML = '';
        DB.articles.forEach(a => {
            div.innerHTML += `<div class="item" style="flex-direction:column; align-items:flex-start">
                <b>${a.t}</b>
                <small style="color:var(--pri); margin:4px 0">${a.c} | 👁${a.v}</small>
                <p style="font-size:0.9em; color:#ccc; margin:0">${a.txt}</p>
            </div>`;
        });
    },

    renderShop: function() {
        const div = document.getElementById('shop-list');
        if(!div) return;
        div.innerHTML = '';
        for(let k in DB.shop) {
            DB.shop[k].forEach(i => {
                div.innerHTML += `<div class="item">
                    <div><b>${k.toUpperCase()}</b><br><small>${i.p}</small></div>
                    <div style="text-align:right">
                        <div style="color:var(--sec); font-weight:bold">${i.pr}</div>
                        <a href="${i.l}" class="btn-del" style="text-decoration:none">Купить</a>
                    </div>
                </div>`;
            });
        }
    },

    renderGlossary: function() {
        const div = document.getElementById('glossary-list');
        if(!div) return;
        div.innerHTML = '';
        for(let k in DB.glossary) {
            div.innerHTML += `<div class="item" style="flex-direction:column; align-items:flex-start">
                <b style="color:var(--sec)">${k}</b>
                <small style="color:#aaa; margin-top:4px">${DB.glossary[k]}</small>
            </div>`;
        }
    },

    renderWorkouts: function() {
        const div = document.getElementById('workout-list');
        if(!div) return;
        div.innerHTML = '';
        DB.workouts.forEach(w => {
            div.innerHTML += `<div class="item">
                <div><b>${w.name}</b><br><small>${w.muscles}</small></div>
                <div style="text-align:right">
                    <small style="color:var(--pri)">${w.vol}</small><br>
                    <small style="color:#aaa">${w.rec}</small>
                </div>
            </div>`;
        });
    }
};

// Global wrapper for HTML onclick
window.App = App;

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Ready. Starting App...");
    App.init();
});
