var App = {
    state: {stack:[], plan:[], wIdx:0, xp:0, charts:{liver:true, cardio:true, hemato:true, kidney:false, neuro:false, endo:false, repro:false}},
    init: function() {
        console.log('App Starting...');
        var sel = document.getElementById('sub-select');
        if (sel && DB.substances) {
            sel.innerHTML = '';
            for (var i=0; i<DB.substances.length; i++) {
                var s = DB.substances[i];
                var o = document.createElement('option');
                o.value = s.id;
                o.innerText = s.name;
                sel.appendChild(o);
            }
        }
        this.renderSupport();
        this.renderArticles();
        this.renderShop();
        this.renderGlossary();
        this.renderControls();
        console.log('App Initialized.');
    },
    switchTab: function(id) {
        var views = document.querySelectorAll('.view');
        for (var i=0; i<views.length; i++) views[i].classList.remove('active');
        var btns = document.querySelectorAll('.tab-btn');
        for (var i=0; i<btns.length; i++) btns[i].classList.remove('active');
        document.getElementById(id).classList.add('active');
        event.currentTarget.classList.add('active');
        if (id === 'risks' && this.state.plan.length) {
            setTimeout(this.renderChart.bind(this), 100);
        }
    },
    loadEsters: function() {
        var subId = document.getElementById('sub-select').value;
        var estSel = document.getElementById('est-select');
        estSel.innerHTML = '';
        var list = DB.esters[subId];
        if (list && list.length) {
            estSel.disabled = false;
            for (var i=0; i<list.length; i++) {
                var e = list[i];
                var o = document.createElement('option');
                o.value = e.id;
                o.innerText = e.name + ' (' + e.hl + ' дн.)';
                estSel.appendChild(o);
            }
        } else {
            estSel.disabled = true;
        }
    },
    addDrug: function() {
        var sub = document.getElementById('sub-select').value;
        var est = document.getElementById('est-select').value;
        var dose = parseFloat(document.getElementById('in-dose').value);
        var start = parseInt(document.getElementById('in-start').value);
        var end = parseInt(document.getElementById('in-end').value);
        if (!dose || start >= end) return alert('Ошибка ввода!');
        this.state.stack.push({sub: sub, est: est, dose: dose, start: start, end: end});
        this.renderStack();
        document.getElementById('in-dose').value = '';
    },
    renderStack: function() {
        var div = document.getElementById('stack-list');
        div.innerHTML = '';
        for (var i=0; i<this.state.stack.length; i++) {
            var it = this.state.stack[i];
            var s = null;
            for(var k=0; k<DB.substances.length; k++) if(DB.substances[k].id === it.sub) s = DB.substances[k];
            var e = null;
            var eList = DB.esters[it.sub];
            if(eList) { for(var j=0; j<eList.length; j++) if(eList[j].id === it.est) e = eList[j]; }
            
            var html = '<div class="item"><div><b>' + s.name + '</b> ' + (e ? '('+e.name+')' : '') + '<br><small>' + it.dose + 'мг | Нед ' + it.start + '-' + it.end + '</small></div>';
            html += '<button class="btn-del" onclick="App.state.stack.splice('+i+',1); App.renderStack()">X</button></div>';
            div.innerHTML += html;
        }
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
        
        var sumTotal = 0;
        var countTotal = 0;
        var firstWeek = this.state.plan[0].r;
        for (var sys in firstWeek) {
            for (var k in firstWeek[sys]) {
                sumTotal += firstWeek[sys][k];
                countTotal++;
            }
        }
        var avg = countTotal > 0 ? sumTotal / countTotal : 0;
        document.getElementById('d-risk').innerText = Math.round(avg) + '%';
        document.getElementById('d-readiness').innerText = Math.max(10, 100 - Math.round(avg)) + '';
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
        var data = this.state.plan[this.state.wIdx];
        document.getElementById('week-label').innerText = 'Неделя ' + data.w;
        var div = document.getElementById('heatmap');
        div.innerHTML = '';
        for (var sys in DB.risks) {
            div.innerHTML += '<div style="grid-column:1/-1; color:var(--pri); font-weight:bold; margin-top:10px">' + sys.toUpperCase() + '</div>';
            DB.risks[sys].forEach(function(m) {
                var val = data.r[sys][m.id] || 0;
                var col = Engine.getColor(val);
                var txt = val > 50 ? '#000' : '#fff';
                div.innerHTML += '<div class="hm-cell" style="background:' + col + '; color:' + txt + '"><b>' + m.n + '</b><br>' + val + '%</div>';
            });
        }
    },
    renderChart: function() {
        var ctx = document.getElementById('trend-chart');
        if (!ctx) return;
        if (window.myChart) window.myChart.destroy();
        var labels = [];
        for (var i=0; i<this.state.plan.length; i++) labels.push('W' + this.state.plan[i].w);
        
        var datasets = [];
        var colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40', kidney:'#4bc0c0', neuro:'#9966ff', endo:'#c9cbcf', repro:'#e7e9ed'};
        
        for (var sys in this.state.charts) {
            if (this.state.charts[sys]) {
                var d = [];
                for (var i=0; i<this.state.plan.length; i++) {
                    var p = this.state.plan[i];
                    var sum = 0; var cnt = 0;
                    for (var k in p.r[sys]) { sum += p.r[sys][k]; cnt++; }
                    d.push(cnt > 0 ? Math.round(sum / cnt) : 0);
                }
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
        var div = document.getElementById('chart-controls');
        if (!div) return;
        var names = {liver:'Печень', cardio:'Сердце', hemato:'Кровь', kidney:'Почки', neuro:'Невро', endo:'Эндо', repro:'Репро'};
        div.innerHTML = '';
        for (var k in names) {
            var checked = this.state.charts[k] ? 'checked' : '';
            div.innerHTML += '<label><input type="checkbox" ' + checked + ' onchange="App.toggleChart(\'' + k + '\')"> ' + names[k] + '</label>';
        }
    },
    renderSupport: function() {
        var div = document.getElementById('support-list');
        if (!div) return;
        div.innerHTML = '';
        DB.support.forEach(function(b) {
            var html = '<div class="time-block"><h3>' + b.t + '</h3>';
            b.items.forEach(function(i) {
                html += '<div class="item" style="margin:5px 0; padding:10px"><div><b>' + i.n + '</b> ' + i.d + '<br><small>' + i.m + '</small></div></div>';
            });
            html += '</div>';
            div.innerHTML += html;
        });
    },
    calcFert: function() {
        var v = parseFloat(document.getElementById('lab-vol').value) || 0;
        var c = parseFloat(document.getElementById('lab-conc').value) || 0;
        var res = Math.round((v / 1.5) * 20 + (c / 16) * 30);
        var el = document.getElementById('fert-res');
        if (el) el.innerHTML = '<span style="color:' + (res > 50 ? 'var(--sec)' : 'var(--err)') + '">IF: ' + res + '/100</span>';
    },
    renderArticles: function() {
        var div = document.getElementById('articles-list');
        if (!div) return;
        div.innerHTML = '';
        DB.articles.forEach(function(a) {
            div.innerHTML += '<div class="item"><div><b>' + a.t + '</b><br><small>' + a.c + ' | 👁' + a.v + '</small></div></div>';
        });
    },
    renderShop: function() {
        var div = document.getElementById('shop-list');
        if (!div) return;
        div.innerHTML = '';
        for (var k in DB.shop) {
            DB.shop[k].forEach(function(i) {
                div.innerHTML += '<div class="item"><div><b>' + k.toUpperCase() + '</b><br>' + i.p + '</div><div style="color:var(--sec)">' + i.pr + '</div></div>';
            });
        }
    },
    renderGlossary: function() {
        var div = document.getElementById('glossary-list');
        if (!div) return;
        div.innerHTML = '';
        for (var k in DB.glossary) {
            div.innerHTML += '<div class="item"><b>' + k + '</b><br><small>' + DB.glossary[k] + '</small></div>';
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Ready. Starting App...');
    App.init();
});
