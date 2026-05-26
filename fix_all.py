# fix_all.py
import os

print("🔧 Starting absolute fix...")

# 1. Создаем папки
os.makedirs("assets/js/core", exist_ok=True)
os.makedirs("assets/css", exist_ok=True)

# 2. Пишем Базу Данных (database.v6.js)
db_code = """const DB = {
  substances: [
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
    'test': [{id:'test_p',name:'Пропионат',hl:2},{id:'test_e',name:'Энантат',hl:7},{id:'test_c',name:'Ципионат',hl:8},{id:'test_sus',name:'Сустанон',hl:15}],
    'nandrolone': [{id:'nandrolone_p',name:'Фенилпропионат',hl:4.5},{id:'nandrolone_d',name:'Деканоат',hl:14}],
    'trenbolone': [{id:'trenbolone_a',name:'Ацетат',hl:3},{id:'trenbolone_e',name:'Энантат',hl:7},{id:'trenbolone_h',name:'Гекса',hl:10}],
    'boldenone': [{id:'boldenone_u',name:'Ундесиленат',hl:14}],
    'dhb': [{id:'dhb_p',name:'Ацетат',hl:10}],
    'masteron': [{id:'masteron_p',name:'Пропионат',hl:2.5},{id:'masteron_e',name:'Энантат',hl:7}],
    'primobolan': [{id:'primobolan_e',name:'Энантат',hl:10}],
    'stanozolol': [{id:'stanozolol_s',name:'Суспензия',hl:24}],
    'gh': [{id:'gh_short',name:'Ежедневно',hl:0.1},{id:'gh_long',name:'Пролонг',hl:168}],
    'insulin': [{id:'insulin_r',name:'Короткий',hl:0.1},{id:'insulin_l',name:'Продленный',hl:24}],
    'igf1': [{id:'igf1_lr3',name:'LR3',hl:24},{id:'igf1_des',name:'DES',hl:0.5}],
    'mgf': [{id:'mgf_plain',name:'MGF',hl:0.5},{id:'peg_mgf',name:'PEG-MGF',hl:48}]
  },
  risks: {
    liver: [{id:'chol',n:'Холестаз'}, {id:'ox',n:'Окс.стресс'}, {id:'cyt',n:'Цитолиз'}, {id:'fib',n:'Фиброз'}, {id:'mito',n:'Митохондрии'}, {id:'met',n:'Метилирование'}, {id:'apo',n:'Апоптоз'}],
    cardio: [{id:'htn',n:'Гипертония'}, {id:'tach',n:'Тахикардия'}, {id:'lip',n:'Липиды'}, {id:'thr',n:'Тромбоз'}, {id:'lvh',n:'Гипертрофия'}, {id:'endo',n:'Эндотелий'}, {id:'arr',n:'Аритмия'}],
    kidney: [{id:'hyper',n:'Гиперф.'}, {id:'fib_k',n:'Фиброз'}, {id:'elec',n:'Электролиты'}, {id:'prot',n:'Протеин'}, {id:'stone',n:'Камни'}, {id:'tub',n:'Некроз'}, {id:'gfr',n:'СКФ'}],
    neuro: [{id:'dop',n:'Дофамин'}, {id:'glu',n:'Глутамат'}, {id:'gaba',n:'ГАМК'}, {id:'ser',n:'Серотонин'}, {id:'inf',n:'Воспаление'}, {id:'cog',n:'Когнитив'}, {id:'add',n:'Зависимость'}],
    hemato: [{id:'ery',n:'Эритроциты'}, {id:'visc',n:'Вязкость'}, {id:'coag',n:'Коагуляция'}, {id:'anem',n:'Анемия'}, {id:'leuk',n:'Лейкоциты'}, {id:'plat',n:'Тромбоциты'}, {id:'hem',n:'Гемолиз'}],
    endo: [{id:'ins',n:'Инсулин'}, {id:'est',n:'Эстроген'}, {id:'prl',n:'Пролактин'}, {id:'thy',n:'Щитовидка'}, {id:'cor',n:'Кортизол'}, {id:'gh_ax',n:'Ось ГР'}, {id:'adr',n:'Надпочечники'}],
    repro: [{id:'atr',n:'Атрофия'}, {id:'sup',n:'Подавление'}, {id:'sp',n:'Сперма'}, {id:'lib',n:'Либидо'}, {id:'ed',n:'Эрекция'}, {id:'gyn',n:'Гино'}, {id:'inf',n:'Бесплодие'}]
  },
  support: [
    {t:'☀️ Натощак', items:[{n:'Iron Guard',d:'2 капс',m:'Гемоглобин'},{n:'Цитиколин',d:'500мг',m:'Нейро'},{n:'Наттокиназа',d:'2 капс',m:'Реология'},{n:'Таурин',d:'2г',m:'Анти-спазм'}]},
    {t:'🍳 Завтрак', items:[{n:'Астрагал',d:'500мг',m:'Почки'},{n:'Небилет',d:'2.5мг',m:'Давление'},{n:'Тадалафил',d:'5мг',m:'Поток'},{n:'Берберин',d:'500мг',m:'Инсулин'},{n:'D3+K2',d:'5000МЕ',m:'Кости'},{n:'TMG+Метилфолат',d:'1г',m:'Метил'},{n:'Бергамот',d:'500мг',m:'Липиды'},{n:'Бромантан+Фасорацетам',d:'50+100мг',m:'Дофамин'}]},
    {t:'🍲 Обед', items:[{n:'УДХК',d:'1000мг',m:'Желчь'},{n:'Пентоксифиллин',d:'400мг',m:'Вязкость'},{n:'Joint Health',d:'2 капс',m:'Суставы'},{n:'Витамин Е',d:'400МЕ',m:'Антиокс'}]},
    {t:'💪 Предтреник', items:[{n:'Агмантин',d:'1000мг',m:'NO'}]},
    {t:'🌙 Вечер', items:[{n:'Телмисартан',d:'80мг',m:'Давление'},{n:'Магний',d:'400мг',m:'Расслабление'},{n:'L-Теанин',d:'400мг',m:'Сон'},{n:'Гормон Роста',d:'5ЕД',m:'Рост',note:'Inj'}]}
  ],
  shop: {'udca':[{p:'Ozon',pr:'1500₽'},{p:'iHerb',pr:'$25'}],'telmisartan':[{p:'Apteka',pr:'600₽'}],'berberine':[{p:'iHerb',pr:'$20'}]},
  articles: [{t:'Основы PK/PD',c:'Theory',v:120},{t:'Защита печени',c:'Safety',v:340},{t:'IGF-1: LR3 vs DES',c:'Peptides',v:85},{t:'Контроль Эстрадиола',c:'Hormones',v:210}],
  glossary: {'Raw Risk':'Риск без защиты','Net Risk':'Риск с защитой','Half-life':'Период полувыведения','Hematocrit':'Густота крови'}
};"""

