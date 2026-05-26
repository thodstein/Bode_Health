console.log("App.v3.js Loaded");
const AppData = { stack:[], plan:[], wIdx:0, xp:0, charts:{liver:true, cardio:true, hemato:true} };

function initApp() {
    console.log("Initializing App...");
    if(typeof DB === 'undefined') { alert("DB not loaded!"); return; }
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
}

function switchTab(id) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.currentTarget.classList.add('active');
    if(id==='risks') setTimeout(renderChart, 100);
}

function loadEsters() {
    const subId = document.getElementById('sub-select').value;
    const estSel = document.getElementById('est-select');
    estSel.innerHTML = '';
    const list = DB.esters[subId];
    if(list && list.length) {
        estSel.disabled = false;
        list.forEach(e => {
            let o = document.createElement('option'); o.value=e.id; o.innerText=e.name+' ('+e.hl+'д)'; estSel.appendChild(o);
        });
    } else { estSel.disabled = true; }
}

function addDrug() {
    const sub = document.getElementById('sub-select').value;
    const est = document.getElementById('est-select').value;
    const dose = parseFloat(document.getElementById('in-dose').value);
    const start = parseInt(document.getElementById('in-start').value);
    const end = parseInt(document.getElementById('in-end').value);
    if(!dose || start>=end) return alert('Ошибка ввода!');
    AppData.stack.push({sub, est, dose, start, end});
    renderStack();
    document.getElementById('in-dose').value = '';
}

function renderStack() {
    const div = document.getElementById('stack-list');
    div.innerHTML = '';
    AppData.stack.forEach((it, idx) => {
        const s = DB.substances.find(x=>x.id===it.sub);
        const e = DB.esters[it.sub]?.find(x=>x.id===it.est);
        div.innerHTML += `<div class="item"><div><b>${s.name}</b> ${e?'('+e.name+')':''}<br><small>${it.dose}мг | ${it.start}-${it.end} нед</small></div><button class="btn-del" onclick="AppData.stack.splice(${idx},1);renderStack()">✕</button></div>`;
    });
}

function calcPlan() {
    if(!AppData.stack.length) return alert('Пусто!');
    AppData.plan = Engine.generatePlan(AppData.stack);
    AppData.wIdx = 0;
    renderHeatmap();
    renderChart();
    document.getElementById('plan-msg').innerText = 'Расчет готов!';
}

function changeWeek(dir) {
    if(!AppData.plan.length) return;
    AppData.wIdx += dir;
    if(AppData.wIdx<0) AppData.wIdx=0;
    if(AppData.wIdx>=AppData.plan.length) AppData.wIdx=AppData.plan.length-1;
    renderHeatmap();
}

function renderHeatmap() {
    if(!AppData.plan.length) return;
    const data = AppData.plan[AppData.wIdx];
    document.getElementById('week-label').innerText = 'Неделя '+data.w;
    const div = document.getElementById('heatmap');
    div.innerHTML = '';
    for(let sys in DB.risks) {
        div.innerHTML += `<div style="grid-column:1/-1;color:var(--pri);font-weight:bold;margin-top:10px">${sys.toUpperCase()}</div>`;
        DB.risks[sys].forEach(m => {
            const val = data.r[sys][m.id]||0;
            let col = Engine.getColor(val);
            let el = document.createElement('div');
            el.className = 'hm-cell'; el.style.background=col; el.style.color=val>50?'#000':'#fff';
            el.innerHTML = `<b>${m.n}</b><br>${val}%`;
            div.appendChild(el);
        });
    }
}

function renderChart() {
    const ctx = document.getElementById('trend-chart');
    if(!ctx || !AppData.plan.length) return;
    if(window.myChart) window.myChart.destroy();
    const labels = AppData.plan.map(p=>'W'+p.w);
    const datasets = [];
    const colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40'};
    for(let sys in AppData.charts) {
        if(AppData.charts[sys]) {
            const d = AppData.plan.map(p => {
                let sum=0, cnt=0; for(let k in p.r[sys]){sum+=p.r[sys][k];cnt++;} return cnt?Math.round(sum/cnt):0;
            });
            datasets.push({label:sys.toUpperCase(), data:d, borderColor:colors[sys], borderWidth:2, fill:false});
        }
    }
    window.myChart = new Chart(ctx.getContext('2d'), {type:'line', data:{labels, datasets}, options:{responsive:true, plugins:{legend:{labels:{color:'#aaa'}}}, scales:{y:{beginAtZero:true, max:100, ticks:{color:'#aaa'}}, x:{ticks:{color:'#aaa'}}}});
}

function renderSupport() {
    const div = document.getElementById('support-list');
    if(!div) return;
    DB.support.forEach(b => {
        div.innerHTML += `<div class="time-block"><h3>${b.t}</h3>` + b.items.map(i=>`<div class="item" style="margin:5px 0;padding:10px"><b>${i.n}</b> ${i.d}<br><small>${i.m}</small></div>`).join('') + `</div>`;
    });
}

function renderArticles() {
    const div = document.getElementById('articles-list');
    if(!div) return;
    DB.articles.forEach(a => div.innerHTML += `<div class="item"><b>${a.t}</b><br><small>${a.c}</small></div>`);
}

function renderShop() {
    const div = document.getElementById('shop-list');
    if(!div) return;
    for(let k in DB.shop) DB.shop[k].forEach(i => div.innerHTML += `<div class="item"><b>${k}</b> ${i.p}</div>`);
}

document.addEventListener('DOMContentLoaded', initApp);
