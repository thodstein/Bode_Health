// Global App State
const AppState = {
    stack: [],
    plan: [],
    wIdx: 0,
    xp: 0,
    charts: { liver: true, cardio: true, hemato: true, kidney: false, neuro: false, endo: false, repro: false }
};

// Init Function
function initApp() {
    // Populate Substance Select
    const subSel = document.getElementById('sub-select');
    if (subSel) {
        subSel.innerHTML = '';
        DB.substances.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            subSel.appendChild(opt);
        });
    }
    
    renderSupport();
    renderArticles();
    renderShop();
    renderGlossary();
    renderChartControls();
}

// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    // Find button that triggered this (if clicked) or match by text/data
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(b => {
        if(b.getAttribute('onclick').includes(tabId)) b.classList.add('active');
    });

    if (tabId === 'risks' && AppState.plan.length > 0) {
        setTimeout(() => { renderChart(); renderHeatmap(); }, 100);
    }
}

// Load Esters
function loadEsters() {
    const subId = document.getElementById('sub-select').value;
    const estSel = document.getElementById('est-select');
    estSel.innerHTML = '';
    
    const list = DB.esters[subId];
    if (list && list.length > 0) {
        estSel.disabled = false;
        list.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.id;
            opt.textContent = `${e.name} (${e.hl} дн.)`;
            estSel.appendChild(opt);
        });
    } else {
        estSel.disabled = true;
    }
}

// Add Drug
function addDrug() {
    const sub = document.getElementById('sub-select').value;
    const est = document.getElementById('est-select').value;
    const dose = parseFloat(document.getElementById('in-dose').value);
    const start = parseInt(document.getElementById('in-start').value);
    const end = parseInt(document.getElementById('in-end').value);
    
    if (!dose || start >= end) {
        alert('Проверьте дозу и недели (Финиш > Старт)!');
        return;
    }
    
    AppState.stack.push({ sub, est, dose, start, end });
    renderStack();
    
    // Reset inputs
    document.getElementById('in-dose').value = '';
    document.getElementById('in-start').value = '1';
    document.getElementById('in-end').value = '8';
}

// Render Stack List
function renderStack() {
    const div = document.getElementById('stack-list');
    div.innerHTML = '';
    AppState.stack.forEach((it, idx) => {
        const s = DB.substances.find(x => x.id === it.sub);
        const e = DB.esters[it.sub]?.find(x => x.id === it.est);
        const name = s ? s.name : 'Unknown';
        const esterName = e ? `(${e.name})` : '';
        
        div.innerHTML += `
            <div class="item">
                <div>
                    <strong>${name}</strong> ${esterName}<br>
                    <small>${it.dose} мг | Недели ${it.start}–${it.end}</small>
                </div>
                <button class="btn-del" onclick="removeDrug(${idx})">✕</button>
            </div>
        `;
    });
}

function removeDrug(idx) {
    AppState.stack.splice(idx, 1);
    renderStack();
}

// Calculate Plan
function calcPlan() {
    if (AppState.stack.length === 0) {
        alert('Сначала добавьте препараты в стек!');
        return;
    }
    
    AppState.plan = Engine.generatePlan(AppState.stack);
    AppState.wIdx = 0;
    
    renderHeatmap();
    renderChart();
    
    const msg = document.getElementById('plan-msg');
    msg.textContent = `Расчет выполнен на ${AppState.plan.length} недель!`;
    msg.style.color = 'var(--sec)';
    
    AppState.xp += 100;
    document.getElementById('xp-display').textContent = `XP: ${AppState.xp}`;
    
    // Update Dashboard
    const firstWeek = AppState.plan[0].r;
    let sum = 0, cnt = 0;
    for(let sys in firstWeek) {
        for(let k in firstWeek[sys]) { sum += firstWeek[sys][k]; cnt++; }
    }
    const avg = cnt ? Math.round(sum / cnt) : 0;
    document.getElementById('d-risk').textContent = `${avg}%`;
    document.getElementById('d-readiness').textContent = Math.max(10, 100 - avg);
}

// Change Week
function changeWeek(dir) {
    if (AppState.plan.length === 0) return;
    AppState.wIdx += dir;
    if (AppState.wIdx < 0) AppState.wIdx = 0;
    if (AppState.wIdx >= AppState.plan.length) AppState.wIdx = AppState.plan.length - 1;
    renderHeatmap();
}

