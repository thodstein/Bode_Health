// CORE V3 - FULL DATA & LOGIC BUNDLE
console.log("CORE V3 LOADED");

const DB = {
    subs: [
        {id:'test', name:'Тестостерон', tox:{liver:1, lipid:3, hct:4, neuro:0, kid:1, endo:2, repro:5}},
        {id:'nandrolone', name:'Нандролон', tox:{liver:1, lipid:4, hct:2, neuro:0, kid:2, endo:4, repro:4}},
        {id:'trenbolone', name:'Тренболон', tox:{liver:2, lipid:5, hct:3, neuro:5, kid:4, endo:4, repro:5}},
        {id:'boldenone', name:'Болденон', tox:{liver:1, lipid:3, hct:6, neuro:0, kid:1, endo:1, repro:3}},
        {id:'dhb', name:'DHB', tox:{liver:1, lipid:4, hct:5, neuro:0, kid:3, endo:1, repro:3}},
        {id:'masteron', name:'Мастерон', tox:{liver:1, lipid:4, hct:3, neuro:0, kid:1, endo:1, repro:4}},
        {id:'primobolan', name:'Примоболан', tox:{liver:1, lipid:3, hct:2, neuro:0, kid:1, endo:1, repro:2}},
        {id:'oxandrolone', name:'Оксандролон', tox:{liver:4, lipid:5, hct:1, neuro:0, kid:1, endo:1, repro:2}},
        {id:'stanozolol', name:'Станозолол', tox:{liver:5, lipid:5, hct:2, neuro:0, kid:2, endo:1, repro:3}},
        {id:'methandienone', name:'Метандиенон', tox:{liver:5, lipid:4, hct:3, neuro:0, kid:1, endo:3, repro:3}},
        {id:'gh', name:'Гормон Роста', tox:{liver:0, lipid:2, hct:0, neuro:0, kid:1, endo:5, repro:0}},
        {id:'insulin', name:'Инсулин', tox:{liver:0, lipid:1, hct:0, neuro:0, kid:0, endo:5, repro:0}},
        {id:'igf1', name:'IGF-1', tox:{liver:0, lipid:0, hct:0, neuro:0, kid:2, endo:4, repro:0}},
        {id:'mgf', name:'MGF', tox:{liver:0, lipid:0, hct:0, neuro:0, kid:1, endo:2, repro:0}}
    ],
    esters: {
        'test': [{id:'p',name:'Пропионат',hl:2},{id:'e',name:'Энантат',hl:7},{id:'c',name:'Ципионат',hl:8},{id:'sus',name:'Сустанон',hl:15}],
        'nandrolone': [{id:'p',name:'Фенилпропионат',hl:4.5},{id:'d',name:'Деканоат',hl:14}],
        'trenbolone': [{id:'a',name:'Ацетат',hl:3},{id:'e',name:'Энантат',hl:7},{id:'h',name:'Гекса',hl:10}],
        'boldenone': [{id:'u',name:'Ундесиленат',hl:14}],
        'dhb': [{id:'p',name:'Ацетат',hl:10}],
        'masteron': [{id:'p',name:'Пропионат',hl:2.5},{id:'e',name:'Энантат',hl:7}],
        'primobolan': [{id:'e',name:'Энантат',hl:10}],
        'stanozolol': [{id:'s',name:'Суспензия',hl:24}],
        'gh': [{id:'short',name:'Ежедневно',hl:0.1},{id:'long',name:'Пролонг',hl:168}],
        'insulin': [{id:'r',name:'Короткий',hl:0.1},{id:'l',name:'Продленный',hl:24}],
        'igf1': [{id:'lr3',name:'LR3',hl:24},{id:'des',name:'DES',hl:0.5}],
        'mgf': [{id:'plain',name:'MGF',hl:0.5},{id:'peg',name:'PEG-MGF',hl:48}]
    },
    risks: {
        liver: [{id:'chol',n:'Холестаз'},{id:'ox',n:'Окс.стресс'},{id:'cyt',n:'Цитолиз'},{id:'fib',n:'Фиброз'},{id:'mito',n:'Митохондрии'},{id:'met',n:'Метилирование'},{id:'apo',n:'Апоптоз'}],
        cardio: [{id:'htn',n:'Гипертония'},{id:'tach',n:'Тахикардия'},{id:'lip',n:'Липиды'},{id:'thr',n:'Тромбоз'},{id:'lvh',n:'Гипертрофия'},{id:'endo',n:'Эндотелий'},{id:'arr',n:'Аритмия'}],
        kidney: [{id:'hyper',n:'Гиперф.'},{id:'fib_k',n:'Фиброз'},{id:'elec',n:'Электролиты'},{id:'prot',n:'Протеин'},{id:'stone',n:'Камни'},{id:'tub',n:'Некроз'},{id:'gfr',n:'СКФ'}],
        neuro: [{id:'dop',n:'Дофамин'},{id:'glu',n:'Глутамат'},{id:'gaba',n:'ГАМК'},{id:'ser',n:'Серотонин'},{id:'inf',n:'Воспаление'},{id:'cog',n:'Когнитив'},{id:'add',n:'Зависимость'}],
        hemato: [{id:'ery',n:'Эритроциты'},{id:'visc',n:'Вязкость'},{id:'coag',n:'Коагуляция'},{id:'anem',n:'Анемия'},{id:'leuk',n:'Лейкоциты'},{id:'plat',n:'Тромбоциты'},{id:'hem',n:'Гемолиз'}],
        endo: [{id:'ins',n:'Инсулин'},{id:'est',n:'Эстроген'},{id:'prl',n:'Пролактин'},{id:'thy',n:'Щитовидка'},{id:'cor',n:'Кортизол'},{id:'gh_ax',n:'Ось ГР'},{id:'adr',n:'Надпочечники'}],
        repro: [{id:'atr',n:'Атрофия'},{id:'sup',n:'Подавление'},{id:'sp',n:'Сперма'},{id:'lib',n:'Либидо'},{id:'ed',n:'Эрекция'},{id:'gyn',n:'Гино'},{id:'inf',n:'Бесплодие'}]
    },
    support: [
        {t:'☀️ Натощак', items:[{n:'Iron Guard',d:'2 капс',m:'Гемоглобин'},{n:'Цитиколин',d:'500мг',m:'Нейро'},{n:'Наттокиназа',d:'2 капс',m:'Реология'},{n:'Таурин',d:'2г',m:'Анти-спазм'}]},
        {t:'🍳 Завтрак', items:[{n:'Астрагал',d:'500мг',m:'Почки'},{n:'Небилет',d:'2.5мг',m:'Давление'},{n:'Тадалафил',d:'5мг',m:'Поток'},{n:'Берберин',d:'500мг',m:'Инсулин'},{n:'D3+K2',d:'5000МЕ',m:'Кости'},{n:'TMG+Метилфолат',d:'1г',m:'Метил'},{n:'Бергамот',d:'500мг',m:'Липиды'},{n:'Бромантан+Фасорацетам',d:'50+100мг',m:'Дофамин'}]},
        {t:'🍲 Обед', items:[{n:'УДХК',d:'1000мг',m:'Желчь'},{n:'Пентоксифиллин',d:'400мг',m:'Вязкость'},{n:'Joint Health',d:'2 капс',m:'Суставы'},{n:'Витамин Е',d:'400МЕ',m:'Антиокс'}]},
        {t:'💪 Предтреник', items:[{n:'Агмантин',d:'1000мг',m:'NO'}]},
        {t:'🌙 Вечер', items:[{n:'Телмисартан',d:'80мг',m:'Давление'},{n:'Магний',d:'400мг',m:'Расслабление'},{n:'L-Теанин',d:'400мг',m:'Сон'},{n:'Гормон Роста',d:'5ЕД',m:'Рост',note:'Inj'}]}
    ],
    shop: {'udca':[{p:'Ozon',pr:'1500₽'}],'telmisartan':[{p:'Apteka',pr:'600₽'}],'berberine':[{p:'iHerb',pr:'$20'}]},
    articles: [{t:'Основы PK/PD',c:'Theory',v:120},{t:'Защита печени',c:'Safety',v:340},{t:'IGF-1: LR3 vs DES',c:'Peptides',v:85}],
    glossary: {'Raw Risk':'Риск без защиты','Net Risk':'Риск с защитой','Half-life':'Период полувыведения'}
};

