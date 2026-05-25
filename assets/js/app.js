// Глобальное состояние
const AppState = {
    stack: [],
    plan: [],
    wIdx: 0,
    xp: 0,
    charts: { liver:true, cardio:true, hemato:true, kidney:false, neuro:false, endo:false, repro:false }
};

// Инициализация при загрузке страницы
function initApp() {
    console.log("Initializing App...");
    if (typeof DB === 'undefined') {
        console.error("DATABASE NOT LOADED!");
        alert("Ошибка загрузки базы данных!");
        return;
    }
    
    // Заполняем селект веществ
    const sel = document.getElementById('sub-select');
    if(sel) {
        sel.innerHTML = '';
        DB.substances.forEach(s => {
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
    console.log("App Initialized Successfully");
}

// Переключение вкладок
function switchTab(tabId) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(tabId);
    if(target) target.classList.add('active');
    
    // Подсветка кнопки
    const btns = document.querySelectorAll('.tab-btn');
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
}

// Загрузка эфиров
function loadEsters() {
    const subId = document.getElementById('sub-select').value;
    const estSel = document.getElementById('est-select');
    if(!estSel) return;
    
    estSel.innerHTML = '';
    const list = DB.esters[subId];
    
    if(list && list.length > 0) {
        estSel.disabled = false;
        list.forEach(e => {
            let o = document.createElement('option'); 
            o.value = e.id; 
            o.innerText = e.name + ' (' + e.hl + ' дн.)'; 
            estSel.appendChild(o);
        });
    } else { 
        estSel.disabled = true; 
    }
}

// Добавление препарата
function addDrug() {
    const sub = document.getElementById('sub-select').value;
    const est = document.getElementById('est-select').value;
    const doseVal = document.getElementById('in-dose').value;
    const startVal = document.getElementById('in-start').value;
    const endVal = document.getElementById('in-end').value;
    
    const dose = parseFloat(doseVal);
    const start = parseInt(startVal);
    const end = parseInt(endVal);
    
    if(!dose || start >= end) {
        alert('Проверьте дозу и недели! Финиш должен быть больше старта.');
        return;
    }
    
    AppState.stack.push({sub, est, dose, start, end});
    renderStack();
    document.getElementById('in-dose').value = '';
}

function renderStack() {
    const div = document.getElementById('stack-list');
    if(!div) return;
    div.innerHTML = '';
    AppState.stack.forEach((it, idx) => {
        const s = DB.substances.find(x=>x.id===it.sub);
        const e = DB.esters[it.sub] ? DB.esters[it.sub].find(x=>x.id===it.est) : null;
        const esterName = e ? '('+e.name+')' : '';
        div.innerHTML += `<div class="item">
            <div><b>${s.name}</b> ${esterName}<br><small>${it.dose}мг | Нед ${it.start}-${it.end}</small></div>
            <button class="btn-del" onclick="removeDrug(${idx})">✕</button>
        </div>`;
    });
}

function removeDrug(idx) {
    AppState.stack.splice(idx, 1);
    renderStack();
}

function calcPlan() {
    if(AppState.stack.length === 0) {
        alert('Добавьте препараты в стек!');
        return;
    }
    AppState.plan = Engine.generatePlan(AppState.stack);
    AppState.wIdx = 0;
    renderHeatmap();
    renderChart();
    
    const msg = document.getElementById('plan-msg');
    if(msg) msg.innerText = `Расчет на ${AppState.plan.length} недель выполнен!`;
    
    AppState.xp += 100;
    const xpEl = document.getElementById('xp-display');
    if(xpEl) xpEl.innerText = 'XP: ' + AppState.xp;
    
    // Обновляем дэшборд
    const firstWeek = AppState.plan[0];
    let totalRisk = 0;
    let count = 0;
    for(let sys in firstWeek.r) {
        for(let k in firstWeek.r[sys]) {
            totalRisk += firstWeek.r[sys][k];
            count++;
        }
    }
    const avg = count > 0 ? Math.round(totalRisk / count) : 0;
    
    const dRisk = document.getElementById('d-risk');
    const dReadiness = document.getElementById('d-readiness');
    if(dRisk) dRisk.innerText = avg + '%';
    if(dReadiness) dReadiness.innerText = Math.max(10, 100 - avg);
}

function changeWeek(dir) {
    if(AppState.plan.length === 0) return;
    AppState.wIdx += dir;
    if(AppState.wIdx < 0) AppState.wIdx = 0;
    if(AppState.wIdx >= AppState.plan.length) AppState.wIdx = AppState.plan.length - 1;
    renderHeatmap();
}

function renderHeatmap() {
    if(AppState.plan.length === 0) return;
    const data = AppState.plan[AppState.wIdx];
    const label = document.getElementById('week-label');
    if(label) label.innerText = 'Неделя ' + data.w;
    
    const div = document.getElementById('heatmap');
    if(!div) return;
    div.innerHTML = '';
    
    for(let sys in DB.risks) {
        div.innerHTML += `<div style="grid-column:1/-1; color:var(--pri); font-weight:bold; margin-top:10px">${sys.toUpperCase()}</div>`;
        DB.risks[sys].forEach(m => {
            const val = data.r[sys][m.id] || 0;
            const col = Engine.getColor(val);
            const txt = val > 50 ? '#000' : '#fff';
            const el = document.createElement('div');
            el.className = 'hm-cell';
            el.style.background = col;
            el.style.color = txt;
            el.innerHTML = `<b>${m.n}</b><br>${val}%`;
            div.appendChild(el);
        });
    }
}

function renderChart() {
    const canvas = document.getElementById('trend-chart');
    if(!canvas) return;
    
    if(window.myChartInstance) {
        window.myChartInstance.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const labels = AppState.plan.map(p => 'W' + p.w);
    const datasets = [];
    const colors = {
        liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40', 
        kidney:'#4bc0c0', neuro:'#9966ff', endo:'#c9cbcf', repro:'#e7e9ed'
    };
    
    for(let sys in AppState.charts) {
        if(AppState.charts[sys]) {
            const d = AppState.plan.map(p => {
                let sum=0, cnt=0;
                for(let k in p.r[sys]){
                    sum += p.r[sys][k];
                    cnt++;
                }
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
    
    window.myChartInstance = new Chart(ctx, {
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

function toggleChart(sys) {
    AppState.charts[sys] = !AppState.charts[sys];
    renderChart();
}

function renderControls() {
    const div = document.getElementById('chart-controls');
    if(!div) return;
    const names = {
        liver:'Печень', cardio:'Сердце', hemato:'Кровь', 
        kidney:'Почки', neuro:'Невро', endo:'Эндо', repro:'Репро'
    };
    div.innerHTML = '';
    for(let k in names) {
        const checked = AppState.charts[k] ? 'checked' : '';
        div.innerHTML += `<label><input type="checkbox" ${checked} onchange="toggleChart('${k}')"> ${names[k]}</label>`;
    }
}

function renderSupport() {
    const div = document.getElementById('support-list');
    if(!div) return;
    div.innerHTML = '';
    DB.support.forEach(b => {
        let itemsHtml = b.items.map(i => 
            `<div class="item" style="margin:5px 0; padding:10px">
                <div><b>${i.n}</b> ${i.d}<br><small>${i.m}</small></div>
            </div>`
        ).join('');
        div.innerHTML += `<div class="time-block"><h3>${b.t}</h3>${itemsHtml}</div>`;
    });
}

function calcFert() {
    const v = parseFloat(document.getElementById('lab-vol').value) || 0;
    const c = parseFloat(document.getElementById('lab-conc').value) || 0;
    const res = Math.round((v/1.5)*20 + (c/16)*30);
    const el = document.getElementById('fert-res');
    if(el) {
        const color = res > 50 ? 'var(--sec)' : 'var(--err)';
        el.innerHTML = `<span style="color:${color}">IF: ${res}/100</span>`;
    }
}

function renderArticles() {
    const div = document.getElementById('articles-list');
    if(!div) return;
    div.innerHTML = '';
    DB.articles.forEach(a => {
        div.innerHTML += `<div class="item"><div><b>${a.t}</b><br><small>${a.c} | 👁${a.v}</small></div></div>`;
    });
}

function renderShop() {
    const div = document.getElementById('shop-list');
    if(!div) return;
    div.innerHTML = '';
    for(let k in DB.shop) {
        DB.shop[k].forEach(i => {
            div.innerHTML += `<div class="item">
                <div><b>${k.toUpperCase()}</b><br>${i.p}</div>
                <div style="color:var(--sec)">${i.pr}</div>
            </div>`;
        });
    }
}

function renderGlossary() {
    const div = document.getElementById('glossary-list');
    if(!div) return;
    div.innerHTML = '';
    for(let k in DB.glossary) {
        div.innerHTML += `<div class="item"><b>${k}</b><br><small>${DB.glossary[k]}</small></div>`;
    }
}

// Запуск при загрузке DOM
document.addEventListener('DOMContentLoaded', initApp);
