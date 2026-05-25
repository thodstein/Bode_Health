#!/bin/bash
echo "🚀 STAGE 7: Fix Esters/Risks Logic & Full Content Fill"

# 1. CORE DATABASE (Full Content & Correct Structures)
echo "💾 Updating Database with Full Content..."
cat > assets/js/core/database.js << 'DBEOF'
const DB = {
    substances: [
        { id: 'test', name: 'Тестостерон', baseTox: { liver: 1, lipid: 3, hct: 4, neuro: 0, kidney: 1, endo: 2, repro: 5 } },
        { id: 'nandrolone', name: 'Нандролон', baseTox: { liver: 1, lipid: 4, hct: 2, neuro: 0, kidney: 2, endo: 4, repro: 4 } },
        { id: 'trenbolone', name: 'Тренболон', baseTox: { liver: 2, lipid: 5, hct: 3, neuro: 5, kidney: 4, endo: 4, repro: 5 } },
        { id: 'boldenone', name: 'Болденон', baseTox: { liver: 1, lipid: 3, hct: 6, neuro: 0, kidney: 1, endo: 1, repro: 3 } },
        { id: 'dhb', name: 'Дигидроболденон (DHB)', baseTox: { liver: 1, lipid: 4, hct: 5, neuro: 0, kidney: 3, endo: 1, repro: 3 } },
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
            { id: 'trenbolone_h', name: 'Гексагидробензилкарбонат', halfLife: 10.0 }
        ],
        'boldenone': [{ id: 'boldenone_u', name: 'Ундесиленат', halfLife: 14.0 }],
        'dhb': [{ id: 'dhb_p', name: 'Ацетат', halfLife: 10.0 }],
        'masteron': [
            { id: 'masteron_p', name: 'Пропионат', halfLife: 2.5 },
            { id: 'masteron_e', name: 'Энантат', halfLife: 7.0 }
        ],
        'primobolan': [{ id: 'primobolan_e', name: 'Энантат', halfLife: 10.0 }],
        'stanozolol': [{ id: 'stanozolol_susp', name: 'Суспензия (Winstrol Depot)', halfLife: 24.0 }],
        'oxandrolone': [{ id: 'oxandrolone_oral', name: 'Таблетки', halfLife: 9.0 }],
        'methandienone': [{ id: 'methandienone_oral', name: 'Таблетки', halfLife: 5.0 }],
        'gh': [
            { id: 'gh_short', name: 'Соматропин (Ежедневно)', halfLife: 0.1 },
            { id: 'gh_long', name: 'Пегилated (Weekly)', halfLife: 168.0 }
        ],
        'insulin': [
            { id: 'insulin_r', name: 'Короткий (Actrapid/Humulin R)', halfLife: 0.1 },
            { id: 'insulin_l', name: 'Продленный (Glargine/Tresiba)', halfLife: 24.0 }
        ],
        'igf1': [
            { id: 'igf1_lr3', name: 'LR3 (Long Acting)', halfLife: 24.0 },
            { id: 'igf1_des', name: 'DES (Short Acting)', halfLife: 0.5 }
        ],
        'mgf': [
            { id: 'mgf_plain', name: 'MGF (Peptide)', halfLife: 0.5 },
            { id: 'peg_mgf', name: 'PEG-MGF (Depot)', halfLife: 48.0 }
        ]
    },

    riskMatrix: {
        liver: { mechanisms: [
            { id: 'cholestasis', name: 'Холестаз', desc: 'Застой желчи, зуд' },
            { id: 'oxidative', name: 'Оксидативный стресс', desc: 'Повреждение свободными радикалами' },
            { id: 'cytolysis', name: 'Цитолиз', desc: 'Разрушение клеток (рост ALT/AST)' },
            { id: 'fibrosis', name: 'Фиброз', desc: 'Рубцевание ткани печени' },
            { id: 'mito', name: 'Митохондриальная дисфункция', desc: 'Снижение энергообеспечения' },
            { id: 'methylation', name: 'Дефицит метилирования', desc: 'Нарушение детоксикации' },
            { id: 'apoptosis', name: 'Апоптоз', desc: 'Программируемая гибель клеток' }
        ]},
        cardio: { mechanisms: [
            { id: 'htn', name: 'Артериальная гипертензия', desc: 'Повышение АД >140/90' },
            { id: 'tachycardia', name: 'Тахикардия', desc: 'ЧСС покоя >90' },
            { id: 'lipids', name: 'Дислипидемия', desc: 'Рост ЛПНП, падение ЛПВП' },
            { id: 'thrombo', name: 'Тромбогенный потенциал', desc: 'Риск образования тромбов' },
            { id: 'lvh', name: 'Гипертрофия ЛЖ', desc: 'Утолщение стенок сердца' },
            { id: 'endo', name: 'Дисфункция эндотелия', desc: 'Снижение эластичности сосудов' },
            { id: 'arrhythmia', name: 'Аритмия', desc: 'Нарушение ритма сердца' }
        ]},
        kidney: { mechanisms: [
            { id: 'hyperfiltration', name: 'Гломерулярная гиперфильтрация', desc: 'Перегрузка фильтров почек' },
            { id: 'fibrosis_k', name: 'Интерстициальный фиброз', desc: 'Рубцевание ткани почек' },
            { id: 'electrolytes', name: 'Электролитный дисбаланс', desc: 'Нарушение K/Na/Ca' },
            { id: 'proteinuria', name: 'Протеинурия', desc: 'Потеря белка с мочой' },
            { id: 'stones', name: 'Нефролитиаз', desc: 'Образование камней' },
            { id: 'tubular', name: 'Тубулярный некроз', desc: 'Отмирание канальцев' },
            { id: 'gfr_drop', name: 'Снижение СКФ', desc: 'Падение функции фильтрации' }
        ]},
        neuro: { mechanisms: [
            { id: 'dopamine', name: 'Дофаминовый дисбаланс', desc: 'Агрессия, апатия, депрессия' },
            { id: 'glutamate', name: 'Глутаматная эксайтотоксичность', desc: 'Перевозбуждение нейронов' },
            { id: 'gaba', name: 'ГАМК-дисрегуляция', desc: 'Тревожность, бессонница' },
            { id: 'serotonin', name: 'Серотониновый синдром', desc: 'Перепады настроения' },
            { id: 'inflammation', name: 'Нейровоспаление', desc: 'Активация микроглии' },
            { id: 'cognitive', name: 'Когнитивный спад', desc: 'Ухудшение памяти и фокуса' },
            { id: 'addiction', name: 'Аддиктивный потенциал', desc: 'Формирование зависимости' }
        ]},
        hemato: { mechanisms: [
            { id: 'erythrocytosis', name: 'Эритроцитоз', desc: 'Гематокрит >52%' },
            { id: 'viscosity', name: 'Гипервязкость', desc: 'Густая кровь, замедление потока' },
            { id: 'coagulation', name: 'Гиперкоагуляция', desc: 'Ускорение свертываемости' },
            { id: 'anemia', name: 'Анемия', desc: 'Снижение гемоглобина' },
            { id: 'leukocytosis', name: 'Лейкоцитоз', desc: 'Воспалительный ответ' },
            { id: 'platelets', name: 'Тромбоцитоз', desc: 'Избыток тромбоцитов' },
            { id: 'hemolysis', name: 'Гемолиз', desc: 'Разрушение эритроцитов' }
        ]},
        endo: { mechanisms: [
            { id: 'insulin_res', name: 'Инсулинорезистентность', desc: 'Снижение чувствительности к инсулину' },
            { id: 'estrogen', name: 'Эстрогендоминирование', desc: 'Высокий E2, отеки, гино' },
            { id: 'prolactin', name: 'Гиперпролактинемия', desc: 'Высокий пролактин, либидо↓' },
            { id: 'thyroid', name: 'Гипотиреоз', desc: 'Снижение функции щитовидной железы' },
            { id: 'cortisol', name: 'Гиперкортизолизм', desc: 'Высокий кортизол, катаболизм' },
            { id: 'gh_axis', name: 'Подавление оси ГР', desc: 'Снижение собственного гормона роста' },
            { id: 'adrenal', name: 'Надпочечниковая усталость', desc: 'Истощение надпочечников' }
        ]},
        repro: { mechanisms: [
            { id: 'atrophy', name: 'Атрофия тестикул', desc: 'Уменьшение размера яичек' },
            { id: 'suppression', name: 'Подавление HPTA', desc: 'Остановка выработки своего тестостерона' },
            { id: 'sperm', name: 'Олигозооспермия', desc: 'Снижение количества сперматозоидов' },
            { id: 'libido', name: 'Снижение либидо', desc: 'Отсутствие полового влечения' },
            { id: 'erectile', name: 'Эректильная дисфункция', desc: 'Проблемы с эрекцией' },
            { id: 'gyno', name: 'Гинекомастия', desc: 'Рост железистой ткани груди' },
            { id: 'infertility', name: 'Бесплодие', desc: 'Невозможность зачатия' }
        ]}
    },

    supportProtocol: [
        { timeId: 'morning_empty', title: '☀️ Натощак', items: [
            { name: 'Iron Guard', dose: '2 капс', mechanism: 'Профилактика анемии', risks: ['hemato_anemia'] },
            { name: 'Цитиколин', dose: '500 мг', mechanism: 'Защита мозга, фокус', risks: ['neuro_cognitive', 'neuro_dopamine'] },
            { name: 'Наттокиназа + Серрапептаза', dose: '2 капс', mechanism: 'Разжижение крови, фибринолиз', risks: ['hemato_viscosity', 'cardio_thrombo'] },
            { name: 'Таурин', dose: '2000 мг', mechanism: 'Контроль АД, анти-спазм', risks: ['cardio_htn', 'neuro_glutamate'] }
        ]},
        { timeId: 'morning_food', title: '🍳 Завтрак', items: [
            { name: 'Астрагал', dose: '500 мг', mechanism: 'Защита почек от фиброза', risks: ['kidney_fibrosis_k'] },
            { name: 'Небилет (Небиволол)', dose: '2.5-5 мг', mechanism: 'Контроль ЧСС и АД', risks: ['cardio_htn', 'cardio_tachycardia'] },
            { name: 'Тадалафил', dose: '5 мг', mechanism: 'Здоровье эндотелия, памп', risks: ['cardio_endo'] },
            { name: 'Берберин', dose: '500 мг', mechanism: 'Чувствительность к инсулину', risks: ['endo_insulin_res'] },
            { name: 'Витамин D3 + K2', dose: '5000 МЕ + 100 мкг', mechanism: 'Кости, иммунитет, кальций', risks: [] },
            { name: 'TMG + Метилфолат', dose: '1г + 1 капс', mechanism: 'Метилирование, гомоцистеин', risks: ['liver_methylation', 'cardio_thrombo'] },
            { name: 'Бергамот', dose: '500 мг', mechanism: 'Контроль липидов', risks: ['cardio_lipids'] },
            { name: 'Бромантан + Фасорацетам', dose: '50+100 мг', mechanism: 'Баланс нейромедиаторов', risks: ['neuro_dopamine', 'neuro_gaba'] }
        ]},
        { timeId: 'lunch', title: '🍲 Обед', items: [
            { name: 'УДХК (Урсосан)', dose: '1000 мг', mechanism: 'Защита от холестаза', risks: ['liver_cholestasis'] },
            { name: 'Пентоксифиллин', dose: '400 мг', mechanism: 'Микроциркуляция, реология', risks: ['hemato_viscosity', 'kidney_hyperfiltration'] },
            { name: 'Joint Health (Глюкозамин/МСМ)', dose: '2 капс', mechanism: 'Поддержка суставов', risks: [] },
            { name: 'Витамин Е', dose: '400 МЕ', mechanism: 'Антиоксидант', risks: ['liver_oxidative'] }
        ]},
        { timeId: 'pre_workout', title: '💪 Предтреник', items: [
            { name: 'Агмантин Сульфат', dose: '1000 мг', mechanism: 'NO-бустер, защита рецепторов', risks: ['cardio_endo'] }
        ]},
        { timeId: 'evening', title: '🌙 Вечер', items: [
            { name: 'Телмисартан', dose: '40-80 мг', mechanism: 'Мощная защита почек и сердца', risks: ['cardio_htn', 'kidney_hyperfiltration', 'cardio_lvh'] },
            { name: 'Магний (Глицинат/Цитрат)', dose: '400 мг', mechanism: 'Расслабление, сон, сердце', risks: ['neuro_gaba', 'cardio_arrhythmia'] },
            { name: 'L-Теанин', dose: '200-400 мг', mechanism: 'Спокойствие, качественный сон', risks: ['neuro_gaba'] },
            { name: 'Гормон Роста', dose: '2-5 ЕД', mechanism: 'Восстановление, липолиз', risks: ['endo_gh_axis'], note: 'Инъекция п/к' }
        ]},
        { timeId: 'cycle_specific', title: '💉 По необходимости (по анализам)', items: [
            { name: 'HCG', dose: '500 МЕ 2р/нед', mechanism: 'Поддержка тестикул', risks: ['repro_atrophy'] },
            { name: 'Анастрозол', dose: '0.25-0.5 мг', mechanism: 'Контроль эстрадиола', risks: ['endo_estrogen'] },
            { name: 'Каберголин', dose: '0.25 мг', mechanism: 'Контроль пролактина', risks: ['endo_prolactin'] },
            { name: 'BPC-157 + TB-500', dose: 'Курс', mechanism: 'Заживление травм', risks: [] }
        ]}
    ],

    shopItems: {
        'udca': [{ platform: 'Ozon', price: '~1500₽', url: '#' }, { platform: 'iHerb', price: '~$25', url: '#' }],
        'telmisartan': [{ platform: 'Apteka.ru', price: '~600₽', url: '#' }],
        'nebivolol': [{ platform: 'Ozon', price: '~400₽', url: '#' }],
        'berberine': [{ platform: 'iHerb', price: '~$20', url: '#' }],
        'taurine': [{ platform: 'Ozon', price: '~800₽', url: '#' }],
        'magnesium': [{ platform: 'Ozon', price: '~900₽', url: '#' }],
        'omega3': [{ platform: 'iHerb', price: '~$15', url: '#' }],
        'vitamin_d3k2': [{ platform: 'Ozon', price: '~1000₽', url: '#' }]
    },

    glossary: {
        'Half-life (T1/2)': 'Время, за которое концентрация вещества в крови падает вдвое.',
        'Steady State': 'Равновесное состояние, когда поступление вещества равно его выведению.',
        'Hematocrit': 'Доля эритроцитов в объеме крови. Норма 40-52%. Выше – риск тромбов.',
        'LDL/HDL': 'Липопротеины низкой (плохой) и высокой (хороший) плотности.',
        'ALT/AST': 'Ферменты печени. Рост указывает на разрушение клеток (цитолиз).',
        'Estradiol (E2)': 'Основной эстроген. Важен для костей и мозга, но избыток ведет к гинекомастии.',
        'Prolactin': 'Гормон, подавляющий либидо и эрекцию при повышении.',
        'IGF-1 LR3': 'Модифицированная форма IGF-1 с длительным действием (до 24ч).',
        'PEG-MGF': 'Пегиллированная форма MGF для пролонгированного восстановления мышц.',
        'Insulin Glargine': 'Аналог инсулина продленного действия без выраженного пика.',
        'Raw Risk': 'Теоретический риск препарата без учета защиты.',
        'Net Risk': 'Реальный остаточный риск после применения протокола поддержки.'
    }
};
DBEOF

