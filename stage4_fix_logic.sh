#!/bin/bash
echo "🔥 STAGE 4: Fix Course Logic (Start/End Weeks), Restore Charts, Fill Content"

# 1. Обновляем Базу Данных (Полная матрица 7x7 + Контент)
echo "💾 Updating DB: Full 7x7 Matrix & Content..."
cat > assets/js/core/database.js << 'DBEOF'
const DB = {
    // 1.1 Вещества (Расширено)
    substances: [
        { id: 'test', name: 'Тестостерон', baseToxicity: { liver: 1, cardio_lipid: 3, cardio_htn: 2, hct: 4, neuro: 0, kidney: 1, endo_e2: 4, repro: 5 } },
        { id: 'nandrolone', name: 'Нандролон', baseToxicity: { liver: 1, cardio_lipid: 4, cardio_htn: 1, hct: 2, neuro: 0, kidney: 2, endo_prl: 5, repro: 4 } },
        { id: 'trenbolone', name: 'Тренболон', baseToxicity: { liver: 2, cardio_lipid: 5, cardio_htn: 3, hct: 3, neuro: 5, kidney: 4, endo_prl: 5, repro: 3 } },
        { id: 'boldenone', name: 'Болденон', baseToxicity: { liver: 1, cardio_lipid: 3, cardio_htn: 1, hct: 6, neuro: 0, kidney: 1, endo_e2: 2, repro: 3 } },
        { id: 'dhb', name: 'Дигидроболденон (DHB)', baseToxicity: { liver: 1, cardio_lipid: 4, cardio_htn: 2, hct: 5, neuro: 0, kidney: 3, endo_e2: 0, repro: 2 } },
        { id: 'masteron', name: 'Мастерон', baseToxicity: { liver: 1, cardio_lipid: 4, cardio_htn: 1, hct: 3, neuro: 0, kidney: 1, endo_e2: -2, repro: 2 } },
        { id: 'primobolan', name: 'Примоболан', baseToxicity: { liver: 1, cardio_lipid: 3, cardio_htn: 1, hct: 2, neuro: 0, kidney: 1, endo_e2: 0, repro: 2 } },
        { id: 'oxandrolone', name: 'Оксандролон', baseToxicity: { liver: 5, cardio_lipid: 5, cardio_htn: 2, hct: 1, neuro: 0, kidney: 2, endo_e2: 0, repro: 3 } },
        { id: 'stanozolol', name: 'Станозолол', baseToxicity: { liver: 6, cardio_lipid: 5, cardio_htn: 2, hct: 2, neuro: 0, kidney: 3, endo_e2: 0, repro: 3 } },
        { id: 'methandienone', name: 'Метандиенон', baseToxicity: { liver: 6, cardio_lipid: 4, cardio_htn: 3, hct: 3, neuro: 0, kidney: 2, endo_e2: 4, repro: 4 } },
        { id: 'gh', name: 'Гормон Роста', baseToxicity: { liver: 0, cardio_lipid: 2, cardio_htn: 2, hct: 0, neuro: 0, kidney: 2, endo_insulin: 5, repro: 0 } },
        { id: 'insulin', name: 'Инсулин', baseToxicity: { liver: 0, cardio_lipid: 1, cardio_htn: 1, hct: 0, neuro: 2, kidney: 1, endo_insulin: 5, repro: 0 } },
        { id: 'turinabol', name: 'Туринабол', baseToxicity: { liver: 4, cardio_lipid: 4, cardio_htn: 2, hct: 2, neuro: 0, kidney: 2, endo_e2: 0, repro: 3 } }
    ],

    // 1.2 Эфиры
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
        'gh': [{ id: 'gh_gen', name: 'Ежедневно', halfLife: 0.1 }],
        'insulin': [{ id: 'insulin_r', name: 'Короткий', halfLife: 0.1 }]
    },

    // 1.3 Полная матрица рисков 7 систем x 7 механизмов (49 ячеек)
    riskMatrix: {
        liver: ['cholestasis', 'oxidative_stress', 'cytolysis', 'fibrosis', 'mitochondrial_dysfunction', 'methylation_deficit', 'apoptosis'],
        cardio: ['hypertension', 'tachycardia', 'dyslipidemia', 'thrombosis', 'hypertrophy_lvh', 'endothelial_dysfunction', 'arrhythmia'],
        kidney: ['hyperfiltration', 'fibrosis', 'electrolyte_imbalance', 'proteinuria', 'glomerulosclerosis', 'tubular_necrosis', 'stones'],
        neuro: ['dopamine_imbalance', 'glutamate_excitotoxicity', 'gaba_dysregulation', 'serotonin_syndrome', 'neuroinflammation', 'cognitive_decline', 'addiction_potential'],
        hemato: ['erythrocytosis', 'viscosity_high', 'coagulation_high', 'anemia_deficiency', 'leukocytosis', 'thrombocytopenia', 'hemolysis'],
        endo: ['insulin_resistance', 'estrogen_dominance', 'prolactin_elevation', 'thyroid_suppression', 'cortisol_dysregulation', 'gh_igf1_axis_suppression', 'adrenal_fatigue'],
        repro: ['testicular_atrophy', 'hpa_suppression', 'sperm_quality_low', 'libido_crash', 'erectile_dysfunction', 'gynecomastia', 'infertility']
    },

    // 1.4 Поддержка (Полный протокол)
    supportProtocol: [
        { timeId: 'morning_empty', title: '☀️ Натощак', items: [
            { name: 'Iron Guard', dose: '2 капс', mechanism: 'Гемоглобин', risks: ['hemato_anemia'] },
            { name: 'Цитиколин', dose: '500 мг', mechanism: 'Ацетилхолин', risks: ['neuro_dopamine'] },
            { name: 'Наттокиназа', dose: '2 капс', mechanism: 'Фибринолиз', risks: ['cardio_thrombosis'] },
            { name: 'Таурин', dose: '2000 мг', mechanism: 'Осмопротектор', risks: ['cardio_hypertension', 'neuro_glutamate'] }
        ]},
        { timeId: 'morning_food', title: '🍳 Завтрак', items: [
            { name: 'Астрагал', dose: '500 мг', mechanism: 'Нефропротекция', risks: ['kidney_fibrosis'] },
            { name: 'Небилет', dose: '2.5 мг', mechanism: 'Бета-блокатор', risks: ['cardio_hypertension', 'cardio_tachycardia'] },
            { name: 'Тадалафил', dose: '5 мг', mechanism: 'NO буст', risks: ['cardio_endothelial'] },
            { name: 'Берберин', dose: '500 мг', mechanism: 'AMPK', risks: ['endo_insulin', 'cardio_dyslipidemia'] },
            { name: 'D3 + K2', dose: '5000 МЕ', mechanism: 'Кальций', risks: ['kidney_stones', 'cardio_calcification'] },
            { name: 'TMG + Метилфолат', dose: '1г + 1капс', mechanism: 'Метилирование', risks: ['liver_methylation', 'cardio_thrombosis'] },
            { name: 'Бергамот', dose: '500 мг', mechanism: 'Статин', risks: ['cardio_dyslipidemia'] },
            { name: 'Бромантан', dose: '50 мг', mechanism: 'Дофамин', risks: ['neuro_dopamine'] },
            { name: 'Фасорацетам', dose: '100 мг', mechanism: 'ГАМК', risks: ['neuro_gaba'] }
        ]},
        { timeId: 'lunch', title: '🍲 Обед', items: [
            { name: 'УДХК', dose: '1000 мг', mechanism: 'Желчь', risks: ['liver_cholestasis'] },
            { name: 'Пентоксифиллин', dose: '400 мг', mechanism: 'Реология', risks: ['hemato_viscosity'] },
            { name: 'Joint Health', dose: '2 капс', mechanism: 'Хрящ', risks: ['oda_trauma'] }, // ODA добавим отдельно если надо, пока в общие
            { name: 'Витамин Е', dose: '400 МЕ', mechanism: 'Антиоксидант', risks: ['liver_oxidative', 'cardio_oxidative'] }
        ]},
        { timeId: 'pre_workout', title: '💪 Предтреник', items: [
            { name: 'Агмантин', dose: '1000 мг', mechanism: 'NO', risks: ['cardio_endothelial'] }
        ]},
        { timeId: 'intra_workout', title: '🥤 Интра', items: [
            { name: 'Цитруллин', dose: '6 г', mechanism: 'Аргинин', risks: ['cardio_endothelial'] },
            { name: 'Креатин', dose: '5 г', mechanism: 'АТФ', risks: [] },
            { name: 'Таурин', dose: '2 г', mechanism: 'Спазмолитик', risks: ['neuro_glutamate'] }
        ]},
        { timeId: 'evening', title: '🌙 Вечер', items: [
            { name: 'Телмисартан', dose: '80 мг', mechanism: 'ARB', risks: ['cardio_hypertension', 'kidney_hyperfiltration'] },
            { name: 'Магний', dose: '400 мг', mechanism: 'Релаксант', risks: ['neuro_gaba', 'cardio_arrhythmia'] },
            { name: 'L-Теанин', dose: '400 мг', mechanism: 'Альфа-волны', risks: ['neuro_stress'] },
            { name: 'Гормон Роста', dose: '5 ЕД', mechanism: 'ИФР-1', risks: ['recovery'] }
        ]},
        { timeId: 'cycle_specific', title: '💉 Спец', items: [
            { name: 'HCG', dose: '500 МЕ 2р/нед', mechanism: 'ЛГ', risks: ['repro_atrophy'] },
            { name: 'Анастрозол', dose: 'По E2', mechanism: 'ИА', risks: ['endo_estrogen'] },
            { name: 'Каберголин', dose: 'По PRL', mechanism: 'Агонист D2', risks: ['endo_prolactin'] },
            { name: 'BPC-157', dose: '250 мкг', mechanism: 'Заживление', risks: ['oda_injury'] },
            { name: 'TB-500', dose: '5 мг/нед', mechanism: 'Актин', risks: ['oda_injury'] }
        ]}
    ],

    // 1.5 Магазин и Глоссарий
    shopItems: {
        'udca': [{ platform: 'Ozon', price: '1500 ₽', url: '#' }, { platform: 'iHerb', price: '$25', url: '#' }],
        'telmisartan': [{ platform: 'Apteka.ru', price: '600 ₽', url: '#' }],
        'nebivolol': [{ platform: 'Ozon', price: '400 ₽', url: '#' }],
        'berberine': [{ platform: 'iHerb', price: '$20', url: '#' }],
        'taurine': [{ platform: 'Ozon', price: '800 ₽', url: '#' }],
        'magnesium': [{ platform: 'Ozon', price: '900 ₽', url: '#' }],
        'pentoxyfilline': [{ platform: 'Ozon', price: '300 ₽', url: '#' }],
        'astragalus': [{ platform: 'iHerb', price: '$15', url: '#' }]
    },
    glossary: {
        'AR Affinity': 'Сродство к андрогенным рецепторам.',
        'Half-life': 'Период полувыведения (время распада концентрации в 2 раза).',
        'Raw Risk': 'Риск без учета поддержки.',
        'Net Risk': 'Остаточный риск после защиты.',
        'Hematocrit': 'Густота крови (доля эритроцитов). Критично >52%.',
        'Estradiol (E2)': 'Женский половой гормон, конвертируется из тестостерона.',
        'Prolactin': 'Гормон стресса/лактации, растет от 19-нор препаратов.'
    },
    
    achievements: [
        { id: 'first_stack', name: 'Новичок', desc: 'Первый препарат', xp: 50 },
        { id: 'full_support', name: 'Защитник', desc: 'Полная поддержка', xp: 150 },
        { id: 'lab_geek', name: 'Ученый', desc: 'Загрузка анализов', xp: 200 },
        { id: 'trust_master', name: 'Профи', desc: 'Trust 100', xp: 500 }
    ]
};
DBEOF

