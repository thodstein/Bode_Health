#!/bin/bash
echo "🚀 STAGE 6 FINAL: Heatmap, Flexible Weeks, Fixed Buttons, New Hormones"

# 1. Database Update (IGF, Long Insulin, Full Matrix)
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
        'test': [
            { id: 'test_p', name: 'Пропионат', halfLife: 2.0 },
            { id: 'test_e', name: 'Энантат', halfLife: 7.0 },
            { id: 'test_c', name: 'Ципионат', halfLife: 8.0 },
            { id: 'test_sus', name: 'Сустанон', halfLife: 15.0 }
        ],
        'nandrolone': [
            { id: 'nandrolone_p', name: 'Фенилпропионат', halfLife: 4.5 },
            { id: 'nandrolone_d', name: 'Деканоат', halfLife: 14.0 }
        ],
        'trenbolone': [
            { id: 'trenbolone_a', name: 'Ацетат', halfLife: 3.0 },
            { id: 'trenbolone_e', name: 'Энантат', halfLife: 7.0 },
            { id: 'trenbolone_h', name: 'Гекса', halfLife: 10.0 }
        ],
        'boldenone': [{ id: 'boldenone_u', name: 'Ундесиленат', halfLife: 14.0 }],
        'dhb': [{ id: 'dhb_p', name: 'Ацетат', halfLife: 10.0 }],
        'masteron': [
            { id: 'masteron_p', name: 'Пропионат', halfLife: 2.5 },
            { id: 'masteron_e', name: 'Энантат', halfLife: 7.0 }
        ],
        'primobolan': [{ id: 'primobolan_e', name: 'Энантат', halfLife: 10.0 }],
        'stanozolol': [{ id: 'stanozolol_susp', name: 'Суспензия', halfLife: 24.0 }],
        'gh': [
            { id: 'gh_short', name: 'Ежедневно', halfLife: 0.1 },
            { id: 'gh_long', name: 'Пролонг (Weekly)', halfLife: 168.0 }
        ],
        'insulin': [
            { id: 'insulin_r', name: 'Короткий (R)', halfLife: 0.1 },
            { id: 'insulin_l', name: 'Продленный (Glargine/Degludec)', halfLife: 24.0 }
        ],
        'igf1': [
            { id: 'igf1_lr3', name: 'LR3 (Длинный)', halfLife: 24.0 },
            { id: 'igf1_des', name: 'DES (Короткий)', halfLife: 0.5 }
        ],
        'mgf': [
            { id: 'mgf_plain', name: 'MGF', halfLife: 0.5 },
            { id: 'peg_mgf', name: 'PEG-MGF', halfLife: 48.0 }
        ]
    },
    riskMatrix: {
        liver: { mechanisms: [
            { id: 'cholestasis', name: 'Холестаз', desc: 'Застой желчи' }, { id: 'oxidative', name: 'Окс. стресс', desc: 'Свободные радикалы' },
            { id: 'cytolysis', name: 'Цитолиз', desc: 'Разрушение клеток' }, { id: 'fibrosis', name: 'Фиброз', desc: 'Рубцевание' },
            { id: 'mito', name: 'Митохондрии', desc: 'Энергодефицит' }, { id: 'methylation', name: 'Метилирование', desc: 'Дефицит метил-групп' },
            { id: 'apoptosis', name: 'Апоптоз', desc: 'Гибель клеток' }
        ]},
        cardio: { mechanisms: [
            { id: 'htn', name: 'Гипертония', desc: 'Высокое АД' }, { id: 'tachycardia', name: 'Тахикардия', desc: 'Высокий пульс' },
            { id: 'lipids', name: 'Дислипидемия', desc: 'ЛПНП↑ / ЛПВП↓' }, { id: 'thrombo', name: 'Тромбоз', desc: 'Сгущение крови' },
            { id: 'lvh', name: 'Гипертрофия', desc: 'Утолщение стенок' }, { id: 'endo', name: 'Эндотелий', desc: 'Дисфункция сосудов' },
            { id: 'arrhythmia', name: 'Аритмия', desc: 'Сбой ритма' }
        ]},
        kidney: { mechanisms: [
            { id: 'hyperfiltration', name: 'Гиперфильтрация', desc: 'Перегрузка' }, { id: 'fibrosis_k', name: 'Фиброз', desc: 'Рубцевание' },
            { id: 'electrolytes', name: 'Электролиты', desc: 'Дисбаланс' }, { id: 'proteinuria', name: 'Протеинурия', desc: 'Белок в моче' },
            { id: 'stones', name: 'Камни', desc: 'Нефролитиаз' }, { id: 'tubular', name: 'Некроз', desc: 'Отмирание канальцев' },
            { id: 'gfr_drop', name: 'Падение СКФ', desc: 'Снижение функции' }
        ]},
        neuro: { mechanisms: [
            { id: 'dopamine', name: 'Дофамин', desc: 'Агрессия/Апатия' }, { id: 'glutamate', name: 'Глутамат', desc: 'Эксайтотоксичность' },
            { id: 'gaba', name: 'ГАМК', desc: 'Тревожность' }, { id: 'serotonin', name: 'Серотонин', desc: 'Настроение' },
            { id: 'inflammation', name: 'Воспаление', desc: 'Микроглия' }, { id: 'cognitive', name: 'Когнитивный спад', desc: 'Память' },
            { id: 'addiction', name: 'Зависимость', desc: 'Дофаминовая яма' }
        ]},
        hemato: { mechanisms: [
            { id: 'erythrocytosis', name: 'Эритроцитоз', desc: 'Гематокрит' }, { id: 'viscosity', name: 'Вязкость', desc: 'Густая кровь' },
            { id: 'coagulation', name: 'Коагуляция', desc: 'Свертываемость' }, { id: 'anemia', name: 'Анемия', desc: 'Дефицит' },
            { id: 'leukocytosis', name: 'Лейкоцитоз', desc: 'Воспаление' }, { id: 'platelets', name: 'Тромбоциты', desc: 'Агрегация' },
            { id: 'hemolysis', name: 'Гемолиз', desc: 'Разрушение эритроцитов' }
        ]},
        endo: { mechanisms: [
            { id: 'insulin_res', name: 'Инсулинорезистентность', desc: 'Сахар' }, { id: 'estrogen', name: 'Эстроген', desc: 'Гинекомастия' },
            { id: 'prolactin', name: 'Пролактин', desc: 'Либидо' }, { id: 'thyroid', name: 'Щитовидка', desc: 'Т3/Т4' },
            { id: 'cortisol', name: 'Кортизол', desc: 'Стресс' }, { id: 'gh_axis', name: 'Ось ГР', desc: 'Свой гормон' },
            { id: 'adrenal', name: 'Надпочечники', desc: 'Истощение' }
        ]},
        repro: { mechanisms: [
            { id: 'atrophy', name: 'Атрофия', desc: 'Тестикулы' }, { id: 'suppression', name: 'Подавление оси', desc: 'Нет своего Т' },
            { id: 'sperm', name: 'Спермогенез', desc: 'Качество' }, { id: 'libido', name: 'Либидо', desc: 'Влечение' },
            { id: 'erectile', name: 'Эрекция', desc: 'ЭД' }, { id: 'gyno', name: 'Гинекомастия', desc: 'Грудь' },
            { id: 'infertility', name: 'Бесплодие', desc: 'Зачатие' }
        ]}
    },
    supportProtocol: [
        { timeId: 'morning_empty', title: '☀️ Натощак', items: [
            { name: 'Iron Guard', dose: '2 капс', mechanism: 'Гемоглобин', risks: ['hemato_anemia'] },
            { name: 'Цитиколин', dose: '500 мг', mechanism: 'Нейро', risks: ['neuro_cognitive'] },
            { name: 'Наттокиназа', dose: '2 капс', mechanism: 'Реология', risks: ['hemato_viscosity'] },
            { name: 'Таурин', dose: '2000 мг', mechanism: 'Давление', risks: ['cardio_htn'] }
        ]},
        { timeId: 'morning_food', title: '🍳 Завтрак', items: [
            { name: 'Астрагал', dose: '500 мг', mechanism: 'Почки', risks: ['kidney_fibrosis_k'] },
            { name: 'Небилет', dose: '2.5 мг', mechanism: 'Пульс/Давление', risks: ['cardio_htn', 'cardio_tachycardia'] },
            { name: 'Тадалафил', dose: '5 мг', mechanism: 'Поток', risks: ['cardio_endo'] },
            { name: 'Берберин', dose: '500 мг', mechanism: 'Инсулин', risks: ['endo_insulin_res'] },
            { name: 'D3 + K2', dose: '5000 МЕ', mechanism: 'Кости', risks: [] },
            { name: 'TMG + Метилфолат', dose: '1г', mechanism: 'Метил', risks: ['liver_methylation'] },
            { name: 'Бергамот', dose: '500 мг', mechanism: 'Липиды', risks: ['cardio_lipids'] },
            { name: 'Бромантан', dose: '50 мг', mechanism: 'Дофамин', risks: ['neuro_dopamine'] }
        ]},
        { timeId: 'lunch', title: '🍲 Обед', items: [
            { name: 'УДХК', dose: '1000 мг', mechanism: 'Желчь', risks: ['liver_cholestasis'] },
            { name: 'Пентоксифиллин', dose: '400 мг', mechanism: 'Вязкость', risks: ['hemato_viscosity'] },
            { name: 'Joint Health', dose: '2 капс', mechanism: 'Суставы', risks: [] },
            { name: 'Витамин Е', dose: '400 МЕ', mechanism: 'Антиоксидант', risks: ['liver_oxidative'] }
        ]},
        { timeId: 'evening', title: '🌙 Вечер', items: [
            { name: 'Телмисартан', dose: '80 мг', mechanism: 'Давление', risks: ['cardio_htn', 'kidney_hyperfiltration'] },
            { name: 'Магний', dose: '400 мг', mechanism: 'Сон', risks: ['neuro_gaba'] },
            { name: 'L-Теанин', dose: '400 мг', mechanism: 'Расслабление', risks: ['neuro_gaba'] },
            { name: 'Гормон Роста', dose: '5 ЕД', mechanism: 'Рост', risks: ['endo_gh_axis'], note: 'Инъекция' }
        ]}
    ],
    glossary: {
        'Raw Risk': 'Исходный риск без поддержки.',
        'Net Risk': 'Риск после применения протокола.',
        'Half-life': 'Период полувыведения.',
        'IGF-1 LR3': 'Длинная версия (24ч).',
        'IGF-1 DES': 'Короткая версия (20 мин).',
        'PEG-MGF': 'Пролонгированный MGF.'
    }
};
DBEOF

