console.log("App.v99 Loaded");

// Глобальное состояние
window.AppState = { 
    stack:[], plan:[], wIdx:0, xp:0, 
    charts:{liver:true, cardio:true, hemato:true, kidney:false, neuro:false, endo:false, repro:false} 
};

// Инициализация при загрузке
window.initApp = function() {
    console.log("Initializing App...");
    if(typeof DB === 'undefined') { alert('DB Error'); return; }
    
    // Заполняем вещества
    const sel = document.getElementById('sub-select');
    if(sel) {
        sel.innerHTML = '';
        DB.substances.forEach(s => {
            let o = document.createElement('option'); o.value=s.id; o.innerText=s.name; sel.appendChild(o);
        });
    }
    renderSupport();
    renderArticles();
    renderShop();
    renderGlossary();
    renderControls();
    console.log("App Ready");
};

// Переключение вкладок (ГЛОБАЛЬНАЯ)
window.switchTab = function(tabId) {
    console.log("Switching to:", tabId);
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(tabId);
    if(target) target.classList.add('active');
    
    // Подсветка кнопки
    const btns = document.querySelectorAll('.tab-btn');
    if(tabId==='dashboard') btns[0]?.classList.add('active');
    if(tabId==='stack') btns[1]?.classList.add('active');
    if(tabId==='risks') { 
        btns[2]?.classList.add('active'); 
        setTimeout(renderChart, 100); 
    }
    if(tabId==='support') btns[3]?.classList.add('active');
    if(tabId==='labs') btns[4]?.classList.add('active');
    if(tabId==='articles') btns[5]?.classList.add('active');
    if(tabId==='shop') btns[6]?.classList.add('active');
};

// Загрузка эфиров (ГЛОБАЛЬНАЯ)
window.loadEsters = function() {
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
};

// Добавление препарата (ГЛОБАЛЬНАЯ)
window.addDrug = function() {
    const sub = document.getElementById('sub-select').value;
    const est = document.getElementById('est-select').value;
    const dose = parseFloat(document.getElementById('in-dose').value);
    const start = parseInt(document.getElementById('in-start').value);
    const end = parseInt(document.getElementById('in-end').value);
    
    if(!dose || start>=end) return alert('Ошибка ввода!');
    
    AppState.stack.push({sub, est, dose, start, end});
    renderStack();
    document.getElementById('in-dose').value = '';
};

window.renderStack = function() {
    const div = document.getElementById('stack-list');
    if(!div) return;
    div.innerHTML = '';
    AppState.stack.forEach((it, idx) => {
        const s = DB.substances.find(x=>x.id===it.sub);
        const e = DB.esters[it.sub]?.find(x=>x.id===it.est);
        div.innerHTML += `<div class="item"><div><b>${s.name}</b> ${e?'('+e.name+')':''}<br><small>${it.dose}мг | Нед ${it.start}-${it.end}</small></div><button class="btn-del" onclick="AppState.stack.splice(${idx},1);renderStack()">✕</button></div>`;
    });
};

// Расчет (ГЛОБАЛЬНАЯ)
window.calcPlan = function() {
    if(!AppState.stack.length) return alert('Пустой стек!');
    AppState.plan = Engine.generatePlan(AppState.stack);
    AppState.wIdx = 0;
    renderHeatmap();
    renderChart();
    document.getElementById('plan-msg').innerText = `Расчет на ${AppState.plan.length} недель!`;
    AppState.xp += 100;
    document.getElementById('xp-display').innerText = 'XP: '+AppState.xp;
    
    const avg = Object.values(AppState.plan[0].r).reduce((a,b)=>a+Object.values(b).reduce((x,y)=>x+y,0),0) / 49;
    document.getElementById('d-risk').innerText = Math.round(avg)+'%';
    document.getElementById('d-readiness').innerText = Math.max(10, 100-Math.round(avg));
};

window.changeWeek = function(dir) {
    if(!AppState.plan.length) return;
    AppState.wIdx += dir;
    if(AppState.wIdx<0) AppState.wIdx=0;
    if(AppState.wIdx>=AppState.plan.length) AppState.wIdx=AppState.plan.length-1;
    renderHeatmap();
};

