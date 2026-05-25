const App = {
    state: {stack:[], plan:[], wIdx:0, xp:0, charts:{liver:true, cardio:true, hemato:true, kidney:false, neuro:false, endo:false, repro:false}},
    init: function() {
        console.log('App Starting...');
        const sel = document.getElementById('sub-select');
        if (sel && DB.substances) {
            sel.innerHTML = '';
            DB.substances.forEach(function(s) {
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
        console.log('App Initialized.');
    },
    switchTab: function(id) {
        document.querySelectorAll('.view').forEach(function(el){el.classList.remove('active');});
        document.querySelectorAll('.tab-btn').forEach(function(el){el.classList.remove('active');});
        document.getElementById(id).classList.add('active');
        if(event && event.currentTarget) event.currentTarget.classList.add('active');
        if (id === 'risks' && this.state.plan.length) {
            setTimeout(this.renderChart.bind(this), 100);
        }
    },
    loadEsters: function() {
        const subId = document.getElementById('sub-select').value;
        const estSel = document.getElementById('est-select');
        estSel.innerHTML = '';
        const list = DB.esters[subId];
        if (list && list.length) {
            estSel.disabled = false;
            list.forEach(function(e) {
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
        if (!dose || start >= end) return alert('Ошибка ввода!');
        this.state.stack.push({sub: sub, est: est, dose: dose, start: start, end: end});
        this.renderStack();
        document.getElementById('in-dose').value = '';
    },
    renderStack: function() {
        const div = document.getElementById('stack-list');
        if(!div) return;
        div.innerHTML = '';
        const self = this;
        this.state.stack.forEach(function(it, idx) {
            const s = DB.substances.find(function(x){return x.id===it.sub;});
            let eName = '';
            const esterList = DB.esters[it.sub];
            if(esterList) {
                for(let k=0; k<esterList.length; k++) {
                    if(esterList[k].id === it.est) { eName = esterList[k].name; break; }
                }
            }
            const html = '<div class="item"><div><b>' + s.name + '</b> ' + (eName ? '('+eName+')' : '') + '<br><small>' + it.dose + 'мг | Нед ' + it.start + '-' + it.end + '</small></div>';
            const btn = '<button class="btn-del" onclick="App.state.stack.splice('+idx+',1);App.renderStack()">X</button></div>';
            div.innerHTML += html + btn;
        });
    },
    calcPlan: function() {
        if (!this.state.stack.length) return alert('Добавьте препараты!');
        this.state.plan = Engine.generatePlan(this.state.stack);
        this.state.wIdx = 0;
        this.renderHeatmap();
        this.renderChart();
        document.getElementById('plan-msg').innerText = 'Расчет на ' + this.state.plan.length + ' недель!';
        this.state.xp += 100;
        document.getElementById('xp-display').innerText = 'XP: ' + this.state.xp;
        let sumTotal = 0;
        let countTotal = 0;
        const firstWeek = this.state.plan[0].r;
        for(let sys in firstWeek) {
            for(let k in firstWeek[sys]) {
                sumTotal += firstWeek[sys][k];
                countTotal++;
            }
        }
        const avg = countTotal > 0 ? sumTotal / countTotal : 0;
        document.getElementById('d-risk').innerText = Math.round(avg) + '%';
        document.getElementById('d-readiness').innerText = Math.max(10, 100 - Math.round(avg));
    },
    changeWeek: function(dir) {
        if (!this.state.plan.length) return;
        this.state.wIdx += dir;
        if (this.state.wIdx < 0) this.state.wIdx = 0;
        if (this.state.wIdx >= this.state.plan.length) this.state.wIdx = this.state.plan.length - 1;
        this.renderHeatmap();
    },
    renderHeatmap: function() {
        if (!this.state.plan.length) return;
        const data = this.state.plan[this.state.wIdx];
        document.getElementById('week-label').innerText = 'Неделя ' + data.w;
        const div = document.getElementById('heatmap');
        if(!div) return;
        div.innerHTML = '';
        for (let sys in DB.risks) {
            div.innerHTML += '<div style="grid-column:1/-1;color:var(--pri);font-weight:bold;margin-top:10px">' + sys.toUpperCase() + '</div>';
            DB.risks[sys].forEach(function(m) {
                const val = data.r[sys][m.id] || 0;
                const col = Engine.getColor(val);
                const txt = val > 50 ? '#000' : '#fff';
                div.innerHTML += '<div class="hm-cell" style="background:' + col + ';color:' + txt + '"><b>' + m.n + '</b><br>' + val + '%</div>';
            });
        }
    },
    renderChart: function() {
        const ctx = document.getElementById('trend-chart');
        if (!ctx) return;
        if (window.myChart) window.myChart.destroy();
        const labels = this.state.plan.map(function(p){return 'W'+p.w;});
        const datasets = [];
        const colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40', kidney:'#4bc0c0', neuro:'#9966ff', endo:'#c9cbcf', repro:'#e7e9ed'};
        const self = this;
        for (let sys in this.state.charts) {
            if (this.state.charts[sys]) {
                const d = this.state.plan.map(function(p) {
                    let sum = 0, cnt = 0;
                    for (let k in p.r[sys]) { sum += p.r[sys][k]; cnt++; }
                    return cnt ? Math.round(sum / cnt) : 0;
                });
                datasets.push({label: sys.toUpperCase(), data: d, borderColor: colors[sys], borderWidth: 2, fill: false, tension: 0.4});
            }
        }
        window.myChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {labels: labels, datasets: datasets},
            options: {
                responsive: true,
                plugins: {legend: {labels: {color: '#aaa'}}},
                scales: {
                    y: {beginAtZero: true, max: 100, ticks: {color: '#aaa'}, grid: {color: '#333'}},
                    x: {ticks: {color: '#aaa'}, grid: {color: '#333'}}
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
        const names = {liver:'Печень', cardio:'Сердце', hemato:'Кровь', kidney:'Почки', neuro:'Невро', endo:'Эндо', repro:'Репро'};
        div.innerHTML = '';
        const self = this;
        for (let k in names) {
            const checked = self.state.charts[k] ? 'checked' : '';
            div.innerHTML += '<label><input type="checkbox" ' + checked + ' onchange="App.toggleChart(\'' + k + '\')"> ' + names[k] + '</label>';
        }
    },
    renderSupport: function() {
        const div = document.getElementById('support-list');
        if (!div) return;
        div.innerHTML = '';
        DB.support.forEach(function(b) {
            let itemsHtml = '';
            b.items.forEach(function(i) {
                itemsHtml += '<div class="item" style="margin:5px 0;padding:10px"><div><b>' + i.n + '</b> ' + i.d + '<br><small>' + i.m + '</small></div></div>';
            });
            div.innerHTML += '<div class="time-block"><h3>' + b.t + '</h3>' + itemsHtml + '</div>';
        });
    },
    calcFert: function() {
        const v = parseFloat(document.getElementById('lab-vol').value) || 0;
        const c = parseFloat(document.getElementById('lab-conc').value) || 0;
        const res = Math.round((v / 1.5) * 20 + (c / 16) * 30);
        const el = document.getElementById('fert-res');
        if (el) el.innerHTML = '<span style="color:' + (res > 50 ? 'var(--sec)' : 'var(--err)') + '">IF: ' + res + '/100</span>';
    },
    renderArticles: function() {
        const div = document.getElementById('articles-list');
        if (!div) return;
        div.innerHTML = '';
        DB.articles.forEach(function(a) {
            div.innerHTML += '<div class="item"><div><b>' + a.t + '</b><br><small>' + a.c + ' | 👁' + a.v + '</small></div></div>';
        });
    },
    renderShop: function() {
        const div = document.getElementById('shop-list');
        if (!div) return;
        div.innerHTML = '';
        for (let k in DB.shop) {
            DB.shop[k].forEach(function(i) {
                div.innerHTML += '<div class="item"><div><b>' + k.toUpperCase() + '</b><br>' + i.p + '</div><div style="color:var(--sec)">' + i.pr + '</div></div>';
            });
        }
    },
    renderGlossary: function() {
        const div = document.getElementById('glossary-list');
        if (!div) return;
        div.innerHTML = '';
        for (let k in DB.glossary) {
            div.innerHTML += '<div class="item"><b>' + k + '</b><br><small>' + DB.glossary[k] + '</small></div>';
        }
    }
};
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Ready. Starting App...');
    App.init();
});