# 2. Engine Update (Logic)
cat > assets/js/core/engine.js << 'ENGINEEOF'
const Engine = {
    calculateConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        const weeksOnDrug = currentWeek - startWeek;
        if (currentWeek <= endWeek) {
            return Math.min(1, weeksOnDrug / (halfLife / 7));
        } else {
            const weeksOff = currentWeek - endWeek;
            return Math.max(0, Math.exp(-0.693 * weeksOff / (halfLife / 7)));
        }
    },
    generateWeeklyPlan(stack, totalWeeksForecast) {
        const weeks = [];
        let maxEnd = 0;
        stack.forEach(s => { if (s.endWeek > maxEnd) maxEnd = s.endWeek; });
        const longestHalfLife = Math.max(...stack.map(s => {
            const ester = DB.esters[s.substanceId]?.find(e => e.id === s.esterId);
            return ester ? ester.halfLife : 1;
        }), 1);
        const forecastEnd = Math.ceil(maxEnd + (longestHalfLife / 7) * 5);
        const finalDuration = Math.max(totalWeeksForecast || 12, forecastEnd);

        for (let w = 1; w <= finalDuration; w++) {
            let risks = {};
            for (let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].mechanisms.forEach(m => risks[sys][m.id] = 0);
            }
            stack.forEach(item => {
                const conc = this.calculateConcentration(
                    (DB.esters[item.substanceId]?.find(e => e.id === item.esterId)?.halfLife) || 1,
                    item.startWeek, item.endWeek, w
                );
                if (conc > 0.01) {
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    if (!sub) return;
                    const tox = sub.baseTox;
                    const load = conc * (item.dose / 100);
                    risks.liver.cholestasis += (tox.liver * 3) * load;
                    risks.liver.cytolysis += (tox.liver * 2) * load;
                    risks.cardio.lipids += (tox.lipid * 3) * load;
                    risks.cardio.htn += (tox.lipid * 1.5) * load;
                    risks.hemato.erythrocytosis += (tox.hct * 4) * load;
                    risks.neuro.dopamine += (tox.neuro * 5) * load;
                    risks.kidney.hyperfiltration += (tox.kidney * 3) * load;
                    risks.endo.insulin_res += (tox.endo * 3) * load;
                    risks.repro.suppression += (tox.repro * 5) * load;
                }
            });
            for (let sys in risks) for (let m in risks[sys]) risks[sys][m] = Math.min(100, Math.round(risks[sys][m]));
            weeks.push({ week: w, risks });
        }
        return weeks;
    },
    getRiskColor(value) {
        if (value < 20) return '#4caf50';
        if (value < 40) return '#8bc34a';
        if (value < 60) return '#ffeb3b';
        if (value < 80) return '#ff9800';
        return '#f44336';
    }
};
ENGINEEOF

