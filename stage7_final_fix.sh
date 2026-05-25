#!/bin/bash
set -e
echo "🔥 STAGE 7: FINAL FIX (Buttons, All Tabs, Full DB, Esters Logic)"

# 1. FULL DATABASE RESTORE (All substances, esters, support, shop, articles)
echo "💾 Restoring Full Database..."
cat > assets/js/core/database.js << 'DBEOF'
const DB = {
    substances: [
        { id: 'test', name: 'Тестостерон', class: 'AAS', baseTox: { liver: 1, lipid: 3, hct: 4, neuro: 0, kidney: 1, endo: 2, repro: 5 } },
        { id: 'nandrolone', name: 'Нандролон', class: 'AAS', baseTox: { liver: 1, lipid: 4, hct: 2, neuro: 0, kidney: 2, endo: 4, repro: 4 } },
        { id: 'trenbolone', name: 'Тренболон', class: 'AAS', baseTox: { liver: 2, lipid: 5, hct: 3, neuro: 5, kidney: 4, endo: 4, repro: 5 } },
        { id: 'boldenone', name: 'Болденон', class: 'AAS', baseTox: { liver: 1, lipid: 3, hct: 6, neuro: 0, kidney: 1, endo: 1, repro: 3 } },
        { id: 'dhb', name: 'Дигидроболденон (DHB)', class: 'AAS', baseTox: { liver: 1, lipid: 4, hct: 5, neuro: 0, kidney: 3, endo: 1, repro: 3 } },
        { id: 'masteron', name: 'Мастерон', class: 'AAS', baseTox: { liver: 1, lipid: 4, hct: 3, neuro: 0, kidney: 1, endo: 1, repro: 4 } },
        { id: 'primobolan', name: 'Примоболан', class: 'AAS', baseTox: { liver: 1, lipid: 3, hct: 2, neuro: 0, kidney: 1, endo: 1, repro: 2 } },
        { id: 'oxandrolone', name: 'Оксандролон', class: 'Oral', baseTox: { liver: 4, lipid: 5, hct: 1, neuro: 0, kidney: 1, endo: 1, repro: 2 } },
        { id: 'stanozolol', name: 'Станозолол', class: 'Oral/Inj', baseTox: { liver: 5, lipid: 5, hct: 2, neuro: 0, kidney: 2, endo: 1, repro: 3 } },
        { id: 'methandienone', name: 'Метандиенон', class: 'Oral', baseTox: { liver: 5, lipid: 4, hct: 3, neuro: 0, kidney: 1, endo: 3, repro: 3 } },
        { id: 'gh', name: 'Гормон Роста', class: 'Peptide', baseTox: { liver: 0, lipid: 2, hct: 0, neuro: 0, kidney: 1, endo: 5, repro: 0 } },
        { id: 'insulin', name: 'Инсулин', class: 'Hormone', baseTox: { liver: 0, lipid: 1, hct: 0, neuro: 0, kidney: 0, endo: 5, repro: 0 } },
        { id: 'igf1', name: 'IGF-1', class: 'Peptide', baseTox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kidney: 2, endo: 4, repro: 0 } },
        { id: 'mgf', name: 'MGF / PEG-MGF', class: 'Peptide', baseTox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kidney: 1, endo: 2, repro: 0 } }
    ],
    esters: {
        'test': [ { id: 'test_p', name: 'Пропионат', halfLife: 2.0 }, { id: 'test_e', name: 'Энантат', halfLife: 7.0 }, { id: 'test_c', name: 'Ципионат', halfLife: 8.0 }, { id: 'test_sus', name: 'Сустанон', halfLife: 15.0 } ],
        'nandrolone': [ { id: 'nandrolone_p', name: 'Фенилпропионат', halfLife: 4.5 }, { id: 'nandrolone_d', name: 'Деканоат', halfLife: 14.0 } ],
        'trenbolone': [ { id: 'trenbolone_a', name: 'Ацетат', halfLife: 3.0 }, { id: 'trenbolone_e', name: 'Энантат', halfLife: 7.0 }, { id: 'trenbolone_h', name: 'Гекса', halfLife: 10.0 } ],
        'boldenone': [ { id: 'boldenone_u', name: 'Ундесиленат', halfLife: 14.0 } ],
        'dhb': [ { id: 'dhb_p', name: 'Ацетат', halfLife: 10.0 } ],
        'masteron': [ { id: 'masteron_p', name: 'Пропионат', halfLife: 2.5 }, { id: 'masteron_e', name: 'Энантат', halfLife: 7.0 } ],
        'primobolan': [ { id: 'primobolan_e', name: 'Энантат', halfLife: 10.0 } ],
        'stanozolol': [ { id: 'stanozolol_susp', name: 'Суспензия', halfLife: 24.0 } ],
        'gh': [ { id: 'gh_short', name: 'Ежедневно', halfLife: 0.1 }, { id: 'gh_long', name: 'Пролонг', halfLife: 168.0 } ],
        'insulin': [ { id: 'insulin_r', name: 'Короткий (R)', halfLife: 0.1 }, { id: 'insulin_l', name: 'Продленный (Glargine)', halfLife: 24.0 } ],
        'igf1': [ { id: 'igf1_lr3', name: 'LR3 (Длинный)', halfLife: 24.0 }, { id: 'igf1_des', name: 'DES (Короткий)', halfLife: 0.5 } ],
        'mgf': [ { id: 'mgf_plain', name: 'MGF', halfLife: 0.5 }, { id: 'peg_mgf', name: 'PEG-MGF', halfLife: 48.0 } ]
    },
    riskMatrix: {
        liver: { mechanisms: [ {id:'cholestasis',name:'Холестаз'}, {id:'oxidative',name:'Окс.стресс'}, {id:'cytolysis',name:'Цитолиз'}, {id:'fibrosis',name:'Фиброз'}, {id:'mito',name:'Митохондрии'}, {id:'methylation',name:'Метилирование'}, {id:'apoptosis',name:'Апоптоз'} ] },
        cardio: { mechanisms: [ {id:'htn',name:'Гипертония'}, {id:'tachycardia',name:'Тахикардия'}, {id:'lipids',name:'Дислипидемия'}, {id:'thrombo',name:'Тромбоз'}, {id:'lvh',name:'Гипертрофия'}, {id:'endo',name:'Эндотелий'}, {id:'arrhythmia',name:'Аритмия'} ] },
        kidney: { mechanisms: [ {id:'hyperfiltration',name:'Гиперфильтрация'}, {id:'fibrosis_k',name:'Фиброз'}, {id:'electrolytes',name:'Электролиты'}, {id:'proteinuria',name:'Протеинурия'}, {id:'stones',name:'Камни'}, {id:'tubular',name:'Некроз'}, {id:'gfr_drop',name:'Падение СКФ'} ] },
        neuro: { mechanisms: [ {id:'dopamine',name:'Дофамин'}, {id:'glutamate',name:'Глутамат'}, {id:'gaba',name:'ГАМК'}, {id:'serotonin',name:'Серотонин'}, {id:'inflammation',name:'Воспаление'}, {id:'cognitive',name:'Когнитив'}, {id:'addiction',name:'Зависимость'} ] },
        hemato: { mechanisms: [ {id:'erythrocytosis',name:'Эритроцитоз'}, {id:'viscosity',name:'Вязкость'}, {id:'coagulation',name:'Коагуляция'}, {id:'anemia',name:'Анемия'}, {id:'leukocytosis',name:'Лейкоцитоз'}, {id:'platelets',name:'Тромбоциты'}, {id:'hemolysis',name:'Гемолиз'} ] },
        endo: { mechanisms: [ {id:'insulin_res',name:'Инсулинорезист.'}, {id:'estrogen',name:'Эстроген'}, {id:'prolactin',name:'Пролактин'}, {id:'thyroid',name:'Щитовидка'}, {id:'cortisol',name:'Кортизол'}, {id:'gh_axis',name:'Ось ГР'}, {id:'adrenal',name:'Надпочечники'} ] },
        repro: { mechanisms: [ {id:'atrophy',name:'Атрофия'}, {id:'suppression',name:'Подавление'}, {id:'sperm',name:'Спермогенез'}, {id:'libido',name:'Либидо'}, {id:'erectile',name:'Эрекция'}, {id:'gyno',name:'Гинекомастия'}, {id:'infertility',name:'Бесплодие'} ] }
    },
    supportProtocol: [
        { timeId: 'morning_empty', title: '☀️ Натощак', items: [ {name:'Iron Guard',dose:'2 капс',mechanism:'Гемоглобин'}, {name:'Цитиколин',dose:'500 мг',mechanism:'Нейро'}, {name:'Наттокиназа',dose:'2 капс',mechanism:'Реология'}, {name:'Таурин',dose:'2000 мг',mechanism:'Анти-спазм'} ] },
        { timeId: 'morning_food', title: '🍳 Завтрак', items: [ {name:'Астрагал',dose:'500 мг',mechanism:'Почки'}, {name:'Небилет',dose:'2.5 мг',mechanism:'Давление'}, {name:'Тадалафил',dose:'5 мг',mechanism:'Поток'}, {name:'Берберин',dose:'500 мг',mechanism:'Инсулин'}, {name:'D3+K2',dose:'5000 МЕ',mechanism:'Кости'}, {name:'TMG+Метилфолат',dose:'1г+1капс',mechanism:'Метил'}, {name:'Бергамот',dose:'500 мг',mechanism:'Липиды'}, {name:'Бромантан+Фасорацетам',dose:'50+100 мг',mechanism:'Дофамин/ГАМК'} ] },
        { timeId: 'lunch', title: '🍲 Обед', items: [ {name:'УДХК',dose:'1000 мг',mechanism:'Желчь'}, {name:'Пентоксифиллин',dose:'400 мг',mechanism:'Вязкость'}, {name:'Joint Health',dose:'2 капс',mechanism:'Суставы'}, {name:'Витамин Е',dose:'400 МЕ',mechanism:'Антиокс'} ] },
        { timeId: 'pre_workout', title: '💪 Предтреник', items: [ {name:'Агмантин',dose:'1000 мг',mechanism:'NO'} ] },
        { timeId: 'evening', title: '🌙 Вечер', items: [ {name:'Телмисартан',dose:'80 мг',mechanism:'Давление/Почки'}, {name:'Магний',dose:'400 мг',mechanism:'Расслабление'}, {name:'L-Теанин',dose:'400 мг',mechanism:'Сон'}, {name:'Гормон Роста',dose:'5 ЕД',mechanism:'Рост',note:'Инъекция'} ] }
    ],
    shopItems: {
        'udca': [{platform:'Ozon',price:'1500₽',url:'#'}, {platform:'iHerb',price:'$25',url:'#'}],
        'telmisartan': [{platform:'Apteka.ru',price:'600₽',url:'#'}],
        'nebivolol': [{platform:'Ozon',price:'400₽',url:'#'}],
        'berberine': [{platform:'iHerb',price:'$20',url:'#'}],
        'taurine': [{platform:'Ozon',price:'800₽',url:'#'}],
        'magnesium': [{platform:'Ozon',price:'900₽',url:'#'}]
    },
    articles: [
        { id: 1, title: 'Основы фармакокинетики', category: 'Theory', views: 120 },
        { id: 2, title: 'Протоколы защиты печени', category: 'Safety', views: 340 },
        { id: 3, title: 'IGF-1: LR3 vs DES', category: 'Peptides', views: 85 },
        { id: 4, title: 'Управление эстрогеном', category: 'Hormones', views: 210 }
    ],
    glossary: {
        'Raw Risk': 'Исходный риск без поддержки.',
        'Net Risk': 'Риск после применения протокола.',
        'Half-life': 'Период полувыведения.',
        'Hematocrit': 'Густота крови (>52% критично).',
        'IGF-1 LR3': 'Длинная версия (24ч).',
        'IGF-1 DES': 'Короткая версия (20 мин).',
        'PEG-MGF': 'Пролонгированный MGF.'
    }
};
DBEOF