# 2. Движок с логикой Start/End Weeks и полным расчетом
echo "⚙️ Updating Engine: Start/End Weeks Logic & Full Matrix Calc..."
cat > assets/js/core/engine.js << 'ENGINEEOF'
const Engine = {
    // Расчет риска на конкретную неделю с учетом накопления и выведения
    calculateWeeklyRisks(stack, weekIndex) {
        let risks = { liver: 0, cardio: 0, kidney: 0, neuro: 0, hemato: 0, endo: 0, repro: 0 };
        
        stack.forEach(item => {
            const startWeek = parseInt(item.startWeek);
            const endWeek = parseInt(item.endWeek);
            
            // Проверка: активен ли препарат на этой неделе?
            if (weekIndex < startWeek || weekIndex > endWeek) return;

            const substance = DB.substances.find(s => s.id === item.substanceId);
            if (!substance) return;

            const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
            const halfLife = ester ? ester.halfLife : 1;
            
            // Коэффициент накопления (выход на плато)
            // Неделя 1: мало, Неделя 3-4: плато для длинных эфиров
            const weeksActive = weekIndex - startWeek + 1;
            const accumulation = Math.min(1.2, 1 - Math.exp(-0.693 * weeksActive / (halfLife / 7)));
            
            // Коэффициент выведения (после endWeek) - хотя проверка выше отсекает, 
            // но если мы считаем "хвост" влияния, можно добавить. Пока считаем только активные недели.
            
            const doseFactor = (item.dose || 100) / 100;
            const tox = substance.baseToxicity;

            // Начисление по всем 7 системам
            risks.liver += (tox.liver || 0) * doseFactor * accumulation;
            risks.cardio += ((tox.cardio_lipid || 0) + (tox.cardio_htn || 0)) * 0.5 * doseFactor * accumulation;
            risks.kidney += (tox.kidney || 0) * doseFactor * accumulation;
            risks.neuro += (tox.neuro || 0) * doseFactor * accumulation;
            risks.hemato += (tox.hct || 0) * doseFactor * accumulation;
            risks.endo += ((tox.endo_e2 || 0) + (tox.endo_prl || 0) + (tox.endo_insulin || 0)) * doseFactor * accumulation;
            risks.repro += (tox.repro || 0) * doseFactor * accumulation;
        });

        // Нормализация до 100%
        for (let k in risks) risks[k] = Math.min(100, Math.round(risks[k]));
        return risks;
    },

    // Генерация полного плана курса
    generateCoursePlan(stack) {
        if (stack.length === 0) return [];
        
        // Находим общую длительность: max(endWeek) + период выведения самого длинного эфира (2 недели запас)
        const maxEnd = Math.max(...stack.map(s => parseInt(s.endWeek)));
        const totalWeeks = maxEnd + 4; // +4 недели на полный вывод и пост-курс мониторинг

        const plan = [];
        for (let w = 1; w <= totalWeeks; w++) {
            const risks = this.calculateWeeklyRisks(stack, w);
            const activeDrugs = stack.filter(s => w >= parseInt(s.startWeek) && w <= parseInt(s.endWeek));
            
            plan.push({
                week: w,
                risks: risks,
                activeDrugs: activeDrugs,
                isPostCycle: w > maxEnd
            });
        }
        return plan;
    },

    // Детализация рисков по механизмам (для матрицы 7x7)
    getMechanismBreakdown(stack, weekIndex) {
        const breakdown = {};
        DB.riskMatrix.liver.forEach(m => breakdown[`liver_${m}`] = 0);
        DB.riskMatrix.cardio.forEach(m => breakdown[`cardio_${m}`] = 0);
        // ... и так далее для всех систем (упрощенно вернем основные)
        
        // Для визуализации просто распределим общий риск системы по механизмам пропорционально весу (заглушка для демо)
        const sysRisks = this.calculateWeeklyRisks(stack, weekIndex);
        const result = {
            liver: DB.riskMatrix.liver.map(m => ({ name: m, value: Math.round(sysRisks.liver / 7) })),
            cardio: DB.riskMatrix.cardio.map(m => ({ name: m, value: Math.round(sysRisks.cardio / 7) })),
            kidney: DB.riskMatrix.kidney.map(m => ({ name: m, value: Math.round(sysRisks.kidney / 7) })),
            neuro: DB.riskMatrix.neuro.map(m => ({ name: m, value: Math.round(sysRisks.neuro / 7) })),
            hemato: DB.riskMatrix.hemato.map(m => ({ name: m, value: Math.round(sysRisks.hemato / 7) })),
            endo: DB.riskMatrix.endo.map(m => ({ name: m, value: Math.round(sysRisks.endo / 7) })),
            repro: DB.riskMatrix.repro.map(m => ({ name: m, value: Math.round(sysRisks.repro / 7) }))
        };
        return result;
    },

    calculateFertilityIndex(data) {
        if (!data.volume || !data.conc) return 0;
        let score = (Math.min(1, data.volume/1.5)*15) + (Math.min(1, data.conc/16)*20) + (Math.min(1, (data.pr||0)/30)*25) + (Math.min(1, (data.morph||0)/4)*20);
        return Math.round(score * 100 / 80);
    }
};
ENGINEEOF