# 2. ENGINE (Fixed Logic)
echo "⚙️ Fixing Engine Logic..."
cat > assets/js/core/engine.js << 'ENGINEEOF'
const Engine = {
    // Расчет концентрации с учетом старта, финиша и T1/2
    calculateConcentration(halfLifeDays, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        
        const daysOn = (currentWeek - startWeek) * 7;
        const weeksDuration = endWeek - startWeek;
        const daysDuration = weeksDuration * 7;
        
        // Фаза набора (Loading phase)
        let concentration = 0;
        
        if (currentWeek <= endWeek) {
            // На курсе: рост до плато
            // Используем упрощенную модель накопления: 1 - e^(-kt)
            const k = 0.693 / halfLifeDays;
            const t = daysOn;
            concentration = 1 - Math.exp(-k * t);
        } else {
            // После курса: спад (Washout)
            const daysOff = (currentWeek - endWeek) * 7;
            const k = 0.693 / halfLifeDays;
            // Начинаем спад с уровня, близкого к 1 (или чуть меньше если курс короткий)
            const peak = 1 - Math.exp(-k * daysDuration); 
            concentration = peak * Math.exp(-k * daysOff);
        }
        
        return Math.max(0, Math.min(1, concentration));
    },

    generateWeeklyPlan(stack, forecastWeeks) {
        if (!stack || stack.length === 0) return [];

        // Определяем длительность прогноза
        let maxEnd = 0;
        let maxHalfLife = 1;
        
        stack.forEach(item => {
            if (item.endWeek > maxEnd) maxEnd = item.endWeek;
            const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
            const hl = ester ? ester.halfLife : (item.substanceId === 'oxandrolone' ? 0.4 : 1); // Default for orals
            if (hl > maxHalfLife) maxHalfLife = hl;
        });

        // Прогноз: конец последнего курса + 5 периодов полувыведения самого долгого
        const washoutWeeks = Math.ceil((maxHalfLife * 5) / 7);
        const totalWeeks = Math.max(forecastWeeks || 12, maxEnd + washoutWeeks);

        const plan = [];

        for (let w = 1; w <= totalWeeks; w++) {
            // Инициализация матрицы нулями
            let weekRisks = {};
            for (let sys in DB.riskMatrix) {
                weekRisks[sys] = {};
                DB.riskMatrix[sys].mechanisms.forEach(m => weekRisks[sys][m.id] = 0);
            }

            let activeSubstances = [];

            stack.forEach(item => {
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const halfLife = ester ? ester.halfLife : (item.substanceId === 'oxandrolone' || item.substanceId === 'methandienone' ? 0.4 : 1);
                
                const concFactor = this.calculateConcentration(halfLife, item.startWeek, item.endWeek, w);
                
                if (concFactor > 0.05) {
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    if (!sub) return;

                    activeSubstances.push(`${sub.name} (${Math.round(concFactor*100)}%)`);
                    
                    // Коэффициент нагрузки (Доза / 100мг база)
                    const load = (item.dose / 100) * concFactor;

                    const tox = sub.baseTox;
                    
                    // Распределение токсичности по механизмам (Weighted distribution)
                    // Liver
                    weekRisks.liver.cholestasis += (tox.liver * 4 * load);
                    weekRisks.liver.cytolysis += (tox.liver * 3 * load);
                    weekRisks.liver.methylation += (tox.liver * 2 * load);
                    
                    // Cardio (Lipids -> Thrombo/HTN)
                    weekRisks.cardio.lipids += (tox.lipid * 5 * load);
                    weekRisks.cardio.thrombo += (tox.lipid * 2 * load);
                    weekRisks.cardio.htn += (tox.lipid * 1.5 * load);
                    weekRisks.cardio.endo += (tox.lipid * 2 * load);

                    // Hemato (HCT -> Viscosity/Erythrocytosis)
                    weekRisks.hemato.erythrocytosis += (tox.hct * 6 * load);
                    weekRisks.hemato.viscosity += (tox.hct * 5 * load);

                    // Neuro
                    weekRisks.neuro.dopamine += (tox.neuro * 5 * load);
                    weekRisks.neuro.gaba += (tox.neuro * 2 * load);

                    // Kidney
                    weekRisks.kidney.hyperfiltration += (tox.kidney * 3 * load);

                    // Endo
                    weekRisks.endo.insulin_res += (tox.endo * 4 * load);
                    weekRisks.endo.estrogen += (sub.id === 'test' ? 3 * load : 0); // Test specific
                    weekRisks.endo.prolactin += (sub.id === 'nandrolone' || sub.id === 'trenbolone' ? 4 * load : 0);

                    // Repro
                    weekRisks.repro.suppression += (tox.repro * 5 * load);
                    weekRisks.repro.atrophy += (tox.repro * 4 * load);
                }
            });

            // Нормализация и ограничение 0-100
            for (let sys in weekRisks) {
                for (let m in weekRisks[sys]) {
                    weekRisks[sys][m] = Math.min(100, Math.round(weekRisks[sys][m]));
                }
            }

            plan.push({
                week: w,
                risks: weekRisks,
                active: activeSubstances
            });
        }

        return plan;
    },

    getRiskColor(value) {
        if (value < 20) return '#2e7d32'; // Dark Green
        if (value < 40) return '#66bb6a'; // Light Green
        if (value < 60) return '#fdd835'; // Yellow
        if (value < 80) return '#fb8c00'; // Orange
        return '#d32f2f'; // Red
    },
    
    getTextColor(bgColor) {
        // Simple logic: dark text on light colors (yellow), white on others
        if (bgColor === '#fdd835') return '#000';
        return '#fff';
    },
    
    calculateFertilityIndex(data) {
        if (!data.volume || !data.concentration) return 0;
        let score = 0;
        score += Math.min(1, data.volume / 1.5) * 15;
        score += Math.min(1, data.concentration / 16) * 20;
        score += Math.min(1, (data.total_count || 0) / 39) * 10;
        score += Math.min(1, (data.pr || 0) / 30) * 25;
        score += Math.min(1, (data.morphology || 0) / 4) * 20;
        return Math.round(score);
    }
};
ENGINEEOF

