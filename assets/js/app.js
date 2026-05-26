console.log("Bode Health App Starting...");

const AppState = {
    stack: [],
    plan: [],
    wIdx: 0,
    xp: 0,
    charts: {liver:true, cardio:true, hemato:true, kidney:false, neuro:false, endo:false, repro:false}
};

function initApp() {
    console.log("DOM Ready. Starting App...");
    if(typeof DB === 'undefined') {
        console.error("DATABASE NOT LOADED!");
        return;
    }
    console.log("App Initialized. DB Loaded:", true);

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
    
    renderSupport();
    renderArticles();
    renderShop();
    renderGlossary();
    renderControls();
}

// --- GLOBAL FUNCTIONS FOR HTML ONCLICK ---

window.switchTab = function(tabId) {
    console.log("Switching tab to:", tabId);
    const views = document.querySelectorAll('.view');
    const btns = document.querySelectorAll('.tab-btn');
    
    views.forEach(function(el) { el.classList.remove('active'); });
    btns.forEach(function(el) { el.classList.remove('active'); });
    
    const target = document.getElementById(tabId);
    if(target) target.classList.add('active');
    
    // Activate button
    if(tabId==='dashboard') btns[0].classList.add('active');
    if(tabId==='stack') btns[1].classList.add('active');
    if(tabId==='risks') { 
        btns[2].classList.add('active'); 
        setTimeout(renderChart, 100); 
    }
    if(tabId==='support') btns[3].classList.add('active');
    if(tabId==='labs') btns[4].classList.add('active');
    if(tabId==='articles') btns[5].classList.add('active');
    if(tabId==='shop') btns[6].classList.add('active');
};

window.loadEsters = function() {
    const subId = document.getElementById('sub-select').value;
    const estSel = document.getElementById('est-select');
    if(!estSel) return;
    estSel.innerHTML = '';
    const list = DB.esters[subId];
    if(list && list.length) {
        estSel.disabled = false;
        list.forEach(function(e) {
            let o = document.createElement('option'); 
            o.value = e.id; 
            o.innerText = e.name + ' (' + e.hl + ' дн.)'; 
            estSel.appendChild(o);
        });
    } else { 
        estSel.disabled = true; 
    }
};

window.addDrug = function() {
    const sub = document.getElementById('sub-select').value;
    const est = document.getElementById('est-select').value;
    const doseVal = document.getElementById('in-dose').value;
    const startVal = document.getElementById('in-start').value;
    const endVal = document.getElementById('in-end').value;
    
    const dose = parseFloat(doseVal);
    const start = parseInt(startVal);
    const end = parseInt(endVal);
    
    if(!dose || start >= end) {
        alert('Проверьте дозу и недели!');
        return;
    }
    
    AppState.stack.push({sub: sub, est: est, dose: dose, start: start, end: end});
    renderStack();
    document.getElementById('in-dose').value = '';
};

window.calcPlan = function() {
    if(AppState.stack.length === 0) {
        alert('Добавьте препараты!');
        return;
    }
    AppState.plan = Engine.generatePlan(AppState.stack);
    AppState.wIdx = 0;
    renderHeatmap();
    renderChart();
    
    const msg = document.getElementById('plan-msg');
    if(msg) msg.innerText = 'Расчет на ' + AppState.plan.length + ' недель выполнен!';
    
    AppState.xp += 100;
    const xpEl = document.getElementById('xp-display');
    if(xpEl) xpEl.innerText = 'XP: ' + AppState.xp;
    
    // Update Dashboard
    if(AppState.plan.length > 0) {
        let sumTotal = 0;
        let countTotal = 0;
        const firstWeek = AppState.plan[0].r;
        for(let sys in firstWeek) {
            for(let k in firstWeek[sys]) {
                sumTotal += firstWeek[sys][k];
                countTotal++;
            }
        }
        const avg = countTotal > 0 ? sumTotal / countTotal : 0;
        
        const rRisk = document.getElementById('d-risk');
        const rRead = document.getElementById('d-readiness');
        if(rRisk) rRisk.innerText = Math.round(avg) + '%';
        if(rRead) rRead.innerText = Math.max(10, 100 - Math.round(avg));
    }
};

window.changeWeek = function(dir) {
    if(AppState.plan.length === 0) return;
    AppState.wIdx += dir;
    if(AppState.wIdx < 0) AppState.wIdx = 0;
    if(AppState.wIdx >= AppState.plan.length) AppState.wIdx = AppState.plan.length - 1;
    renderHeatmap();
};

window.toggleChart = function(sys) {
    AppState.charts[sys] = !AppState.charts[sys];
    renderChart();
};

