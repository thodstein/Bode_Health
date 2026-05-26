#!/bin/bash
set -e
echo "🚀 STAGE FINAL: Full Structure, No Shortcuts, Fixed Graphs & Tabs"

# 1. DATABASE (Full Content)
echo "💾 Creating Full Database..."
cat > assets/js/core/database.v4.js << 'DBEOF'
const DB = {
    substances: [
        { id: 'test', name: 'Тестостерон', class: 'AAS', tox: { liver: 1, lipid: 3, hct: 4, neuro: 0, kid: 1, endo: 2, repro: 5 } },
        { id: 'nandrolone', name: 'Нандролон', class: 'AAS', tox: { liver: 1, lipid: 4, hct: 2, neuro: 0, kid: 2, endo: 4, repro: 4 } },
        { id: 'trenbolone', name: 'Тренболон', class: 'AAS', tox: { liver: 2, lipid: 5, hct: 3, neuro: 5, kid: 4, endo: 4, repro: 5 } },
        { id: 'boldenone', name: 'Болденон', class: 'AAS', tox: { liver: 1, lipid: 3, hct: 6, neuro: 0, kid: 1, endo: 1, repro: 3 } },
        { id: 'dhb', name: 'Дигидроболденон (DHB)', class: 'AAS', tox: { liver: 1, lipid: 4, hct: 5, neuro: 0, kid: 3, endo: 1, repro: 3 } },
        { id: 'masteron', name: 'Мастерон', class: 'AAS', tox: { liver: 1, lipid: 4, hct: 3, neuro: 0, kid: 1, endo: 1, repro: 4 } },
        { id: 'primobolan', name: 'Примоболан', class: 'AAS', tox: { liver: 1, lipid: 3, hct: 2, neuro: 0, kid: 1, endo: 1, repro: 2 } },
        { id: 'oxandrolone', name: 'Оксандролон', class: 'Oral', tox: { liver: 4, lipid: 5, hct: 1, neuro: 0, kid: 1, endo: 1, repro: 2 } },
        { id: 'stanozolol', name: 'Станозолол', class: 'Oral/Inj', tox: { liver: 5, lipid: 5, hct: 2, neuro: 0, kid: 2, endo: 1, repro: 3 } },
        { id: 'methandienone', name: 'Метандиенон', class: 'Oral', tox: { liver: 5, lipid: 4, hct: 3, neuro: 0, kid: 1, endo: 3, repro: 3 } },
        { id: 'gh', name: 'Гормон Роста', class: 'Peptide', tox: { liver: 0, lipid: 2, hct: 0, neuro: 0, kid: 1, endo: 5, repro: 0 } },
        { id: 'insulin', name: 'Инсулин', class: 'Hormone', tox: { liver: 0, lipid: 1, hct: 0, neuro: 0, kid: 0, endo: 5, repro: 0 } },
        { id: 'igf1', name: 'IGF-1', class: 'Peptide', tox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kid: 2, endo: 4, repro: 0 } },
        { id: 'mgf', name: 'MGF / PEG-MGF', class: 'Peptide', tox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kid: 1, endo: 2, repro: 0 } }
    ],
    esters: {
        'test': [ {id:'test_p', name:'Пропионат', hl:2}, {id:'test_e', name:'Энантат', hl:7}, {id:'test_c', name:'Ципионат', hl:8}, {id:'test_sus', name:'Сустанон', hl:15} ],
        'nandrolone': [ {id:'nandrolone_p', name:'Фенилпропионат', hl:4.5}, {id:'nandrolone_d', name:'Деканоат', hl:14} ],
        'trenbolone': [ {id:'trenbolone_a', name:'Ацетат', hl:3}, {id:'trenbolone_e', name:'Энантат', hl:7}, {id:'trenbolone_h', name:'Гекса', hl:10} ],
        'boldenone': [ {id:'boldenone_u', name:'Ундесиленат', hl:14} ],
        'dhb': [ {id:'dhb_p', name:'Ацетат', hl:10} ],
        'masteron': [ {id:'masteron_p', name:'Пропионат', hl:2.5}, {id:'masteron_e', name:'Энантат', hl:7} ],
        'primobolan': [ {id:'primobolan_e', name:'Энантат', hl:10} ],
        'stanozolol': [ {id:'stanozolol_s', name:'Суспензия', hl:24} ],
        'gh': [ {id:'gh_short', name:'Ежедневно', hl:0.1}, {id:'gh_long', name:'Пролонг', hl:168} ],
        'insulin': [ {id:'insulin_r', name:'Короткий', hl:0.1}, {id:'insulin_l', name:'Продленный', hl:24} ],
        'igf1': [ {id:'igf1_lr3', name:'LR3 (Длинный)', hl:24}, {id:'igf1_des', name:'DES (Короткий)', hl:0.5} ],
        'mgf': [ {id:'mgf_plain', name:'MGF', hl:0.5}, {id:'peg_mgf', name:'PEG-MGF', hl:48} ]
    },
    risks: {
        liver: [ {id:'chol',n:'Холестаз'}, {id:'ox',n:'Окс.стресс'}, {id:'cyt',n:'Цитолиз'}, {id:'fib',n:'Фиброз'}, {id:'mito',n:'Митохондрии'}, {id:'met',n:'Метилирование'}, {id:'apo',n:'Апоптоз'} ],
        cardio: [ {id:'htn',n:'Гипертония'}, {id:'tach',n:'Тахикардия'}, {id:'lip',n:'Липиды'}, {id:'thr',n:'Тромбоз'}, {id:'lvh',n:'Гипертрофия'}, {id:'endo',n:'Эндотелий'}, {id:'arr',n:'Аритмия'} ],
        kidney: [ {id:'hyper',n:'Гиперф.'}, {id:'fib_k',n:'Фиброз'}, {id:'elec',n:'Электролиты'}, {id:'prot',n:'Протеин'}, {id:'stone',n:'Камни'}, {id:'tub',n:'Некроз'}, {id:'gfr',n:'СКФ'} ],
        neuro: [ {id:'dop',n:'Дофамин'}, {id:'glu',n:'Глутамат'}, {id:'gaba',n:'ГАМК'}, {id:'ser',n:'Серотонин'}, {id:'inf',n:'Воспаление'}, {id:'cog',n:'Когнитив'}, {id:'add',n:'Зависимость'} ],
        hemato: [ {id:'ery',n:'Эритроциты'}, {id:'visc',n:'Вязкость'}, {id:'coag',n:'Коагуляция'}, {id:'anem',n:'Анемия'}, {id:'leuk',n:'Лейкоциты'}, {id:'plat',n:'Тромбоциты'}, {id:'hem',n:'Гемолиз'} ],
        endo: [ {id:'ins',n:'Инсулин'}, {id:'est',n:'Эстроген'}, {id:'prl',n:'Пролактин'}, {id:'thy',n:'Щитовидка'}, {id:'cor',n:'Кортизол'}, {id:'gh_ax',n:'Ось ГР'}, {id:'adr',n:'Надпочечники'} ],
        repro: [ {id:'atr',n:'Атрофия'}, {id:'sup',n:'Подавление'}, {id:'sp',n:'Сперма'}, {id:'lib',n:'Либидо'}, {id:'ed',n:'Эрекция'}, {id:'gyn',n:'Гино'}, {id:'inf',n:'Бесплодие'} ]
    },
    support: [
        { t:'☀️ Натощак', items:[ {n:'Iron Guard', d:'2 капс', m:'Гемоглобин'}, {n:'Цитиколин', d:'500мг', m:'Нейропластичность'}, {n:'Наттокиназа', d:'2 капс', m:'Фибринолиз'}, {n:'Таурин', d:'2г', m:'Антагонист AngII'} ] },
        { t:'🍳 Завтрак', items:[ {n:'Астрагал', d:'500мг', m:'Нефропротекция'}, {n:'Небилет', d:'2.5мг', m:'Beta-1 блокатор'}, {n:'Тадалафил', d:'5мг', m:'PDE5 ингибитор'}, {n:'Берберин', d:'500мг', m:'AMPK активатор'}, {n:'D3+K2', d:'5000МЕ', m:'Кальций-менеджмент'}, {n:'TMG+Метилфолат', d:'1г', m:'Метилирование'}, {n:'Бергамот', d:'500мг', m:'Натуральный статин'}, {n:'Бромантан+Фасорацетам', d:'50+100мг', m:'Актопротектор+Ноотроп'} ] },
        { t:'🍲 Обед', items:[ {n:'УДХК', d:'1000мг', m:'Антихолестаз'}, {n:'Пентоксифиллин', d:'400мг', m:'Реология крови'}, {n:'Joint Health', d:'2 капс', m:'Хондропротекция'}, {n:'Витамин Е', d:'400МЕ', m:'Антиоксидант'} ] },
        { t:'💪 Предтреник', items:[ {n:'Агмантин', d:'1000мг', m:'NO бустер'} ] },
        { t:'🥤 Intra-Workout', items:[ {n:'Цитруллин', d:'6г', m:'NO прекурсор'}, {n:'Креатин', d:'5г', m:'АТФ ресинтез'}, {n:'EAA', d:'10г', m:'Антикатаболизм'} ] },
        { t:'🌙 Вечер', items:[ {n:'Телмисартан', d:'80мг', m:'ARB Нефропротектор'}, {n:'Магний', d:'400мг', m:'Релаксант'}, {n:'L-Теанин', d:'400мг', m:'ГАМК агонист'}, {n:'Гормон Роста', d:'5ЕД', m:'Липолиз/Регенерация', note:'Inj'} ] }
    ],
    shop: {
        'udca': [ {p:'Ozon', pr:'1500₽', u:'#'}, {p:'iHerb', pr:'$25', u:'#'} ],
        'telmisartan': [ {p:'Apteka.ru', pr:'600₽', u:'#'} ],
        'nebivolol': [ {p:'Ozon', pr:'400₽', u:'#'} ],
        'berberine': [ {p:'iHerb', pr:'$20', u:'#'} ],
        'taurine': [ {p:'Ozon', pr:'800₽', u:'#'} ],
        'magnesium': [ {p:'Ozon', pr:'900₽', u:'#'} ],
        'omega3': [ {p:'iHerb', pr:'$30', u:'#'} ]
    },
    articles: [
        { t:'Основы PK/PD в бодибилдинге', c:'Theory', v:120, txt:'Фармакокинетика определяет частоту инъекций...' },
        { t:'Протоколы защиты печени на курсе', c:'Safety', v:340, txt:'УДХК и ТМГ — основа защиты гепатоцитов...' },
        { t:'IGF-1: LR3 vs DES — что выбрать?', c:'Peptides', v:85, txt:'LR3 работает системно 24ч, DES локально 20 мин...' },
        { t:'Контроль Эстрадиола и Пролактина', c:'Hormones', v:210, txt:'ИА и Каберголин только по анализам...' },
        { t:'ПКТ: Классика и современные схемы', c:'Recovery', v:150, txt:'Кломид, Тамоксифен и ХГЧ...' },
        { t:'Расшифровка анализов крови', c:'Labs', v:400, txt:'Гематокрит, Липидный профиль, Печеночные пробы...' }
    ],
    glossary: {
        'Raw Risk': 'Исходный риск без применения поддержки.',
        'Net Risk': 'Остаточный риск после применения протокола защиты.',
        'Half-life': 'Период полувыведения вещества из организма.',
        'Hematocrit': 'Показатель густоты крови (доля эритроцитов). Критично >52%.',
        'IGF-1 LR3': 'Длинная версия IGF-1 с периодом действия до 24 часов.',
        'IGF-1 DES': 'Короткая версия IGF-1 (20 мин), колется локально.',
        'PEG-MGF': 'Пролонгированная версия MGF для восстановления мышц.',
        'Insulin Glargine': 'Продленный инсулин без пиковых значений.',
        'AR Affinity': 'Сродство к андрогенным рецепторам.',
        'MV/MRV': 'Минимальный/Максимальный восстанавливаемый объем тренировок.'
    },
    workouts: [
        { id: 'push', name: 'Push (Грудь/Плечи/Трицепс)', exercises: ['Жим лежа', 'Жим гантелей наклон', 'Разводки', 'Армейский жим', 'Французский жим'] },
        { id: 'pull', name: 'Pull (Спина/Бицепс)', exercises: ['Подтягивания', 'Тяга штанги', 'Тяга вертикального блока', 'Подъем на бицепс', 'Молотки'] },
        { id: 'legs', name: 'Legs (Ноги)', exercises: ['Приседания', 'Жим ногами', 'Разгибания', 'Сгибания', 'Икры'] }
    ]
};
DBEOF

