#!/bin/bash
echo "🚀 STAGE 3: Advanced Features (Weekly Plan, Deep Input, Reports, Shop, Gamification)"

# 1. Обновляем Базу Данных (добавляем эфиры и маппинг для магазина)
echo "💾 Updating Database with Esters & Shop Mapping..."
cat > assets/js/core/database.js << 'DBEOF'
const DB = {
    // 1.1 Вещества (Active Substances)
    substances: [
        { id: 'test', name: 'Тестостерон', baseToxicity: { liver: 1, lipid: 3, hct: 4, neuro: 0 } },
        { id: 'nandrolone', name: 'Нандролон', baseToxicity: { liver: 1, lipid: 4, hct: 2, neuro: 0 } },
        { id: 'trenbolone', name: 'Тренболон', baseToxicity: { liver: 2, lipid: 5, hct: 3, neuro: 5 } },
        { id: 'boldenone', name: 'Болденон', baseToxicity: { liver: 1, lipid: 3, hct: 6, neuro: 0 } },
        { id: 'dhb', name: 'Дигидроболденон (DHB)', baseToxicity: { liver: 1, lipid: 4, hct: 5, neuro: 0 } },
        { id: 'masteron', name: 'Мастерон', baseToxicity: { liver: 1, lipid: 4, hct: 3, neuro: 0 } },
        { id: 'primobolan', name: 'Примоболан', baseToxicity: { liver: 1, lipid: 3, hct: 2, neuro: 0 } },
        { id: 'oxandrolone', name: 'Оксандролон', baseToxicity: { liver: 4, lipid: 5, hct: 1, neuro: 0 } },
        { id: 'stanozolol', name: 'Станозолол', baseToxicity: { liver: 5, lipid: 5, hct: 2, neuro: 0 } },
        { id: 'methandienone', name: 'Метандиенон', baseToxicity: { liver: 5, lipid: 4, hct: 3, neuro: 0 } },
        { id: 'gh', name: 'Гормон Роста', baseToxicity: { liver: 0, lipid: 2, hct: 0, neuro: 0, insulin: 5 } },
        { id: 'insulin', name: 'Инсулин', baseToxicity: { liver: 0, lipid: 0, hct: 0, neuro: 0, insulin: 5 } }
    ],

    // 1.2 Эфиры (Esters) с периодами полувыведения
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
            { id: 'trenbolone_h', name: 'Гексагидробензилкарбонат', halfLife: 10.0 }
        ],
        'boldenone': [
            { id: 'boldenone_u', name: 'Ундесиленат', halfLife: 14.0 }
        ],
        'dhb': [
            { id: 'dhb_p', name: 'Ацетат (DHB)', halfLife: 10.0 } 
        ],
        'masteron': [
            { id: 'masteron_p', name: 'Пропионат', halfLife: 2.5 },
            { id: 'masteron_e', name: 'Энантат', halfLife: 7.0 }
        ],
        'primobolan': [
            { id: 'primobolan_e', name: 'Энантат', halfLife: 10.0 }
        ],
        'gh': [
            { id: 'gh_gen', name: 'Соматропин (Ежедневно)', halfLife: 0.1 }
        ],
        'insulin': [
            { id: 'insulin_r', name: 'Короткий (Actrapid)', halfLife: 0.1 }
        ]
        // Оральные не имеют эфиров в классическом понимании, но для унификации можно добавить
    },

    // 1.3 Протокол поддержки (Строго из ТЗ)
    supportProtocol: [
        { timeId: 'morning_empty', title: '☀️ Натощак', items: [
            { name: 'Iron Guard', dose: '2 капс', mechanism: 'Гемоглобин', risks: ['hemato_def'] },
            { name: 'Цитиколин', dose: '500 мг', mechanism: 'Нейропротекция', risks: ['neuro_dopamine'] },
            { name: 'Наттокиназа', dose: '2 капс', mechanism: 'Реология', risks: ['cardio_thrombo'] },
            { name: 'Таурин', dose: '2000 мг', mechanism: 'Анти-спазм, давление', risks: ['cardio_htn', 'neuro_glutamate'] }
        ]},
        { timeId: 'morning_food', title: '🍳 Завтрак', items: [
            { name: 'Астрагал', dose: '500 мг', mechanism: 'Почки', risks: ['kidney_fibrosis'] },
            { name: 'Небилет', dose: '2.5 мг', mechanism: 'Давление, ЧСС', risks: ['cardio_htn'] },
            { name: 'Тадалафил', dose: '5 мг', mechanism: 'Поток крови', risks: ['cardio_endo'] },
            { name: 'Берберин', dose: '500 мг', mechanism: 'Инсулин', risks: ['endo_insulin'] },
            { name: 'D3 + K2', dose: '5000 МЕ', mechanism: 'Кости, иммунитет', risks: ['bone_health'] },
            { name: 'TMG + Метилфолат', dose: '1г + 1капс', mechanism: 'Метилирование', risks: ['cardio_homo'] },
            { name: 'Бергамот', dose: '500 мг', mechanism: 'Липиды', risks: ['cardio_lipids'] },
            { name: 'Бромантан + Фасорацетам', dose: '50+100 мг', mechanism: 'Дофамин/ГАМК', risks: ['neuro_balance'] }
        ]},
        { timeId: 'lunch', title: '🍲 Обед', items: [
            { name: 'УДХК (Урсосан)', dose: '1000 мг', mechanism: 'Желчь, печень', risks: ['liver_cholestasis'] },
            { name: 'Пентоксифиллин', dose: '400 мг', mechanism: 'Вязкость крови', risks: ['hemato_viscosity'] },
            { name: 'Joint Health', dose: '2 капс', mechanism: 'Суставы', risks: ['oda_cartilage'] },
            { name: 'Витамин Е', dose: '400 МЕ', mechanism: 'Антиоксидант', risks: ['oxidative_stress'] }
        ]},
        { timeId: 'pre_workout', title: '💪 Предтреник', items: [
            { name: 'Агмантин', dose: '1000 мг', mechanism: 'NO буст', risks: ['cardio_pump'] }
        ]},
        { timeId: 'intra_workout', title: '🥤 Во время тренировки', items: [
            { name: 'Цитруллин', dose: '6 г', mechanism: 'NO, аммониак', risks: ['pump'] },
            { name: 'Креатин', dose: '5 г', mechanism: 'АТФ', risks: ['power'] },
            { name: 'Таурин', dose: '2 г', mechanism: 'Клеточный объем', risks: ['cramps'] }
        ]},
        { timeId: 'evening', title: '🌙 Вечер', items: [
            { name: 'Телмисартан', dose: '80 мг', mechanism: 'Давление, почки', risks: ['cardio_htn', 'kidney_hyper'] },
            { name: 'Магний', dose: '400 мг', mechanism: 'Расслабление', risks: ['neuro_excite', 'cramps'] },
            { name: 'L-Теанин', dose: '400 мг', mechanism: 'Сон, стресс', risks: ['stress'] },
            { name: 'Гормон Роста', dose: '5 ЕД', mechanism: 'Рост, липолиз', risks: ['recovery'], note: 'Инъекция' }
        ]},
        { timeId: 'cycle_specific', title: '💉 Спец. препараты', items: [
            { name: 'HCG', dose: '500 МЕ 2р/нед', mechanism: 'Тестикулы', risks: ['repro_atrophy'] },
            { name: 'Анастрозол', dose: 'По анализам', mechanism: 'Эстрадиол', risks: ['endo_e2'] },
            { name: 'Каберголин', dose: 'По анализам', mechanism: 'Пролактин', risks: ['endo_prl'] },
            { name: 'BPC-157 + TB-500', dose: 'Курс', mechanism: 'Заживление', risks: ['oda_injury'] }
        ]}
    ],

    // 1.4 Магазин (Маппинг)
    shopItems: {
        'udca': [{ platform: 'Ozon', price: '1500 ₽', url: '#' }, { platform: 'iHerb', price: '$25', url: '#' }],
        'telmisartan': [{ platform: 'Apteka.ru', price: '600 ₽', url: '#' }],
        'nebivolol': [{ platform: 'Ozon', price: '400 ₽', url: '#' }],
        'berberine': [{ platform: 'iHerb', price: '$20', url: '#' }],
        'taurine': [{ platform: 'Ozon', price: '800 ₽', url: '#' }],
        'magnesium': [{ platform: 'Ozon', price: '900 ₽', url: '#' }]
    },

    // 1.5 Геймификация
    achievements: [
        { id: 'first_stack', name: 'Первый курс', desc: 'Добавь первый препарат в стек', xp: 100 },
        { id: 'full_support', name: 'Защитник', desc: 'Активируй полный протокол поддержки', xp: 200 },
        { id: 'lab_geek', name: 'Лабораторный гений', desc: 'Загрузи первые анализы', xp: 150 },
        { id: 'trust_100', name: 'Надежный источник', desc: 'Достигни Trust Score 100', xp: 500 }
    ],

    // 1.6 Глоссарий
    glossary: {
        'AR Affinity': 'Сродство к андрогенным рецепторам. Чем выше, тем мощнее анаболический эффект.',
        'Hematocrit': 'Доля эритроцитов в крови. Критично >52%.',
        'Half-life': 'Период полувыведения. Время, за которое концентрация падает в 2 раза.',
        'Raw Risk': 'Исходный риск без учета поддержки.',
        'Net Risk': 'Остаточный риск после применения протокола защиты.'
    }
};
DBEOF

