const DB = {
    substances: [
        { id: 'test', name: 'Тестостерон', baseToxicity: { liver: 1, lipid: 3, hct: 4, neuro: 0, kidney: 1, endo: 2, repro: 5 } },
        { id: 'nandrolone', name: 'Нандролон', baseToxicity: { liver: 1, lipid: 4, hct: 2, neuro: 0, kidney: 2, endo: 4, repro: 4 } },
        { id: 'trenbolone', name: 'Тренболон', baseToxicity: { liver: 2, lipid: 5, hct: 3, neuro: 5, kidney: 3, endo: 5, repro: 5 } },
        { id: 'boldenone', name: 'Болденон', baseToxicity: { liver: 1, lipid: 3, hct: 6, neuro: 0, kidney: 1, endo: 1, repro: 3 } },
        { id: 'dhb', name: 'Дигидроболденон (DHB)', baseToxicity: { liver: 1, lipid: 4, hct: 5, neuro: 0, kidney: 2, endo: 1, repro: 2 } },
        { id: 'masteron', name: 'Мастерон', baseToxicity: { liver: 1, lipid: 4, hct: 3, neuro: 0, kidney: 1, endo: 1, repro: 3 } },
        { id: 'primobolan', name: 'Примоболан', baseToxicity: { liver: 1, lipid: 3, hct: 2, neuro: 0, kidney: 1, endo: 1, repro: 2 } },
        { id: 'oxandrolone', name: 'Оксандролон', baseToxicity: { liver: 5, lipid: 5, hct: 1, neuro: 0, kidney: 1, endo: 2, repro: 3 } },
        { id: 'stanozolol', name: 'Станозолол', baseToxicity: { liver: 6, lipid: 5, hct: 2, neuro: 0, kidney: 2, endo: 2, repro: 3 } },
        { id: 'methandienone', name: 'Метандиенон', baseToxicity: { liver: 6, lipid: 4, hct: 3, neuro: 0, kidney: 1, endo: 3, repro: 4 } },
        { id: 'gh', name: 'Гормон Роста', baseToxicity: { liver: 0, lipid: 2, hct: 0, neuro: 0, kidney: 1, endo: 5, repro: 0 } },
        { id: 'insulin', name: 'Инсулин', baseToxicity: { liver: 0, lipid: 1, hct: 0, neuro: 2, kidney: 0, endo: 5, repro: 0 } },
        { id: 'igf1', name: 'IGF-1', baseToxicity: { liver: 0, lipid: 0, hct: 0, neuro: 1, kidney: 1, endo: 4, repro: 0 } },
        { id: 'mgf', name: 'MGF / PEG-MGF', baseToxicity: { liver: 0, lipid: 0, hct: 0, neuro: 0, kidney: 0, endo: 2, repro: 0 } }
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
        'gh': [{ id: 'gh_gen', name: 'Соматропин (Ежедневно)', halfLife: 0.1 }],
        'insulin': [
            { id: 'insulin_r', name: 'Короткий (Actrapid/Humulin)', halfLife: 0.1 },
            { id: 'insulin_g', name: 'Продленный (Glargine/Degludec)', halfLife: 24.0 }
        ],
        'igf1': [
            { id: 'igf1_lr3', name: 'IGF-1 LR3 (Длинный)', halfLife: 24.0 },
            { id: 'igf1_des', name: 'IGF-1 DES (Короткий)', halfLife: 0.5 }
        ],
        'mgf': [
            { id: 'mgf_nat', name: 'MGF (Короткий)', halfLife: 0.5 },
            { id: 'mgf_peg', name: 'PEG-MGF (Длинный)', halfLife: 168.0 }
        ]
    },

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

    riskMatrixDef: {
        liver: ['cholestasis', 'oxidative_stress', 'cytolysis', 'fibrosis', 'mitochondrial', 'methylation', 'apoptosis'],
        cardio: ['hypertension', 'tachycardia', 'dyslipidemia', 'thrombosis', 'hypertrophy', 'endothelial', 'arrhythmia'],
        kidney: ['hyperfiltration', 'fibrosis', 'electrolytes', 'proteinuria', 'glomerulosclerosis', 'tubular', 'stones'],
        neuro: ['dopamine_imbalance', 'glutamate_excitotoxicity', 'gaba_dysregulation', 'serotonin_syndrome', 'neuroinflammation', 'cognitive_decline', 'addiction'],
        hemato: ['erythrocytosis', 'viscosity_high', 'coagulation_high', 'anemia', 'leukocytosis', 'thrombocytopenia', 'hemolysis'],
        endo: ['insulin_resistance', 'estrogen_dominance', 'prolactin_elevation', 'thyroid_suppression', 'cortisol_dysregulation', 'gh_axis_suppression', 'adrenal_fatigue'],
        repro: ['testicular_atrophy', 'hpa_suppression', 'sperm_quality_low', 'libido_crash', 'erectile_dysfunction', 'gynecomastia', 'infertility']
    },

    shopItems: {
        'udca': [{ platform: 'Ozon', price: '1500 ₽', url: '#' }],
        'telmisartan': [{ platform: 'Apteka.ru', price: '600 ₽', url: '#' }],
        'nebivolol': [{ platform: 'Ozon', price: '400 ₽', url: '#' }],
        'berberine': [{ platform: 'iHerb', price: '$20', url: '#' }],
        'taurine': [{ platform: 'Ozon', price: '800 ₽', url: '#' }],
        'magnesium': [{ platform: 'Ozon', price: '900 ₽', url: '#' }]
    },

    glossary: {
        'AR Affinity': 'Сродство к андрогенным рецепторам.',
        'Half-life': 'Период полувыведения.',
        'Raw Risk': 'Риск без поддержки.',
        'Net Risk': 'Риск с учетом защиты.',
        'IGF-1 LR3': 'Длинная версия IGF-1 (24ч), системное действие.',
        'PEG-MGF': 'Пегилированная форма MGF, длительное действие (неделя).'
    }
};
