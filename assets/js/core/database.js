const DB = {
    // 1.1 ФАРМАКОЛОГИЯ (130+ препаратов, сокращенная полная версия для примера, в проде - полный список)
    drugs: [
        { id: 'test_e', name: 'Тестостерон Энантат', type: 'ester', halfLife: 7.0, arAffinity: 100, conversionE2: 0.3, hepatotoxicity: 1, lipidImpact: 3, erythrocytosisRisk: 4, neuroToxic: false },
        { id: 'test_p', name: 'Тестостерон Пропионат', type: 'ester', halfLife: 2.0, arAffinity: 100, conversionE2: 0.3, hepatotoxicity: 1, lipidImpact: 3, erythrocytosisRisk: 4, neuroToxic: false },
        { id: 'nandrolon_d', name: 'Нандролон Деканоат', type: 'ester', halfLife: 14.0, arAffinity: 130, conversionE2: 0.2, progestinActivity: 0.9, hepatotoxicity: 1, lipidImpact: 4, erythrocytosisRisk: 2, neuroToxic: false },
        { id: 'trenbolone_e', name: 'Тренболон Энантат', type: 'ester', halfLife: 7.0, arAffinity: 180, conversionE2: 0.0, progestinActivity: 1.5, hepatotoxicity: 2, lipidImpact: 5, erythrocytosisRisk: 3, neuroToxic: true },
        { id: 'dhb', name: 'Дигидроболденон (DHB)', type: 'ester', halfLife: 10.0, arAffinity: 150, conversionE2: 0.0, progestinActivity: 0.1, hepatotoxicity: 1, lipidImpact: 4, erythrocytosisRisk: 5, neuroToxic: false, note: 'NOT BOLDENONE' },
        { id: 'boldenone_u', name: 'Болденон Ундесиленат', type: 'ester', halfLife: 14.0, arAffinity: 100, conversionE2: 0.15, hepatotoxicity: 1, lipidImpact: 3, erythrocytosisRisk: 6, neuroToxic: false },
        { id: 'masteron_e', name: 'Мастерон Энантат', type: 'ester', halfLife: 7.0, arAffinity: 120, conversionE2: 0.0, antiEstrogenic: 0.8, hepatotoxicity: 1, lipidImpact: 4, erythrocytosisRisk: 3, neuroToxic: false },
        { id: 'oxandrolone', name: 'Оксандролон', type: 'oral', halfLife: 9.0, arAffinity: 130, conversionE2: 0.0, hepatotoxicity: 4, lipidImpact: 5, erythrocytosisRisk: 1, neuroToxic: false },
        { id: 'stanozolol', name: 'Станозолол', type: 'oral', halfLife: 9.0, arAffinity: 130, conversionE2: 0.0, hepatotoxicity: 5, lipidImpact: 5, erythrocytosisRisk: 2, neuroToxic: false },
        { id: 'methandienone', name: 'Метандиенон', type: 'oral', halfLife: 5.0, arAffinity: 90, conversionE2: 0.4, hepatotoxicity: 5, lipidImpact: 4, erythrocytosisRisk: 3, neuroToxic: false },
        { id: 'gh', name: 'Гормон Роста', type: 'peptide', halfLife: 0.1, igf1Boost: 100, insulinResistRisk: 4 },
        { id: 'insulin', name: 'Инсулин Короткий', type: 'hormone', halfLife: 0.1, hypoRisk: 5, lipogenesis: 5 },
        { id: 'anastrozole', name: 'Анастрозол', type: 'ai', halfLife: 48.0, aromataseInhibition: 5 },
        { id: 'cabergoline', name: 'Каберголин', type: 'dopamine_agonist', halfLife: 168.0, d2Agonist: 5, prolactinSuppress: 5 },
        { id: 'hcg', name: 'HCG', type: 'peptide', halfLife: 36.0, lhActivity: 100 },
        { id: 'semaglutide', name: 'Семаглутид', type: 'peptide_mimetic', halfLife: 168.0, glp1Agonist: 5 },
        { id: 'telmisartan', name: 'Телмисартан', type: 'arb', halfLife: 24.0, at1Blocker: 5 },
        { id: 'udca', name: 'УДХК', type: 'bile_acid', halfLife: 4.0, cholestasisPrevent: 5 },
        { id: 'pentoxifylline', name: 'Пентоксифиллин', type: 'hemorheologic', halfLife: 1.5, rbcFlexibility: 5 },
        { id: 'berberine', name: 'Берберин', type: 'alkaloid', halfLife: 4.0, ampkActivator: 5 }
        // ... здесь будут остальные 110 препаратов при полном заполнении
    ],

    // 1.2 ПРОТОКОЛ ПОДДЕРЖКИ (СТРОГО ИЗ ТЗ)
    supportProtocol: [
        { timeId: 'morning_empty', title: '☀️ Натощак', items: [
            { name: 'Iron Guard', dose: '2 капс', mechanism: 'Субстрат гема', risksCovered: ['hemato_deficiency'] },
            { name: 'Цитиколин', dose: '500 мг', mechanism: 'Нейропластичность', risksCovered: ['neuro_dopamine'] },
            { name: 'Серрапептаза+Наттокиназа', dose: '2 капс', mechanism: 'Фибринолиз', risksCovered: ['cardio_thrombo', 'hemato_rheology'] },
            { name: 'Таурин', dose: '2000 мг', mechanism: 'Антагонист AngII', risksCovered: ['cardio_htn', 'neuro_glutamate'] }
        ]},
        { timeId: 'morning_food', title: '🍳 Утро', items: [
            { name: 'Астрагал', dose: '500 мг', mechanism: 'Нефропротекция', risksCovered: ['kidney_fibrosis'] },
            { name: 'Небилет', dose: '2.5 мг', mechanism: 'Beta-1 блокатор', risksCovered: ['cardio_htn', 'cardio_tachycardia'] },
            { name: 'Тадалафил', dose: '5 мг', mechanism: 'PDE5 ингибитор', risksCovered: ['cardio_endothelial'] },
            { name: 'Берберин', dose: '500 мг', mechanism: 'AMPK активатор', risksCovered: ['endo_insulin'] },
            { name: 'Вит D3+K2', dose: '5000 МЕ', mechanism: 'Кальций-менеджмент', risksCovered: ['bone_health'] },
            { name: 'TMG+Метилфолат', dose: '1000 мг', mechanism: 'Метилирование', risksCovered: ['cardio_thrombo_homocysteine'] },
            { name: 'Бромантан+Фасорацетам', dose: '50+100 мг', mechanism: 'Актопротектор+Ноотроп', risksCovered: ['neuro_fatigue'] }
        ]},
        { timeId: 'lunch', title: '🍲 Обед', items: [
            { name: 'УДХК', dose: '1000 мг', mechanism: 'Антихолестаз', risksCovered: ['liver_cholestasis'] },
            { name: 'Пентоксифиллин', dose: '400 мг', mechanism: 'Реология крови', risksCovered: ['hemato_viscosity'] },
            { name: 'Joint Health', dose: '2 капс', mechanism: 'Хондропротекция', risksCovered: ['oda_cartilage'] },
            { name: 'Витамин Е', dose: '400 МЕ', mechanism: 'Антиоксидант', risksCovered: ['oxidative_stress'] }
        ]},
        { timeId: 'pre_workout', title: '💪 Предтреник', items: [
            { name: 'Агмантин', dose: '1000 мг', mechanism: 'NO буст', risksCovered: ['cardio_pump'] }
        ]},
        { timeId: 'intra_workout', title: '🥤 Intra-Workout', items: [
            { name: 'Цитруллин', dose: '6 г', mechanism: 'NO прекурсор', risksCovered: ['pump'] },
            { name: 'Креатин', dose: '5 г', mechanism: 'АТФ ресинтез', risksCovered: ['power'] },
            { name: 'Таурин', dose: '2000 мг', mechanism: 'Анти-спазм', risksCovered: ['cramps'] }
        ]},
        { timeId: 'evening', title: '🌙 Вечер', items: [
            { name: 'Телмисартан', dose: '80 мг', mechanism: 'ARB', risksCovered: ['cardio_htn', 'kidney_hyperfiltration'] },
            { name: 'Магний', dose: '400 мг', mechanism: 'Релаксант', risksCovered: ['neuro_excitability'] },
            { name: 'L-Теанин', dose: '400 мг', mechanism: 'ГАМК агонист', risksCovered: ['stress'] },
            { name: 'Гормон Роста', dose: '5 ЕД', mechanism: 'Липолиз', risksCovered: ['recovery'], note: 'INJECTION' }
        ]},
        { timeId: 'cycle_specific', title: '💉 Специфическое', items: [
            { name: 'HCG', dose: '500 МЕ 2р/нед', mechanism: 'Сохранение тестикул', risksCovered: ['repro_atrophy'] },
            { name: 'Анастрозол', dose: '0.5 мг 2р/нед', mechanism: 'Контроль E2', risksCovered: ['endo_estrogen'], note: 'IF HIGH' },
            { name: 'Каберголин', dose: '0.25 мг 2р/нед', mechanism: 'Контроль PRL', risksCovered: ['endo_prolactin'], note: 'IF HIGH' },
            { name: 'BPC-157+TB-500', dose: '250мкг/2.5мг', mechanism: 'Регенерация', risksCovered: ['oda_injury'] }
        ]}
    ],

    // 1.3 МАТРИЦА РИСКОВ 7x7
    riskMatrixDefinition: {
        liver: { mechanisms: ['cholestasis', 'oxidative_stress', 'cytolysis', 'fibrosis', 'mitochondrial_dysfunction', 'methylation_deficit', 'apoptosis'] },
        cardio: { mechanisms: ['hypertension', 'tachycardia', 'dyslipidemia', 'thrombosis', 'hypertrophy_lvh', 'endothelial_dysfunction', 'arrhythmia'] },
        kidney: { mechanisms: ['hyperfiltration', 'fibrosis', 'electrolyte_imbalance', 'proteinuria', 'glomerulosclerosis', 'tubular_necrosis', 'stones'] },
        neuro: { mechanisms: ['dopamine_imbalance', 'glutamate_excitotoxicity', 'gaba_dysregulation', 'serotonin_syndrome', 'neuroinflammation', 'cognitive_decline', 'addiction_potential'] },
        hemato: { mechanisms: ['erythrocytosis', 'viscosity_high', 'coagulation_high', 'anemia_deficiency', 'leukocytosis', 'thrombocytopenia', 'hemolysis'] },
        endo: { mechanisms: ['insulin_resistance', 'estrogen_dominance', 'prolactin_elevation', 'thyroid_suppression', 'cortisol_dysregulation', 'gh_igf1_axis_suppression', 'adrenal_fatigue'] },
        repro: { mechanisms: ['testicular_atrophy', 'hpa_suppression', 'sperm_quality_low', 'libido_crash', 'erectile_dysfunction', 'gynecomastia', 'infertility'] }
    },

    // 1.4 ГЕНЕТИКА
    genetics: [
        { id: 'mthfr_c677t', name: 'MTHFR C677T', effect: 'methylation_deficit', multiplier: 1.5 },
        { id: 'comt_met_met', name: 'COMT Met/Met', effect: 'dopamine_sensitivity', multiplier: 1.4 },
        { id: 'agtr1_a1166c', name: 'AGTR1 A1166C', effect: 'hypertension_risk', multiplier: 1.3 }
    ]
};

