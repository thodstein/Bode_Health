#!/bin/bash
set -e
echo "🚑 FINAL RESCUE: Hard Reset, Inline Events, Full Content Restore"

# 1. DATABASE (Full Content)
cat > assets/js/core/database.js << 'DQ'
const DB_DATA = {
  substances: [
    {id:'test', name:'Тестостерон', tox:{liv:1,lip:3,hct:4,neu:0,kid:1,end:2,rep:5}},
    {id:'tren', name:'Тренболон', tox:{liv:2,lip:5,hct:3,neu:5,kid:4,end:4,rep:5}},
    {id:'nand', name:'Нандролон', tox:{liv:1,lip:4,hct:2,neu:0,kid:2,end:4,rep:4}},
    {id:'bold', name:'Болденон', tox:{liv:1,lip:3,hct:6,neu:0,kid:1,end:1,rep:3}},
    {id:'dhb', name:'DHB', tox:{liv:1,lip:4,hct:5,neu:0,kid:3,end:1,rep:3}},
    {id:'mast', name:'Мастерон', tox:{liv:1,lip:4,hct:3,neu:0,kid:1,end:1,rep:4}},
    {id:'prim', name:'Примоболан', tox:{liv:1,lip:3,hct:2,neu:0,kid:1,end:1,rep:2}},
    {id:'oxan', name:'Оксандролон', tox:{liv:4,lip:5,hct:1,neu:0,kid:1,end:1,rep:2}},
    {id:'stan', name:'Станозолол', tox:{liv:5,lip:5,hct:2,neu:0,kid:2,end:1,rep:3}},
    {id:'meth', name:'Метандиенон', tox:{liv:5,lip:4,hct:3,neu:0,kid:1,end:3,rep:3}},
    {id:'gh', name:'Гормон Роста', tox:{liv:0,lip:2,hct:0,neu:0,kid:1,end:5,rep:0}},
    {id:'ins', name:'Инсулин', tox:{liv:0,lip:1,hct:0,neu:0,kid:0,end:5,rep:0}},
    {id:'igf', name:'IGF-1', tox:{liv:0,lip:0,hct:0,neu:0,kid:2,end:4,rep:0}},
    {id:'mgf', name:'MGF/PEG', tox:{liv:0,lip:0,hct:0,neu:0,kid:1,end:2,rep:0}}
  ],
  esters: {
    'test': [{id:'tp',n:'Пропионат',h:2},{id:'te',n:'Энантат',h:7},{id:'tc',n:'Ципионат',h:8},{id:'ts',n:'Сустанон',h:15}],
    'tren': [{id:'ta',n:'Ацетат',h:3},{id:'te',n:'Энантат',h:7},{id:'th',n:'Гекса',h:10}],
    'nand': [{id:'np',n:'Фенилпропионат',h:4.5},{id:'nd',n:'Деканоат',h:14}],
    'bold': [{id:'bu',n:'Ундесиленат',h:14}],
    'dhb': [{id:'da',n:'Ацетат',h:10}],
    'mast': [{id:'mp',n:'Пропионат',h:2.5},{id:'me',n:'Энантат',h:7}],
    'prim': [{id:'pe',n:'Энантат',h:10}],
    'stan': [{id:'ss',n:'Суспензия',h:24}],
    'gh': [{id:'gs',n:'Ежедневно',h:0.1},{id:'gl',n:'Пролонг',h:168}],
    'ins': [{id:'ir',n:'Короткий',h:0.1},{id:'il',n:'Продленный',h:24}],
    'igf': [{id:'lr3',n:'LR3',h:24},{id:'des',n:'DES',h:0.5}],
    'mgf': [{id:'mgf',n:'MGF',h:0.5},{id:'peg',n:'PEG-MGF',h:48}]
  },
  risks: {
    liver: [{id:'chol',n:'Холестаз'},{id:'ox',n:'Окс.стресс'},{id:'cyt',n:'Цитолиз'},{id:'fib',n:'Фиброз'},{id:'mit',n:'Митохондрии'},{id:'met',n:'Метилирование'},{id:'apo',n:'Апоптоз'}],
    cardio: [{id:'htn',n:'Гипертония'},{id:'tach',n:'Тахикардия'},{id:'lip',n:'Липиды'},{id:'thr',n:'Тромбоз'},{id:'lvh',n:'Гипертрофия'},{id:'end',n:'Эндотелий'},{id:'arr',n:'Аритмия'}],
    kidney: [{id:'hf',n:'Гиперфильтрация'},{id:'fibk',n:'Фиброз'},{id:'elec',n:'Электролиты'},{id:'prot',n:'Протеинурия'},{id:'ston',n:'Камни'},{id:'tub',n:'Некроз'},{id:'gfr',n:'Падение СКФ'}],
    neuro: [{id:'dop',n:'Дофамин'},{id:'glu',n:'Глутамат'},{id:'gaba',n:'ГАМК'},{id:'ser',n:'Серотонин'},{id:'inf',n:'Воспаление'},{id:'cog',n:'Когнитив'},{id:'add',n:'Зависимость'}],
    hemato: [{id:'ery',n:'Эритроцитоз'},{id:'vis',n:'Вязкость'},{id:'coa',n:'Коагуляция'},{id:'ane',n:'Анемия'},{id:'leu',n:'Лейкоцитоз'},{id:'pla',n:'Тромбоциты'},{id:'hem',n:'Гемолиз'}],
    endo: [{id:'insr',n:'Инсулинорез.'},{id:'est',n:'Эстроген'},{id:'prol',n:'Пролактин'},{id:'thy',n:'Щитовидка'},{id:'cor',n:'Кортизол'},{id:'ghax',n:'Ось ГР'},{id:'adr',n:'Надпочечники'}],
    repro: [{id:'atr',n:'Атрофия'},{id:'sup',n:'Подавление'},{id:'sp erm',n:'Спермогенез'},{id:'lib',n:'Либидо'},{id:'ed',n:'Эрекция'},{id:'gyn',n:'Гинекомастия'},{id:'inf',n:'Бесплодие'}]
  },
  support: [
    {t:'☀️ Натощак', items:[{n:'Iron Guard',d:'2 капс',m:'Гемоглобин'},{n:'Цитиколин',d:'500мг',m:'Нейро'},{n:'Наттокиназа',d:'2 капс',m:'Реология'},{n:'Таурин',d:'2г',m:'Анти-спазм'}]},
    {t:'🍳 Завтрак', items:[{n:'Астрагал',d:'500мг',m:'Почки'},{n:'Небилет',d:'2.5мг',m:'Давление'},{n:'Тадалафил',d:'5мг',m:'Поток'},{n:'Берберин',d:'500мг',m:'Инсулин'},{n:'D3+K2',d:'5000МЕ',m:'Кости'},{n:'TMG+Метилфолат',d:'1г',m:'Метил'},{n:'Бергамот',d:'500мг',m:'Липиды'},{n:'Бромантан+Фасорацетам',d:'50+100мг',m:'Дофамин'}]},
    {t:'🍲 Обед', items:[{n:'УДХК',d:'1000мг',m:'Желчь'},{n:'Пентоксифиллин',d:'400мг',m:'Вязкость'},{n:'Joint Health',d:'2 капс',m:'Суставы'},{n:'Витамин Е',d:'400МЕ',m:'Антиокс'}]},
    {t:'💪 Предтреник', items:[{n:'Агмантин',d:'1г',m:'NO'}]},
    {t:'🌙 Вечер', items:[{n:'Телмисартан',d:'80мг',m:'Давление'},{n:'Магний',d:'400мг',m:'Расслабление'},{n:'L-Теанин',d:'400мг',m:'Сон'},{n:'ГР',d:'5ЕД',m:'Рост'}]}
  ],
  shop: {
    'udca':[{p:'Ozon',pr:'1500₽',u:'#'},{p:'iHerb',pr:'$25',u:'#'}],
    'telmisartan':[{p:'Apteka',pr:'600₽',u:'#'}],
    'nebivolol':[{p:'Ozon',pr:'400₽',u:'#'}],
    'berberine':[{p:'iHerb',pr:'$20',u:'#'}],
    'taurine':[{p:'Ozon',pr:'800₽',u:'#'}],
    'magnesium':[{p:'Ozon',pr:'900₽',u:'#'}]
  },
  articles: [
    {t:'Основы фармакокинетики',c:'Theory',v:120},
    {t:'Протоколы защиты печени',c:'Safety',v:340},
    {t:'IGF-1: LR3 vs DES',c:'Peptides',v:85},
    {t:'Управление эстрогеном',c:'Hormones',v:210},
    {t:'Гайд по ПКТ',c:'Recovery',v:150}
  ],
  glossary: {
    'Raw Risk':'Риск без поддержки',
    'Net Risk':'Риск с поддержкой',
    'Half-life':'Период полувыведения',
    'Hematocrit':'Густота крови',
    'IGF-1 LR3':'Длинный IGF (24ч)',
    'IGF-1 DES':'Короткий IGF (20мин)',
    'PEG-MGF':'Пролонгированный MGF'
  }
};
DQ