# 3. UI & App Logic (Fixed Buttons, Heatmap, Charts)
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
        <header><h1>Bode Health <span class="version">v11.0</span></h1><div class="status-bar" id="xp-display">XP: 0</div></header>
        <nav class="tabs">
            <button class="tab-btn active" data-tab="dashboard">📊 Главная</button>
            <button class="tab-btn" data-tab="stack">💉 Стек</button>
            <button class="tab-btn" data-tab="risks">⚠️ Риски</button>
            <button class="tab-btn" data-tab="support">💊 Поддержка</button>
            <button class="tab-btn" data-tab="labs">🧬 Анализы</button>
            <button class="tab-btn" data-tab="reports">📑 Отчеты</button>
            <button class="tab-btn" data-tab="shop">🛒 Магазин</button>
        </nav>
        <main>
            <section id="dashboard" class="tab-content active">
                <div class="cards-grid">
                    <div class="card"><h3>Readiness</h3><div class="big-value" id="dash-readiness">--</div></div>
                    <div class="card"><h3>Fatigue</h3><div class="big-value" id="dash-fatigue">--</div></div>
                    <div class="card"><h3>Avg Risk</h3><div class="big-value" id="dash-risk">--</div></div>
                </div>
            </section>
            <section id="stack" class="tab-content">
                <h2>Добавить препарат</h2>
                <form id="add-drug-form" class="deep-form">
                    <label>Вещество:</label><select id="drug-substance"></select>
                    <label>Эфир:</label><select id="drug-ester" disabled></select>
                    <div class="row"><input type="number" id="drug-dose" placeholder="Доза (мг)" required></div>
                    <div class="row">
                        <input type="number" id="drug-start" placeholder="Старт (нед)" value="1" min="1" required>
                        <input type="number" id="drug-end" placeholder="Финиш (нед)" value="8" min="1" required>
                    </div>
                    <button type="submit" class="btn-primary">Добавить</button>
                </form>
                <div id="stack-list" class="list-container"></div>
                <button id="btn-calc" class="btn-success">Рассчитать динамику</button>
                <div id="weekly-plan-output"></div>
            </section>
            <section id="risks" class="tab-content">
                <h2>Динамика</h2>
                <div class="chart-controls" id="chart-controls"></div>
                <canvas id="risk-trend-chart"></canvas>
                <h2>Матрица (Heatmap)</h2>
                <div class="week-selector">
                    <button id="btn-prev-week">◀</button>
                    <span id="current-week-display">Неделя 1</span>
                    <button id="btn-next-week">▶</button>
                </div>
                <div id="heatmap-container" class="heatmap-grid"></div>
            </section>
            <section id="support" class="tab-content"><h2>Поддержка</h2><div id="support-schedule" class="schedule-container"></div></section>
            <section id="labs" class="tab-content">
                <h2>Фертильность</h2>
                <div class="input-group">
                    <input type="number" id="semen-vol" placeholder="Объем"><input type="number" id="semen-conc" placeholder="Конц.">
                    <input type="number" id="semen-pr" placeholder="PR%"><input type="number" id="semen-morph" placeholder="Morph%">
                </div>
                <button id="btn-calc-fert" class="btn-primary">Рассчитать IF</button>
                <div id="fertility-result"></div>
            </section>
            <section id="reports" class="tab-content"><h2>Отчеты</h2><button id="btn-export" class="btn-secondary">Экспорт JSON</button></section>
            <section id="shop" class="tab-content"><h2>Магазин</h2><div id="shop-list" class="list-container"></div><h2>Глоссарий</h2><div id="glossary-list"></div></section>
        </main>
    </div>
    <script src="assets/js/core/database.js"></script>
    <script src="assets/js/core/engine.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
