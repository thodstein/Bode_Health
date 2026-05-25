#!/bin/bash
echo "🚑 STAGE 8: DATA RECOVERY & CRITICAL FIXES"

# 1. ПОЛНОЕ ВОССТАНОВЛЕНИЕ БАЗЫ ДАННЫХ (ВСЕ ПРЕПАРАТЫ, ПОДДЕРЖКА, СЛОВАРЬ)
echo "💾 Restoring Full Database..."
cat > assets/js/core/database.js << 'DBEOF'
const DB = {
    // 1.1 Вещества (Расширенная токсичность для всех 7 систем)
    substances: [
        { id: 'test', name: 'Тестостерон', class: 'AAS', tox: { liver: 1, cardio: 3, kidney: 1, neuro: 0, hemato: 4, endo: 2, repro: 5 } },
        { id: 'nandrolone', name: 'Нандролон', class: 'AAS', tox: { liver: 1, cardio: 4, kidney: 2, neuro: 0, hemato: 2, endo: 4, repro: 4 } },
        { id: 'trenbolone', name: 'Тренболон', class: 'AAS', tox: { liver: 2, cardio: 5, kidney: 4, neuro: 5, hemato: 3, endo: 4, repro: 5 } },
        { id: 'boldenone', name: 'Болденон', class: 'AAS', tox: { liver: 1, cardio: 3, kidney: 1, neuro: 0, hemato: 6, endo: 1, repro: 3 } },
        { id: 'dhb', name: 'Дигидроболденон (DHB)', class: 'AAS', tox: { liver: 1, cardio: 4, kidney: 3, neuro: 0, hemato: 5, endo: 1, repro: 3 } },
        { id: 'masteron', name: 'Мастерон', class: 'AAS', tox: { liver: 1, cardio: 4, kidney: 1, neuro: 0, hemato: 3, endo: 1, repro: 4 } },
        { id: 'primobolan', name: 'Примоболан', class: 'AAS', tox: { liver: 1, cardio: 3, kidney: 1, neuro: 0, hemato: 2, endo: 1, repro: 2 } },
        { id: 'oxandrolone', name: 'Оксандролон', class: 'Oral', tox: { liver: 4, cardio: 5, kidney: 1, neuro: 0, hemato: 1, endo: 1, repro: 2 } },
        { id: 'stanozolol', name: 'Станозолол', class: 'Oral/Inj', tox: { liver: 5, cardio: 5, kidney: 2, neuro: 0, hemato: 2, endo: 1, repro: 3 } },
        { id: 'methandienone', name: 'Метандиенон', class: 'Oral', tox: { liver: 5, cardio: 4, kidney: 1, neuro: 0, hemato: 3, endo: 3, repro: 3 } },
        { id: 'gh', name: 'Гормон Роста', class: 'Peptide', tox: { liver: 0, cardio: 2, kidney: 1, neuro: 0, hemato: 0, endo: 5, repro: 0 } },
        { id: 'insulin', name: 'Инсулин', class: 'Hormone', tox: { liver: 0, cardio: 1, kidney: 0, neuro: 0, hemato: 0, endo: 5, repro: 0 } },
        { id: 'igf1', name: 'IGF-1', class: 'Peptide', tox: { liver: 0, cardio: 0, kidney: 2, neuro: 0, hemato: 0, endo: 4, repro: 0 } },
        { id: 'mgf', name: 'MGF / PEG-MGF', class: 'Peptide', tox: { liver: 0, cardio: 0, kidney: 1, neuro: 0, hemato: 0, endo: 2, repro: 0 } }
    ],

    // 1.2 Эфиры (Полный список)
    esters: {
        'test': [
            { id: 'test_p', name: 'Пропионат', hl: 2.0 },
            { id: 'test_e', name: 'Энантат', hl: 7.0 },
            { id: 'test_c', name: 'Ципионат', hl: 8.0 },
            { id: 'test_sus', name: 'Сустанон', hl: 15.0 }
        ],
        'nandrolone': [
            { id: 'nandrolone_p', name: 'Фенилпропионат', hl: 4.5 },
            { id: 'nandrolone_d', name: 'Деканоат', hl: 14.0 }
        ],
        'trenbolone': [
            { id: 'trenbolone_a', name: 'Ацетат', hl: 3.0 },
            { id: 'trenbolone_e', name: 'Энантат', hl: 7.0 },
            { id: 'trenbolone_h', name: 'Гекса', hl: 10.0 }
        ],
        'boldenone': [{ id: 'boldenone_u', name: 'Ундесиленат', hl: 14.0 }],
        'dhb': [{ id: 'dhb_p', name: 'Ацетат', hl: 10.0 }],
        'masteron': [
            { id: 'masteron_p', name: 'Пропионат', hl: 2.5 },
            { id: 'masteron_e', name: 'Энантат', hl: 7.0 }
        ],
        'primobolan': [{ id: 'primobolan_e', name: 'Энантат', hl: 10.0 }],
        'stanozolol': [{ id: 'stanozolol_s', name: 'Суспензия', hl: 24.0 }],
        'gh': [
            { id: 'gh_short', name: 'Ежедневно', hl: 0.1 },
            { id: 'gh_long', name: 'Пролонг (Weekly)', hl: 168.0 }
        ],
        'insulin': [
            { id: 'insulin_r', name: 'Короткий (R)', hl: 0.1 },
            { id: 'insulin_l', name: 'Продленный (Glargine)', hl: 24.0 }
        ],
        'igf1': [
            { id: 'igf1_lr3', name: 'LR3 (Длинный)', hl: 24.0 },
            { id: 'igf1_des', name: 'DES (Короткий)', hl: 0.5 }
        ],
        'mgf': [
            { id: 'mgf_plain', name: 'MGF', hl: 0.5 },
            { id: 'peg_mgf', name: 'PEG-MGF', hl: 48.0 }
        ]
    },

    // 1.3 Матрица рисков (7x7)
    riskMatrix: {
        liver: [
            { id: 'cholestasis', name: 'Холестаз', desc: 'Застой желчи' },
            { id: 'oxidative', name: 'Окс. стресс', desc: 'Свободные радикалы' },
            { id: 'cytolysis', name: 'Цитолиз', desc: 'Разрушение клеток (ALT/AST)' },
            { id: 'fibrosis', name: 'Фиброз', desc: 'Рубцевание ткани' },
            { id: 'mito', name: 'Митохондрии', desc: 'Энергодефицит' },
            { id: 'methylation', name: 'Метилирование', desc: 'Дефицит метил-групп' },
            { id: 'apoptosis', name: 'Апоптоз', desc: 'Гибель клеток' }
        ],
        cardio: [
            { id: 'htn', name: 'Гипертония', desc: 'Высокое АД' },
            { id: 'tachycardia', name: 'Тахикардия', desc: 'Высокий пульс' },
            { id: 'lipids', name: 'Дислипидемия', desc: 'ЛПНП↑ / ЛПВП↓' },
            { id: 'thrombo', name: 'Тромбоз', desc: 'Сгущение крови' },
            { id: 'lvh', name: 'Гипертрофия', desc: 'Утолщение стенок' },
            { id: 'endo', name: 'Эндотелий', desc: 'Дисфункция сосудов' },
            { id: 'arrhythmia', name: 'Аритмия', desc: 'Сбой ритма' }
        ],
        kidney: [
            { id: 'hyperfiltration', name: 'Гиперфильтрация', desc: 'Перегрузка клубочков' },
            { id: 'fibrosis_k', name: 'Фиброз почек', desc: 'Рубцевание' },
            { id: 'electrolytes', name: 'Электролиты', desc: 'Дисбаланс K/Na' },
            { id: 'proteinuria', name: 'Протеинурия', desc: 'Белок в моче' },
            { id: 'stones', name: 'Камни', desc: 'Нефролитиаз' },
            { id: 'tubular', name: 'Тубулярный некроз', desc: 'Отмирание канальцев' },
            { id: 'gfr_drop', name: 'Падение СКФ', desc: 'Снижение функции' }
        ],
        neuro: [
            { id: 'dopamine', name: 'Дофамин', desc: 'Дисбаланс (агрессия/апатия)' },
            { id: 'glutamate', name: 'Глутамат', desc: 'Эксайтотоксичность' },
            { id: 'gaba', name: 'ГАМК', desc: 'Тревожность/Бессонница' },
            { id: 'serotonin', name: 'Серотонин', desc: 'Перепады настроения' },
            { id: 'inflammation', name: 'Нейровоспаление', desc: 'Микроглия' },
            { id: 'cognitive', name: 'Когнитивный спад', desc: 'Память/Фокус' },
            { id: 'addiction', name: 'Зависимость', desc: 'Дофаминовая яма' }
        ],
        hemato: [
            { id: 'erythrocytosis', name: 'Эритроцитоз', desc: 'Высокий гематокрит' },
            { id: 'viscosity', name: 'Вязкость', desc: 'Густая кровь' },
            { id: 'coagulation', name: 'Коагуляция', desc: 'Свертываемость' },
            { id: 'anemia', name: 'Анемия', desc: 'Дефицит железа/B12' },
            { id: 'leukocytosis', name: 'Лейкоцитоз', desc: 'Воспаление' },
            { id: 'platelets', name: 'Тромбоциты', desc: 'Агрегация' },
            { id: 'hemolysis', name: 'Гемолиз', desc: 'Разрушение эритроцитов' }
        ],
        endo: [
            { id: 'insulin_res', name: 'Инсулинорезистентность', desc: 'Рост сахара' },
            { id: 'estrogen', name: 'Эстроген', desc: 'Гинекомастия/Отеки' },
            { id: 'prolactin', name: 'Пролактин', desc: 'Либидо↓/Потенция' },
            { id: 'thyroid', name: 'Щитовидка', desc: 'Снижение Т3/Т4' },
            { id: 'cortisol', name: 'Кортизол', desc: 'Катаболизм/Стресс' },
            { id: 'gh_axis', name: 'Ось ГР', desc: 'Снижение собственного' },
            { id: 'adrenal', name: 'Надпочечники', desc: 'Истощение' }
        ],
        repro: [
            { id: 'atrophy', name: 'Атрофия', desc: 'Уменьшение тестикул' },
            { id: 'suppression', name: 'Подавление оси', desc: 'Нет своего Тестостерона' },
            { id: 'sperm', name: 'Спермогенез', desc: 'Качество спермы↓' },
            { id: 'libido', name: 'Либидо', desc: 'Падение влечения' },
            { id: 'erectile', name: 'Эрекция', desc: 'ЭД' },
            { id: 'gyno', name: 'Гинекомастия', desc: 'Рост груди' },
            { id: 'infertility', name: 'Бесплодие', desc: 'Невозможность зачатия' }
        ]
    },

    // 1.4 ПРОТОКОЛ ПОДДЕРЖКИ (ПОЛНЫЙ, ИЗ ТЗ)
    supportProtocol: [
        { timeId: 'morning_empty', title: '☀️ Натощак', items: [
            { name: 'Iron Guard', dose: '2 капс', mechanism: 'Гемоглобин', risks: ['hemato_anemia'] },
            { name: 'Цитиколин', dose: '500 мг', mechanism: 'Нейропротекция', risks: ['neuro_cognitive'] },
            { name: 'Наттокиназа', dose: '2 капс', mechanism: 'Реология', risks: ['hemato_viscosity'] },
            { name: 'Таурин', dose: '2000 мг', mechanism: 'Анти-спазм', risks: ['cardio_htn', 'neuro_glutamate'] }
        ]},
        { timeId: 'morning_food', title: '🍳 Завтрак', items: [
            { name: 'Астрагал', dose: '500 мг', mechanism: 'Почки', risks: ['kidney_fibrosis_k'] },
            { name: 'Небилет', dose: '2.5 мг', mechanism: 'Давление', risks: ['cardio_htn', 'cardio_tachycardia'] },
            { name: 'Тадалафил', dose: '5 мг', mechanism: 'Поток крови', risks: ['cardio_endo'] },
            { name: 'Берберин', dose: '500 мг', mechanism: 'Инсулин', risks: ['endo_insulin_res'] },
            { name: 'D3 + K2', dose: '5000 МЕ', mechanism: 'Кости', risks: [] },
            { name: 'TMG + Метилфолат', dose: '1г + 1капс', mechanism: 'Метилирование', risks: ['liver_methylation', 'cardio_thrombo'] },
            { name: 'Бергамот', dose: '500 мг', mechanism: 'Липиды', risks: ['cardio_lipids'] },
            { name: 'Бромантан + Фасорацетам', dose: '50+100 мг', mechanism: 'Дофамин/ГАМК', risks: ['neuro_dopamine', 'neuro_gaba'] }
        ]},
        { timeId: 'lunch', title: '🍲 Обед', items: [
            { name: 'УДХК', dose: '1000 мг', mechanism: 'Желчь', risks: ['liver_cholestasis'] },
            { name: 'Пентоксифиллин', dose: '400 мг', mechanism: 'Вязкость', risks: ['hemato_viscosity'] },
            { name: 'Joint Health', dose: '2 капс', mechanism: 'Суставы', risks: [] },
            { name: 'Витамин Е', dose: '400 МЕ', mechanism: 'Антиоксидант', risks: ['liver_oxidative'] }
        ]},
        { timeId: 'pre_workout', title: '💪 Предтреник', items: [
            { name: 'Агмантин', dose: '1000 мг', mechanism: 'NO', risks: ['cardio_endo'] }
        ]},
        { timeId: 'intra_workout', title: '🥤 Intra-Workout', items: [
            { name: 'Цитруллин', dose: '6 г', mechanism: 'NO', risks: ['cardio_pump'] },
            { name: 'Креатин', dose: '5 г', mechanism: 'АТФ', risks: [] },
            { name: 'Таурин', dose: '2 г', mechanism: 'Объем клетки', risks: ['neuro_glutamate'] }
        ]},
        { timeId: 'evening', title: '🌙 Вечер', items: [
            { name: 'Телмисартан', dose: '80 мг', mechanism: 'Давление/Почки', risks: ['cardio_htn', 'kidney_hyperfiltration'] },
            { name: 'Магний', dose: '400 мг', mechanism: 'Расслабление', risks: ['neuro_gaba', 'cardio_arrhythmia'] },
            { name: 'L-Теанин', dose: '400 мг', mechanism: 'Сон', risks: ['neuro_gaba'] },
            { name: 'Гормон Роста', dose: '5 ЕД', mechanism: 'Рост', risks: ['endo_gh_axis'], note: 'Инъекция' }
        ]}
    ],

    // 1.5 Магазин и Глоссарий
    shopItems: {
        'udca': [{ platform: 'Ozon', price: '1500 ₽', url: '#' }],
        'telmisartan': [{ platform: 'Apteka.ru', price: '600 ₽', url: '#' }],
        'berberine': [{ platform: 'iHerb', price: '$20', url: '#' }],
        'taurine': [{ platform: 'Ozon', price: '800 ₽', url: '#' }]
    },
    glossary: {
        'Raw Risk': 'Исходный риск без поддержки.',
        'Net Risk': 'Риск после применения протокола.',
        'Half-life': 'Период полувыведения вещества.',
        'Hematocrit': 'Густота крови (доля эритроцитов). Критично >52%.',
        'IGF-1 LR3': 'Длинная версия IGF-1 (24ч), работает системно.',
        'IGF-1 DES': 'Короткая версия (20 мин), колется локально перед тренировкой.',
        'PEG-MGF': 'Пролонгированный MGF для восстановления мышц.',
        'Insulin Glargine': 'Продленный инсулин (фон), без пиков.'
    }
};
DBEOF