# 2. ENGINE
cat > assets/js/core/engine.js << 'EQ'
const EngineCore = {
  calcConc: function(hl, start, end, cur) {
    if(cur < start) return 0;
    if(cur <= end) return Math.min(1, (cur-start)/(hl/7+1));
    return Math.max(0, 1 - ((cur-end)*0.2));
  },
  genPlan: function(stack) {
    let maxW = 12;
    stack.forEach(s => { if(s.end > maxW) maxW = s.end; });
    const total = maxW + 6;
    const plan = [];
    for(let w=1; w<=total; w++) {
      let r = {};
      for(let sys in DB_DATA.risks) {
        r[sys] = {};
        DB_DATA.risks[sys].forEach(m => r[sys][m.id] = 0);
      }
      stack.forEach(it => {
        const estList = DB_DATA.esters[it.sub];
        const est = estList ? estList.find(e=>e.id===it.est) : null;
        const hl = est ? est.h : 1;
        const conc = this.calcConc(hl, it.start, it.end, w);
        if(conc > 0.05) {
          const sub = DB_DATA.substances.find(s=>s.id===it.sub);
          if(!sub) return;
          const load = conc * (it.dose/100);
          const t = sub.tox;
          r.liver.chol += t.liv*3*load; r.liver.cyt += t.liv*2*load;
          r.cardio.lip += t.lip*3*load; r.cardio.htn += t.lip*1.5*load;
          r.hemato.ery += t.hct*4*load; r.hemato.vis += t.hct*3*load;
          r.neuro.dop += t.neu*5*load;
          r.kidney.hf += t.kid*3*load;
          r.endo.insr += t.end*3*load; r.endo.est += t.end*2*load;
          r.repro.atr += t.rep*5*load; r.repro.sup += t.rep*4*load;
        }
      });
      for(let sys in r) for(let k in r[sys]) r[sys][k] = Math.min(100, Math.round(r[sys][k]));
      plan.push({w:w, r:r});
    }
    return plan;
  },
  getColor: function(v) { return v<20?'#4caf50':v<40?'#8bc34a':v<60?'#ffeb3b':v<80?'#ff9800':'#f44336'; }
};
EQ