const Engine = {
    calc: function(hl, start, end, w) {
        if(w<start) return 0;
        if(w<=end) return Math.min(1, (w-start)/(hl/7+1));
        return Math.max(0, 1-(w-end)*0.2);
    },
    plan: function(stack) {
        let maxW = 12; stack.forEach(i=>{if(i.end>maxW)maxW=i.end;});
        let res = [];
        for(let w=1; w<=maxW+6; w++) {
            let r = {};
            for(let s in DB.risks) { r[s]={}; DB.risks[s].forEach(m=>r[s][m.id]=0); }
            stack.forEach(it=>{
                let hl = (DB.esters[it.sub]?.find(x=>x.id===it.est)?.hl) || 1;
                let c = this.calc(hl, it.start, it.end, w);
                if(c>0.05) {
                    let t = DB.subs.find(x=>x.id===it.sub).tox;
                    let l = c*(it.dose/100);
                    r.liver.chol+=t.liver*3*l; r.cardio.lip+=t.lipid*3*l; r.hemato.ery+=t.hct*4*l;
                    r.neuro.dop+=t.neuro*5*l; r.kidney.hyper+=t.kid*3*l; r.endo.ins+=t.endo*3*l; r.repro.sup+=t.repro*5*l;
                }
            });
            for(let s in r) for(let k in r[s]) r[s][k]=Math.min(100,Math.round(r[s][k]));
            res.push({w,r});
        }
        return res;
    },
    color: function(v){ return v<20?'#4caf50':v<40?'#8bc34a':v<60?'#ffeb3b':v<80?'#ff9800':'#f44336'; }
};

