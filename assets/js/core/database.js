const DB = {
    substances: [
        { id: 'test', name: 'Тестостерон', baseTox: { liver: 1, lipid: 3, hct: 4, neuro: 0, kidney: 1, endo: 2, repro: 5 } },
        { id: 'nandrolone', name: 'Нандролон', baseTox: { liver: 1, lipid: 4, hct: 2, neuro: 0, kidney: 2, endo: 4, repro: 4 } },
        { id: 'trenbolone', name: 'Тренболон', baseTox: { liver: 2, lipid: 5, hct: 3, neuro: 5, kidney: 4, endo: 4, repro: 5 } },
        { id: 'boldenone', name: 'Болденон', baseTox: { liver: 1, lipid: 3, hct: 6, neuro: 0, kidney: 1, endo: 1, repro: 3 } },
        { id: 'dhb', name: 'DHB', baseTox: { liver: 1, lipid: 4, hct: 5, neuro: 0, kidney: 3, endo: 1, repro: 3 } },
        { id: 'masteron', name: 'Мастерон', baseTox: { liver: 1, lipid: 4, hct: 3, neuro: 0, kidney: 1, endo: 1, repro: 4 } },
        { id: 'primobolan', name: 'Примоболан', baseTox: { liver: 1, lipid: 3, hct: 2, neuro: 0, kidney: 1, endo: 1, repro: 2 } },
        { id: 'oxandrolone', name: 'Оксандролон', baseTox: { liver: 4, lipid: 5, hct: 1, neuro: 0, kidney: 1, endo: 1, repro: 2 } },
        { id: 'stanozolol', name: 'Станозолол', baseTox: { liver: 5, lipid: 5, hct: 2, neuro: 0, kidney: 2, endo: 1, repro: 3 } },
        { id: 'methandienone', name: 'Метандиенон', baseTox: { liver: 5, lipid: 4, hct: 3, neuro: 0, kidney: 1, endo: 3, repro: 3 } },
        { id: 'gh', name: 'Гормон Роста', baseTox: { liver: 0, lipid: 2, hct: 0, neuro: 0, kidney: 1, endo: 5, repro: 0 } },
        { id: 'insulin', name: 'Инсулин', baseTox: { liver: 0, lipid: 1, hct: 0, neuro: 0, kidney: 0, endo: 5, repro: 0 } },
        { id: 'igf1', name: 'IGF-1', baseTox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kidney: 2, endo: 4, repro: 0 } },
        { id: 'mgf', name: 'MGF / PEG-MGF', baseTox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kidney: 1, endo: 2, repro: 0 } }
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
        'stanozolol': [{ id: 'stanozolol_susp', name: 'Суспензия', halfLife: 1.0 }],
        'oxandrolone': [], // Oral
        'methandienone': [], // Oral
        'gh': [
            { id: 'gh_short', name: 'Ежедневно', halfLife: 0.1 },
            { id: 'gh_long', name: 'Пролонг', halfLife: 168.0 }
        ],
        'insulin': [
            { id: 'insulin_r', name: 'Короткий (R)', halfLife: 0.1 },
            { id: 'insulin_l', name: 'Продленный (Glargine)', halfLife: 24.0 }
        ],
        'igf1': [
            { id: 'igf1_lr3', name: 'LR3 (Long)', halfLife: 24.0 },
            { id: 'igf1_des', name: 'DES (Short)', halfLife: 0.5 }
        ],
        'mgf': [
            { id: 'mgf_plain', name: 'MGF', halfLife: 0.5 },
            { id: 'peg_mgf', name: 'PEG-MGF', halfLife: 48.0 }
        ]
    },

    riskMatrix: {
        liver: { mechanisms: [
            { id: 'cholestasis', name: 'Холестаз' }, { id: 'oxidative', name: 'Окс. стресс' },
            { id: 'cytolysis', name: 'Цитолиз' }, { id: 'fibrosis', name: 'Фиброз' },
            { id: 'mito', name: 'Митохондрии' }, { id: 'methylation', name: 'Метилирование' },
            { id: 'apoptosis', name: 'Апоптоз' }
        ]},
        cardio: { mechanisms: [
            { id: 'htn', name: 'Гипертония' }, { id: 'tachycardia', name: 'Тахикардия' },
            { id: 'lipids', name: 'Дислипидемия' }, { id: 'thrombo', name: 'Тромбоз' },
            { id: 'lvh', name: 'Гипертрофия' }, { id: 'endo', name: 'Эндотелий' },
            { id: 'arrhythmia', name: 'Аритмия' }
        ]},
        kidney: { mechanisms: [
            { id: 'hyperfiltration', name: 'Гиперфильтрация' }, { id: 'fibrosis_k', name: 'Фиброз' },
            { id: 'electrolytes', name: 'Электролиты' }, { id: 'proteinuria', name: 'Протеинурия' },
            { id: 'stones', name: 'Камни' }, { id: 'tubular', name: 'Некроз' },
            { id: 'gfr_drop', name: 'Падение СКФ' }
        ]},
        neuro: { mechanisms: [
            { id: 'dopamine', name: 'Дофамин' }, { id: 'glutamate', name: 'Глутамат' },
            { id: 'gaba', name: 'ГАМК' }, { id: 'serotonin', name: 'Серотонин' },
            { id: 'inflammation', name: 'Воспаление' }, { id: 'cognitive', name: 'Когнитив' },
            { id: 'addiction', name: 'Зависимость' }
        ]},
        hemato: { mechanisms: [
            { id: 'erythrocytosis', name: 'Эритроцитоз' }, { id: 'viscosity', name: 'Вязкость' },
            { id: 'coagulation', name: 'Коагуляция' }, { id: 'anemia', name: 'Анемия' },
            { id: 'leukocytosis', name: 'Лейкоцитоз' }, { id: 'platelets', name: 'Тромбоциты' },
            { id: 'hemolysis', name: 'Гемолиз' }
        ]},
        endo: { mechanisms: [
            { id: 'insulin_res', name: 'Инсулинорезист.' }, { id: 'estrogen', name: 'Эстроген' },
            { id: 'prolactin', name: 'Пролактин' }, { id: 'thyroid', name: 'Щитовидка' },
            { id: 'cortisol', name: 'Кортизол' }, { id: 'gh_axis', name: 'Ось ГР' },
            { id: 'adrenal', name: 'Надпочечники' }
        ]},
        repro: { mechanisms: [
            { id: 'atrophy', name: 'Атрофия' }, { id: 'suppression', name: 'Подавление' },
            { id: 'sperm', name: 'Сперма' }, { id: 'libido', name: 'Либидо' },
            { id: 'erectile', name: 'Эрекция' }, { id: 'gyno', name: 'Гино' },
            { id: 'infertility', name: 'Бесплодие' }
        ]}
    },

    supportProtocol: [
        { timeId: 'morning_empty', title: '☀️ Натощак', items: [
            { name: 'Iron Guard', dose: '2 капс', mechanism: 'Железо' },
            { name: 'Цитиколин', dose: '500 мг', mechanism: 'Мозг' },
            { name: 'Наттокиназа', dose: '2 капс', mechanism: 'Кровь' },
            { name: 'Таурин', dose: '2000 мг', mechanism: 'Сердце' }
        ]},
        { timeId: 'morning_food', title: '🍳 Завтрак', items: [
            { name: 'Астрагал', dose: '500 мг', mechanism: 'Почки' },
            { name: 'Небилет', dose: '2.5 мг', mechanism: 'Давление' },
            { name: 'Тадалафил', dose: '5 мг', mechanism: 'Поток' },
            { name: 'Берберин', dose: '500 мг', mechanism: 'Сахар' },
            { name: 'D3 + K2', dose: '5000 МЕ', mechanism: 'Кости' },
            { name: 'TMG + Метилфолат', dose: '1г', mechanism: 'Метил' },
            { name: 'Бергамот', dose: '500 мг', mechanism: 'Липиды' }
        ]},
        { timeId: 'lunch', title: '🍲 Обед', items: [
            { name: 'УДХК', dose: '1000 мг', mechanism: 'Желчь' },
            { name: 'Пентоксифиллин', dose: '400 мг', mechanism: 'Вязкость' },
            { name: 'Joint Health', dose: '2 капс', mechanism: 'Суставы' }
        ]},
        { timeId: 'evening', title: '🌙 Вечер', items: [
            { name: 'Телмисартан', dose: '80 мг', mechanism: 'Давление' },
            { name: 'Магний', dose: '400 мг', mechanism: 'Расслабление' },
            { name: 'L-Теанин', dose: '400 мг', mechanism: 'Сон' }
        ]}
    ],
    
    shopItems: {
        'udca': [{ platform: 'Ozon', price: '1500₽', url: '#' }],
        'telmisartan': [{ platform: 'Apteka', price: '600₽', url: '#' }],
        'berberine': [{ platform: 'iHerb', price: '$20', url: '#' }]
    },
    glossary: {
        'Raw Risk': 'Риск без защиты',
        'Net Risk': 'Риск с защитой',
        'Half-life': 'Период полувыведения'
    }
};
