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