# 2. ИСПРАВЛЕННЫЙ ДВИЖОК (БЕЗОПАСНЫЕ РАСЧЕТЫ)
echo "⚙️ Fixing Engine Logic..."
cat > assets/js/core/engine.js << 'ENGINEEOF'
const Engine = {
    // Безопасный расчет концентрации
    getConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        if (halfLife <= 0) halfLife = 1; // Защита от деления на ноль

        const weeksOn = currentWeek - startWeek;
        const duration = endWeek - startWeek;
        
        // Фаза приема (накопление)
        if (currentWeek <= endWeek) {
            // Плавный выход на плато за 3-4 периода полувыведения
            const factor = 1 - Math.exp(-0.693 * weeksOn / (halfLife / 7));
            return Math.min(1, factor);
        } 
        // Фаза выведения (спад)
        else {
            const weeksOff = currentWeek - endWeek;
            return Math.max(0, Math.exp(-0.693 * weeksOff / (halfLife / 7)));
        }
    },

    generatePlan(stack, forecastWeeks) {
        if (!stack || stack.length === 0) return [];
        
        // Определяем длительность прогноза
        let maxEnd = 0;
        let longestHL = 1;
        stack.forEach(s => {
            if (s.endWeek > maxEnd) maxEnd = s.endWeek;
            const ester = DB.esters[s.substanceId]?.find(e => e.id === s.esterId);
            const hl = ester ? ester.hl : 1;
            if (hl > longestHL) longestHL = hl;
        });
        
        const totalWeeks = Math.max(forecastWeeks || 12, Math.ceil(maxEnd + (longestHL / 7) * 5));
        const plan = [];

        for (let w = 1; w <= totalWeeks; w++) {
            // Инициализация нулями
            let risks = {};
            for (let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].forEach(m => risks[sys][m.id] = 0);
            }

            let activeCount = 0;
            stack.forEach(item => {
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const hl = ester ? ester.hl : 1;
                const sub = DB.substances.find(s => s.id === item.substanceId);
                
                const conc = this.getConcentration(hl, item.startWeek, item.endWeek, w);
                
                if (conc > 0.05) {
                    activeCount++;
                    const tox = sub.tox;
                    const load = conc * (item.dose / 100); // Нормализация к 100мг

                    // Распределение токсичности по механизмам (упрощенная модель)
                    // Liver
                    risks.liver.cholestasis += tox.liver * 3 * load;
                    risks.liver.cytolysis += tox.liver * 2 * load;
                    // Cardio
                    risks.cardio.lipids += tox.cardio * 3 * load;
                    risks.cardio.htn += tox.cardio * 1.5 * load;
                    risks.cardio.thrombo += tox.cardio * load;
                    // Hemato
                    risks.hemato.erythrocytosis += tox.hemato * 4 * load;
                    risks.hemato.viscosity += tox.hemato * 3 * load;
                    // Neuro
                    risks.neuro.dopamine += tox.neuro * 5 * load;
                    // Kidney
                    risks.kidney.hyperfiltration += tox.kidney * 3 * load;
                    // Endo
                    risks.endo.insulin_res += tox.endo * 3 * load;
                    risks.endo.estrogen += tox.endo * 2 * load;
                    // Repro
                    risks.repro.suppression += tox.repro * 5 * load;
                    risks.repro.atrophy += tox.repro * 4 * load;
                }
            });

            // Нормализация и ограничение 0-100
            for (let sys in risks) {
                for (let m in risks[sys]) {
                    risks[sys][m] = Math.min(100, Math.round(risks[sys][m]));
                }
            }

            plan.push({ week: w, risks, activeCount });
        }
        return plan;
    },

    getRiskColor(val) {
        if (val < 20) return '#2e7d32'; // Green
        if (val < 40) return '#fdd835'; // Yellow
        if (val < 60) return '#fb8c00'; // Orange
        return '#c62828'; // Red
    }
};
ENGINEEOF

