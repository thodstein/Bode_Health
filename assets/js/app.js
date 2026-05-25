console.log("Bode Health App Starting...");

const App = {
    state: { 
        stack: [], 
        plan: [], 
        wIdx: 0, 
        xp: 0, 
        charts: {liver:true, cardio:true, hemato:true, kidney:false, neuro:false, endo:false, repro:false} 
    },
    
    init: function() {
        console.log("App Initialized. DB Loaded:", typeof DB !== 'undefined');
        if(typeof DB === 'undefined') {
            alert("ERROR: Database not loaded! Check database.js");
            return;
        }

        // Fill Substance Select
        const sel = document.getElementById('sub-select');
        if(sel) {
            sel.innerHTML = '';
            DB.substances.forEach(function(s) {
                let o = document.createElement('option'); 
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
    },

    switchTab: function(tabId) {
        document.querySelectorAll('.view').forEach(function(el){ el.classList.remove('active'); });
        document.querySelectorAll('.tab-btn').forEach(function(el){ el.classList.remove('active'); });
        
        const target = document.getElementById(tabId);
        if(target) target.classList.add('active');
        
        // Highlight button logic simplified
        const btns = document.querySelectorAll('.tab-btn');
        if(tabId==='dashboard') btns[0].classList.add('active');
        if(tabId==='stack') btns[1].classList.add('active');
        if(tabId==='risks') { 
            btns[2].classList.add('active'); 
            setTimeout(function(){ App.renderChart(); }, 100); 
        }
        if(tabId==='support') btns[3].classList.add('active');
        if(tabId==='labs') btns[4].classList.add('active');
        if(tabId==='articles') btns[5].classList.add('active');
        if(tabId==='shop') btns[6].classList.add('active');
    },

    loadEsters: function() {
        const subId = document.getElementById('sub-select').value;
        const estSel = document.getElementById('est-select');
        estSel.innerHTML = '';
        const list = DB.esters[subId];
        if(list && list.length) {
            estSel.disabled = false;
            list.forEach(function(e) {
                let o = document.createElement('option'); 
                o.value = e.id; 
                o.innerText = e.name + ' (' + e.hl + ' days)'; 
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
        
        if(!dose || start >= end) {
            alert('Check dose and weeks! Start must be < End.');
            return;
        }
        
        this.state.stack.push({sub: sub, est: est, dose: dose, start: start, end: end});
        this.renderStack();
        document.getElementById('in-dose').value = '';
    },

    renderStack: function() {
        const div = document.getElementById('stack-list');
        if(!div) return;
        div.innerHTML = '';
        this.state.stack.forEach(function(it, idx) {
            let sName = it.sub;
            let eName = '';
            
            // Find names safely
            for(let k=0; k<DB.substances.length; k++) {
                if(DB.substances[k].id === it.sub) sName = DB.substances[k].name;
            }
            const esterList = DB.esters[it.sub];
            if(esterList) {
                for(let k=0; k<esterList.length; k++) {
                    if(esterList[k].id === it.est) eName = esterList[k].name;
                }
            }
            
            const html = '<div class="item">' +
                '<div><b>' + sName + '</b> ' + (eName ? '('+eName+')' : '') + '<br><small>' + it.dose + 'mg | Weeks ' + it.start + '-' + it.end + '</small></div>' +
                '<button class="btn-del" onclick="App.state.stack.splice('+idx+',1); App.renderStack()">X</button></div>';
            div.innerHTML += html;
        });
    },

    calcPlan: function() {
        if(!this.state.stack.length) {
            alert('Add drugs first!');
            return;
        }
        this.state.plan = Engine.generatePlan(this.state.stack);
        this.state.wIdx = 0;
        this.renderHeatmap();
        this.renderChart();
        
        const msg = document.getElementById('plan-msg');
        if(msg) msg.innerText = 'Calculated for ' + this.state.plan.length + ' weeks!';
        
        this.state.xp += 100;
        const xpEl = document.getElementById('xp-display');
        if(xpEl) xpEl.innerText = 'XP: ' + this.state.xp;
        
        // Update Dashboard
        if(this.state.plan.length > 0) {
            const firstWeek = this.state.plan[0].r;
            let sum = 0, cnt = 0;
            for(let sys in firstWeek) {
                for(let k in firstWeek[sys]) { sum += firstWeek[sys][k]; cnt++; }
            }
            const avg = cnt > 0 ? Math.round(sum/cnt) : 0;
            
            const rEl = document.getElementById('d-risk');
            const readEl = document.getElementById('d-readiness');
            if(rEl) rEl.innerText = avg + '%';
            if(readEl) readEl.innerText = Math.max(10, 100-avg);
        }
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
        const lbl = document.getElementById('week-label');
        if(lbl) lbl.innerText = 'Week ' + data.w;
        
        const div = document.getElementById('heatmap');
        if(!div) return;
        div.innerHTML = '';
        
        for(let sys in DB.risks) {
            div.innerHTML += '<div style="grid-column:1/-1; color:var(--pri); font-weight:bold; margin-top:10px">' + sys.toUpperCase() + '</div>';
            DB.risks[sys].forEach(function(m) {
                const val = data.r[sys][m.id] || 0;
                const col = Engine.getColor(val);
                const txt = val > 50 ? '#000' : '#fff';
                const el = document.createElement('div');
                el.className = 'hm-cell';
                el.style.background = col;
                el.style.color = txt;
                el.innerHTML = '<b>' + m.n + '</b><br>' + val + '%';
                div.appendChild(el);
            });
        }
    },

    renderChart: function() {
        const ctxCanvas = document.getElementById('trend-chart');
        if(!ctxCanvas) return;
        
        if(window.myChart) window.myChart.destroy();
        
        const labels = this.state.plan.map(function(p){ return 'W'+p.w; });
        const datasets = [];
        const colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40', kidney:'#4bc0c0', neuro:'#9966ff', endo:'#c9cbcf', repro:'#e7e9ed'};
        
        for(let sys in this.state.charts) {
            if(this.state.charts[sys]) {
                const d = this.state.plan.map(function(p) {
                    let sum=0, cnt=0;
                    for(let k in p.r[sys]){ sum+=p.r[sys][k]; cnt++; }
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
        
        window.myChart = new Chart(ctxCanvas.getContext('2d'), {
            type: 'line',
            data: { labels: labels, datasets: datasets },
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
        const names = {liver:'Liver', cardio:'Heart', hemato:'Blood', kidney:'Kidney', neuro:'Neuro', endo:'Endo', repro:'Repro'};
        div.innerHTML = '';
        for(let k in names) {
            const checked = this.state.charts[k] ? 'checked' : '';
            div.innerHTML += '<label><input type="checkbox" ' + checked + ' onchange="App.toggleChart(\''+k+'\')"> ' + names[k] + '</label>';
        }
    },

    renderSupport: function() {
        const div = document.getElementById('support-list');
        if(!div) return;
        DB.support.forEach(function(b) {
            let itemsHtml = '';
            b.items.forEach(function(i) {
                itemsHtml += '<div class="item" style="margin:5px 0; padding:10px"><div><b>' + i.n + '</b> ' + i.d + '<br><small>' + i.m + '</small></div></div>';
            });
            div.innerHTML += '<div class="time-block"><h3>' + b.t + '</h3>' + itemsHtml + '</div>';
        });
    },

    calcFert: function() {
        const v = parseFloat(document.getElementById('lab-vol').value) || 0;
        const c = parseFloat(document.getElementById('lab-conc').value) || 0;
        const res = Math.round((v/1.5)*20 + (c/16)*30);
        const el = document.getElementById('fert-res');
        if(el) {
            const col = res > 50 ? 'var(--sec)' : 'var(--err)';
            el.innerHTML = '<span style="color:'+col+'">IF: ' + res + '/100</span>';
        }
    },

    renderArticles: function() {
        const div = document.getElementById('articles-list');
        if(!div) return;
        DB.articles.forEach(function(a) {
            div.innerHTML += '<div class="item"><div><b>' + a.t + '</b><br><small>' + a.c + ' | Views:' + a.v + '</small></div></div>';
        });
    },

    renderShop: function() {
        const div = document.getElementById('shop-list');
        if(!div) return;
        for(let k in DB.shop) {
            DB.shop[k].forEach(function(i) {
                div.innerHTML += '<div class="item"><div><b>' + k.toUpperCase() + '</b><br>' + i.p + '</div><div style="color:var(--sec)">' + i.pr + '</div></div>';
            });
        }
    },

    renderGlossary: function() {
        const div = document.getElementById('glossary-list');
        if(!div) return;
        for(let k in DB.glossary) {
            div.innerHTML += '<div class="item"><b>' + k + '</b><br><small>' + DB.glossary[k] + '</small></div>';
        }
    }
};

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Ready. Starting App...");
    // Small delay to ensure DB script is parsed
    setTimeout(function() {
        App.init();
    }, 100);
});