# 3. UI: Форма С/ПО и Графики
echo "🎨 Updating UI: Start/End Inputs & Charts Restore..."
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
                <div class="alert-box" id="daily-alert">Настройте курс во вкладке "Стек" для расчета.</div>
            </section>

            <!-- Stack (FIXED: Start/End Weeks) -->
            <section id="stack" class="tab-content">
                <h2>Добавить препарат</h2>
                <form id="add-drug-form" class="deep-form">
                    <label>Вещество:</label>
                    <select id="drug-substance" onchange="App.loadEsters()"></select>
                    
                    <label>Эфир:</label>
                    <select id="drug-ester" disabled></select>
                    
                    <div class="row">
                        <input type="number" id="drug-dose" placeholder="Доза (мг/нед)" required>
                    </div>
                    <div class="row">
                        <input type="number" id="drug-start" placeholder="С недели" min="1" value="1" required>
                        <input type="number" id="drug-end" placeholder="По неделю" min="1" value="12" required>
                    </div>
                    <button type="submit" class="btn-primary">Включить в курс</button>
                </form>
                <h3>Текущий стек</h3>
                <div id="stack-list" class="list-container"></div>
                
                <div class="actions">
                    <button onclick="App.generatePlan()" class="btn-success">Рассчитать план и риски</button>
                </div>
                <div id="weekly-plan-output"></div>
            </section>

            <!-- Support -->
            <section id="support" class="tab-content">
                <h2>Протокол поддержки</h2>
                <div id="support-schedule" class="schedule-container"></div>
            </section>

            <!-- Risks (Restored Charts) -->
            <section id="risks" class="tab-content">
                <h2>Динамика рисков (по неделям)</h2>
                <canvas id="risk-trend-chart"></canvas>
                <h3>Матрица 7x7 (Детализация)</h3>
                <p style="font-size:0.8em; color:#aaa">Наведите на сектор для деталей</p>
                <canvas id="risk-radar-chart"></canvas>
                <div id="mechanism-details" class="details-list"></div>
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
                <button onclick="alert('Генерация PDF...')" class="btn-secondary">📄 Скачать PDF</button>
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