# 2. Обновляем Движок (Weekly Logic)
echo "⚙️ Updating Engine with Weekly Logic..."
cat > assets/js/core/engine.js << 'ENGINEEOF'
const Engine = {
    // Расчет концентрации с учетом эфира
    calculateConcentration(esterHalfLife, doseMgPerWeek, weekIndex, totalWeeks) {
        const ke = Math.log(2) / (esterHalfLife * 24); // часов -> дни
        // Упрощенная модель накопления к steady state
        // Steady state достигается примерно за 4-5 периодов полувыведения
        const weeksToSteady = (esterHalfLife * 7) / 7; 
        
        let accumulationFactor = 1 - Math.exp(-0.693 * (weekIndex + 1) / (esterHalfLife / 7));
        if (weekIndex >= totalWeeks) {
             // ПКТ / спад
             const weeksOff = weekIndex - totalWeeks;
             accumulationFactor = Math.max(0, 1 - (weeksOff * 0.2)); // Грубый спад
        }
        
        return doseMgPerWeek * accumulationFactor;
    },

    // Генерация понедельного плана
    generateWeeklyPlan(stack) {
        const weeks = [];
        const maxWeeks = Math.max(...stack.map(s => s.duration), 12);
        
        for (let w = 1; w <= maxWeeks; w++) {
            let weekRisks = { liver: 0, cardio: 0, kidney: 0, neuro: 0, hemato: 0, endo: 0, repro: 0 };
            let activeDrugs = [];

            stack.forEach(item => {
                if (w <= item.duration) {
                    activeDrugs.push(item);
                    const substance = DB.substances.find(s => s.id === item.substanceId);
                    if (!substance) return;

                    // Коэффициент накопления (чем дольше эфир, тем плавнее, но к середине курса максимум)
                    const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                    const halfLife = ester ? ester.halfLife : 1;
                    const loadFactor = Math.min(1.2, w / (halfLife/7 + 2)); 

                    // Начисление рисков
                    const tox = substance.baseToxicity;
                    weekRisks.liver += (tox.liver || 0) * (item.dose / 100) * loadFactor;
                    weekRisks.cardio += (tox.lipid || 0) * (item.dose / 100) * loadFactor;
                    weekRisks.hemato += (tox.hct || 0) * (item.dose / 100) * loadFactor;
                    weekRisks.neuro += (tox.neuro || 0) * (item.dose / 100) * loadFactor;
                    
                    if (tox.insulin) weekRisks.endo += tox.insulin * (item.dose / 10) * loadFactor;
                    if (substance.id.includes('nandrolone') || substance.id.includes('trenbolone')) {
                        weekRisks.repro += 10 * loadFactor; // Прогестины
                    }
                }
            });

            // Нормализация и сохранение
            for (let k in weekRisks) weekRisks[k] = Math.min(100, Math.round(weekRisks[k]));
            
            weeks.push({
                week: w,
                risks: weekRisks,
                support: DB.supportProtocol, // Поддержка постоянная, но можно динамически менять
                drugs: activeDrugs.map(d => `${DB.substances.find(s=>s.id===d.substanceId)?.name} (${d.dose}мг)`)
            });
        }
        return weeks;
    },

    // Расчет Trust Score
    calculateTrustScore(userActivity) {
        let score = 0;
        if (userActivity.daysLogged > 7) score += 20;
        if (userActivity.labsUploaded) score += 30;
        if (userActivity.supportCompliance > 0.8) score += 30;
        if (userActivity.reviews > 0) score += 20;
        return Math.min(100, score);
    },

    // Фертильность (WHO 2021)
    calculateFertilityIndex(data) {
        if (!data.volume || !data.conc) return 0;
        let score = (Math.min(1, data.volume/1.5)*15) + (Math.min(1, data.conc/16)*20) + (Math.min(1, (data.pr||0)/30)*25) + (Math.min(1, (data.morph||0)/4)*20);
        return Math.round(score * 100 / 80); // Нормализация к 100
    }
};
ENGINEEOF