with open("assets/js/core/database.v6.js", "w", encoding='utf-8') as f:
    f.write(db_code)
print("✅ DB created")

# 3. Пишем Движок (engine.v6.js)
engine_code = """const Engine = {
  calcConc: function(hl, start, end, week) {
    if (week < start) return 0;
    if (week <= end) return Math.min(1, (week - start) / (hl/7 + 1));
    return Math.max(0, 1 - (week - end) * 0.2);
  },
  generatePlan: function(stack) {
    let maxW = 12;
    stack.forEach(i => { if(i.end > maxW) maxW = i.end; });
    const total = maxW + 6;
    const plan = [];
    for(let w=1; w<=total; w++) {
      let r = {};
      for(let sys in DB.risks) { r[sys]={}; DB.risks[sys].forEach(m => r[sys][m.id]=0); }
      stack.forEach(it => {
        const ester = DB.esters[it.sub] ? DB.esters[it.sub].find(x=>x.id===it.est) : null;
        const hl = ester ? ester.hl : 1;
        const conc = this.calcConc(hl, it.start, it.end, w);
        if(conc > 0.05) {
          const t = DB.substances.find(x=>x.id===it.sub).tox;
          const load = conc * (it.dose/100);
          r.liver.chol += t.liver*3*load; r.liver.cyt += t.liver*2*load;
          r.cardio.lip += t.lipid*3*load; r.cardio.htn += t.lipid*1.5*load;
          r.hemato.ery += t.hct*4*load; r.hemato.visc += t.hct*3*load;
          r.neuro.dop += t.neuro*5*load;
          r.kidney.hyper += t.kid*3*load;
          r.endo.ins += t.endo*3*load; r.endo.est += t.endo*2*load;
          r.repro.sup += t.repro*5*load; r.repro.atr += t.repro*4*load;
        }
      });
      for(let sys in r) for(let k in r[sys]) r[sys][k] = Math.min(100, Math.round(r[sys][k]));
      plan.push({w, r});
    }
    return plan;
  },
  getColor: function(v) {
    if(v<20) return '#4caf50'; if(v<40) return '#8bc34a'; if(v<60) return '#ffeb3b'; if(v<80) return '#ff9800'; return '#f44336';
  }
};"""

