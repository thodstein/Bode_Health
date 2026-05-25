const DB = {
    // 1.1 ПОЛНАЯ БАЗА ПРЕПАРАТОВ (Фрагмент ключевых, структура для 130+)
    drugs: [
        { id: 'test_e', name: 'Тестостерон Энантат', type: 'ester', halfLife: 7.0, arAffinity: 100, hepatotoxicity: 1, lipidImpact: 3, erythrocytosisRisk: 4, neuroToxic: false, prolactinRisk: 0 },
        { id: 'test_p', name: 'Тестостерон Пропионат', type: 'ester', halfLife: 2.0, arAffinity: 100, hepatotoxicity: 1, lipidImpact: 3, erythrocytosisRisk: 4, neuroToxic: false, prolactinRisk: 0 },
        { id: 'nandrolon_d', name: 'Нандролон Деканоат', type: 'ester', halfLife: 14.0, arAffinity: 130, hepatotoxicity: 1, lipidImpact: 4, erythrocytosisRisk: 2, neuroToxic: false, prolactinRisk: 4 },
        { id: 'trenbolone_e', name: 'Тренболон Энантат', type: 'ester', halfLife: 7.0, arAffinity: 180, hepatotoxicity: 2, lipidImpact: 5, erythrocytosisRisk: 3, neuroToxic: true, prolactinRisk: 5 },
        { id: 'dhb', name: 'Дигидроболденон (DHB)', type: 'ester', halfLife: 10.0, arAffinity: 150, hepatotoxicity: 1, lipidImpact: 4, erythrocytosisRisk: 5, neuroToxic: false, prolactinRisk: 0, note: 'Не Болденон!' },
        { id: 'boldenone_u', name: 'Болденон Ундесиленат', type: 'ester', halfLife: 14.0, arAffinity: 100, hepatotoxicity: 1, lipidImpact: 3, erythrocytosisRisk: 6, neuroToxic: false, prolactinRisk: 0 },
        { id: 'oxandrolone', name: 'Оксандролон', type: 'oral', halfLife: 9.0, arAffinity: 130, hepatotoxicity: 4, lipidImpact: 5, erythrocytosisRisk: 1, neuroToxic: false, prolactinRisk: 0 },
        { id: 'stanozolol', name: 'Станозолол', type: 'oral', halfLife: 9.0, arAffinity: 130, hepatotoxicity: 5, lipidImpact: 5, erythrocytosisRisk: 2, neuroToxic: false, prolactinRisk: 0 },
        { id: 'methandienone', name: 'Метандиенон', type: 'oral', halfLife: 5.0, arAffinity: 90, hepatotoxicity: 5, lipidImpact: 4, erythrocytosisRisk: 3, neuroToxic: false, prolactinRisk: 0 },
        { id: 'gh', name: 'Гормон Роста (Somatropin)', type: 'peptide', halfLife: 0.1, igf1Boost: 100, insulinResistRisk: 4, hepatotoxicity: 0, lipidImpact: 1, erythrocytosisRisk: 0 },
        { id: 'insulin', name: 'Инсулин Короткий', type: 'hormone', halfLife: 0.1, hypoRisk: 5, lipogenesis: 5, hepatotoxicity: 0 },
        { id: 'hcg', name: 'Хорионический Гонадотропин', type: 'peptide', halfLife: 1.5, reproSupport: 5, hepatotoxicity: 0 },
        { id: 'anastrozole', name: 'Анастрозол', type: 'oral', halfLife: 48.0, aiPower: 5, hepatotoxicity: 2 },
        { id: 'cabergoline', name: 'Каберголин', type: 'oral', halfLife: 168.0, daAgonist: 5, hepatotoxicity: 1 }
        // ... Сюда добавляются остальные 116 препаратов по аналогии
    ],

    // 1.2 ПРОТОКОЛ ПОДДЕРЖКИ (СТРОГО ИЗ ТЗ РАЗДЕЛ 10)
    supportProtocol: [
        {
            timeId: 'morning_empty',
            label: '☀️ Натощак (сразу после сна)',
            items: [
                { name: 'Iron Guard (Железо)', dose: '2 капс (~100 мг Fe)', mechanism: 'Субстрат для синтеза гема', risksCovered: ['hemato_deficiency'], synergy: ['vit_c'] },
                { name: 'Цитиколин', dose: '500 мг', mechanism: 'Прекурсор ацетилхолина и фосфатидилхолина', risksCovered: ['neuro_dopamine', 'neuro_cognitive'], synergy: ['fasoracetam'] },
                { name: 'Серрапептаза + Наттокиназа', dose: '2 капс', mechanism: 'Фибринолиз, разжижение крови', risksCovered: ['cardio_thrombo', 'hemato_rheology'], synergy: ['aspirin', 'pentoxifylline'] },
                { name: 'Таурин', dose: '2000 мг', mechanism: 'Антагонист ангиотензина II, мембраностабилизатор', risksCovered: ['cardio_htn', 'cardio_arrhythmia', 'neuro_glutamate'], synergy: ['magnesium'] }
            ]
        },
        {
            timeId: 'morning_food',
            label: '🍳 Утро (после завтрака)',
            items: [
                { name: 'Астрагал', dose: '500 мг', mechanism: 'Иммуномодулятор, снижение протеинурии', risksCovered: ['kidney_fibrosis', 'kidney_proteinuria'], synergy: ['telmisartan'] },
                { name: 'Небилет (Небиволол)', dose: '2.5 мг', mechanism: 'Селективный бета-1-блокатор, NO', risksCovered: ['cardio_htn', 'cardio_tachycardia', 'cardio_hypertrophy'], synergy: ['telmisartan', 'taurine'] },
                { name: 'Тадалафил', dose: '5 мг', mechanism: 'Ингибитор ФДЭ-5, вазодилатация', risksCovered: ['cardio_endothelium', 'cardio_htn'], synergy: ['agmatine'] },
                { name: 'Берберин', dose: '500 мг', mechanism: 'Активация AMPK, снижение глюконеогенеза', risksCovered: ['endo_insulin_resistance', 'cardio_lipids'], synergy: ['alk', 'retrutide'] },
                { name: 'Витамин D3 + K2', dose: '5000 МЕ / 100 мкг', mechanism: 'Регуляция кальция, иммунитет', risksCovered: ['endo_thyroid', 'cardio_calcification'], synergy: ['magnesium'] },
                { name: 'TMG (Триметилглицин)', dose: '1000 мг', mechanism: 'Донор метильных групп, снижение гомоцистеина', risksCovered: ['cardio_thrombo', 'liver_stress'], synergy: ['methylfolate', 'b12'] },
                { name: 'Метилфолат', dose: '1 капс (~1000 мкг)', mechanism: 'Активная форма фолиевой кислоты', risksCovered: ['cardio_thrombo'], synergy: ['tmg', 'b12'] },
                { name: 'Бергамот', dose: '500 мг', mechanism: 'Ингибирование HMG-CoA редуктазы', risksCovered: ['cardio_lipids'], synergy: ['rosuvastatin'] },
                { name: 'Бромелайн', dose: '200 мг', mechanism: 'Протеолитический фермент', risksCovered: ['gut_inflammation', 'oda_trauma'], synergy: ['probiotics'] },
                { name: 'Бромантан', dose: '50 мг', mechanism: 'Актопротектор, нормализация дофамина', risksCovered: ['neuro_dopamine', 'neuro_fatigue'], synergy: ['fasoracetam'] },
                { name: 'Фасорацетам', dose: '100 мг', mechanism: 'Ноотроп, модуляция ГАМК', risksCovered: ['neuro_gaba', 'neuro_anxiety'], synergy: ['citicolin', 'bromantan'] }
            ]
        },
        {
            timeId: 'lunch',
            label: '🍲 Обед',
            items: [
                { name: 'УДХК (Урсосан)', dose: '1000 мг', mechanism: 'Гидрофильная желчная кислота', risksCovered: ['liver_cholestasis', 'liver_apoptosis'], synergy: ['nac', 'tmg'] },
                { name: 'Диомакс (Торасемид)', dose: '1 капс', mechanism: 'Диуретик, контроль отеков', risksCovered: ['kidney_edema', 'cardio_htn'], synergy: ['telmisartan'] },
                { name: 'Пентоксифиллин', dose: '400 мг', mechanism: 'Улучшение реологии крови', risksCovered: ['hemato_rheology', 'cardio_thrombo'], synergy: ['aspirin', 'serrapeptase'] },
                { name: 'Астрагал (повтор)', dose: '1000 мг', mechanism: 'Нефропротекция', risksCovered: ['kidney_fibrosis'], synergy: ['telmisartan'] },
                { name: 'Joint Health', dose: '2 капс', mechanism: 'Глюкозамин+Хондроитин+МСМ', risksCovered: ['oda_trauma', 'oda_inflammation'], synergy: ['bpc157'] },
                { name: 'Витамин Е', dose: '400 мг', mechanism: 'Антиоксидант', risksCovered: ['oxidative_stress_general'], synergy: ['vit_c'] },
                { name: 'АТФ Оптимайзер', dose: '2 капс', mechanism: 'Митохондриальная поддержка', risksCovered: ['cardio_energy', 'oxidative_stress'], synergy: ['coq10'] }
            ]
        },
        {
            timeId: 'pre_workout',
            label: '💪 Предтреник',
            items: [
                { name: 'Агмантин', dose: '1000 мг', mechanism: 'Донатор азота, ингибитор аргиназы', risksCovered: ['cardio_endothelium'], synergy: ['citrulline', 'tadalafil'] }
            ]
        },
        {
            timeId: 'intra_workout',
            label: '🥤 Intra-Workout',
            items: [
                { name: 'Цитруллин', dose: '6 г', mechanism: 'Прекурсор аргинина', risksCovered: ['cardio_endothelium'], synergy: ['agmatine'] },
                { name: 'Таурин (повтор)', dose: '2000 мг', mechanism: 'Профилактика спазмов', risksCovered: ['neuro_glutamate', 'muscle_cramp'], synergy: ['magnesium'] },
                { name: 'Креатин', dose: '5 г', mechanism: 'Ресинтез АТФ', risksCovered: [], synergy: [] }
            ]
        },
        {
            timeId: 'evening',
            label: '🌙 Вечер (после ужина)',
            items: [
                { name: 'Телмисартан', dose: '80 мг', mechanism: 'Блокатор рецепторов ангиотензина II', risksCovered: ['cardio_htn', 'cardio_hypertrophy', 'kidney_hyperfiltration'], synergy: ['nebivolol', 'astragalus'] },
                { name: 'УДХК (повтор)', dose: '1000 мг', mechanism: 'Гепатопротекция', risksCovered: ['liver_cholestasis'], synergy: [] },
                { name: 'Берберин (повтор)', dose: '500 мг', mechanism: 'Контроль инсулина', risksCovered: ['endo_insulin_resistance'], synergy: [] },
                { name: 'Пентоксифиллин (повтор)', dose: '400 мг', mechanism: 'Реология', risksCovered: ['hemato_rheology'], synergy: [] },
                { name: 'Магний', dose: '400 мг (эл.)', mechanism: 'Релаксант, кофактор', risksCovered: ['neuro_glutamate', 'neuro_gaba', 'cardio_arrhythmia'], synergy: ['taurine', 'theanine'] },
                { name: 'L-Теанин', dose: '400 мг', mechanism: 'Агонист ГАМК', risksCovered: ['neuro_gaba', 'stress'], synergy: ['magnesium'] },
                { name: 'Гормон Роста', dose: '5 ЕД', mechanism: 'Липолиз, регенерация', risksCovered: ['oda_recovery'], synergy: ['berberine'], note: 'За 30-60 мин до сна' }
            ]
        },
        {
            timeId: 'cycle_specific',
            label: '💉 Специфическое (по схеме)',
            items: [
                { name: 'BPC-157', dose: '250-500 мкг/день', mechanism: 'Ангиогенез, заживление', risksCovered: ['oda_trauma', 'gut_inflammation'], synergy: ['tb500'] },
                { name: 'TB-500', dose: '2.5-10 мг/нед', mechanism: 'Системная регенерация', risksCovered: ['oda_trauma'], synergy: ['bpc157'] },
                { name: 'HCG', dose: '500 МЕ 2р/нед', mechanism: 'Стимуляция клеток Лейдига', risksCovered: ['repro_atrophy'], synergy: [] },
                { name: 'Анастрозол', dose: '0.5 мг 2р/нед', mechanism: 'Ингибитор ароматазы', risksCovered: ['endo_estrogen'], synergy: [] },
                { name: 'Каберголин', dose: '0.25 мг 2р/нед', mechanism: 'Агонист D2', risksCovered: ['endo_prolactin'], synergy: [] },
                { name: 'Ретрутид (Семаглутид)', dose: '1 мг 1р/нед', mechanism: 'Агонист GLP-1', risksCovered: ['endo_insulin_resistance'], synergy: ['berberine'] }
            ]
        }
    ],

    // 1.3 МАТРИЦА РИСКОВ (7 систем x механизмы) - Базовые веса
    riskMatrix: {
        liver: { cholestasis: 0, oxidative: 0, cytolysis: 0, fibrosis: 0, mitochondrial: 0, inflammation: 0, cancer: 0 },
        cardio: { htn: 0, tachycardia: 0, lipids: 0, thrombo: 0, hypertrophy: 0, endothelium: 0, arrhythmia: 0 },
        kidney: { hyperfiltration: 0, fibrosis: 0, electrolytes: 0, proteinuria: 0, stones: 0, gfr_drop: 0, infection: 0 },
        neuro: { dopamine: 0, glutamate: 0, gaba: 0, serotonin: 0, cognitive: 0, anxiety: 0, sleep: 0 },
        hemato: { erythrocytosis: 0, rheology: 0, coagulation: 0, anemia: 0, immunity: 0, platelets: 0, wbc: 0 },
        endo: { insulin_resist: 0, estrogen: 0, prolactin: 0, thyroid: 0, cortisol: 0, gh_igf1: 0, leptin: 0 },
        repro: { atrophy: 0, suppression: 0, fertility: 0, libido: 0, sperm_quality: 0, prostate: 0, gyno: 0 }
    },

    // 1.4 КОЭФФИЦИЕНТЫ СНИЖЕНИЯ РИСКОВ (Эффективность поддержки)
    supportEfficacy: {
        udca: { liver_cholestasis: 0.7, liver_cytolysis: 0.4 },
        telmisartan: { cardio_htn: 0.8, kidney_hyperfiltration: 0.7, cardio_hypertrophy: 0.5 },
        nebivolol: { cardio_htn: 0.6, cardio_tachycardia: 0.8, cardio_arrhythmia: 0.5 },
        taurine: { cardio_htn: 0.3, neuro_glutamate: 0.5, cardio_arrhythmia: 0.4 },
        berberine: { endo_insulin_resist: 0.6, cardio_lipids: 0.4 },
        pentoxifylline: { hemato_rheology: 0.6, cardio_thrombo: 0.4 },
        astragalus: { kidney_fibrosis: 0.5, kidney_proteinuria: 0.4 },
        hcg: { repro_atrophy: 0.9 },
        anastrozole: { endo_estrogen: 0.9 },
        cabergoline: { endo_prolactin: 0.9 }
    }
};