// Render Heatmap
function renderHeatmap() {
    const div = document.getElementById('heatmap');
    if (!div || AppState.plan.length === 0) return;
    
    const data = AppState.plan[AppState.wIdx];
    document.getElementById('week-label').textContent = `Неделя ${data.w}`;
    div.innerHTML = '';
    
    for (let sys in DB.risks) {
        div.innerHTML += `<div style="grid-column: 1 / -1; color: var(--pri); font-weight: bold; margin-top: 10px;">${sys.toUpperCase()}</div>`;
        DB.risks[sys].forEach(m => {
            const val = data.r[sys][m.id] || 0;
            const col = Engine.getColor(val);
            const txt = val > 50 ? '#000' : '#fff';
            
            const cell = document.createElement('div');
            cell.className = 'hm-cell';
            cell.style.backgroundColor = col;
            cell.style.color = txt;
            cell.innerHTML = `<b>${m.n}</b><br>${val}%`;
            div.appendChild(cell);
        });
    }
}

// Chart Controls
function renderChartControls() {
    const div = document.getElementById('chart-controls');
    if(!div) return;
    const names = { liver:'Печень', cardio:'Сердце', hemato:'Кровь', kidney:'Почки', neuro:'Невро', endo:'Эндо', repro:'Репро' };
    let html = '';
    for (let k in names) {
        const checked = AppState.charts[k] ? 'checked' : '';
        html += `<label><input type="checkbox" ${checked} onchange="toggleChart('${k}')"> ${names[k]}</label>`;
    }
    div.innerHTML = html;
}

function toggleChart(sys) {
    AppState.charts[sys] = !AppState.charts[sys];
    renderChart();
}

// Render Chart
function renderChart() {
    const ctx = document.getElementById('trend-chart');
    if (!ctx || AppState.plan.length === 0) return;
    
    if (window.myChart) window.myChart.destroy();
    
    const labels = AppState.plan.map(p => `W${p.w}`);
    const datasets = [];
    const colors = { liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40', kidney:'#4bc0c0', neuro:'#9966ff', endo:'#c9cbcf', repro:'#e7e9ed' };
    
    for (let sys in AppState.charts) {
        if (AppState.charts[sys]) {
            const d = AppState.plan.map(p => {
                let sum = 0, cnt = 0;
                for (let k in p.r[sys]) { sum += p.r[sys][k]; cnt++; }
                return cnt ? Math.round(sum / cnt) : 0;
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
    
    window.myChart = new Chart(ctx, {
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
}

// Render Support
function renderSupport() {
    const div = document.getElementById('support-list');
    if(!div) return;
    div.innerHTML = '';
    DB.support.forEach(b => {
        let itemsHtml = b.items.map(i => `
            <div class="item" style="margin:5px 0; padding:10px;">
                <div><strong>${i.n}</strong> ${i.d}<br><small>${i.m}</small></div>
            </div>
        `).join('');
        div.innerHTML += `<div class="time-block"><h3>${b.t}</h3>${itemsHtml}</div>`;
    });
}

// Fertility Calc
function calcFert() {
    const v = parseFloat(document.getElementById('lab-vol').value) || 0;
    const c = parseFloat(document.getElementById('lab-conc').value) || 0;
    const res = Math.round((v / 1.5) * 20 + (c / 16) * 30);
    const color = res > 50 ? 'var(--sec)' : 'var(--err)';
    document.getElementById('fert-res').innerHTML = `<span style="color:${color}">IF: ${res}/100</span>`;
}

// Render Articles
function renderArticles() {
    const div = document.getElementById('articles-list');
    if(!div) return;
    div.innerHTML = '';
    DB.articles.forEach(a => {
        div.innerHTML += `<div class="item"><div><strong>${a.t}</strong><br><small>${a.c} | 👁 ${a.v}</small></div></div>`;
    });
}

// Render Shop
function renderShop() {
    const div = document.getElementById('shop-list');
    if(!div) return;
    div.innerHTML = '';
    for (let k in DB.shop) {
        DB.shop[k].forEach(i => {
            div.innerHTML += `<div class="item"><div><strong>${k.toUpperCase()}</strong><br>${i.p}</div><div style="color:var(--sec)">${i.pr}</div></div>`;
        });
    }
}

// Render Glossary
function renderGlossary() {
    const div = document.getElementById('glossary-list');
    if(!div) return;
    div.innerHTML = '';
    for (let k in DB.glossary) {
        div.innerHTML += `<div class="item"><strong>${k}</strong><br><small>${DB.glossary[k]}</small></div>`;
    }
}

// Start App when DOM ready
document.addEventListener('DOMContentLoaded', initApp);