# 3. ИСПРАВЛЕННЫЙ UI (ЖЕСТКАЯ ПРИВЯЗКА СОБЫТИЙ)
echo "🎨 Fixing UI Events & Rendering..."
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
        <header>
            <div><h1>Bode Health <span class="version">v11.0</span></h1></div>
            <div class="status-bar" id="xp-display">XP: 0</div>
        </header>

        <nav class="tabs">
            <button class="tab-btn active" data-tab="dashboard">📊 Главная</button>
            <button class="tab-btn" data-tab="stack">💉 Стек</button>
            <button class="tab-btn" data-tab="risks">⚠️ Риски</button>
            <button class="tab-btn" data-tab="support">💊 Поддержка</button>
            <button class="tab-btn" data-tab="labs">🧬 Анализы</button>
            <button class="tab-btn" data-tab="shop">🛒 Магазин</button>
        </nav>

        <main>
            <!-- Dashboard -->
            <section id="dashboard" class="tab-content active">
                <div class="cards-grid">
                    <div class="card"><h3>Readiness</h3><div class="big-value" id="dash-readiness">--</div></div>
                    <div class="card"><h3>Fatigue</h3><div class="big-value" id="dash-fatigue">--</div></div>
                    <div class="card"><h3>Avg Risk</h3><div class="big-value" id="dash-risk">--</div></div>
                </div>
            </section>

            <!-- Stack -->
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
                        <input type="number" id="drug-start" placeholder="Старт (неделя)" value="1" min="1" required>
                        <input type="number" id="drug-end" placeholder="Финиш (неделя)" value="8" min="1" required>
                    </div>
                    <button type="submit" class="btn-primary">Добавить в курс</button>
                </form>
                <div id="stack-list" class="list-container"></div>
                <button onclick="App.generatePlan()" class="btn-success">Рассчитать динамику курса</button>
                <div id="weekly-plan-output"></div>
            </section>

            <!-- Risks -->
            <section id="risks" class="tab-content">
                <h2>Динамика рисков</h2>
                <div class="chart-controls">
                    <label><input type="checkbox" checked onchange="App.toggleChart('liver')"> Печень</label>
                    <label><input type="checkbox" checked onchange="App.toggleChart('cardio')"> Сердце</label>
                    <label><input type="checkbox" checked onchange="App.toggleChart('hemato')"> Кровь</label>
                    <label><input type="checkbox" onchange="App.toggleChart('neuro')"> Нейро</label>
                    <label><input type="checkbox" onchange="App.toggleChart('kidney')"> Почки</label>
                    <label><input type="checkbox" onchange="App.toggleChart('endo')"> Эндо</label>
                    <label><input type="checkbox" onchange="App.toggleChart('repro')"> Репро</label>
                </div>
                <canvas id="risk-trend-chart"></canvas>

                <h2>Матрица рисков (Heatmap)</h2>
                <div class="week-selector">
                    <button onclick="App.changeWeek(-1)">◀</button>
                    <span id="current-week-display">Неделя 1</span>
                    <button onclick="App.changeWeek(1)">▶</button>
                </div>
                <div id="heatmap-container" class="heatmap-grid"></div>
            </section>

            <!-- Support -->
            <section id="support" class="tab-content">
                <h2>Протокол поддержки</h2>
                <div id="support-schedule" class="schedule-container"></div>
            </section>

            <!-- Labs -->
            <section id="labs" class="tab-content">
                <h2>Фертильность</h2>
                <div class="input-group">
                    <input type="number" id="semen-vol" placeholder="Объем">
                    <input type="number" id="semen-conc" placeholder="Конц.">
                    <input type="number" id="semen-pr" placeholder="PR%">
                    <input type="number" id="semen-morph" placeholder="Morph%">
                </div>
                <button onclick="App.calcFertility()" class="btn-primary">Рассчитать IF</button>
                <div id="fertility-result"></div>
            </section>

            <!-- Shop -->
            <section id="shop" class="tab-content">
                <h2>Магазин</h2>
                <div id="shop-list" class="list-container"></div>
                <h2>Глоссарий</h2>
                <div id="glossary-list"></div>
            </section>
        </main>
    </div>
    <script src="assets/js/core/database.js"></script>
    <script src="assets/js/core/engine.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