window.calcFert = function() {
    const v = parseFloat(document.getElementById('lab-vol').value) || 0;
    const c = parseFloat(document.getElementById('lab-conc').value) || 0;
    const res = Math.round((v/1.5)*20 + (c/16)*30);
    const el = document.getElementById('fert-res');
    if(el) {
        const color = res > 50 ? 'var(--sec)' : 'var(--err)';
        el.innerHTML = '<span style="color:'+color+'">IF: ' + res + '/100</span>';
    }
};

// --- RENDER FUNCTIONS ---

function renderStack() {
    const div = document.getElementById('stack-list');
    if(!div) return;
    div.innerHTML = '';
    AppState.stack.forEach(function(it, idx) {
        const s = DB.substances.find(function(x){ return x.id === it.sub; });
        const eList = DB.esters[it.sub];
        let eName = '';
        if(eList) {
            const e = eList.find(function(x){ return x.id === it.est; });
            if(e) eName = '(' + e.name + ')';
        }
        
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = '<div><b>' + s.name + '</b> ' + eName + '<br><small>' + it.dose + 'мг | Нед ' + it.start + '-' + it.end + '</small></div><button class="btn-del" onclick="removeDrug('+idx+')">✕</button>';
        div.appendChild(item);
    });
}

window.removeDrug = function(idx) {
    AppState.stack.splice(idx, 1);
    renderStack();
};

function renderHeatmap() {
    if(AppState.plan.length === 0) return;
    const data = AppState.plan[AppState.wIdx];
    const label = document.getElementById('week-label');
    if(label) label.innerText = 'Неделя ' + data.w;
    
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
}

function renderChart() {
    const ctxCanvas = document.getElementById('trend-chart');
    if(!ctxCanvas) return;
    
    if(window.myChartInstance) {
        window.myChartInstance.destroy();
    }
    
    const labels = AppState.plan.map(function(p){ return 'W'+p.w; });
    const datasets = [];
    const colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40', kidney:'#4bc0c0', neuro:'#9966ff', endo:'#c9cbcf', repro:'#e7e9ed'};
    
    for(let sys in AppState.charts) {
        if(AppState.charts[sys]) {
            const d = AppState.plan.map(function(p) {
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
    
    window.myChartInstance = new Chart(ctxCanvas.getContext('2d'), {
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
}

function renderControls() {
    const div = document.getElementById('chart-controls');
    if(!div) return;
    const names = {liver:'Печень', cardio:'Сердце', hemato:'Кровь', kidney:'Почки', neuro:'Невро', endo:'Эндо', repro:'Репро'};
    div.innerHTML = '';
    for(let k in names) {
        const checked = AppState.charts[k] ? 'checked' : '';
        const lbl = document.createElement('label');
        lbl.style.display = 'flex';
        lbl.style.alignItems = 'center';
        lbl.style.gap = '5px';
        lbl.style.margin = '0';
        lbl.style.color = '#fff';
        lbl.style.fontSize = '0.85rem';
        lbl.innerHTML = '<input type="checkbox" '+checked+' onchange="toggleChart(\''+k+'\')"> ' + names[k];
        div.appendChild(lbl);
    }
}

function renderSupport() {
    const div = document.getElementById('support-list');
    if(!div) return;
    DB.support.forEach(function(b) {
        const block = document.createElement('div');
        block.className = 'time-block';
        let html = '<h3>' + b.t + '</h3>';
        b.items.forEach(function(i) {
            html += '<div class="item" style="margin:5px 0; padding:10px"><div><b>' + i.n + '</b> ' + i.d + '<br><small>' + i.m + '</small></div></div>';
        });
        block.innerHTML = html;
        div.appendChild(block);
    });
}

function renderArticles() {
    const div = document.getElementById('articles-list');
    if(!div) return;
    DB.articles.forEach(function(a) {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = '<div><b>' + a.t + '</b><br><small>' + a.c + ' | 👁' + a.v + '</small></div>';
        div.appendChild(item);
    });
}

function renderShop() {
    const div = document.getElementById('shop-list');
    if(!div) return;
    for(let k in DB.shop) {
        DB.shop[k].forEach(function(i) {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = '<div><b>' + k.toUpperCase() + '</b><br>' + i.p + '</div><div style="color:var(--sec)">' + i.pr + '</div>';
            div.appendChild(item);
        });
    }
}

function renderGlossary() {
    const div = document.getElementById('glossary-list');
    if(!div) return;
    for(let k in DB.glossary) {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = '<b>' + k + '</b><br><small>' + DB.glossary[k] + '</small>';
        div.appendChild(item);
    }
}

// Start
document.addEventListener('DOMContentLoaded', initApp);