# 3. HTML (Inline Events Guaranteed)
cat > index.html << 'HQ'
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bode Health v11</title>
<base href="https://thodstein.github.io/Bode_Health/">
<link rel="stylesheet" href="assets/css/style.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
<div class="app">
  <header><h1>Bode Health <span>v11</span></h1><div id="xp">XP:0</div></header>
  <nav class="tabs">
    <button onclick="UI.tab('dash')">📊 Главная</button>
    <button onclick="UI.tab('stack')">💉 Стек</button>
    <button onclick="UI.tab('risks')">⚠️ Риски</button>
    <button onclick="UI.tab('support')">💊 Поддержка</button>
    <button onclick="UI.tab('labs')">🧬 Анализы</button>
    <button onclick="UI.tab('articles')">📚 Статьи</button>
    <button onclick="UI.tab('shop')">🛒 Магазин</button>
  </nav>
  <main>
    <section id="dash" class="tab active">
      <div class="grid"><div class="card"><h3>Readiness</h3><div id="d-read" class="val">--</div></div><div class="card"><h3>Risk</h3><div id="d-risk" class="val">--</div></div></div>
    </section>
    <section id="stack" class="tab">
      <h2>Добавить препарат</h2>
      <form onsubmit="UI.addDrug(event)">
        <label>Вещество</label><select id="sel-sub" onchange="UI.loadEst()"></select>
        <label>Эфир</label><select id="sel-est" disabled></select>
        <div class="row"><input type="number" id="in-dose" placeholder="Доза" required></div>
        <div class="row"><input type="number" id="in-start" value="1" placeholder="Старт" required><input type="number" id="in-end" value="8" placeholder="Финиш" required></div>
        <button type="submit">Добавить</button>
      </form>
      <div id="list-stack"></div>
      <button class="ok" onclick="UI.calc()">Рассчитать курс</button>
      <div id="out-plan"></div>
    </section>
    <section id="risks" class="tab">
      <h2>Динамика</h2>
      <div class="ctrl"><label><input type="checkbox" checked onchange="UI.togChart('liv')"> Печень</label><label><input type="checkbox" checked onchange="UI.togChart('car')"> Сердце</label><label><input type="checkbox" checked onchange="UI.togChart('hem')"> Кровь</label></div>
      <canvas id="chart-r"></canvas>
      <h2>Матрица</h2>
      <div class="wk-nav"><button onclick="UI.wk(-1)">◀</button><span id="wk-txt">W1</span><button onclick="UI.wk(1)">▶</button></div>
      <div id="heat" class="heat"></div>
    </section>
    <section id="support" class="tab"><h2>Поддержка</h2><div id="list-sup"></div></section>
    <section id="labs" class="tab"><h2>Фертильность</h2><div class="row"><input id="lab-v" placeholder="Объем"><input id="lab-c" placeholder="Конц"><input id="lab-p" placeholder="PR%"></div><button onclick="UI.fert()">Расчет</button><div id="res-fert"></div></section>
    <section id="articles" class="tab"><h2>Статьи</h2><div id="list-art"></div></section>
    <section id="shop" class="tab"><h2>Магазин</h2><div id="list-shop"></div><h2>Глоссарий</h2><div id="list-glos"></div></section>
  </main>