HTMLEOF

# 4. APP.JS (FIXED LOGIC)
cat > assets/js/app.js << 'APPEOF'
document.addEventListener('DOMContentLoaded', () => {
    const state = { 
        stack: [], 
        plan: [], 
        currentWeekIdx: 0, 
        chartVisibility: { liver:true, cardio:true, hemato:true, neuro:false, kidney:false, endo:false, repro:false },
        xp: 0
    };

    // Tabs Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // Init Substance Select
    const subSelect = document.getElementById('drug-substance');
    if(DB && DB.substances) {
        DB.substances.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            subSelect.appendChild(opt);
        });
    }

    window.App = {
        loadEsters: function() {
            const subId = document.getElementById('drug-substance').value;
            const estSelect = document.getElementById('drug-ester');
            estSelect.innerHTML = '';
            
            // Проверка: есть ли эфиры у этого вещества
            if (DB.esters && DB.esters[subId] && DB.esters[subId].length > 0) {
                estSelect.disabled = false;
                DB.esters[subId].forEach(e => {
                    const opt = document.createElement('option');
                    opt.value = e.id;
                    opt.textContent = `${e.name} (T1/2: ${e.hl} дн.)`;
                    estSelect.appendChild(opt);
                });
            } else {
                // Для оралов и пептидов без эфиров
                estSelect.disabled = true;
                const opt = document.createElement('option');
                opt.value = 'none';
                opt.textContent = 'Таблетки / Пептид';
                estSelect.appendChild(opt);
            }
        },
        
        addDrug: function(e) {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            let esterId = document.getElementById('drug-ester').value;
            if (esterId === 'none') esterId = null;
            
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const start = parseInt(document.getElementById('drug-start').value);
            const end = parseInt(document.getElementById('drug-end').value);
            
            if (start >= end) return alert('Неделя финиша должна быть больше старта!');
            
            state.stack.push({ substanceId: subId, esterId, dose, startWeek: start, endWeek: end });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-ester').disabled = true;
            document.getElementById('drug-start').value = 1;
            document.getElementById('drug-end').value = 8;
            // Сброс выбора эфира визуально
            App.loadEsters(); 
        },
        
        renderStack: function() {
            const list = document.getElementById('stack-list');
            list.innerHTML = '';
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                let esterName = '';
                if (item.esterId && DB.esters[item.substanceId]) {
                    const ester = DB.esters[item.substanceId].find(e => e.id === item.esterId);
                    if (ester) esterName = '(' + ester.name + ')';
                }
                
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div><strong>${sub.name}</strong> ${esterName}<br><small>${item.dose}мг | Недели ${item.startWeek}-${item.endWeek}</small></div>
                    <button class="btn-delete" onclick="App.removeDrug(${idx})">✕</button>
                `;
                list.appendChild(div);
            });
        },
        
        removeDrug: function(idx) {
            state.stack.splice(idx, 1);
            App.renderStack();
        },
        
        generatePlan: function() {
            if (state.stack.length === 0) return alert('Добавьте препараты!');
            state.plan = Engine.generatePlan(state.stack, 20);
            state.currentWeekIdx = 0;
            
            document.getElementById('weekly-plan-output').innerHTML = `<p style="color:#03dac6; text-align:center;">Курс рассчитан на ${state.plan.length} недель.</p>`;
            
            App.renderHeatmap();
            App.renderTrendChart();
            
            state.xp += 150;
            document.getElementById('xp-display').textContent = `XP: ${state.xp}`;
        },
        
        changeWeek: function(dir) {
            if (!state.plan.length) return;
            state.currentWeekIdx += dir;
            if (state.currentWeekIdx < 0) state.currentWeekIdx = 0;
            if (state.currentWeekIdx >= state.plan.length) state.currentWeekIdx = state.plan.length - 1;
            App.renderHeatmap();
        },
        
        toggleChart: function(sys) {
            state.chartVisibility[sys] = !state.chartVisibility[sys];
            App.renderTrendChart();
        },
        
        renderHeatmap: function() {
            if (!state.plan.length) return;
            const weekData = state.plan[state.currentWeekIdx];
            document.getElementById('current-week-display').textContent = `Неделя ${weekData.week}`;
            
            const container = document.getElementById('heatmap-container');
            container.innerHTML = '';
            
            for (let sys in DB.riskMatrix) {
                const sysDiv = document.createElement('div');
                sysDiv.style.gridColumn = '1 / -1';
                sysDiv.style.marginTop = '10px';
                sysDiv.style.color = '#bb86fc';
                sysDiv.style.fontWeight = 'bold';
                sysDiv.textContent = sys.toUpperCase();
                container.appendChild(sysDiv);

                DB.riskMatrix[sys].forEach(mech => {
                    const val = weekData.risks[sys][mech.id] || 0;
                    const cell = document.createElement('div');
                    cell.className = 'heatmap-cell';
                    cell.style.backgroundColor = Engine.getRiskColor(val);
                    cell.style.padding = '10px';
                    cell.style.borderRadius = '4px';
                    cell.style.color = val > 50 ? '#000' : '#fff';
                    cell.style.textAlign = 'center';
                    cell.style.fontSize = '0.8em';
                    cell.innerHTML = `<div>${mech.name}</div><div style="font-weight:bold">${val}%</div>`;
                    cell.title = mech.desc;
                    container.appendChild(cell);
                });
            }
        },
        
        renderTrendChart: function() {
            const ctx = document.getElementById('risk-trend-chart');
            if (!ctx || !state.plan.length) return;
            if (window.trendChartInstance) window.trendChartInstance.destroy();

            const labels = state.plan.map(p => `W${p.week}`);
            const datasets = [];
            const colors = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', neuro: '#9966ff', kidney: '#4bc0c0', endo: '#c9cbcf', repro: '#e7e9ed' };

            for (let sys in state.chartVisibility) {
                if (state.chartVisibility[sys]) {
                    const data = state.plan.map(p => {
                        let sum = 0, cnt = 0;
                        for(let m in p.risks[sys]) { sum += p.risks[sys][m]; cnt++; }
                        return cnt ? Math.round(sum/cnt) : 0;
                    });
                    datasets.push({
                        label: sys.toUpperCase(),
                        data: data,
                        borderColor: colors[sys],
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    });
                }
            }

            window.trendChartInstance = new Chart(ctx, {
                type: 'line',
                data: { labels, datasets },
                options: {
                    responsive: true,
                    interaction: { mode: 'index', intersect: false },
                    plugins: { legend: { labels: { color: 'white' } } },
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } },
                        x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
                    }
                }
            });
        },
        
        calcFertility: function() {
            const vol = parseFloat(document.getElementById('semen-vol').value) || 0;
            const conc = parseFloat(document.getElementById('semen-conc').value) || 0;
            const pr = parseFloat(document.getElementById('semen-pr').value) || 0;
            const morph = parseFloat(document.getElementById('semen-morph').value) || 0;
            
            // Простая формула WHO
            const score = Math.round((Math.min(1, vol/1.5)*15) + (Math.min(1, conc/16)*20) + (Math.min(1, pr/30)*25) + (Math.min(1, morph/4)*20));
            const res = document.getElementById('fertility-result');
            res.innerHTML = `<h3>IF: ${score}/100</h3><p>${score > 60 ? 'Норма' : 'Требуется внимание'}</p>`;
        },
        
        renderSupport: function() {
            const container = document.getElementById('support-schedule');
            container.innerHTML = '';
            if(!DB.supportProtocol) return;
            
            DB.supportProtocol.forEach(block => {
                const blockDiv = document.createElement('div');
                blockDiv.className = 'time-block';
                blockDiv.innerHTML = `<h3>${block.title}</h3>`;
                block.items.forEach(item => {
                    blockDiv.innerHTML += `
                        <div class="support-item">
                            <div class="item-header"><span class="item-name">${item.name}</span><span class="item-dose">${item.dose}</span></div>
                            <div class="item-mechanism">${item.mechanism}</div>
                        </div>
                    `;
                });
                container.appendChild(blockDiv);
            });
        },
        
        renderShop: function() {
            const list = document.getElementById('shop-list');
            list.innerHTML = '';
            if(!DB.shopItems) return;
            for (const [key, items] of Object.entries(DB.shopItems)) {
                items.forEach(item => {
                    list.innerHTML += `<div class="drug-card"><div><strong>${key}</strong><br><small>${item.platform}</small></div><div><span style="color:#03dac6">${item.price}</span></div></div>`;
                });
            }
        },
        
        renderGlossary: function() {
            const list = document.getElementById('glossary-list');
            list.innerHTML = '';
            if(!DB.glossary) return;
            for (const [term, def] of Object.entries(DB.glossary)) {
                list.innerHTML += `<div class="drug-card"><strong>${term}</strong><p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${def}</p></div>`;
            }
        }
    };

    // Form Submit Listener
    document.getElementById('add-drug-form').addEventListener('submit', App.addDrug);

    // Initial Renders
    App.renderStack();
    App.renderSupport();
    App.renderShop();
    App.renderGlossary();
    App.loadEsters(); // Init esters select
});
APPEOF

# 5. CSS UPDATES
cat > assets/css/style.css << 'CSSEOF'
:root { --bg-dark: #121212; --bg-card: #1e1e1e; --primary: #bb86fc; --secondary: #03dac6; --error: #cf6679; --text-main: #fff; --text-sec: #b0b0b0; --border: #333; }
body { margin: 0; font-family: 'Segoe UI', sans-serif; background: var(--bg-dark); color: var(--text-main); padding-bottom: 60px; }
.app-container { max-width: 900px; margin: 0 auto; }
header { background: var(--bg-card); padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.version { font-size: 0.6em; color: var(--secondary); }
.status-bar { font-size: 0.9em; color: var(--primary); font-weight: bold; }

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
button { padding: 12px 20px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; background: var(--primary); color: #000; }
.btn-delete { background: rgba(207, 102, 121, 0.2); color: var(--error); padding: 8px 12px; font-size: 0.9em; }
.btn-success { background: #03dac6; color: #000; width: 100%; margin-top: 20px; font-size: 1.1em; }

.list-container, .schedule-container { display: flex; flex-direction: column; gap: 12px; }
.drug-card, .support-item { background: var(--bg-card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--secondary); display: flex; justify-content: space-between; align-items: center; }
.support-item { flex-direction: column; align-items: flex-start; border-left-color: var(--primary); width: 100%; box-sizing: border-box; }
.item-header { display: flex; justify-content: space-between; width: 100%; font-weight: bold; }
.item-dose { color: var(--secondary); }
.item-mechanism { font-size: 0.85em; color: var(--text-sec); margin-top: 4px; }
.time-block { background: #252525; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.time-block h3 { color: var(--primary); margin: 0 0 10px; font-size: 0.9em; text-transform: uppercase; }

/* Heatmap */
.heatmap-grid { display: grid; gap: 5px; margin-top: 15px; }
.heatmap-cell { transition: transform 0.2s; cursor: help; }
.heatmap-cell:hover { transform: scale(1.05); z-index: 10; box-shadow: 0 0 10px rgba(0,0,0,0.5); }

/* Charts */
.chart-controls { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; background: var(--bg-card); padding: 10px; border-radius: 8px; }
.chart-controls label { display: flex; align-items: center; gap: 5px; font-size: 0.9em; cursor: pointer; }
.week-selector { display: flex; justify-content: center; align-items: center; gap: 20px; margin: 20px 0; }
.week-selector button { padding: 5px 15px; font-size: 1.2em; }
#current-week-display { font-size: 1.2em; font-weight: bold; color: var(--secondary); min-width: 120px; text-align: center; }
canvas { max-width: 100%; margin: 20px 0; background: var(--bg-card); border-radius: 12px; padding: 10px; }
CSSEOF

# 6. GIT PUSH
echo "🚀 Committing Stage 8: Data Recovery & Stability..."
git add -A
git commit -m "Stage 8: Data Recovery, Fixed Esters Logic, Full Support Protocol, Safe Calculations"
git push origin main --force

echo "✅ Stage 8 Complete! Check Actions."