window.renderHeatmap = function() {
    if(!AppState.plan.length) return;
    const data = AppState.plan[AppState.wIdx];
    document.getElementById('week-label').innerText = 'Неделя '+data.w;
    const div = document.getElementById('heatmap');
    if(!div) return;
    div.innerHTML = '';
    
    for(let sys in DB.risks) {
        div.innerHTML += `<div style="grid-column:1/-1; color:var(--pri); font-weight:bold; margin-top:10px">${sys.toUpperCase()}</div>`;
        DB.risks[sys].forEach(m => {
            const val = data.r[sys][m.id]||0;
            let col = Engine.getColor(val);
            let txt = val>50?'#000':'#fff';
            let el = document.createElement('div');
            el.className = 'hm-cell';
            el.style.background = col; el.style.color = txt;
            el.innerHTML = `<b>${m.n}</b><br>${val}%`;
            div.appendChild(el);
        });
    }
};

window.renderChart = function() {
    const ctx = document.getElementById('trend-chart');
    if(!ctx) return;
    if(window.myChart) window.myChart.destroy();
    
    const labels = AppState.plan.map(p=>'W'+p.w);
    const datasets = [];
    const colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40', kidney:'#4bc0c0', neuro:'#9966ff', endo:'#c9cbcf', repro:'#e7e9ed'};
    
    for(let sys in AppState.charts) {
        if(AppState.charts[sys]) {
            const d = AppState.plan.map(p => {
                let sum=0, cnt=0;
                for(let k in p.r[sys]){sum+=p.r[sys][k];cnt++;}
                return cnt?Math.round(sum/cnt):0;
            });
            datasets.push({label:sys.toUpperCase(), data:d, borderColor:colors[sys], borderWidth:2, fill:false, tension:0.4});
        }
    }
    
    window.myChart = new Chart(ctx.getContext('2d'), {
        type:'line',
        data: {labels, datasets},
        options:{responsive:true, plugins:{legend:{labels:{color:'#aaa'}}}, scales:{y:{beginAtZero:true, max:100, ticks:{color:'#aaa'},grid:{color:'#333'}}, x:{ticks:{color:'#aaa'},grid:{color:'#333'}}}}
    );
};

window.toggleChart = function(sys) {
    AppState.charts[sys] = !AppState.charts[sys];
    renderChart();
};

window.renderControls = function() {
    const div = document.getElementById('chart-controls');
    if(!div) return;
    const names = {liver:'Печень', cardio:'Сердце', hemato:'Кровь', kidney:'Почки', neuro:'Невро', endo:'Эндо', repro:'Репро'};
    div.innerHTML = '';
    for(let k in names) {
        div.innerHTML += `<label><input type="checkbox" ${AppState.charts[k]?'checked':''} onchange="toggleChart('${k}')"> ${names[k]}</label>`;
    }
};

window.renderSupport = function() {
    const div = document.getElementById('support-list');
    if(!div) return;
    DB.support.forEach(b => {
        div.innerHTML += `<div class="time-block"><h3>${b.t}</h3>` + b.items.map(i=>`<div class="item" style="margin:5px 0; padding:10px"><div><b>${i.n}</b> ${i.d}<br><small>${i.m}</small></div></div>`).join('') + `</div>`;
    });
};

window.calcFert = function() {
    const v = parseFloat(document.getElementById('lab-vol').value)||0;
    const c = parseFloat(document.getElementById('lab-conc').value)||0;
    const res = Math.round((v/1.5)*20 + (c/16)*30);
    const el = document.getElementById('fert-res');
    if(el) el.innerHTML = `<span style="color:${res>50?'var(--sec)':'var(--err)'}">IF: ${res}/100</span>`;
};

window.renderArticles = function() {
    const div = document.getElementById('articles-list');
    if(!div) return;
    DB.articles.forEach(a => div.innerHTML += `<div class="item"><div><b>${a.t}</b><br><small>${a.c} | 👁${a.v}</small></div></div>`);
};

window.renderShop = function() {
    const div = document.getElementById('shop-list');
    if(!div) return;
    for(let k in DB.shop) {
        DB.shop[k].forEach(i => div.innerHTML += `<div class="item"><div><b>${k.toUpperCase()}</b><br>${i.p}</div><div style="color:var(--sec)">${i.pr}</div></div>`);
    }
};

window.renderGlossary = function() {
    const div = document.getElementById('glossary-list');
    if(!div) return;
    for(let k in DB.glossary) div.innerHTML += `<div class="item"><b>${k}</b><br><small>${DB.glossary[k]}</small></div>`;
};

// Запуск после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);