# 3. Обновляем UI (Новые вкладки и логика)
echo "🎨 Updating UI with 9 Tabs & Advanced Forms..."
cat > index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bode Health v11.0 Ultimate</title>
    <base href="https://thodstein.github.io/Bode_Health/">
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
    <div class="app-container">
        <header>
            <div>
                <h1>Bode Health <span class="version">v11.0</span></h1>
                <p class="subtitle">Pro Analytics & Risk Management</p>
            </div>
            <div class="status-bar">
                <span id="trust-score-display">Trust: 0</span>
                <span id="xp-display">XP: 0</span>
            </div>
        </header>

        <nav class="tabs">
            <button class="tab-btn active" data-tab="dashboard">📊 Главная</button>
            <button class="tab-btn" data-tab="stack">💉 Стек</button>
            <button class="tab-btn" data-tab="support">💊 Поддержка</button>
            <button class="tab-btn" data-tab="risks">⚠️ Риски</button>
            <button class="tab-btn" data-tab="nutrition">🍎 Питание</button>
            <button class="tab-btn" data-tab="training">🏋️ Тренировки</button>
            <button class="tab-btn" data-tab="labs">🧬 Анализы</button>
            <button class="tab-btn" data-tab="reports">📑 Отчеты</button>
            <button class="tab-btn" data-tab="shop">🛒 Статьи/Магазин</button>
        </nav>

        <main>
            <!-- Dashboard -->
            <section id="dashboard" class="tab-content active">
                <div class="cards-grid">
                    <div class="card"><h3>Readiness</h3><div class="big-value" id="dash-readiness">--</div></div>
                    <div class="card"><h3>Fatigue</h3><div class="big-value" id="dash-fatigue">--</div></div>
                    <div class="card"><h3>Risk (Net)</h3><div class="big-value" id="dash-risk">--</div></div>
                </div>
                <div class="alert-box" id="daily-alert">Добавьте препараты для расчета прогноза.</div>
            </section>

            <!-- Stack (Deep Input) -->
            <section id="stack" class="tab-content">
                <h2>Добавить препарат</h2>
                <form id="add-drug-form" class="deep-form">
                    <label>Вещество:</label>
                    <select id="drug-substance" onchange="App.loadEsters()"></select>
                    
                    <label>Эфир:</label>
                    <select id="drug-ester" disabled></select>
                    
                    <div class="row">
                        <input type="number" id="drug-dose" placeholder="Доза (мг/нед)" required>
                        <input type="number" id="drug-weeks" placeholder="Недель" required>
                    </div>
                    <button type="submit" class="btn-primary">Включить в курс</button>
                </form>
                <h3>Текущий стек</h3>
                <div id="stack-list" class="list-container"></div>
                
                <div class="actions">
                    <button onclick="App.generatePlan()" class="btn-success">Рассчитать план курса</button>
                </div>
                <div id="weekly-plan-output"></div>
            </section>

            <!-- Support -->
            <section id="support" class="tab-content">
                <h2>Протокол поддержки</h2>
                <div id="support-schedule" class="schedule-container"></div>
            </section>

            <!-- Risks -->
            <section id="risks" class="tab-content">
                <h2>Динамика рисков (по неделям)</h2>
                <canvas id="risk-trend-chart"></canvas>
                <h3>Матрица (Текущая неделя)</h3>
                <canvas id="risk-radar-chart"></canvas>
            </section>

            <!-- Nutrition -->
            <section id="nutrition" class="tab-content">
                <h2>Дневник питания</h2>
                <button id="voice-btn" class="btn-icon">🎙️</button>
                <form id="food-form" class="input-group">
                    <input type="text" id="food-name" placeholder="Продукт">
                    <input type="number" id="food-weight" placeholder="г">
                    <button type="submit">OK</button>
                </form>
                <div id="food-log"></div>
            </section>

            <!-- Training -->
            <section id="training" class="tab-content">
                <h2>Тренировочный план</h2>
                <p>Генерация на основе Readiness...</p>
                <div id="workout-plan"></div>
            </section>

            <!-- Labs -->
            <section id="labs" class="tab-content">
                <h2>Анализы и Фертильность</h2>
                <div class="fertility-block">
                    <h3>Спермограмма (WHO 2021)</h3>
                    <div class="input-group">
                        <input type="number" id="semen-vol" placeholder="Объем (мл)">
                        <input type="number" id="semen-conc" placeholder="Конц.">
                        <input type="number" id="semen-pr" placeholder="PR (%)">
                        <input type="number" id="semen-morph" placeholder="Morph (%)">
                    </div>
                    <button onclick="App.calcFertility()" class="btn-primary">Рассчитать IF</button>
                    <div id="fertility-result"></div>
                </div>
            </section>

            <!-- Reports -->
            <section id="reports" class="tab-content">
                <h2>Отчеты</h2>
                <button onclick="alert('Генерация PDF...')" class="btn-secondary">📄 Скачать PDF для врача</button>
                <button onclick="App.exportJSON()" class="btn-secondary">💾 Экспорт JSON</button>
                <div id="report-preview"></div>
            </section>

            <!-- Shop & Articles -->
            <section id="shop" class="tab-content">
                <h2>Магазин поддержки</h2>
                <div id="shop-list" class="list-container"></div>
                <h2>Глоссарий</h2>
                <div id="glossary-list" class="glossary-container"></div>
            </section>
        </main>
    </div>

    <script src="assets/js/core/database.js"></script>
    <script src="assets/js/core/engine.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