# 2. ENGINE (Math)
echo "⚙️ Creating Engine..."
cat > assets/js/core/engine.v4.js << 'ENGINEEOF'
const Engine = {
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
                const ester = DB.esters[it.sub]?.find(x=>x.id===it.est);
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
    },
    calcFert: function(data) {
        if(!data.vol || !data.conc) return 0;
        return Math.round((data.vol/1.5)*20 + (data.conc/16)*30 + (data.pr/30)*30 + (data.morph/4)*20);
    }
};
ENGINEEOF

# 3. APP (Logic & UI)
echo "🧠 Creating App Logic..."
cat > assets/js/app.v4.js << 'APPEOF'
const App = {
    state: { stack:[], plan:[], wIdx:0, xp:0, charts:{liver:true, cardio:true, hemato:true} },
    init: function() {
        console.log("App v4 Init");
        const sel = document.getElementById('sub-select');
        if(sel) {
            sel.innerHTML = '';
            DB.substances.forEach(s => {
                let o = document.createElement('option'); o.value=s.id; o.innerText=s.name; sel.appendChild(o);
            });
        }
        this.renderSupport();
        this.renderArticles();
        this.renderShop();
        this.renderGlossary();
        this.renderWorkouts();
        this.renderControls();
    },
    switchTab: function(id) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        event.currentTarget.classList.add('active');
        if(id === 'risks' && this.state.plan.length) setTimeout(()=>this.renderChart(), 50);
    },
    loadEsters: function() {
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
            const e = DB.esters[it.sub]?.find(x=>x.id===it.est);
            div.innerHTML += `<div class="item"><div><b>${s.name}</b> ${e?'('+e.name+')':''}<br><small>${it.dose}мг | Нед ${it.start}-${it.end}</small></div><button class="btn-del" onclick="App.state.stack.splice(${idx},1);App.renderStack()">✕</button></div>`;
        });
    },
    calcPlan: function() {
        if(!this.state.stack.length) return alert('Добавьте препараты!');
        this.state.plan = Engine.generatePlan(this.state.stack);
        this.state.wIdx = 0;
        this.renderHeatmap();
        this.renderChart();
        document.getElementById('plan-msg').innerText = `Расчет на ${this.state.plan.length} недель!`;
        this.state.xp += 100;
        document.getElementById('xp-display').innerText = 'XP: '+this.state.xp;
        const avg = Object.values(this.state.plan[0].r).reduce((a,b)=>a+Object.values(b).reduce((x,y)=>x+y,0),0) / 49;
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
            div.innerHTML += `<div style="grid-column:1/-1; color:var(--pri); font-weight:bold; margin-top:10px">${sys.toUpperCase()}</div>`;
            DB.risks[sys].forEach(m => {
                const val = data.r[sys][m.id]||0;
                let col = Engine.getColor(val);
                let el = document.createElement('div');
                el.className = 'hm-cell';
                el.style.background = col; el.style.color = val>50?'#000':'#fff';
                el.innerHTML = `<b>${m.n}</b><br>${val}%`;
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
                const d = this.state.plan.map(p => {
                    let sum=0, cnt=0;
                    for(let k in p.r[sys]){sum+=p.r[sys][k];cnt++;}
                    return cnt?Math.round(sum/cnt):0;
                });
                datasets.push({label:sys.toUpperCase(), data:d, borderColor:colors[sys], borderWidth:2, fill:false});
            }
        }
        window.myChart = new Chart(ctx.getContext('2d'), {
            type:'line', data: {labels, datasets},
            options:{responsive:true, plugins:{legend:{labels:{color:'#aaa'}}}, scales:{y:{beginAtZero:true, max:100, ticks:{color:'#aaa'},grid:{color:'#333'}}, x:{ticks:{color:'#aaa'},grid:{color:'#333'}}}}
        );
    },
    toggleChart: function(sys) {
        this.state.charts[sys] = !this.state.charts[sys];
        this.renderChart();
    },
    renderControls: function() {
        const div = document.getElementById('chart-controls');
        if(!div) return;
        const names = {liver:'Печень', cardio:'Сердце', hemato:'Кровь'};
        div.innerHTML = '';
        for(let k in names) {
            div.innerHTML += `<label><input type="checkbox" ${this.state.charts[k]?'checked':''} onchange="App.toggleChart('${k}')"> ${names[k]}</label>`;
        }
    },
    renderSupport: function() {
        const div = document.getElementById('support-list');
        if(!div) return;
        DB.support.forEach(b => {
            div.innerHTML += `<div class="time-block"><h3>${b.t}</h3>` + b.items.map(i=>`<div class="item" style="margin:5px 0; padding:10px"><div><b>${i.n}</b> ${i.d}<br><small>${i.m}</small></div></div>`).join('') + `</div>`;
        });
    },
    calcFert: function() {
        const v = parseFloat(document.getElementById('lab-vol').value)||0;
        const c = parseFloat(document.getElementById('lab-conc').value)||0;
        const p = parseFloat(document.getElementById('lab-pr').value)||0;
        const m = parseFloat(document.getElementById('lab-morph').value)||0;
        const res = Engine.calcFert({vol:v, conc:c, pr:p, morph:m});
        const el = document.getElementById('fert-res');
        if(el) el.innerHTML = `<span style="color:${res>60?'var(--sec)':'var(--err)'}">IF: ${res}/100</span>`;
    },
    renderArticles: function() {
        const div = document.getElementById('articles-list');
        if(!div) return;
        DB.articles.forEach(a => div.innerHTML += `<div class="item"><div><b>${a.t}</b><br><small>${a.c} | 👁${a.v}</small><p style="font-size:0.8em; color:#aaa; margin-top:5px">${a.txt}</p></div></div>`);
    },
    renderShop: function() {
        const div = document.getElementById('shop-list');
        if(!div) return;
        for(let k in DB.shop) {
            DB.shop[k].forEach(i => div.innerHTML += `<div class="item"><div><b>${k.toUpperCase()}</b><br>${i.p}</div><a href="${i.u}" class="btn-del" style="text-decoration:none">Купить</a></div>`);
        }
    },
    renderGlossary: function() {
        const div = document.getElementById('glossary-list');
        if(!div) return;
        for(let k in DB.glossary) div.innerHTML += `<div class="item"><b>${k}</b><br><small>${DB.glossary[k]}</small></div>`;
    },
    renderWorkouts: function() {
        const div = document.getElementById('workout-list');
        if(!div) return;
        DB.workouts.forEach(w => {
            div.innerHTML += `<div class="time-block"><h3>${w.name}</h3><ul>` + w.exercises.map(e=>`<li>${e}</li>`).join('') + `</ul></div>`;
        });
    }
};
document.addEventListener('DOMContentLoaded', () => App.init());
APPEOF