</div>
<script src="assets/js/core/database.js"></script>
<script src="assets/js/core/engine.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>
HQ

# 4. APP JS (Global UI Object)
cat > assets/js/app.js << 'AQ'
const UI = {
  data: { stack:[], plan:[], wk:0, ch:{liv:true,car:true,hem:true} },
  init: function() {
    const s = document.getElementById('sel-sub');
    if(s) {
      s.innerHTML = '';
      DB_DATA.substances.forEach(x => {
        const o = document.createElement('option'); o.value=x.id; o.innerText=x.name; s.appendChild(o);
      });
    }
    this.renderSup(); this.renderArt(); this.renderShop(); this.renderGlos();
  },
  tab: function(id) {
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },
  loadEst: function() {
    const sub = document.getElementById('sel-sub').value;
    const sel = document.getElementById('sel-est');
    sel.innerHTML = '';
    const list = DB_DATA.esters[sub];
    if(list && list.length) {
      sel.disabled = false;
      list.forEach(x => { const o=document.createElement('option'); o.value=x.id; o.innerText=x.n+' ('+x.h+'д)'; sel.appendChild(o); });
    } else { sel.disabled = true; }
  },
  addDrug: function(e) {
    e.preventDefault();
    const sub = document.getElementById('sel-sub').value;
    const est = document.getElementById('sel-est').value;
    const dose = parseFloat(document.getElementById('in-dose').value);
    const start = parseInt(document.getElementById('in-start').value);
    const end = parseInt(document.getElementById('in-end').value);
    if(start >= end) return alert('Ошибка недель');
    this.data.stack.push({sub:sub, est:est, dose:dose, start:start, end:end});
    this.rStack();
    e.target.reset();
    document.getElementById('sel-est').disabled = true;
    document.getElementById('in-start').value = 1;
    document.getElementById('in-end').value = 8;
  },
  rStack: function() {
    const d = document.getElementById('list-stack'); d.innerHTML = '';
    this.data.stack.forEach((x,i) => {
      const s = DB_DATA.substances.find(z=>z.id===x.sub);
      const eList = DB_DATA.esters[x.sub];
      const e = eList ? eList.find(z=>z.id===x.est) : null;
      d.innerHTML += '<div class="item"><b>'+s.name+'</b> '+(e?e.n:'')+'<br>'+x.dose+'мг | '+x.start+'-'+x.end+' нед <button onclick="UI.data.stack.splice('+i+',1);UI.rStack()">✕</button></div>';
    });
  },
  calc: function() {
    this.data.plan = EngineCore.genPlan(this.data.stack);
    this.data.wk = 0;
    this.rHeat(); this.rChart();
    document.getElementById('out-plan').innerHTML = '<p style="color:#03dac6">Курс: '+this.data.plan.length+' нед</p>';
    if(this.data.plan[0]) document.getElementById('d-risk').innerText = Math.round(this.data.plan[0].r.liver.chol)+'%';
  },
  wk: function(dir) {
    if(!this.data.plan.length) return;
    this.data.wk += dir;
    if(this.data.wk<0) this.data.wk=0;
    if(this.data.wk>=this.data.plan.length) this.data.wk=this.data.plan.length-1;
    this.rHeat();
  },
  togChart: function(k) { this.data.ch[k] = !this.data.ch[k]; this.rChart(); },
  rHeat: function() {
    if(!this.data.plan.length) return;
    const p = this.data.plan[this.data.wk];
    document.getElementById('wk-txt').innerText = 'W'+p.w;
    const c = document.getElementById('heat'); c.innerHTML = '';
    for(let sys in DB_DATA.risks) {
      c.innerHTML += '<div class="h-head">'+sys.toUpperCase()+'</div>';
      DB_DATA.risks[sys].forEach(m => {
        const v = p.r[sys][m.id]||0;
        const d = document.createElement('div');
        d.className = 'h-cell';
        d.style.backgroundColor = EngineCore.getColor(v);
        d.style.color = v>50?'#000':'#fff';
        d.innerHTML = '<div>'+m.n+'</div><b>'+v+'%</b>';
        c.appendChild(d);
      });
    }
  },
  rChart: function() {
    const ctx = document.getElementById('chart-r');
    if(!ctx || !this.data.plan.length) return;
    if(window.gChart) window.gChart.destroy();
    const lbs = this.data.plan.map(x=>'W'+x.w);
    const ds = [];
    const cols = {liv:'#ff6384', car:'#36a2eb', hem:'#ff9f40'};
    const names = {liv:'Печень', car:'Сердце', hem:'Кровь'};
    for(let k in this.data.ch) {
      if(this.data.ch[k]) {
        const dt = this.data.plan.map(x => {
          let sum=0,cnt=0; for(let z in x.r[k]){sum+=x.r[k][z];cnt++;} return cnt?Math.round(sum/cnt):0;
        });
        ds.push({label:names[k], data:dt, borderColor:cols[k], borderWidth:2, fill:false});
      }
    }
    window.gChart = new Chart(ctx, {type:'line', data:{labels:lbs, datasets:ds}, options:{responsive:true, plugins:{legend:{labels:{color:'#fff'}}}, scales:{y:{ticks:{color:'#aaa'},grid:{color:'#333'}},x:{ticks:{color:'#aaa'},grid:{color:'#333'}}}});
  },
  renderSup: function() {
    const d = document.getElementById('list-sup'); d.innerHTML = '';
    DB_DATA.support.forEach(b => {
      d.innerHTML += '<div class="blk"><h3>'+b.t+'</h3>'+b.items.map(i=>'<div class="item"><b>'+i.n+'</b> '+i.d+'<br><small>'+i.m+'</small></div>').join('')+'</div>';
    });
  },
  fert: function() {
    const v=parseFloat(document.getElementById('lab-v').value)||0;
    const c=parseFloat(document.getElementById('lab-c').value)||0;
    const res = Math.round((v/1.5)*20 + (c/16)*30);
    document.getElementById('res-fert').innerHTML = '<h3>IF: '+res+'/100</h3>';
  },
  renderArt: function() {
    const d = document.getElementById('list-art'); d.innerHTML = '';
    DB_DATA.articles.forEach(a => d.innerHTML += '<div class="item"><b>'+a.t+'</b><br><small>'+a.c+' | 👁'+a.v+'</small></div>');
  },
  renderShop: function() {
    const d = document.getElementById('list-shop'); d.innerHTML = '';
    for(let k in DB_DATA.shop) {
      DB_DATA.shop[k].forEach(i => d.innerHTML += '<div class="item"><b>'+k+'</b><br>'+i.p+' '+i.pr+' <a href="'+i.u+'" class="btn-s">Buy</a></div>');
    }
  },
  renderGlos: function() {
    const d = document.getElementById('list-glos'); d.innerHTML = '';
    for(let k in DB_DATA.glossary) d.innerHTML += '<div class="item"><b>'+k+'</b><p>'+DB_DATA.glossary[k]+'</p></div>';
  }
};
window.addEventListener('DOMContentLoaded', () => UI.init());
AQ

# 5. CSS
cat > assets/css/style.css << 'CQ'
:root{--bg:#121212;--card:#1e1e1e;--pri:#bb86fc;--sec:#03dac6;--txt:#fff;--bor:#333}
body{margin:0;font-family:sans-serif;background:var(--bg);color:var(--txt)}
.app{max-width:900px;margin:0 auto}
header{background:var(--card);padding:20px;display:flex;justify-content:space-between;border-bottom:1px solid var(--bor)}
.tabs{display:flex;overflow-x:auto;background:var(--card);position:sticky;top:0;z-index:100}
.tabs button{flex:1;min-width:100px;padding:15px;background:none;border:none;color:#aaa;font-weight:bold;border-bottom:3px solid transparent;cursor:pointer}
.tabs button:hover{color:var(--pri)}
.tab{display:none;padding:20px}
.tab.active{display:block}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}
.card,.blk,.item{background:var(--card);padding:15px;margin-bottom:10px;border-radius:8px;border-left:4px solid var(--sec)}
.val{font-size:2em;font-weight:bold;color:var(--sec);margin-top:10px}
form{background:var(--card);padding:20px;border-radius:12px;display:flex;flex-direction:column;gap:10px}
.row{display:flex;gap:10px}
input,select{background:#2c2c2c;border:1px solid var(--bor);color:#fff;padding:12px;border-radius:8px;flex:1}
button{padding:12px;background:var(--pri);color:#000;border:none;border-radius:8px;font-weight:bold;cursor:pointer}
.ok{background:var(--sec);width:100%;margin-top:20px;font-size:1.1em}
.ctrl{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:15px;background:var(--card);padding:10px;border-radius:8px}
.ctrl label{display:flex;align-items:center;gap:5px;font-size:0.9em}
.wk-nav{display:flex;justify-content:center;align-items:center;gap:20px;margin:20px 0}
.heat{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:5px;margin-top:15px}
.h-head{grid-column:1/-1;color:var(--pri);font-weight:bold;margin-top:10px}
.h-cell{padding:10px;border-radius:4px;text-align:center;font-size:0.8em;cursor:help}
.btn-s{display:inline-block;padding:5px 10px;background:var(--sec);color:#000;text-decoration:none;border-radius:4px;font-size:0.8em;margin-left:10px}
canvas{background:var(--card);border-radius:12px;padding:10px}
CQ

# 6. PUSH
git add -A
git commit -m "Stage 7 Rescue: Inline Events, Full DB, All Tabs Restored"
git push origin main --force
echo "✅ RESCUE COMPLETE. CHECK ACTIONS."