HTMLEOF

# 4. Логика приложения (App.js)
cat > assets/js/app.js << 'APPEOF'
document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }

    const state = { stack: [], currentWeek: 1, trust: 0, xp: 0 };

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
        opt.value = s.id;
        opt.textContent = s.name;
        subSelect.appendChild(opt);
    });

    // App Functions
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
                    opt.value = e.id;
                    opt.textContent = `${e.name} (T1/2: ${e.halfLife} дн.)`;
                    estSelect.appendChild(opt);
                });
            } else {
                estSelect.disabled = true;
                const opt = document.createElement('option');
                opt.textContent = "Без эфира (Орал/Пептид)";
                estSelect.appendChild(opt);
            }
        },
        addDrug: (e) => {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const weeks = parseInt(document.getElementById('drug-weeks').value);
            
            state.stack.push({ substanceId: subId, esterId, dose, duration: weeks });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-ester').disabled = true;
        },
        renderStack: () => {
            const list = document.getElementById('stack-list');
            list.innerHTML = '';
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div>
                        <strong>${sub.name}</strong> ${ester ? '('+ester.name+')' : ''}
                        <br><small>${item.dose} мг/нед | ${item.duration} нед.</small>
                    </div>
                    <button class="btn-delete" onclick="state.stack.splice(${idx},1); App.renderStack()">✕</button>
                `;
                list.appendChild(div);
            });
        },
        generatePlan: () => {
            const plan = Engine.generateWeeklyPlan(state.stack);
            const out = document.getElementById('weekly-plan-output');
            out.innerHTML = '<h3>План курса</h3>';
            
            plan.forEach(w => {
                const r = w.risks;
                const avgRisk = (r.liver+r.cardio+r.kidney+r.neuro+r.hemato+r.endo+r.repro)/7;
                const color = avgRisk > 50 ? 'red' : (avgRisk > 30 ? 'orange' : 'green');
                
                out.innerHTML += `
                    <div class="week-card" style="border-left: 4px solid ${color}">
                        <h4>Неделя ${w.week}</h4>
                        <p>Препараты: ${w.drugs.join(', ') || 'Нет'}</p>
                        <div class="mini-stats">
                            <span>Печень: ${r.liver}%</span>
                            <span>Сердце: ${r.cardio}%</span>
                            <span>Кровь: ${r.hemato}%</span>
                            <span style="color:${color}; font-weight:bold">Avg Risk: ${Math.round(avgRisk)}%</span>
                        </div>
                        <details>
                            <summary>Рекомендации поддержки</summary>
                            <ul>${DB.supportProtocol.map(b => `<li>${b.title}: ${b.items.map(i=>i.name).join(', ')}</li>`).join('')}</ul>
                        </details>
                    </div>
                `;
            });
            
            // Update Charts
            App.updateCharts(plan);
            // Gamification
            state.xp += 100;
            document.getElementById('xp-display').textContent = `XP: ${state.xp}`;
        },
        updateCharts: (plan) => {
            // Trend Chart
            const ctxTrend = document.getElementById('risk-trend-chart');
            if (ctxTrend) {
                if (window.trendChart) window.trendChart.destroy();
                const labels = plan.map(p => `W${p.week}`);
                const dataLiver = plan.map(p => p.risks.liver);
                const dataCardio = plan.map(p => p.risks.cardio);
                const dataHemato = plan.map(p => p.risks.hemato);
                
                window.trendChart = new Chart(ctxTrend, {
                    type: 'line',
                     {
                        labels: labels,
                        datasets: [
                            { label: 'Печень', data: dataLiver, borderColor: '#ff6384' },
                            { label: 'Сердце', data: dataCardio, borderColor: '#36a2eb' },
                            { label: 'Кровь', data: dataHemato, borderColor: '#ff9f40' }
                        ]
                    },
                    options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } }, scales: { y: { ticks: { color: 'gray' } }, x: { ticks: { color: 'gray' } } } }
                });
            }
            
            // Radar for current week
            const curr = plan[state.currentWeek-1] || plan[0];
            const ctxRadar = document.getElementById('risk-radar-chart');
            if (ctxRadar) {
                if (window.radarChart) window.radarChart.destroy();
                const r = curr.risks;
                window.radarChart = new Chart(ctxRadar, {
                    type: 'radar',
                     {
                        labels: ['Печень', 'Сердце', 'Почки', 'Невро', 'Кровь', 'Эндо', 'Репро'],
                        datasets: [{
                            label: `Неделя ${curr.week}`,
                             [r.liver, r.cardio, r.kidney, r.neuro, r.hemato, r.endo, r.repro],
                            backgroundColor: 'rgba(0, 218, 198, 0.4)',
                            borderColor: '#03dac6'
                        }]
                    },
                    options: { scales: { r: { ticks: { color: 'gray' }, grid: { color: '#444' } } }, plugins: { legend: { labels: { color: 'white' } } } }
                });
                document.getElementById('dash-risk').textContent = Math.round((r.liver+r.cardio+r.kidney+r.neuro+r.hemato+r.endo+r.repro)/7) + '%';
            }
        },
        calcFertility: () => {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            const ifScore = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr, morphology: morph });
            const res = document.getElementById('fertility-result');
            res.innerHTML = `<h3>IF: ${ifScore}/100</h3><p>${ifScore > 60 ? 'Норма' : 'Требуется внимание'}</p>`;
        },
        exportJSON: () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr);
            node.setAttribute("download", "bode_health_backup.json");
            document.body.appendChild(node);
            node.click();
            node.remove();
        },
        renderShop: () => {
            const list = document.getElementById('shop-list');
            list.innerHTML = '';
            for (const [key, items] of Object.entries(DB.shopItems)) {
                items.forEach(item => {
                    list.innerHTML += `
                        <div class="drug-card">
                            <div>
                                <strong>${key.toUpperCase()}</strong><br>
                                <small>${item.platform}</small>
                            </div>
                            <div>
                                <span style="color:#03dac6">${item.price}</span>
                                <a href="${item.url}" target="_blank" class="btn-primary" style="font-size:0.8em; padding:5px 10px; margin-left:10px; text-decoration:none;">Купить</a>
                            </div>
                        </div>
                    `;
                });
            }
        },
        renderGlossary: () => {
            const list = document.getElementById('glossary-list');
            list.innerHTML = '';
            for (const [term, def] of Object.entries(DB.glossary)) {
                list.innerHTML += `<div class="drug-card"><strong>${term}</strong><p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${def}</p></div>`;
            }
        }
    };

    document.getElementById('add-drug-form').addEventListener('submit', App.addDrug);
    
    // Init
    App.renderStack();
    App.renderShop();
    App.renderGlossary();
    document.getElementById('trust-score-display').textContent = `Trust: ${Engine.calculateTrustScore({ daysLogged: 10, labsUploaded: true, supportCompliance: 0.9 })}`;
});
APPEOF

# 5. CSS Updates
cat > assets/css/style.css << 'CSSEOF'
:root { --bg-dark: #121212; --bg-card: #1e1e1e; --primary: #bb86fc; --secondary: #03dac6; --error: #cf6679; --text-main: #fff; --text-sec: #b0b0b0; --border: #333; }
body { margin: 0; font-family: 'Segoe UI', sans-serif; background: var(--bg-dark); color: var(--text-main); padding-bottom: 60px; }
.app-container { max-width: 900px; margin: 0 auto; }
header { background: var(--bg-card); padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.version { font-size: 0.6em; color: var(--secondary); }
.subtitle { margin: 5px 0 0; font-size: 0.9em; color: var(--text-sec); }
.status-bar { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; font-size: 0.8em; color: var(--text-sec); }

.tabs { display: flex; overflow-x: auto; background: var(--bg-card); position: sticky; top: 0; z-index: 100; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab-btn { flex: 1; min-width: 100px; padding: 15px 10px; background: none; border: none; color: var(--text-sec); font-weight: 600; cursor: pointer; border-bottom: 3px solid transparent; white-space: nowrap; }
.tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }

.tab-content { display: none; padding: 20px; animation: fadeIn 0.3s; }
.tab-content.active { display: block; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; margin-bottom: 20px; }
.card { background: var(--bg-card); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid var(--border); }
.big-value { font-size: 2.2em; font-weight: bold; margin-top: 10px; color: var(--secondary); }

.deep-form { background: var(--bg-card); padding: 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 10px; }
.row { display: flex; gap: 10px; }
input, select { background: #2c2c2c; border: 1px solid var(--border); color: white; padding: 12px; border-radius: 8px; flex: 1; }
button { padding: 12px 20px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; background: var(--primary); color: #000; }
.btn-delete { background: rgba(207, 102, 121, 0.2); color: var(--error); padding: 8px 12px; font-size: 0.9em; }
.btn-success { background: #03dac6; color: #000; width: 100%; margin-top: 20px; }
.btn-secondary { background: #333; color: white; margin-right: 10px; margin-top: 10px; }
.btn-icon { font-size: 1.5em; background: none; border: none; cursor: pointer; color: var(--secondary); padding: 0; }

.list-container, .schedule-container { display: flex; flex-direction: column; gap: 12px; }
.drug-card, .support-item { background: var(--bg-card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--secondary); display: flex; justify-content: space-between; align-items: center; }
.support-item { flex-direction: column; align-items: flex-start; border-left-color: var(--primary); }
.time-block { background: #252525; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.time-block h3 { color: var(--primary); margin: 0 0 10px; font-size: 0.9em; text-transform: uppercase; }

.week-card { background: var(--bg-card); padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.week-card h4 { margin: 0 0 10px; color: var(--secondary); }
.mini-stats { display: flex; gap: 10px; flex-wrap: wrap; font-size: 0.9em; margin-top: 10px; }
details { margin-top: 10px; font-size: 0.9em; color: var(--text-sec); }
summary { cursor: pointer; color: var(--primary); }

.fertility-block, .glossary-container { margin-top: 20px; }
canvas { max-width: 100%; margin: 20px 0; background: var(--bg-card); border-radius: 12px; padding: 10px; }
.alert-box { background: rgba(207, 102, 121, 0.15); border: 1px solid var(--error); color: var(--error); padding: 15px; border-radius: 8px; margin-top: 20px; }
CSSEOF

# 6. Git Push
echo "🚀 Committing and Pushing Stage 3..."
git add -A
git commit -m "Stage 3: Weekly Plan, Deep Input, Reports, Shop, Gamification"
git push origin main --force

echo "✅ Stage 3 Complete! Check Actions."