# 2. ENGINE LOGIC (Fixed Calculations)
echo "⚙️ Updating Engine..."
cat > assets/js/core/engine.js << 'ENGINEEOF'
const Engine = {
    calculateConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        const weeksOn = currentWeek - startWeek;
        if (currentWeek <= endWeek) {
            return Math.min(1, weeksOn / (halfLife/7 + 1));
        } else {
            const weeksOff = currentWeek - endWeek;
            return Math.max(0, 1 - (weeksOff * 0.2)); 
        }
    },
    generateWeeklyPlan(stack) {
        let maxWeek = 12;
        stack.forEach(s => { if(s.endWeek > maxWeek) maxWeek = s.endWeek; });
        const totalWeeks = maxWeek + 6;
        const plan = [];
        for(let w=1; w<=totalWeeks; w++) {
            let risks = {};
            for(let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].mechanisms.forEach(m => risks[sys][m.id] = 0);
            }
            stack.forEach(item => {
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const hl = ester ? ester.halfLife : 1;
                const conc = this.calculateConcentration(hl, item.startWeek, item.endWeek, w);
                if(conc > 0.05) {
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    if(!sub) return;
                    const load = conc * (item.dose/100);
                    const t = sub.baseTox;
                    risks.liver.cholestasis += t.liver*3*load; risks.liver.cytolysis += t.liver*2*load;
                    risks.cardio.lipids += t.lipid*3*load; risks.cardio.htn += t.lipid*1.5*load;
                    risks.hemato.erythrocytosis += t.hct*4*load; risks.hemato.viscosity += t.hct*3*load;
                    risks.neuro.dopamine += t.neuro*5*load;
                    risks.kidney.hyperfiltration += t.kidney*3*load;
                    risks.endo.insulin_res += t.endo*3*load; risks.endo.estrogen += t.endo*2*load;
                    risks.repro.suppression += t.repro*5*load; risks.repro.atrophy += t.repro*4*load;
                }
            });
            for(let sys in risks) for(let m in risks[sys]) risks[sys][m] = Math.min(100, Math.round(risks[sys][m]));
            plan.push({week:w, risks});
        }
        return plan;
    },
    getRiskColor(v) { return v<20?'#4caf50':v<40?'#8bc34a':v<60?'#ffeb3b':v<80?'#ff9800':'#f44336'; }
};
ENGINEEOF