// GLOBAL APP STATE
let State = { stack:[], plan:[], wIdx:0, charts:{liver:true,cardio:true,hemato:true} };

function initApp() {
    console.log("INIT APP");
    let sel = document.getElementById('sub-select');
    if(sel) {
        sel.innerHTML='';
        DB.subs.forEach(s=>{ let o=document.createElement('option'); o.value=s.id; o.innerText=s.name; sel.appendChild(o); });
    }
    renderSupport(); renderArticles(); renderShop(); renderGlossary(); renderControls();
}

function switchTab(id) {
    document.querySelectorAll('.view').forEach(e=>e.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(e=>e.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.currentTarget.classList.add('active');
    if(id==='risks') setTimeout(renderChart, 50);
}

function loadEsters() {
    let sub = document.getElementById('sub-select').value;
    let estSel = document.getElementById('est-select');
    estSel.innerHTML='';
    let list = DB.esters[sub];
    if(list && list.length) {
        estSel.disabled=false;
        list.forEach(e=>{ let o=document.createElement('option'); o.value=e.id; o.innerText=e.name+' ('+e.hl+'д)'; estSel.appendChild(o); });
    } else { estSel.disabled=true; }
}

function addDrug() {
    let sub = document.getElementById('sub-select').value;
    let est = document.getElementById('est-select').value;
    let dose = parseFloat(document.getElementById('in-dose').value);
    let start = parseInt(document.getElementById('in-start').value);
    let end = parseInt(document.getElementById('in-end').value);
    if(!dose || start>=end) return alert('Ошибка ввода!');
    State.stack.push({sub,est,dose,start,end});
    renderStack();
    document.getElementById('in-dose').value='';
}

function renderStack() {
    let d = document.getElementById('stack-list'); d.innerHTML='';
    State.stack.forEach((it,i)=>{
        let s=DB.subs.find(x=>x.id===it.sub);
        let e=DB.esters[it.sub]?.find(x=>x.id===it.est);
        d.innerHTML += `<div class="item"><div><b>${s.name}</b> ${e?'('+e.name+')':''}<br><small>${it.dose}мг | ${it.start}-${it.end} нед</small></div><button class="btn-del" onclick="State.stack.splice(${i},1);renderStack()">✕</button></div>`;
    });
}

function calcPlan() {
    if(!State.stack.length) return alert('Пусто!');
    State.plan = Engine.plan(State.stack);
    State.wIdx=0;
    renderHeatmap(); renderChart();
    document.getElementById('plan-msg').innerText = 'Расчет готов! Недель: '+State.plan.length;
    let avg = Object.values(State.plan[0].r).reduce((a,b)=>a+Object.values(b).reduce((x,y)=>x+y,0),0)/49;
    document.getElementById('d-risk').innerText = Math.round(avg)+'%';
    document.getElementById('d-readiness').innerText = Math.max(10,100-Math.round(avg));
}

function changeWeek(dir) {
    if(!State.plan.length) return;
    State.wIdx+=dir;
    if(State.wIdx<0) State.wIdx=0;
    if(State.wIdx>=State.plan.length) State.wIdx=State.plan.length-1;
    renderHeatmap();
}

function renderHeatmap() {
    if(!State.plan.length) return;
    let d = State.plan[State.wIdx];
    document.getElementById('week-label').innerText = 'Неделя '+d.w;
    let cont = document.getElementById('heatmap'); cont.innerHTML='';
    for(let s in DB.risks) {
        cont.innerHTML += `<div style="grid-column:1/-1;color:var(--pri);font-weight:bold;margin-top:10px">${s.toUpperCase()}</div>`;
        DB.risks[s].forEach(m=>{
            let v = d.r[s][m.id]||0;
            let el = document.createElement('div');
            el.className='hm-cell'; el.style.background=Engine.color(v); el.style.color=v>50?'#000':'#fff';
            el.innerHTML = `<b>${m.n}</b><br>${v}%`;
            cont.appendChild(el);
        });
    }
}

function renderChart() {
    let ctx = document.getElementById('trend-chart'); if(!ctx || !State.plan.length) return;
    if(window.myC) window.myC.destroy();
    let labels = State.plan.map(p=>'W'+p.w);
    let ds = [];
    let cols = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40'};
    for(let k in State.charts) {
        if(State.charts[k]) {
            let data = State.plan.map(p=>{ let sum=0,cnt=0; for(let x in p.r[k]){sum+=p.r[k][x];cnt++;} return cnt?Math.round(sum/cnt):0; });
            ds.push({label:k.toUpperCase(), data:data, borderColor:cols[k], borderWidth:2, fill:false});
        }
    }
    window.myC = new Chart(ctx.getContext('2d'), {type:'line', data:{labels, datasets:ds}, options:{responsive:true, plugins:{legend:{labels:{color:'#aaa'}}}, scales:{y:{beginAtZero:true,max:100,ticks:{color:'#aaa'},grid:{color:'#333'}},x:{ticks:{color:'#aaa'},grid:{color:'#333'}}}});
}

function toggleChart(k) { State.charts[k]=!State.charts[k]; renderChart(); }
function renderControls() {
    let d=document.getElementById('chart-controls'); if(!d)return; d.innerHTML='';
    let n={liver:'Печень',cardio:'Сердце',hemato:'Кровь'};
    for(let k in n) d.innerHTML+=`<label><input type="checkbox" ${State.charts[k]?'checked':''} onchange="toggleChart('${k}')"> ${n[k]}</label>`;
}
function renderSupport() {
    let d=document.getElementById('support-list'); if(!d)return;
    DB.support.forEach(b=>{
        d.innerHTML+=`<div class="time-block"><h3>${b.t}</h3>`+b.items.map(i=>`<div class="item" style="padding:10px;margin:5px 0"><b>${i.n}</b> ${i.d}<br><small>${i.m}</small></div>`).join('')+`</div>`;
    });
}
function renderArticles() {
    let d=document.getElementById('articles-list'); if(!d)return;
    DB.articles.forEach(a=> d.innerHTML+=`<div class="item"><b>${a.t}</b><br><small>${a.c}</small></div>`);
}
function renderShop() {
    let d=document.getElementById('shop-list'); if(!d)return;
    for(let k in DB.shop) DB.shop[k].forEach(i=> d.innerHTML+=`<div class="item"><b>${k}</b> ${i.p} ${i.pr}</div>`);
}
function renderGlossary() {
    let d=document.getElementById('glossary-list'); if(!d)return;
    for(let k in DB.glossary) d.innerHTML+=`<div class="item"><b>${k}</b><br><small>${DB.glossary[k]}</small></div>`;
}
function calcFert() {
    let v=parseFloat(document.getElementById('lab-vol').value)||0;
    let c=parseFloat(document.getElementById('lab-conc').value)||0;
    let r=Math.round((v/1.5)*20+(c/16)*30);
    document.getElementById('fert-res').innerHTML=`<span style="color:${r>50?'var(--sec)':'var(--err)'}">IF: ${r}/100</span>`;
}

// Attach to window
window.initApp = initApp;
window.switchTab = switchTab;
window.loadEsters = loadEsters;
window.addDrug = addDrug;
window.renderStack = renderStack;
window.calcPlan = calcPlan;
window.changeWeek = changeWeek;
window.toggleChart = toggleChart;
window.calcFert = calcFert;

document.addEventListener('DOMContentLoaded', initApp);