with open("assets/js/core/engine.v6.js", "w", encoding='utf-8') as f:
    f.write(engine_code)
print("✅ Engine created")

# 4. Пишем Приложуху (app.v6.js) - ГЛОБАЛЬНО ЧЕРЕЗ WINDOW
app_code = """window.App = {
  state: { stack:[], plan:[], wIdx:0, xp:0, charts:{liver:true, cardio:true, hemato:true} },
  init: function() {
    const sel = document.getElementById('sub-select');
    if(sel) {
      sel.innerHTML = '';
      DB.substances.forEach(s => { let o=document.createElement('option'); o.value=s.id; o.innerText=s.name; sel.appendChild(o); });
    }
    this.renderSupport(); this.renderArticles(); this.renderShop(); this.renderGlossary();
    this.renderControls();
    console.log("App Ready v6");
  },
  switchTab: function(id) {
    document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el=>el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    // Находим кнопку по тексту или индексу, чтобы подсветить
    const btns = document.querySelectorAll('.tab-btn');
    if(id==='dashboard') btns[0].classList.add('active');
    if(id==='stack') btns[1].classList.add('active');
    if(id==='risks') { btns[2].classList.add('active'); setTimeout(()=>this.renderChart(), 50); }
    if(id==='support') btns[3].classList.add('active');
    if(id==='labs') btns[4].classList.add('active');
    if(id==='articles') btns[5].classList.add('active');
    if(id==='shop') btns[6].classList.add('active');
  },
  loadEsters: function() {
    const subId = document.getElementById('sub-select').value;
    const estSel = document.getElementById('est-select');
    estSel.innerHTML = '';
    const list = DB.esters[subId];
    if(list && list.length) {
      estSel.disabled = false;
      list.forEach(e => { let o=document.createElement('option'); o.value=e.id; o.innerText=e.name+' ('+e.hl+'д)'; estSel.appendChild(o); });
    } else { estSel.disabled = true; }
  },
  addDrug: function() {
    const sub = document.getElementById('sub-select').value;
    const est = document.getElementById('est-select').value;
    const dose = parseFloat(document.getElementById('in-dose').value);
    const start = parseInt(document.getElementById('in-start').value);
    const end = parseInt(document.getElementById('in-end').value);
    if(!dose || start>=end) return alert('Ошибка ввода!');
    this.state.stack.push({sub, est, dose, start, end});
    this.renderStack();
    document.getElementById('in-dose').value = '';
  },
  renderStack: function() {
    const div = document.getElementById('stack-list');
    div.innerHTML = '';
    this.state.stack.forEach((it, idx) => {
      const s = DB.substances.find(x=>x.id===it.sub);
      const e = DB.esters[it.sub] ? DB.esters[it.sub].find(x=>x.id===it.est) : null;
      div.innerHTML += '<div class="item"><div><b>'+s.name+'</b> '+(e?'('+e.name+')':'')+'<br><small>'+it.dose+'мг | Нед '+it.start+'-'+it.end+'</small></div><button class="btn-del" onclick="App.state.stack.splice('+idx+',1);App.renderStack()">✕</button></div>';
    });
  },
  calcPlan: function() {
    if(!this.state.stack.length) return alert('Добавьте препараты!');
    this.state.plan = Engine.generatePlan(this.state.stack);
    this.state.wIdx = 0;
    this.renderHeatmap(); this.renderChart();
    document.getElementById('plan-msg').innerText = 'Расчет на '+this.state.plan.length+' недель!';
    this.state.xp += 100;
    document.getElementById('xp-display').innerText = 'XP: '+this.state.xp;
    const avg = Object.values(this.state.plan[0].r).reduce((a,b)=>a+Object.values(b).reduce((x,y)=>x+y,0),0)/49;
    document.getElementById('d-risk').innerText = Math.round(avg)+'%';
    document.getElementById('d-readiness').innerText = Math.max(10, 100-Math.round(avg));
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
    const data = this.state.plan[this.state.wIdx];
    document.getElementById('week-label').innerText = 'Неделя '+data.w;
    const div = document.getElementById('heatmap');
    div.innerHTML = '';
    for(let sys in DB.risks) {
      div.innerHTML += '<div style="grid-column:1/-1; color:var(--pri); font-weight:bold; margin-top:10px">'+sys.toUpperCase()+'</div>';
      DB.risks[sys].forEach(m => {
        const val = data.r[sys][m.id]||0;
        let col = Engine.getColor(val);
        let txt = val>50?'#000':'#fff';
        let el = document.createElement('div');
        el.className = 'hm-cell';
        el.style.background = col; el.style.color = txt;
        el.innerHTML = '<b>'+m.n+'</b><br>'+val+'%';
        div.appendChild(el);
      });
    }
  },
  renderChart: function() {
    const ctx = document.getElementById('trend-chart');
    if(!ctx) return;
    if(window.myChart) window.myChart.destroy();
    const labels = this.state.plan.map(p=>'W'+p.w);
    const datasets = [];
    const colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40'};
    for(let sys in this.state.charts) {
      if(this.state.charts[sys]) {
        const d = this.state.plan.map(p => { let sum=0, cnt=0; for(let k in p.r[sys]){sum+=p.r[sys][k];cnt++;} return cnt?Math.round(sum/cnt):0; });
        datasets.push({label:sys.toUpperCase(), data:d, borderColor:colors[sys], borderWidth:2, fill:false, tension:0.4});
      }
    }
    window.myChart = new Chart(ctx.getContext('2d'), { type:'line', data:{labels:labels, datasets:datasets}, options:{responsive:true, plugins:{legend:{labels:{color:'#aaa'}}}, scales:{y:{beginAtZero:true, max:100, ticks:{color:'#aaa'},grid:{color:'#333'}}, x:{ticks:{color:'#aaa'},grid:{color:'#333'}}}} );
  },
  toggleChart: function(sys) { this.state.charts[sys] = !this.state.charts[sys]; this.renderChart(); },
  renderControls: function() {
    const div = document.getElementById('chart-controls');
    if(!div) return;
    const names = {liver:'Печень', cardio:'Сердце', hemato:'Кровь'};
    div.innerHTML = '';
    for(let k in names) { div.innerHTML += '<label><input type="checkbox" '+(this.state.charts[k]?'checked':'')+' onchange="App.toggleChart(\\''+k+'\\')"> '+names[k]+'</label>'; }
  },
  renderSupport: function() {
    const div = document.getElementById('support-list');
    if(!div) return;
    DB.support.forEach(b => {
      div.innerHTML += '<div class="time-block"><h3>'+b.t+'</h3>'+b.items.map(i=>'<div class="item" style="margin:5px 0; padding:10px"><div><b>'+i.n+'</b> '+i.d+'<br><small>'+i.m+'</small></div></div>').join('')+'</div>';
    });
  },
  calcFert: function() {
    const v = parseFloat(document.getElementById('lab-vol').value)||0;
    const c = parseFloat(document.getElementById('lab-conc').value)||0;
    const res = Math.round((v/1.5)*20 + (c/16)*30);
    const el = document.getElementById('fert-res');
    if(el) el.innerHTML = '<span style="color:'+ (res>50?'var(--sec)':'var(--err)') +'">IF: '+res+'/100</span>';
  },
  renderArticles: function() {
    const div = document.getElementById('articles-list');
    if(!div) return;
    DB.articles.forEach(a => div.innerHTML += '<div class="item"><div><b>'+a.t+'</b><br><small>'+a.c+' | 👁'+a.v+'</small></div></div>');
  },
  renderShop: function() {
    const div = document.getElementById('shop-list');
    if(!div) return;
    for(let k in DB.shop) { DB.shop[k].forEach(i => div.innerHTML += '<div class="item"><div><b>'+k.toUpperCase()+'</b><br>'+i.p+'</div><div style="color:var(--sec)">'+i.pr+'</div></div>'); }
  },
  renderGlossary: function() {
    const div = document.getElementById('glossary-list');
    if(!div) return;
    for(let k in DB.glossary) div.innerHTML += '<div class="item"><b>'+k+'</b><br><small>'+DB.glossary[k]+'</small></div>';
  }
};
document.addEventListener('DOMContentLoaded', () => App.init());"""