# 3. HTML WITH ALL TABS & FIXED ONCHANGE
echo "🎨 Rebuilding HTML with All Tabs..."
cat > index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bode Health v11.0</title>
    <base href="https://thodstein.github.io/Bode_Health/">
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="app-container">
        <header><h1>Bode Health <span>v11.0</span></h1><div id="xp-display">XP:0</div></header>
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
            <section id="dashboard" class="tab-content active"><div class="cards-grid"><div class="card"><h3>Readiness</h3><div id="dash-readiness" class="big-value">--</div></div><div class="card"><h3>Risk</h3><div id="dash-risk" class="big-value">--</div></div></div></section>
            
            <section id="stack" class="tab-content">
                <h2>Добавить препарат</h2>
                <form id="add-drug-form" onsubmit="App.addDrug(event)">
                    <label>Вещество:</label><select id="drug-substance" onchange="App.loadEsters()"></select>
                    <label>Эфир:</label><select id="drug-ester" disabled></select>
                    <div class="row"><input type="number" id="drug-dose" placeholder="Доза (мг)" required></div>
                    <div class="row"><input type="number" id="drug-start" placeholder="Старт (нед)" value="1" required><input type="number" id="drug-end" placeholder="Финиш (нед)" value="8" required></div>
                    <button type="submit" class="btn-primary">Добавить</button>
                </form>
                <div id="stack-list"></div>
                <button onclick="App.generatePlan()" class="btn-success">Рассчитать</button>
                <div id="weekly-plan-output"></div>
            </section>

            <section id="risks" class="tab-content">
                <h2>Динамика</h2>
                <div class="chart-controls">
                    <label><input type="checkbox" checked onchange="App.toggleChart('liver')"> Печень</label>
                    <label><input type="checkbox" checked onchange="App.toggleChart('cardio')"> Сердце</label>
                    <label><input type="checkbox" checked onchange="App.toggleChart('hemato')"> Кровь</label>
                </div>
                <canvas id="risk-trend-chart"></canvas>
                <h2>Матрица (Heatmap)</h2>
                <div class="week-selector"><button onclick="App.changeWeek(-1)">◀</button><span id="week-display">Неделя 1</span><button onclick="App.changeWeek(1)">▶</button></div>
                <div id="heatmap" class="heatmap-grid"></div>
            </section>

            <section id="support" class="tab-content"><h2>Поддержка</h2><div id="support-list"></div></section>
            <section id="labs" class="tab-content"><h2>Фертильность</h2><div class="input-group"><input id="semen-vol" placeholder="Объем"><input id="semen-conc" placeholder="Конц"><input id="semen-pr" placeholder="PR%"></div><button onclick="App.calcFertility()">Рассчитать</button><div id="fert-result"></div></section>
            
            <section id="articles" class="tab-content"><h2>Статьи</h2><div id="articles-list"></div></section>
            <section id="shop" class="tab-content"><h2>Магазин</h2><div id="shop-list"></div><h2>Глоссарий</h2><div id="glossary-list"></div></section>
        </main>
    </div>
    <script src="assets/js/core/database.js"></script>
    <script src="assets/js/core/engine.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
