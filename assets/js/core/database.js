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