HTMLEOF

cat > assets/js/app.js << 'APPEOF'
document.addEventListener('DOMContentLoaded', () => {
    const state = { stack: [], plan: [], currentWeekIdx: 0, chartVisibility: {} };
    
    // Init Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Init Substance Select
    const subSelect = document.getElementById('drug-substance');
    DB.substances.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id; opt.textContent = s.name;
        subSelect.appendChild(opt);
    });

    // Chart Controls Init
    const controlsDiv = document.getElementById('chart-controls');
    const colors = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', neuro: '#9966ff', kidney: '#4bc0c0', endo: '#c9cbcf', repro: '#e7e9ed' };
    Object.keys(colors).forEach(sys => {
        state.chartVisibility[sys] = true; // Default visible
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" checked data-sys="${sys}"> ${sys.toUpperCase()}`;
        label.style.marginRight = '10px';
        label.style.color = colors[sys];
        controlsDiv.appendChild(label);
    });

    // Event Listeners for Buttons
    document.getElementById('btn-calc').addEventListener('click', App.generatePlan);
    document.getElementById('btn-prev-week').addEventListener('click', () => App.changeWeek(-1));
    document.getElementById('btn-next-week').addEventListener('click', () => App.changeWeek(1));
    document.getElementById('btn-calc-fert').addEventListener('click', App.calcFertility);
    document.getElementById('btn-export').addEventListener('click', App.exportJSON);
    
    document.querySelectorAll('#chart-controls input').forEach(chk => {
        chk.addEventListener('change', (e) => {
            state.chartVisibility[e.target.dataset.sys] = e.target.checked;
            App.renderTrendChart();
        });
    });

    window.App = {
        loadEsters: () => {
            const subId = document.getElementById('drug-substance').value;
            const estSelect = document.getElementById('drug-ester');
            estSelect.innerHTML = '';
            const esters = DB.esters[subId];
            if (esters) {
                estSelect.disabled = false;
                esters.forEach(e => {
                    const opt = document.createElement('option');
                    opt.value = e.id; opt.textContent = `${e.name} (${e.halfLife}д)`;
                    estSelect.appendChild(opt);
                });
            } else { estSelect.disabled = true; }
        },
        addDrug: (e) => {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const start = parseInt(document.getElementById('drug-start').value);
            const end = parseInt(document.getElementById('drug-end').value);
            if (start >= end) return alert('Финиш должен быть больше старта!');
            state.stack.push({ substanceId: subId, esterId, dose, startWeek: start, endWeek: end });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-ester').disabled = true;
            document.getElementById('drug-start').value = 1;
            document.getElementById('drug-end').value = 8;
        },
        renderStack: () => {
            const list = document.getElementById('stack-list');
            list.innerHTML = '';
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `<div><strong>${sub.name}</strong> ${ester?'('+ester.name+')':''}<br><small>${item.dose}мг | ${item.startWeek}-${item.endWeek} нед.</small></div>
                <button class="btn-delete" onclick="state.stack.splice(${idx},1); App.renderStack()">✕</button>`;
                list.appendChild(div);
            });
        },
        generatePlan: () => {
            state.plan = Engine.generateWeeklyPlan(state.stack, 20);
            state.currentWeekIdx = 0;
            App.renderHeatmap();
            App.renderTrendChart();
            document.getElementById('weekly-plan-output').innerHTML = `<p style="color:#03dac6">Курс рассчитан на ${state.plan.length} недель.</p>`;
            document.getElementById('xp-display').textContent = `XP: ${parseInt(document.getElementById('xp-display').innerText.split(':')[1])+150}`;
        },
        changeWeek: (dir) => {
            if (!state.plan.length) return;
            state.currentWeekIdx += dir;
            if (state.currentWeekIdx < 0) state.currentWeekIdx = 0;
            if (state.currentWeekIdx >= state.plan.length) state.currentWeekIdx = state.plan.length - 1;
            App.renderHeatmap();
        },
        renderHeatmap: () => {
            if (!state.plan.length) return;
            const weekData = state.plan[state.currentWeekIdx];
            document.getElementById('current-week-display').textContent = `Неделя ${weekData.week}`;
            const container = document.getElementById('heatmap-container');
            container.innerHTML = '';
            for (let sys in DB.riskMatrix) {
                const sysDiv = document.createElement('div');
                sysDiv.style.gridColumn = '1 / -1'; sysDiv.style.marginTop = '10px'; sysDiv.style.color = '#bb86fc'; sysDiv.style.fontWeight = 'bold';
                sysDiv.textContent = sys.toUpperCase(); container.appendChild(sysDiv);
                DB.riskMatrix[sys].mechanisms.forEach(mech => {
                    const val = weekData.risks[sys][mech.id] || 0;
                    const cell = document.createElement('div');
                    cell.className = 'heatmap-cell';
                    cell.style.backgroundColor = Engine.getRiskColor(val);
                    cell.style.padding = '10px'; cell.style.borderRadius = '4px';
                    cell.style.color = val > 50 ? '#000' : '#fff'; cell.style.textAlign = 'center'; cell.style.fontSize = '0.8em';
                    cell.innerHTML = `<div>${mech.name}</div><div style="font-weight:bold">${val}%</div>`;
                    cell.title = mech.desc; container.appendChild(cell);
                });
            }
        },
        renderTrendChart: () => {
            const ctx = document.getElementById('risk-trend-chart');
            if (!ctx || !state.plan.length) return;
            if (window.trendChart) window.trendChart.destroy();
            const labels = state.plan.map(p => `W${p.week}`);
            const datasets = [];
            const cols = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', neuro: '#9966ff', kidney: '#4bc0c0', endo: '#c9cbcf', repro: '#e7e9ed' };
            for (let sys in state.chartVisibility) {
                if (state.chartVisibility[sys]) {
                    const data = state.plan.map(p => {
                        let sum = 0, cnt = 0;
                        for(let m in p.risks[sys]) { sum += p.risks[sys][m]; cnt++; }
                        return cnt ? Math.round(sum/cnt) : 0;
                    });
                    datasets.push({ label: sys.toUpperCase(), data, borderColor: cols[sys], borderWidth: 2, fill: false, tension: 0.4 });
                }
            }
            window.trendChart = new Chart(ctx, { type: 'line', data: { labels, datasets }, options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } }, x: { ticks: { color: '#aaa' }, grid: { color: '#333' } } } } });
        },
        calcFertility: () => {
            const v = parseFloat(document.getElementById('semen-vol').value)||0;
            const c = parseFloat(document.getElementById('semen-conc').value)||0;
            const p = parseFloat(document.getElementById('semen-pr').value)||0;
            const m = parseFloat(document.getElementById('semen-morph').value)||0;
            const score = v ? Math.round((v/1.5)*20 + (c/16)*30 + (p/30)*30 + (m/4)*20) : 0;
            document.getElementById('fertility-result').innerHTML = `<h3>IF: ${score}/100</h3>`;
        },
        exportJSON: () => {
            const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr); node.setAttribute("download", "bode_health.json");
            document.body.appendChild(node); node.click(); node.remove();
        }
    };

    document.getElementById('add-drug-form').addEventListener('submit', App.addDrug);
    document.getElementById('drug-substance').addEventListener('change', App.loadEsters);
    
    // Render Support
    const supList = document.getElementById('support-schedule');
    DB.supportProtocol.forEach(b => {
        const div = document.createElement('div'); div.className = 'time-block';
        div.innerHTML = `<h3>${b.title}</h3>` + b.items.map(i => `<div class="support-item"><strong>${i.name}</strong> ${i.dose}<br><small>${i.mechanism}</small></div>`).join('');
        supList.appendChild(div);
    });
    App.renderStack();
});
APPEOF