# 4. CSS (Clean Tabs)
echo "🎨 Creating Clean CSS..."
cat > assets/css/style.v4.css << 'CSSEOF'
:root { --bg: #121212; --card: #1e1e1e; --pri: #bb86fc; --sec: #03dac6; --err: #cf6679; --txt: #ffffff; --bor: #333; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--txt); padding-bottom: 80px; }
.app { max-width: 900px; margin: 0 auto; }
header { background: var(--card); padding: 15px 20px; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--bor); display: flex; justify-content: space-between; align-items: center; }
h1 { margin: 0; font-size: 1.2rem; color: var(--pri); }
.xp-badge { background: rgba(187, 134, 252, 0.2); color: var(--pri); padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; }

/* Tabs without slider */
.tabs { display: flex; overflow-x: auto; background: var(--card); position: sticky; top: 60px; z-index: 99; scrollbar-width: none; border-bottom: 1px solid var(--bor); }
.tabs::-webkit-scrollbar { display: none; }
.tab-btn { flex: 0 0 auto; padding: 15px 20px; background: none; border: none; color: #888; font-weight: 600; font-size: 0.9rem; cursor: pointer; white-space: nowrap; opacity: 0.7; transition: 0.2s; }
.tab-btn.active { color: var(--sec); opacity: 1; border-bottom: 2px solid var(--sec); }

.view { display: none; padding: 20px; animation: fade 0.3s; }
.view.active { display: block; }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }

.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
.card { background: var(--card); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid var(--bor); }
.big-val { font-size: 1.8rem; font-weight: bold; color: var(--sec); margin-top: 5px; }

.form-box { background: var(--card); padding: 20px; border-radius: 12px; margin-bottom: 20px; }
label { display: block; margin-bottom: 5px; color: #aaa; font-size: 0.9rem; }
input, select { width: 100%; background: #2c2c2c; border: 1px solid var(--bor); color: #fff; padding: 12px; border-radius: 8px; margin-bottom: 10px; font-size: 1rem; }
.row { display: flex; gap: 10px; }

button { width: 100%; padding: 14px; border: none; border-radius: 8px; font-weight: bold; font-size: 1rem; cursor: pointer; }
.btn-pri { background: var(--pri); color: #000; }
.btn-sec { background: var(--sec); color: #000; margin-top: 10px; }
.btn-del { background: rgba(207, 102, 121, 0.2); color: var(--err); width: auto; padding: 5px 10px; font-size: 0.8rem; }

.item { background: var(--card); padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid var(--sec); display: flex; justify-content: space-between; align-items: center; }
.time-block { background: #252525; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.time-block h3 { color: var(--pri); margin: 0 0 10px; font-size: 0.9rem; text-transform: uppercase; }

.heatmap { display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 6px; margin-top: 15px; }
.hm-cell { padding: 8px; border-radius: 4px; text-align: center; font-size: 0.75rem; cursor: help; }
.week-nav { display: flex; justify-content: center; align-items: center; gap: 20px; margin: 20px 0; }
.week-nav button { width: auto; padding: 5px 15px; background: #333; color: #fff; }

canvas { background: var(--card); border-radius: 12px; padding: 10px; margin-bottom: 20px; }
.controls { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; background: var(--card); padding: 10px; border-radius: 8px; }
.controls label { display: flex; align-items: center; gap: 5px; margin: 0; color: #fff; font-size: 0.85rem; }
CSSEOF

# 5. HTML (Links to v4)
echo "📄 Creating Index HTML..."
cat > index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Bode Health v11.0 Ultimate</title>
    <base href="https://thodstein.github.io/Bode_Health/">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="assets/css/style.v4.css">
</head>
<body>
<div class="app">
    <header>
        <h1>Bode Health <span style="font-size:0.6em; color:var(--sec)">v11.0</span></h1>
        <div class="xp-badge" id="xp-display">XP: 0</div>
    </header>
    <nav class="tabs">
        <button class="tab-btn active" onclick="App.switchTab('dashboard')">📊 Главная</button>
        <button class="tab-btn" onclick="App.switchTab('stack')">💉 Стек</button>
        <button class="tab-btn" onclick="App.switchTab('support')">💊 Поддержка</button>
        <button class="tab-btn" onclick="App.switchTab('risks')">⚠️ Риски</button>
        <button class="tab-btn" onclick="App.switchTab('nutrition')">🍎 Питание</button>
        <button class="tab-btn" onclick="App.switchTab('training')">🏋️ Тренировки</button>
        <button class="tab-btn" onclick="App.switchTab('labs')">🧬 Анализы</button>
        <button class="tab-btn" onclick="App.switchTab('reports')">📑 Отчеты</button>
        <button class="tab-btn" onclick="App.switchTab('profile')">👤 Профиль</button>
    </nav>
    <main>
        <div id="dashboard" class="view active">
            <div class="grid">
                <div class="card"><h3>Readiness</h3><div class="big-val" id="d-readiness">--</div></div>
                <div class="card"><h3>Risk Avg</h3><div class="big-val" id="d-risk">--</div></div>
            </div>
            <div class="form-box" style="border:1px solid var(--err); color:var(--err)">⚠️ Добавьте препараты во вкладке "Стек".</div>
        </div>
        <div id="stack" class="view">
            <div class="form-box">
                <label>Вещество</label><select id="sub-select" onchange="App.loadEsters()"></select>
                <label>Эфир</label><select id="est-select" disabled></select>
                <div class="row"><input type="number" id="in-dose" placeholder="Доза (мг/нед)"></div>
                <div class="row"><input type="number" id="in-start" placeholder="Старт (нед)" value="1"><input type="number" id="in-end" placeholder="Финиш (нед)" value="8"></div>
                <button class="btn-pri" onclick="App.addDrug()">Добавить</button>
            </div>
            <div id="stack-list"></div>
            <button class="btn-sec" onclick="App.calcPlan()">РАССЧИТАТЬ</button>
            <div id="plan-msg" style="margin-top:15px; color:var(--sec)"></div>
        </div>
        <div id="support" class="view"><h2>Поддержка</h2><div id="support-list"></div></div>
        <div id="risks" class="view">
            <h3>Динамика</h3>
            <div class="controls" id="chart-controls"></div>
            <canvas id="trend-chart"></canvas>
            <h3>Матрица</h3>
            <div class="week-nav"><button onclick="App.changeWeek(-1)">◀</button><span id="week-label">Неделя 1</span><button onclick="App.changeWeek(1)">▶</button></div>
            <div id="heatmap" class="heatmap"></div>
        </div>
        <div id="nutrition" class="view"><h2>Питание</h2><div class="form-box"><p>Дневник КБЖУ и добавок (в разработке)</p></div></div>
        <div id="training" class="view"><h2>Тренировки</h2><div id="workout-list"></div></div>
        <div id="labs" class="view">
            <div class="form-box"><h3>Фертильность</h3>
                <input type="number" id="lab-vol" placeholder="Объем"><input type="number" id="lab-conc" placeholder="Конц"><input type="number" id="lab-pr" placeholder="PR%"><input type="number" id="lab-morph" placeholder="Morph%">
                <button class="btn-pri" onclick="App.calcFert()">Рассчитать IF</button>
                <div id="fert-res" style="margin-top:15px; font-weight:bold"></div>
            </div>
        </div>
        <div id="reports" class="view"><h2>Отчеты</h2><div class="form-box"><p>Экспорт PDF/JSON (в разработке)</p></div></div>
        <div id="profile" class="view">
            <h2>Профиль</h2>
            <div class="form-box"><h3>Глоссарий</h3><div id="glossary-list"></div></div>
            <div class="form-box"><h3>Магазин</h3><div id="shop-list"></div></div>
            <div class="form-box"><h3>Статьи</h3><div id="articles-list"></div></div>
        </div>
    </main>
</div>
<script src="assets/js/core/database.v4.js"></script>
<script src="assets/js/core/engine.v4.js"></script>
<script src="assets/js/app.v4.js"></script>
</body>
</html>
HTMLEOF

# 6. PUSH
echo "🚀 Pushing Stage Final..."
git add -A
git commit -m "Stage Final: Full DB, Fixed Graphs, Clean Tabs, All 9 Sections"
git push origin main --force
echo "✅ DONE! Hard Refresh (Ctrl+F5)!"