HTMLEOF

# 4. APP JS (Global Functions, Fixed Init)
echo "🧠 Rewriting App Logic (Global Scope Fix)..."
cat > assets/js/app.js << 'APPEOF'
const App = {
    state: { stack:[], plan:[], weekIdx:0, charts:{liver:true,cardio:true,hemato:true} },
    init: function() {
        // Fill Substance Select
        const sel = document.getElementById('drug-substance');
        if(sel) {
            sel.innerHTML = '';
            DB.substances.forEach(s => {
                const opt = document.createElement('option'); opt.value=s.id; opt.textContent=s.name; sel.appendChild(opt);
            });
        }
        this.renderSupport();
        this.renderArticles();
        this.renderShop();
        this.renderGlossary();
    },
    switchTab: function(id) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        event.target.classList.add('active');
    },
    loadEsters: function() {
        const subId = document.getElementById('drug-substance').value;
        const estSel = document.getElementById('drug-ester');
        estSel.innerHTML = '';
        const esters = DB.esters[subId];
        if(esters && esters.length > 0) {
            estSel.disabled = false;
            esters.forEach(e => {
                const opt = document.createElement('option'); opt.value=e.id; opt.textContent=e.name+' ('+e.halfLife+'д)'; estSel.appendChild(opt);
            });
        } else { estSel.disabled = true; }
    },
    addDrug: function(e) {
        e.preventDefault();
        const sub = document.getElementById('drug-substance').value;
        const est = document.getElementById('drug-ester').value;
        const dose = parseFloat(document.getElementById('drug-dose').value);
        const start = parseInt(document.getElementById('drug-start').value);
        const end = parseInt(document.getElementById('drug-end').value);
        if(start >= end) return alert('Финиш должен быть больше старта!');
        this.state.stack.push({substanceId:sub, esterId:est, dose, startWeek:start, endWeek:end});
        this.renderStack();
        e.target.reset();
        document.getElementById('drug-ester').disabled = true;
        document.getElementById('drug-start').value = 1;
        document.getElementById('drug-end').value = 8;
    },
    renderStack: function() {
        const list = document.getElementById('stack-list'); list.innerHTML = '';
        this.state.stack.forEach((item, idx) => {
            const sub = DB.substances.find(s=>s.id===item.substanceId);
            const est = DB.esters[item.substanceId]?.find(e=>e.id===item.esterId);
            list.innerHTML += `<div class="drug-card"><div><b>${sub?.name}</b> ${est?'('+est.name+)':''}<br>${item.dose}мг | ${item.startWeek}-${item.endWeek} нед</div><button class="btn-delete" onclick="App.state.stack.splice(${idx},1);App.renderStack()">✕</button></div>`;
        });
    },
    generatePlan: function() {
        this.state.plan = Engine.generateWeeklyPlan(this.state.stack);
        this.state.weekIdx = 0;
        this.renderHeatmap();
        this.renderChart();
        document.getElementById('weekly-plan-output').innerHTML = `<p style="color:#03dac6">Расчет на ${this.state.plan.length} недель</p>`;
        document.getElementById('dash-risk').textContent = Math.round(this.state.plan[0].risks.liver.cholestasis) + '%';
    },
    changeWeek: function(dir) {
        if(!this.state.plan.length) return;
        this.state.weekIdx += dir;
        if(this.state.weekIdx < 0) this.state.weekIdx = 0;
        if(this.state.weekIdx >= this.state.plan.length) this.state.weekIdx = this.state.plan.length-1;
        this.renderHeatmap();
    },
    toggleChart: function(sys) { this.state.charts[sys] = !this.state.charts[sys]; this.renderChart(); },
    renderHeatmap: function() {
        if(!this.state.plan.length) return;
        const data = this.state.plan[this.state.weekIdx];
        document.getElementById('week-display').textContent = 'Неделя '+data.week;
        const container = document.getElementById('heatmap'); container.innerHTML = '';
        for(let sys in DB.riskMatrix) {
            container.innerHTML += `<div style="grid-column:1/-1;color:#bb86fc;font-weight:bold;margin-top:10px">${sys.toUpperCase()}</div>`;
            DB.riskMatrix[sys].mechanisms.forEach(m => {
                const val = data.risks[sys][m.id]||0;
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                cell.style.backgroundColor = Engine.getRiskColor(val);
                cell.style.color = val>50?'#000':'#fff';
                cell.innerHTML = `<div>${m.name}</div><b>${val}%</b>`;
                container.appendChild(cell);
            });
        }
    },
    renderChart: function() {
        const ctx = document.getElementById('risk-trend-chart');
        if(!ctx || !this.state.plan.length) return;
        if(window.riskChart) window.riskChart.destroy();
        const labels = this.state.plan.map(p=>'W'+p.week);
        const datasets = [];
        const colors = {liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40'};
        for(let sys in this.state.charts) {
            if(this.state.charts[sys]) {
                const d = this.state.plan.map(p => {
                    let sum=0,cnt=0; for(let k in p.risks[sys]){sum+=p.risks[sys][k];cnt++;} return cnt?Math.round(sum/cnt):0;
                });
                datasets.push({label:sys.toUpperCase(), data:d, borderColor:colors[sys], borderWidth:2, fill:false});
            }
        }
        window.riskChart = new Chart(ctx, {type:'line', data:{labels, datasets}, options:{responsive:true, plugins:{legend:{labels:{color:'white'}}}, scales:{y:{ticks:{color:'#aaa'},grid:{color:'#333'}},x:{ticks:{color:'#aaa'},grid:{color:'#333'}}}});
    },
    renderSupport: function() {
        const list = document.getElementById('support-list'); list.innerHTML = '';
        DB.supportProtocol.forEach(b => {
            list.innerHTML += `<div class="time-block"><h3>${b.title}</h3>${b.items.map(i=>`<div class="support-item"><b>${i.name}</b> ${i.dose}<br><small>${i.mechanism}</small></div>`).join('')}</div>`;
        });
    },
    calcFertility: function() {
        const v=parseFloat(document.getElementById('semen-vol').value)||0;
        const c=parseFloat(document.getElementById('semen-conc').value)||0;
        const res = Math.round((v/1.5)*20 + (c/16)*30);
        document.getElementById('fert-result').innerHTML = `<h3>IF: ${res}/100</h3>`;
    },
    renderArticles: function() {
        const list = document.getElementById('articles-list'); list.innerHTML = '';
        DB.articles.forEach(a => list.innerHTML += `<div class="drug-card"><b>${a.title}</b><br><small>${a.category} | 👁${a.views}</small></div>`);
    },
    renderShop: function() {
        const list = document.getElementById('shop-list'); list.innerHTML = '';
        for(let k in DB.shopItems) {
            DB.shopItems[k].forEach(i => list.innerHTML += `<div class="drug-card"><b>${k}</b><br>${i.platform} ${i.price} <a href="${i.url}" class="btn-primary" style="padding:5px;font-size:0.8em">Buy</a></div>`);
        }
    },
    renderGlossary: function() {
        const list = document.getElementById('glossary-list'); list.innerHTML = '';
        for(let k in DB.glossary) list.innerHTML += `<div class="drug-card"><b>${k}</b><p>${DB.glossary[k]}</p></div>`;
    }
};
document.addEventListener('DOMContentLoaded', () => App.init());
APPEOF

# 5. CSS (Heatmap & Layout)
echo "🎨 Updating CSS..."
cat > assets/css/style.css << 'CSSEOF'
:root{--bg:#121212;--card:#1e1e1e;--pri:#bb86fc;--sec:#03dac6;--txt:#fff;--bor:#333}
body{margin:0;font-family:sans-serif;background:var(--bg);color:var(--txt)}
.app-container{max-width:900px;margin:0 auto}
header{background:var(--card);padding:20px;display:flex;justify-content:space-between;border-bottom:1px solid var(--bor)}
.tabs{display:flex;overflow-x:auto;background:var(--card);position:sticky;top:0;z-index:100}
.tab-btn{flex:1;min-width:100px;padding:15px;background:none;border:none;color:#aaa;font-weight:bold;border-bottom:3px solid transparent;cursor:pointer}
.tab-btn.active{color:var(--pri);border-bottom-color:var(--pri)}
.tab-content{display:none;padding:20px}
.tab-content.active{display:block}
.cards-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}
.card{background:var(--card);padding:20px;border-radius:12px;text-align:center}
.big-value{font-size:2em;font-weight:bold;color:var(--sec);margin-top:10px}
form{background:var(--card);padding:20px;border-radius:12px;display:flex;flex-direction:column;gap:10px}
.row{display:flex;gap:10px}
input,select{background:#2c2c2c;border:1px solid var(--bor);color:#fff;padding:12px;border-radius:8px;flex:1}
button{padding:12px;background:var(--pri);color:#000;border:none;border-radius:8px;font-weight:bold;cursor:pointer}
.btn-success{background:var(--sec);width:100%;margin-top:20px}
.btn-delete{background:rgba(207,102,121,0.2);color:#cf6679;padding:5px 10px}
.drug-card,.support-item,.time-block{background:var(--card);padding:15px;margin-bottom:10px;border-radius:8px;border-left:4px solid var(--sec)}
.heatmap-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:5px;margin-top:15px}
.heatmap-cell{padding:10px;border-radius:4px;text-align:center;font-size:0.8em;cursor:help}
.chart-controls{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:15px;background:var(--card);padding:10px;border-radius:8px}
.chart-controls label{display:flex;align-items:center;gap:5px;font-size:0.9em}
.week-selector{display:flex;justify-content:center;align-items:center;gap:20px;margin:20px 0}
canvas{background:var(--card);border-radius:12px;padding:10px}
CSSEOF

# 6. PUSH
echo "🚀 Committing Stage 7 Final Fix..."
git add -A
git commit -m "Stage 7: Final Fix (Buttons, All Tabs, Full DB, Esters Logic)"
git push origin main --force
echo "✅ DONE! Check Actions."