// --- ДОПОЛНЕНИЯ STAGE 3 ---

// 1.4 БАЗА ЭФИРОВ (Для калькулятора дозировок)
DB.esters = {
    'propionate': { name: 'Пропионат', halfLife: 2, releaseFactor: 0.8 },
    'acetate': { name: 'Ацетат', halfLife: 3, releaseFactor: 0.85 },
    'phenylpropionate': { name: 'Фенилпропионат', halfLife: 4.5, releaseFactor: 0.9 },
    'enanthate': { name: 'Энантат', halfLife: 7, releaseFactor: 0.7 },
    'cypionate': { name: 'Ципионат', halfLife: 8, releaseFactor: 0.7 },
    'decanoate': { name: 'Деканоат', halfLife: 14, releaseFactor: 0.6 },
    'undecylenate': { name: 'Ундесиленат', halfLife: 14, releaseFactor: 0.6 },
    'hexahydrobenzylcarbonate': { name: 'Гексагидробензилкарбонат', halfLife: 10, releaseFactor: 0.65 }
};

// 1.5 МАГАЗИН (MAPPING)
DB.shopMapping = {
    'telmisartan': [
        { platform: 'Ozon', price: '450 ₽', url: '#', inStock: true },
        { platform: 'Apteka.ru', price: '420 ₽', url: '#', inStock: true }
    ],
    'udca': [
        { platform: 'Ozon', price: '1200 ₽', url: '#', inStock: true },
        { platform: 'iHerb', price: '$25', url: '#', inStock: false }
    ],
    'berberine': [
        { platform: 'iHerb', price: '$18', url: '#', inStock: true }
    ],
    // ... можно расширять
};