# 3. APP JS (Fixed Event Listeners & Rendering)
echo "🔧 Fixing App Logic & Events..."
cat > assets/js/app.js << 'APPEOF'
document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized");
    
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    const state = {
        stack: [],
        plan: [],
        currentWeekIdx: 0,
        chartVisibility: { liver:true, cardio:true, hemato:true, neuro:false, kidney:false, endo:false, repro:false }
    };

    // --- TABS LOGIC ---
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
        btn.addEventListener('click', function() {
            tabs.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const target = this.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
            console.log("Tab switched to:", target);
        });
    });

    // --- SUBSTANCE SELECT INIT ---
    const subSelect = document.getElementById('drug-substance');
    if (subSelect) {
        DB.substances.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            subSelect.appendChild(opt);
        });
    }

    // --- GLOBAL APP FUNCTIONS ---
    window.App = {
        loadEsters: function() {
            const subId = document.getElementById('drug-substance').value;
            const estSelect = document.getElementById('drug-ester');
            if (!estSelect) return;
            
            estSelect.innerHTML = '';
            const esters = DB.esters[subId];
            
            if (esters && esters.length > 0) {
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
                opt.textContent = "Нет эфиров (Орал/Пептид)";
                estSelect.appendChild(opt);
            }
            console.log("Esters loaded for:", subId);
        },

        addDrug: function(e) {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const doseVal = document.getElementById('drug-dose').value;
            const startVal = document.getElementById('drug-start').value;
            const endVal = document.getElementById('drug-end').value;

            if (!subId) return alert('Выберите вещество!');
            
            const dose = parseFloat(doseVal);
            const start = parseInt(startVal);
            const end = parseInt(endVal);

            if (start >= end) return alert('Неделя финиша должна быть больше старта!');

            state.stack.push({
                substanceId: subId,
                esterId: esterId || 'none',
                dose: dose,
                startWeek: start,
                endWeek: end
            });

            App.renderStack();
            e.target.reset();
            // Reset defaults
            document.getElementById('drug-start').value = 1;
            document.getElementById('drug-end').value = 8;
            document.getElementById('drug-ester').disabled = true;
            alert('Препарат добавлен!');
        },

        renderStack: function() {
            const list = document.getElementById('stack-list');
            if (!list) return;
            list.innerHTML = '';
            
            if (state.stack.length === 0) {
                list.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Стек пуст</div>';
                return;
            }

            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div>
                        <strong>${sub ? sub.name : item.substanceId}</strong> 
                        ${ester ? '('+ester.name+')' : ''}
                        <br><small style="color:#aaa">Доза: ${item.dose}мг | Недели: ${item.startWeek} - ${item.endWeek}</small>
                    </div>
                    <button class="btn-delete" type="button" onclick="window.App.removeDrug(${idx})">✕</button>
                `;
                list.appendChild(div);
            });
        },

        removeDrug: function(idx) {
            state.stack.splice(idx, 1);
            App.renderStack();
        },

        generatePlan: function() {
            if (state.stack.length === 0) return alert('Сначала добавьте препараты в стек!');
            
            state.plan = Engine.generateWeeklyPlan(state.stack, 20);
            state.currentWeekIdx = 0;
            
            App.renderHeatmap();
            App.renderTrendChart();
            
            const out = document.getElementById('weekly-plan-output');
            if (out) {
                out.innerHTML = `<div style="background:#2e7d32; color:white; padding:15px; border-radius:8px; margin-top:20px; text-align:center;">
                    <h3>✅ План рассчитан!</h3>
                    <p>Длительность: ${state.plan.length} недель (включая вывод)</p>
                </div>`;
            }
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
            const container = document.getElementById('heatmap-container');
            if (!container) return;
            
            const weekData = state.plan[state.currentWeekIdx];
            document.getElementById('current-week-display').textContent = `Неделя ${weekData.week}`;
            
            container.innerHTML = '';
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(110px, 1fr))';
            container.style.gap = '8px';

            for (let sys in DB.riskMatrix) {
                // System Header
                const sysHeader = document.createElement('div');
                sysHeader.style.gridColumn = '1 / -1';
                sysHeader.style.marginTop = '15px';
                sysHeader.style.color = '#bb86fc';
                sysHeader.style.fontWeight = 'bold';
                sysHeader.style.textTransform = 'uppercase';
                sysHeader.style.borderBottom = '1px solid #333';
                sysHeader.style.paddingBottom = '5px';
                sysHeader.textContent = sys;
                container.appendChild(sysHeader);

                // Mechanisms
                DB.riskMatrix[sys].mechanisms.forEach(mech => {
                    const val = weekData.risks[sys][mech.id] || 0;
                    const color = Engine.getRiskColor(val);
                    const textColor = Engine.getTextColor(color);
                    
                    const cell = document.createElement('div');
                    cell.className = 'heatmap-cell';
                    cell.style.backgroundColor = color;
                    cell.style.color = textColor;
                    cell.style.padding = '12px 8px';
                    cell.style.borderRadius = '6px';
                    cell.style.textAlign = 'center';
                    cell.style.fontSize = '0.85em';
                    cell.style.cursor = 'help';
                    cell.title = `${mech.name}: ${mech.desc}`;
                    
                    cell.innerHTML = `
                        <div style="font-weight:600; margin-bottom:4px;">${val}%</div>
                        <div style="font-size:0.8em; opacity:0.9;">${mech.name}</div>
                    `;
                    container.appendChild(cell);
                });
            }
        },

        renderTrendChart: function() {
            const ctx = document.getElementById('risk-trend-chart');
            if (!ctx || !state.plan.length) return;
            
            if (window.trendChartInstance) {
                window.trendChartInstance.destroy();
            }

            const labels = state.plan.map(p => `W${p.week}`);
            const datasets = [];
            const colors = { 
                liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', 
                neuro: '#9966ff', kidney: '#4bc0c0', endo: '#c9cbcf', repro: '#e7e9ed' 
            };

            for (let sys in state.chartVisibility) {
                if (state.chartVisibility[sys]) {
                    const data = state.plan.map(p => {
                        let sum = 0, cnt = 0;
                        for(let m in p.risks[sys]) { 
                            sum += p.risks[sys][m]; 
                            cnt++; 
                        }
                        return cnt ? Math.round(sum/cnt) : 0;
                    });
                    
                    datasets.push({
                        label: sys.toUpperCase(),
                        data: data,
                        borderColor: colors[sys],
                        backgroundColor: colors[sys],
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 2
                    });
                }
            }

            window.trendChartInstance = new Chart(ctx, {
                type: 'line',
                data: { labels, datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: { 
                        legend: { labels: { color: '#b0b0b0', font: {size: 10} } },
                        tooltip: { mode: 'index', intersect: false }
                    },
                    scales: {
                        y: { 
                            beginAtZero: true, 
                            max: 100, 
                            ticks: { color: '#666' }, 
                            grid: { color: '#333' } 
                        },
                        x: { 
                            ticks: { color: '#666' }, 
                            grid: { display: false } 
                        }
                    }
                }
            });
        },

        calcFertility: function() {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            
            const score = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr, morphology: morph });
            const res = document.getElementById('fertility-result');
            if (res) {
                const color = score > 60 ? '#4caf50' : (score > 30 ? '#ff9800' : '#f44336');
                res.innerHTML = `<h3 style="color:${color}">Индекс фертильности: ${score}/100</h3>`;
            }
        },

        exportJSON: function() {
            const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr);
            node.setAttribute("download", "bode_health_plan.json");
            document.body.appendChild(node);
            node.click();
            node.remove();
        },
        
        renderShop: function() {
            const list = document.getElementById('shop-list');
            if (!list || !DB.shopItems) return;
            list.innerHTML = '';
            for (const [key, items] of Object.entries(DB.shopItems)) {
                items.forEach(item => {
                    list.innerHTML += `
                        <div class="drug-card">
                            <div><strong>${key.toUpperCase()}</strong><br><small>${item.platform}</small></div>
                            <div><span style="color:#03dac6; font-weight:bold;">${item.price}</span> 
                            <a href="${item.url}" target="_blank" style="margin-left:10px; color:#fff; text-decoration:none;">➜</a></div>
                        </div>
                    `;
                });
            }
        },
        
        renderGlossary: function() {
            const list = document.getElementById('glossary-list');
            if (!list || !DB.glossary) return;
            list.innerHTML = '';
            for (const [term, def] of Object.entries(DB.glossary)) {
                list.innerHTML += `
                    <div class="support-item" style="margin-bottom:10px;">
                        <strong style="color:#bb86fc">${term}</strong>
                        <p style="margin:5px 0 0; color:#aaa; font-size:0.9em;">${def}</p>
                    </div>
                `;
            }
        }
    };

    // Bind Form
    const form = document.getElementById('add-drug-form');
    if (form) {
        form.addEventListener('submit', App.addDrug);
    }

    // Init Views
    App.renderStack();
    App.renderShop();
    App.renderGlossary();
});
APPEOF

# 4. CSS UPDATES
echo "🎨 Updating Styles..."
cat > assets/css/style.css << 'CSSEOF'
:root { --bg-dark: #121212; --bg-card: #1e1e1e; --primary: #bb86fc; --secondary: #03dac6; --error: #cf6679; --text-main: #fff; --text-sec: #b0b0b0; --border: #333; }
body { margin: 0; font-family: 'Segoe UI', sans-serif; background: var(--bg-dark); color: var(--text-main); padding-bottom: 60px; }
.app-container { max-width: 900px; margin: 0 auto; }
header { background: var(--bg-card); padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.version { font-size: 0.6em; color: var(--secondary); }
.subtitle { margin: 5px 0 0; font-size: 0.9em; color: var(--text-sec); }

.tabs { display: flex; overflow-x: auto; background: var(--bg-card); position: sticky; top: 0; z-index: 100; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab-btn { flex: 1; min-width: 100px; padding: 15px 10px; background: none; border: none; color: var(--text-sec); font-weight: 600; cursor: pointer; border-bottom: 3px solid transparent; white-space: nowrap; transition: 0.2s; }
.tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }
.tab-btn:hover { background: rgba(255,255,255,0.05); }

.tab-content { display: none; padding: 20px; animation: fadeIn 0.3s; }
.tab-content.active { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; margin-bottom: 20px; }
.card { background: var(--bg-card); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid var(--border); }
.big-value { font-size: 2.2em; font-weight: bold; margin-top: 10px; color: var(--secondary); }

.deep-form { background: var(--bg-card); padding: 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 12px; }
.row { display: flex; gap: 10px; }
input, select { background: #2c2c2c; border: 1px solid var(--border); color: white; padding: 12px; border-radius: 8px; flex: 1; outline: none; }
input:focus, select:focus { border-color: var(--primary); }
button { padding: 12px 20px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; background: var(--primary); color: #000; transition: 0.2s; }
button:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-delete { background: rgba(207, 102, 121, 0.2); color: var(--error); padding: 8px 12px; font-size: 0.9em; }
.btn-delete:hover { background: var(--error); color: white; }
.btn-success { background: #03dac6; color: #000; width: 100%; margin-top: 20px; font-size: 1.1em; }
.btn-secondary { background: #333; color: white; margin-right: 10px; margin-top: 10px; }

.list-container, .schedule-container { display: flex; flex-direction: column; gap: 12px; }
.drug-card, .support-item { background: var(--bg-card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--secondary); display: flex; justify-content: space-between; align-items: center; }
.support-item { flex-direction: column; align-items: flex-start; border-left-color: var(--primary); }
.time-block { background: #252525; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.time-block h3 { color: var(--primary); margin: 0 0 10px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }

/* Heatmap */
.heatmap-grid { display: grid; gap: 8px; margin-top: 15px; }
.heatmap-cell { transition: transform 0.2s, box-shadow 0.2s; }
.heatmap-cell:hover { transform: scale(1.05); z-index: 10; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }

/* Charts */
.chart-controls { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; background: var(--bg-card); padding: 10px; border-radius: 8px; }
.chart-controls label { display: flex; align-items: center; gap: 5px; font-size: 0.9em; cursor: pointer; color: var(--text-sec); }
.chart-controls input { accent-color: var(--primary); }
.week-selector { display: flex; justify-content: center; align-items: center; gap: 20px; margin: 20px 0; background: var(--bg-card); padding: 10px; border-radius: 8px; }
.week-selector button { padding: 5px 15px; font-size: 1.2em; background: #333; color: white; }
#current-week-display { font-size: 1.2em; font-weight: bold; color: var(--secondary); min-width: 120px; text-align: center; }
canvas { max-width: 100%; height: 300px !important; margin: 20px 0; background: var(--bg-card); border-radius: 12px; padding: 10px; }

#glossary-list { display: flex; flex-direction: column; gap: 10px; }
