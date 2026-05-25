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
        'stanozolol': [{ id: 'stanozolol_susp', name: 'Суспензия', halfLife: 24.0 }], // Условно
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

    // Полная матрица 7x7 с описаниями
    riskMatrix: {
        liver: {
            mechanisms: [
                { id: 'cholestasis', name: 'Холестаз', desc: 'Застой желчи' },
                { id: 'oxidative', name: 'Окс. стресс', desc: 'Свободные радикалы' },
                { id: 'cytolysis', name: 'Цитолиз', desc: 'Разрушение клеток (ALT/AST)' },
                { id: 'fibrosis', name: 'Фиброз', desc: 'Рубцевание ткани' },
                { id: 'mito', name: 'Митохондрии', desc: 'Энергодефицит' },
                { id: 'methylation', name: 'Метилирование', desc: 'Дефицит метил-групп' },
                { id: 'apoptosis', name: 'Апоптоз', desc: 'Гибель клеток' }
            ]
        },
        cardio: {
            mechanisms: [
                { id: 'htn', name: 'Гипертония', desc: 'Высокое АД' },
                { id: 'tachycardia', name: 'Тахикардия', desc: 'Высокий пульс' },
                { id: 'lipids', name: 'Дислипидемия', desc: 'ЛПНП↑ / ЛПВП↓' },
                { id: 'thrombo', name: 'Тромбоз', desc: 'Сгущение крови' },
                { id: 'lvh', name: 'Гипертрофия', desc: 'Утолщение стенок' },
                { id: 'endo', name: 'Эндотелий', desc: 'Дисфункция сосудов' },
                { id: 'arrhythmia', name: 'Аритмия', desc: 'Сбой ритма' }
            ]
        },
        kidney: {
            mechanisms: [
                { id: 'hyperfiltration', name: 'Гиперфильтрация', desc: 'Перегрузка клубочков' },
                { id: 'fibrosis_k', name: 'Фиброз почек', desc: 'Рубцевание' },
                { id: 'electrolytes', name: 'Электролиты', desc: 'Дисбаланс K/Na' },
                { id: 'proteinuria', name: 'Протеинурия', desc: 'Белок в моче' },
                { id: 'stones', name: 'Камни', desc: 'Нефролитиаз' },
                { id: 'tubular', name: 'Тубулярный некроз', desc: 'Отмирание канальцев' },
                { id: 'gfr_drop', name: 'Падение СКФ', desc: 'Снижение функции' }
            ]
        },
        neuro: {
            mechanisms: [
                { id: 'dopamine', name: 'Дофамин', desc: 'Дисбаланс (агрессия/апатия)' },
                { id: 'glutamate', name: 'Глутамат', desc: 'Эксайтотоксичность' },
                { id: 'gaba', name: 'ГАМК', desc: 'Тревожность/Бессонница' },
                { id: 'serotonin', name: 'Серотонин', desc: 'Перепады настроения' },
                { id: 'inflammation', name: 'Нейровоспаление', desc: 'Микроглия' },
                { id: 'cognitive', name: 'Когнитивный спад', desc: 'Память/Фокус' },
                { id: 'addiction', name: 'Зависимость', desc: 'Дофаминовая яма' }
            ]
        },
        hemato: {
            mechanisms: [
                { id: 'erythrocytosis', name: 'Эритроцитоз', desc: 'Высокий гематокрит' },
                { id: 'viscosity', name: 'Вязкость', desc: 'Густая кровь' },
                { id: 'coagulation', name: 'Коагуляция', desc: 'Свертываемость' },
                { id: 'anemia', name: 'Анемия', desc: 'Дефицит железа/B12' },
                { id: 'leukocytosis', name: 'Лейкоцитоз', desc: 'Воспаление' },
                { id: 'platelets', name: 'Тромбоциты', desc: 'Агрегация' },
                { id: 'hemolysis', name: 'Гемолиз', desc: 'Разрушение эритроцитов' }
            ]
        },
        endo: {
            mechanisms: [
                { id: 'insulin_res', name: 'Инсулинорезистентность', desc: 'Рост сахара' },
                { id: 'estrogen', name: 'Эстроген', desc: 'Гинекомастия/Отеки' },
                { id: 'prolactin', name: 'Пролактин', desc: 'Либидо↓/Потенция' },
                { id: 'thyroid', name: 'Щитовидка', desc: 'Снижение Т3/Т4' },
                { id: 'cortisol', name: 'Кортизол', desc: 'Катаболизм/Стресс' },
                { id: 'gh_axis', name: 'Ось ГР', desc: 'Снижение собственного' },
                { id: 'adrenal', name: 'Надпочечники', desc: 'Истощение' }
            ]
        },
        repro: {
            mechanisms: [
                { id: 'atrophy', name: 'Атрофия', desc: 'Уменьшение тестикул' },
                { id: 'suppression', name: 'Подавление оси', desc: 'Нет своего Тестостерона' },
                { id: 'sperm', name: 'Спермогенез', desc: 'Качество спермы↓' },
                { id: 'libido', name: 'Либидо', desc: 'Падение влечения' },
                { id: 'erectile', name: 'Эрекция', desc: 'ЭД' },
                { id: 'gyno', name: 'Гинекомастия', desc: 'Рост груди' },
                { id: 'infertility', name: 'Бесплодие', desc: 'Невозможность зачатия' }
            ]
        }
    },

    supportProtocol: [ /* ... (сокращено для бревитии, остается как в Stage 3) ... */ 
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
        { timeId: 'evening', title: '🌙 Вечер', items: [
            { name: 'Телмисартан', dose: '80 мг', mechanism: 'Давление/Почки', risks: ['cardio_htn', 'kidney_hyperfiltration'] },
            { name: 'Магний', dose: '400 мг', mechanism: 'Расслабление', risks: ['neuro_gaba', 'cardio_arrhythmia'] },
            { name: 'L-Теанин', dose: '400 мг', mechanism: 'Сон', risks: ['neuro_gaba'] },
            { name: 'Гормон Роста', dose: '5 ЕД', mechanism: 'Рост', risks: ['endo_gh_axis'], note: 'Инъекция' }
        ]}
    ],
    
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