// 1.6 СТАТЬИ И ГЛОССАРИЙ
DB.articles = [
    { id: 1, title: 'Кардиопротекция на курсе ААС', category: 'Health', views: 1205, content: 'Полный гайд по защите сердца...' },
    { id: 2, title: 'Как читать анализы: Липидный профиль', category: 'Labs', views: 850, content: 'Разбор ЛПВП, ЛПНП, Триглицеридов...' },
    { id: 3, title: 'ПКТ: Кломид или Тамоксифен?', category: 'Therapy', views: 2100, content: 'Сравнение SERMs...' }
];

DB.glossary = {
    'AR Affinity': 'Сродство к андрогенному рецептору. Чем выше, тем сильнее анаболический эффект.',
    'Hematocrit': 'Доля эритроцитов в крови. Критический порог >54%.',
    'Half-life': 'Период полувыведения вещества из организма.',
    'Estradiol Conversion': 'Способность ароматизироваться в эстрадиол.'
};

// 1.7 ГАМИФИКАЦИЯ
DB.achievements = [
    { id: 'first_stack', title: 'Первый стек', desc: 'Добавь первый препарат', xp: 50, icon: '💉' },
    { id: 'lab_geek', title: 'Лабораторный гений', desc: 'Загрузи первые анализы', xp: 100, icon: '🧬' },
    { id: 'trust_100', title: 'Доверие', desc: 'Trust Score 100', xp: 500, icon: '👑' }
];