with open("assets/js/app.v6.js", "w", encoding='utf-8') as f:
    f.write(app_code)
print("✅ App created")

# 5. Пишем HTML и CSS
html_code = """<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Bode Health v11</title>
<base href="https://thodstein.github.io/Bode_Health/">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
:root{--bg:#121212;--card:#1e1e1e;--pri:#bb86fc;--sec:#03dac6;--err:#cf6679;--txt:#fff;--bor:#333}
body{margin:0;font-family:-apple-system,sans-serif;background:var(--bg);color:var(--txt);padding-bottom:80px;overflow-x:hidden}
.app{max-width:900px;margin:0 auto}
header{background:var(--card);padding:15px;display:flex;justify-content:space-between;border-bottom:1px solid var(--bor)}
.tabs{display:flex;overflow-x:auto;background:var(--card);position:sticky;top:0;z-index:100;-webkit-overflow-scrolling:touch}
.tabs::-webkit-scrollbar{display:none}
.tab-btn{flex:0 0 auto;padding:15px 20px;background:none;border:none;color:#888;font-weight:bold;border-bottom:3px solid transparent;cursor:pointer;white-space:nowrap}
.tab-btn.active{color:var(--sec);border-bottom-color:var(--sec)}
.view{display:none;padding:20px;animation:fade 0.3s}
.view.active{display:block}
@keyframes fade{from{opacity:0}to{opacity:1}}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px}
.card{background:var(--card);padding:20px;border-radius:12px;text-align:center;border:1px solid var(--bor)}
.big-val{font-size:1.8rem;font-weight:bold;color:var(--sec);margin-top:5px}
.form-box{background:var(--card);padding:20px;border-radius:12px;margin-bottom:20px}
label{display:block;margin-bottom:5px;color:#aaa}
input,select{width:100%;background:#2c2c2c;border:1px solid var(--bor);color:#fff;padding:12px;border-radius:8px;margin-bottom:10px}
.row{display:flex;gap:10px}
button{width:100%;padding:14px;border:none;border-radius:8px;font-weight:bold;cursor:pointer;background:var(--pri);color:#000}
.btn-sec{background:var(--sec);margin-top:10px}
.btn-del{background:rgba(207,102,121,0.2);color:var(--err);width:auto;padding:5px 10px}
.item{background:var(--card);padding:15px;margin-bottom:10px;border-radius:8px;border-left:4px solid var(--sec);display:flex;justify-content:space-between;align-items:center}
.time-block{background:#252525;padding:15px;border-radius:8px;margin-bottom:15px}
.time-block h3{color:var(--pri);margin:0 0 10px;font-size:0.9rem;text-transform:uppercase}
.heatmap{display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:6px;margin-top:15px}
.hm-cell{padding:8px;border-radius:4px;text-align:center;font-size:0.75rem;color:#fff}
.week-nav{display:flex;justify-content:center;align-items:center;gap:20px;margin:20px 0}
.week-nav button{width:auto;padding:5px 15px;background:#333;color:#fff}
canvas{background:var(--card);border-radius:12px;padding:10px;margin-bottom:20px;width:100%}
.controls{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:15px;background:var(--card);padding:10px;border-radius:8px}
.controls label{display:flex;align-items:center;gap:5px;margin:0;color:#fff;font-size:0.85rem}
</style>
</head>
<body>
<div class="app">
<header><h1>Bode Health <span style="font-size:0.6em;color:var(--sec)">v11</span></h1><div id="xp-display" style="background:rgba(187,134,252,0.2);color:var(--pri);padding:4px 8px;border-radius:12px;font-size:0.8rem">XP:0</div></header>
<nav class="tabs">
<button class="tab-btn active" onclick="App.switchTab('dashboard')">📊 Главная</button>
<button class="tab-btn" onclick="App.switchTab('stack')">💉 Стек</button>
<button class="tab-btn" onclick="App.switchTab('risks')">⚠️ Риски</button>
<button class="tab-btn" onclick="App.switchTab('support')">💊 Поддержка</button>
<button class="tab-btn" onclick="App.switchTab('labs')">🧬 Анализы</button>
<button class="tab-btn" onclick="App.switchTab('articles')">📚 Статьи</button>
<button class="tab-btn" onclick="App.switchTab('shop')">🛒 Магазин</button>
</nav>
<main>
<div id="dashboard" class="view active">
<div class="grid"><div class="card"><h3>Readiness</h3><div class="big-val" id="d-readiness">--</div></div><div class="card"><h3>Risk</h3><div class="big-val" id="d-risk">--</div></div></div>
<div class="form-box" style="border:1px solid var(--err);color:var(--err)">⚠️ Добавьте препараты во вкладке "Стек"</div>
</div>
<div id="stack" class="view">
<div class="form-box">
<label>Вещество</label><select id="sub-select" onchange="App.loadEsters()"></select>
<label>Эфир</label><select id="est-select" disabled></select>
<div class="row"><input type="number" id="in-dose" placeholder="Доза (мг)"></div>
<div class="row"><input type="number" id="in-start" placeholder="Старт" value="1"><input type="number" id="in-end" placeholder="Финиш" value="8"></div>
<button onclick="App.addDrug()">Добавить</button>
</div>
<div id="stack-list"></div>
<button class="btn-sec" onclick="App.calcPlan()">РАССЧИТАТЬ</button>
<div id="plan-msg" style="margin-top:15px;color:var(--sec)"></div>
</div>
<div id="risks" class="view">
<h3>Динамика</h3>
<div class="controls" id="chart-controls"></div>
<canvas id="trend-chart"></canvas>
<h3>Матрица</h3>
<div class="week-nav"><button onclick="App.changeWeek(-1)">◀</button><span id="week-label" style="font-weight:bold;color:var(--sec)">Неделя 1</span><button onclick="App.changeWeek(1)">▶</button></div>
<div id="heatmap" class="heatmap"></div>
</div>
<div id="support" class="view"><h2>Поддержка</h2><div id="support-list"></div></div>
<div id="labs" class="view">
<div class="form-box"><h3>Фертильность</h3>
<input type="number" id="lab-vol" placeholder="Объем"><input type="number" id="lab-conc" placeholder="Конц"><input type="number" id="lab-pr" placeholder="PR%">
<button onclick="App.calcFert()">Рассчитать</button>
<div id="fert-res" style="margin-top:15px;font-size:1.2rem;font-weight:bold"></div>
</div>
</div>
<div id="articles" class="view"><h2>Статьи</h2><div id="articles-list"></div></div>
<div id="shop" class="view"><h2>Магазин</h2><div id="shop-list"></div><h2>Глоссарий</h2><div id="glossary-list"></div></div>
</main>
</div>
<script src="assets/js/core/database.v6.js"></script>
<script src="assets/js/core/engine.v6.js"></script>
<script src="assets/js/app.v6.js"></script>
</body>
</html>"""

with open("index.html", "w", encoding='utf-8') as f:
    f.write(html_code)
print("✅ HTML created")

print("\n🚀 Done! Now run:")
print("git add -A && git commit -m 'Fixed v6 via Python' && git push origin main --force")
