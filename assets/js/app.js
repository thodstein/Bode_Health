console.log("App Starting...");
var App = {
    state: { stack:[], plan:[], wIdx:0, xp:0, charts:{liver:true, cardio:true, hemato:true} },
    init: function() {
        console.log("App Init");
        if(typeof DB === 'undefined') { alert("DB Error"); return; }
        var sel = document.getElementById('sub-select');
        if(sel) {
            sel.innerHTML = '';
            for(var i=0; i<DB.substances.length; i++) {
                var s = DB.substances[i];
                var o = document.createElement('option'); o.value=s.id; o.innerText=s.name; sel.appendChild(o);
            }
        }
        this.renderSupport();
        this.renderArticles();
        this.renderShop();
        this.renderGlossary();
        this.renderControls();
    },
    switchTab: function(id) {
        var views = document.querySelectorAll('.view');
        for(var i=0; i<views.length; i++) views[i].classList.remove('active');
        var btns = document.querySelectorAll('.tab-btn');
        for(var i=0; i<btns.length; i++) btns[i].classList.remove('active');
        document.getElementById(id).classList.add('active');
        event.target.classList.add('active');
        if(id=='risks' && this.state.plan.length>0) this.renderChart();
    },
    loadEsters: function() {
        var subId = document.getElementById('sub-select').value;
        var estSel = document.getElementById('est-select');
        estSel.innerHTML = '';
        var list = DB.esters[subId];
        if(list && list.length>0) {
            estSel.disabled = false;
            for(var i=0; i<list.length; i++) {
                var e = list[i];
                var o = document.createElement('option'); o.value=e.id; o.innerText=e.name+' ('+e.hl+'d)'; estSel.appendChild(o);
            }
        } else { estSel.disabled = true; }
    },
    addDrug: function() {
        var sub = document.getElementById('sub-select').value;
        var est = document.getElementById('est-select').value;
        var dose = parseFloat(document.getElementById('in-dose').value);
        var start = parseInt(document.getElementById('in-start').value);
        var end = parseInt(document.getElementById('in-end').value);
        if(!dose || start>=end) return alert('Error');
        this.state.stack.push({sub:sub, est:est, dose:dose, start:start, end:end});
        this.renderStack();
        document.getElementById('in-dose').value = '';
    },
    renderStack: function() {
        var div = document.getElementById('stack-list');
        div.innerHTML = '';
        for(var i=0; i<this.state.stack.length; i++) {
            var it = this.state.stack[i];
            var s = DB.substances.find(x=>x.id==it.sub);
            var e = (DB.esters[it.sub]||[]).find(x=>x.id==it.est);
            div.innerHTML += '<div class="item"><div><b>'+s.name+'</b> '+(e?'('+e.name+')':'')+'<br><small>'+it.dose+'mg | '+it.start+'-'+it.end+'</small></div><button class="btn-del" onclick="App.state.stack.splice('+i+',1);App.renderStack()">X</button></div>';
        }
    },
    calcPlan: function() {
        if(this.state.stack.length===0) return alert('Empty');
        this.state.plan = Engine.generatePlan(this.state.stack);
        this.state.wIdx = 0;
        this.renderHeatmap();
        this.renderChart();
        document.getElementById('plan-msg').innerText = 'Calculated!';
        this.state.xp += 100;
        document.getElementById('xp-display').innerText = 'XP: '+this.state.xp;
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
        var data = this.state.plan[this.state.wIdx];
        document.getElementById('week-label').innerText = 'Week '+data.w;
        var div = document.getElementById('heatmap');
        div.innerHTML = '';
        for(var sys in DB.risks) {
            div.innerHTML += '<div style="grid-column:1/-1; color:#bb86fc; font-weight:bold; margin-top:10px">'+sys.toUpperCase()+'</div>';
            var mList = DB.risks[sys];
            for(var i=0; i<mList.length; i++) {
                var m = mList[i];
                var val = data.r[sys][m.id]||0;
                var col = Engine.getColor(val);
                var txt = val>50?'#000':'#fff';
                var el = document.createElement('div');
                el.className = 'hm-cell';
                el.style.background = col; el.style.color = txt;
                el.innerHTML = '<b>'+m.n+'</b><br>'+val+'%';
                div.appendChild(el);
            }
        }
    },
    renderChart: function() {
        var ctx = document.getElementById('trend-chart');
        if(!ctx) return;
        if(window.myChart) window.myChart.destroy();
        var labels = this.state.plan.map(p=>'W'+p.w);
        var datasets = [];
        var colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40'};
        var visible = this.state.charts;
        for(var sys in visible) {
            if(visible[sys]) {
                var d = this.state.plan.map(p => {
                    var sum=0, cnt=0;
                    for(var k in p.r[sys]){sum+=p.r[sys][k];cnt++;}
                    return cnt?Math.round(sum/cnt):0;
                });
                datasets.push({label:sys.toUpperCase(), d, borderColor:colors[sys], borderWidth:2, fill:false});
            }
        }
        window.myChart = new Chart(ctx.getContext('2d'), {
            type:'line',
             {labels:labels, datasets:datasets},
            options:{responsive:true, plugins:{legend:{labels:{color:'#aaa'}}}, scales:{y:{beginAtZero:true, max:100, ticks:{color:'#aaa'}}, x:{ticks:{color:'#aaa'}}}}
        });
    },
    toggleChart: function(sys) {
        this.state.charts[sys] = !this.state.charts[sys];
        this.renderChart();
    },
    renderControls: function() {
        var div = document.getElementById('chart-controls');
        if(!div) return;
        var names = {liver:'Liver', cardio:'Heart', hemato:'Blood'};
        div.innerHTML = '';
        for(var k in names) {
            div.innerHTML += '<label><input type="checkbox" '+(this.state.charts[k]?'checked':'')+' onchange="App.toggleChart(\''+k+'\')"> '+names[k]+'</label>';
        }
    },
    renderSupport: function() {
        var div = document.getElementById('support-list');
        if(!div) return;
        div.innerHTML = '';
        for(var i=0; i<DB.support.length; i++) {
            var b = DB.support[i];
            var html = '<div class="time-block"><h3>'+b.t+'</h3>';
            for(var j=0; j<b.items.length; j++) {
                var it = b.items[j];
                html += '<div class="item" style="margin:5px 0; padding:10px"><div><b>'+it.n+'</b> '+it.d+'<br><small>'+it.m+'</small></div></div>';
            }
            html += '</div>';
            div.innerHTML += html;
        }
    },
    calcFert: function() {
        var v = parseFloat(document.getElementById('lab-vol').value)||0;
        var c = parseFloat(document.getElementById('lab-conc').value)||0;
        var res = Math.round((v/1.5)*20 + (c/16)*30);
        document.getElementById('fert-res').innerHTML = 'IF: '+res;
    },
    renderArticles: function() {
        var div = document.getElementById('articles-list');
        if(!div) return;
        div.innerHTML = '';
        for(var i=0; i<DB.articles.length; i++) {
            var a = DB.articles[i];
            div.innerHTML += '<div class="item"><div><b>'+a.t+'</b><br><small>'+a.c+'</small></div></div>';
        }
    },
    renderShop: function() {
        var div = document.getElementById('shop-list');
        if(!div) return;
        div.innerHTML = '';
        for(var k in DB.shop) {
            var items = DB.shop[k];
            for(var i=0; i<items.length; i++) {
                var it = items[i];
                div.innerHTML += '<div class="item"><div><b>'+k+'</b><br>'+it.p+'</div><div>'+it.pr+'</div></div>';
            }
        }
    },
    renderGlossary: function() {
        var div = document.getElementById('glossary-list');
        if(!div) return;
        div.innerHTML = '';
        for(var k in DB.glossary) {
            div.innerHTML += '<div class="item"><b>'+k+'</b><br><small>'+DB.glossary[k]+'</small></div>';
        }
    }
};
document.addEventListener('DOMContentLoaded', function() { App.init(); });