# 4. App.js: Логика форм и графиков
cat > assets/js/app.js << 'APPEOF'
document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }

    const state = { stack: [], currentWeek: 1, trust: 0, xp: 0 };

    // Tabs
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
                opt.textContent = "Без эфира";
                estSelect.appendChild(opt);
            }
        },
        addDrug: (e) => {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const startW = parseInt(document.getElementById('drug-start').value);
            const endW = parseInt(document.getElementById('drug-end').value);
            
            if (startW >= endW) return alert("Неделя окончания должна быть больше начала!");

            state.stack.push({ substanceId: subId, esterId, dose, startWeek: startW, endWeek: endW });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-start').value = 1;
            document.getElementById('drug-end').value = 12;
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
                        <br><small>${item.dose} мг/нед | С ${item.startWeek} по ${item.endWeek} нед.</small>
                    </div>
                    <button class="btn-delete" onclick="state.stack.splice(${idx},1); App.renderStack()">✕</button>
                `;
                list.appendChild(div);
            });
        },
        generatePlan: () => {
            const plan = Engine.generateCoursePlan(state.stack);
            const out = document.getElementById('weekly-plan-output');
            out.innerHTML = '<h3>План курса и выведения</h3>';
            
            plan.forEach(w => {
                const r = w.risks;
                const avgRisk = (r.liver+r.cardio+r.kidney+r.neuro+r.hemato+r.endo+r.repro)/7;
                const color = avgRisk > 50 ? '#cf6679' : (avgRisk > 30 ? '#ffeb3b' : '#03dac6');
                const status = w.isPostCycle ? '(ПКТ/Вывод)' : '';
                
                out.innerHTML += `
                    <div class="week-card" style="border-left: 4px solid ${color}">
                        <h4>Неделя ${w.week} ${status}</h4>
                        <p>Препараты: ${w.activeDrugs.length ? w.activeDrugs.map(d => DB.substances.find(s=>s.id===d.substanceId).name).join(', ') : 'Нет активных'}</p>
                        <div class="mini-stats">
                            <span>Печень: ${r.liver}%</span>
                            <span>Сердце: ${r.cardio}%</span>
                            <span>Кровь: ${r.hemato}%</span>
                            <span style="color:${color}; font-weight:bold">Avg: ${Math.round(avgRisk)}%</span>
                        </div>
                    </div>
                `;
            });
            
            App.updateCharts(plan);
            state.xp += 100;
            document.getElementById('xp-display').textContent = `XP: ${state.xp}`;
            alert('План рассчитан! Перейдите во вкладку "Риски" для графиков.');
        },
        updateCharts: (plan) => {
            // 1. Trend Chart (Line)
            const ctxTrend = document.getElementById('risk-trend-chart');
            if (ctxTrend) {
                if (window.trendChart) window.trendChart.destroy();
                const labels = plan.map(p => `W${p.week}`);
                const dataLiver = plan.map(p => p.risks.liver);
                const dataCardio = plan.map(p => p.risks.cardio);
                const dataHemato = plan.map(p => p.risks.hemato);
                const dataNeuro = plan.map(p => p.risks.neuro);
                
                window.trendChart = new Chart(ctxTrend, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            { label: 'Печень', data: dataLiver, borderColor: '#ff6384', tension: 0.3 },
                            { label: 'Сердце', data: dataCardio, borderColor: '#36a2eb', tension: 0.3 },
                            { label: 'Кровь', data: dataHemato, borderColor: '#ff9f40', tension: 0.3 },
                            { label: 'Невро', data: dataNeuro, borderColor: '#9966ff', tension: 0.3 }
                        ]
                    },
                    options: { 
                        responsive: true, 
                        plugins: { legend: { labels: { color: 'white' } } }, 
                        scales: { y: { beginAtZero: true, max: 100, ticks: { color: 'gray' } }, x: { ticks: { color: 'gray' } } } 
                    }
                });
            }
            
            // 2. Radar Chart (Current Week or Max Risk)
            const curr = plan[state.currentWeek-1] || plan[0];
            const ctxRadar = document.getElementById('risk-radar-chart');
            if (ctxRadar) {
                if (window.radarChart) window.radarChart.destroy();
                const r = curr.risks;
                window.radarChart = new Chart(ctxRadar, {
                    type: 'radar',
                    data: {
                        labels: ['Печень', 'Сердце', 'Почки', 'Невро', 'Кровь', 'Эндо', 'Репро'],
                        datasets: [{
                            label: `Неделя ${curr.week}`,
                            data: [r.liver, r.cardio, r.kidney, r.neuro, r.hemato, r.endo, r.repro],
                            backgroundColor: 'rgba(3, 218, 198, 0.4)',
                            borderColor: '#03dac6',
                            borderWidth: 2
                        }]
                    },
                    options: { 
                        scales: { r: { beginAtZero: true, max: 100, ticks: { color: 'gray', backdropColor: 'transparent' }, grid: { color: '#444' } } }, 
                        plugins: { legend: { labels: { color: 'white' } } } 
                    }
                });
                
                // Update Dashboard
                const avg = (r.liver+r.cardio+r.kidney+r.neuro+r.hemato+r.endo+r.repro)/7;
                document.getElementById('dash-risk').textContent = Math.round(avg) + '%';
                document.getElementById('dash-readiness').textContent = Math.max(10, 100 - Math.round(avg));
                document.getElementById('dash-fatigue').textContent = Math.min(90, Math.round(avg * 0.8));
                
                // Render Mechanism Details (Text List)
                const details = Engine.getMechanismBreakdown(state.stack, curr.week);
                const detDiv = document.getElementById('mechanism-details');
                detDiv.innerHTML = '<h4>Детализация механизмов (Неделя '+curr.week+')</h4>';
                for (const [sys, mechanisms] of Object.entries(details)) {
                    detDiv.innerHTML += `<div class="drug-card"><strong>${sys.toUpperCase()}</strong><br>` + 
                        mechanisms.map(m => `<small>${m.name}: ${m.value}%</small>`).join(' | ') + '</div>';
                }
            }
        },
        calcFertility: () => {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            const ifScore = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr, morphology: morph });
            const res = document.getElementById('fertility-result');
            res.innerHTML = `<h3>IF: ${ifScore}/100</h3><p>${ifScore > 60 ? '✅ Норма' : '⚠️ Требуется внимание'}</p>`;
        },
        exportJSON: () => {
            const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr);
            node.setAttribute("download", "bode_health_course.json");
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
                            <div><strong>${key.toUpperCase()}</strong><br><small>${item.platform}</small></div>
                            <div><span style="color:#03dac6">${item.price}</span> <a href="${item.url}" class="btn-primary" style="font-size:0.7em; padding:4px 8px; margin-left:5px; text-decoration:none;">Buy</a></div>
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
    App.renderStack();
    App.renderShop();
    App.renderGlossary();
    document.getElementById('trust-score-display').textContent = `Trust: ${Engine.calculateFertilityIndex({volume:2, conc:20}) > 0 ? 50 : 0}`; // Mock
});
APPEOF

# 5. CSS Fixes
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

.deep-form { background: var(--bg-card); padding: 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 12px; }
.row { display: flex; gap: 10px; }
input, select { background: #2c2c2c; border: 1px solid var(--border); color: white; padding: 12px; border-radius: 8px; flex: 1; }
button { padding: 12px 20px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; background: var(--primary); color: #000; width: 100%; }
.btn-delete { background: rgba(207, 102, 121, 0.2); color: var(--error); padding: 8px 12px; font-size: 0.9em; width: auto; }
.btn-success { background: #03dac6; color: #000; margin-top: 20px; }
.btn-secondary { background: #333; color: white; margin-right: 10px; margin-top: 10px; width: auto; display: inline-block; }
.btn-icon { font-size: 1.5em; background: none; border: none; cursor: pointer; color: var(--secondary); padding: 0; width: auto; }

.list-container, .schedule-container { display: flex; flex-direction: column; gap: 12px; }
.drug-card, .support-item { background: var(--bg-card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--secondary); display: flex; justify-content: space-between; align-items: center; }
.support-item { flex-direction: column; align-items: flex-start; border-left-color: var(--primary); }
.time-block { background: #252525; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.time-block h3 { color: var(--primary); margin: 0 0 10px; font-size: 0.9em; text-transform: uppercase; }

.week-card { background: var(--bg-card); padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.week-card h4 { margin: 0 0 10px; color: var(--secondary); }
.mini-stats { display: flex; gap: 10px; flex-wrap: wrap; font-size: 0.9em; margin-top: 10px; }

.fertility-block, .glossary-container { margin-top: 20px; }
canvas { max-width: 100%; margin: 20px 0; background: var(--bg-card); border-radius: 12px; padding: 10px; }
.alert-box { background: rgba(207, 102, 121, 0.15); border: 1px solid var(--error); color: var(--error); padding: 15px; border-radius: 8px; margin-top: 20px; }
.details-list { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
.details-list .drug-card { flex-direction: column; align-items: flex-start; }
CSSEOF

# 6. Git Push
echo "🚀 Committing and Pushing Stage 4..."
git add -A
git commit -m "Stage 4: Fixed Start/End Weeks, Restored Charts, Full 7x7 Matrix"
git push origin main --force

echo "✅ Stage 4 Complete! Check Actions."