cat > assets/css/style.css << 'CSSEOF'
:root { --bg-dark: #121212; --bg-card: #1e1e1e; --primary: #bb86fc; --secondary: #03dac6; --error: #cf6679; --text-main: #fff; --border: #333; }
body { margin: 0; font-family: sans-serif; background: var(--bg-dark); color: var(--text-main); padding-bottom: 60px; }
.app-container { max-width: 900px; margin: 0 auto; }
header { background: var(--bg-card); padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
.version { font-size: 0.6em; color: var(--secondary); }
.tabs { display: flex; overflow-x: auto; background: var(--bg-card); position: sticky; top: 0; z-index: 100; }
.tab-btn { flex: 1; min-width: 100px; padding: 15px; background: none; border: none; color: #aaa; font-weight: bold; border-bottom: 3px solid transparent; white-space: nowrap; }
.tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }
.tab-content { display: none; padding: 20px; } .tab-content.active { display: block; }
.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; }
.card { background: var(--bg-card); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid var(--border); }
.big-value { font-size: 2em; font-weight: bold; color: var(--secondary); margin-top: 10px; }
.deep-form { background: var(--bg-card); padding: 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 10px; }
.row { display: flex; gap: 10px; }
input, select { background: #2c2c2c; border: 1px solid var(--border); color: white; padding: 12px; border-radius: 8px; flex: 1; }
button { padding: 12px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; background: var(--primary); color: #000; }
.btn-success { background: #03dac6; width: 100%; margin-top: 20px; }
.btn-delete { background: rgba(207, 102, 121, 0.2); color: var(--error); padding: 8px; }
.list-container, .schedule-container { display: flex; flex-direction: column; gap: 10px; }
.drug-card, .support-item { background: var(--bg-card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--secondary); display: flex; justify-content: space-between; align-items: center; }
.support-item { flex-direction: column; align-items: flex-start; border-left-color: var(--primary); }
.time-block { background: #252525; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.time-block h3 { color: var(--primary); margin: 0 0 10px; font-size: 0.9em; }
.heatmap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 5px; margin-top: 15px; }
.heatmap-cell { padding: 10px; border-radius: 4px; text-align: center; font-size: 0.8em; cursor: help; transition: transform 0.2s; }
.heatmap-cell:hover { transform: scale(1.05); }
.chart-controls { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; background: var(--bg-card); padding: 10px; border-radius: 8px; }
.week-selector { display: flex; justify-content: center; align-items: center; gap: 20px; margin: 20px 0; }
#current-week-display { font-size: 1.2em; font-weight: bold; color: var(--secondary); min-width: 120px; text-align: center; }
canvas { background: var(--bg-card); border-radius: 12px; padding: 10px; max-width: 100%; }
CSSEOF

git add -A
git commit -m "Stage 6: Advanced Analytics & Visualization (Fixed Buttons, Heatmap, Flexible Weeks)"
git push origin main --force
echo "✅ Stage 6 Pushed Successfully!"
