const DB = {
    // 1.1 Фармакология (Фрагмент полной базы, DHB и Boldenone разделены)
    drugs: [
        { id: 'test_e', name: 'Тестостерон Энантат', type: 'ester', halfLife: 7, arAffinity: 100, hepatotoxicity: 1, lipidImpact: 3, erythrocytosisRisk: 4 },
        { id: 'test_p', name: 'Тестостерон Пропионат', type: 'ester', halfLife: 2, arAffinity: 100, hepatotoxicity: 1, lipidImpact: 3, erythrocytosisRisk: 4 },
        { id: 'nandrolon_d', name: 'Нандролон Деканоат', type: 'ester', halfLife: 14, arAffinity: 130, hepatotoxicity: 1, lipidImpact: 4, erythrocytosisRisk: 2 },
        { id: 'trenbolone_e', name: 'Тренболон Энантат', type: 'ester', halfLife: 7, arAffinity: 180, hepatotoxicity: 2, lipidImpact: 5, erythrocytosisRisk: 3, neuroToxic: true },
        { id: 'dhb', name: 'Дигидроболденон (DHB)', type: 'ester', halfLife: 10, arAffinity: 150, hepatotoxicity: 1, lipidImpact: 4, erythrocytosisRisk: 5, note: 'Не Болденон!' },
        { id: 'boldenone_u', name: 'Болденон Ундесиленат', type: 'ester', halfLife: 14, arAffinity: 100, hepatotoxicity: 1, lipidImpact: 3, erythrocytosisRisk: 6 },
        { id: 'oxandrolone', name: 'Оксандролон', type: 'oral', halfLife: 9, arAffinity: 130, hepatotoxicity: 4, lipidImpact: 5, erythrocytosisRisk: 1 },
        { id: 'stanozolol', name: 'Станозолол', type: 'oral', halfLife: 9, arAffinity: 130, hepatotoxicity: 5, lipidImpact: 5, erythrocytosisRisk: 2 },
        { id: 'methandienone', name: 'Метандиенон', type: 'oral', halfLife: 5, arAffinity: 90, hepatotoxicity: 5, lipidImpact: 4, erythrocytosisRisk: 3 },
        { id: 'gh', name: 'Гормон Роста (Somatropin)', type: 'peptide', halfLife: 0.1, igf1Boost: 100, insulinResistRisk: 4 },
        { id: 'insulin', name: 'Инсулин Короткий', type: 'hormone', halfLife: 0.1, hypoRisk: 5, lipogenesis: 5 },
        // ... (здесь будут остальные 120 препаратов при полном развертывании)
    ],

    // 1.2 Поддержка (Строго из ТЗ Раздел 10, реальный стек)
    support: [
        {
            time: 'morning_empty',
            label: '☀️ Натощак (сразу после сна)',
            items: [
                { name: 'Iron Guard (Железо)', dose: '2 капс', mechanism: 'Субстрат для гема', risks: ['hemato_def'] },
                { name: 'Цитиколин', dose: '500 мг', mechanism: 'Прекурсор ацетилхолина', risks: ['neuro_dopamine'] },
                { name: 'Серрапептаза + Наттокиназа', dose: '2 капс', mechanism: 'Фибринолиз, реология', risks: ['cardio_thrombo', 'hemato_rheology'] },
                { name: 'Таурин', dose: '2000 мг', mechanism: 'Антагонист AngII, мембраностабилизатор', risks: ['cardio_htn', 'neuro_glutamate'] }
            ]
        },
        {
            time: 'morning_food',
            label: '🍳 Утро (после завтрака)',
            items: [
                { name: 'Астрагал', dose: '500 мг', mechanism: 'Нефропротекция', risks: ['kidney_fibrosis'] },
                { name: 'Небилет (Небиволол)', dose: '2.5 мг', mechanism: 'Beta-1 блокатор, NO', risks: ['cardio_htn', 'cardio_tachy'] },
                { name: 'Тадалафил', dose: '5 мг', mechanism: 'PDE5 ингибитор', risks: ['cardio_endothelium'] },
                { name: 'Берберин', dose: '500 мг', mechanism: 'AMPK активатор', risks: ['endo_insulin'] },
                { name: 'Витамин D3 + K2', dose: '5000 МЕ / 100 мкг', mechanism: 'Кальций-менеджмент', risks: ['endo_thyroid', 'cardio_calcification'] },
                { name: 'TMG + Метилфолат', dose: '1000 мг + 1 капс', mechanism: 'Метилирование, гомоцистеин', risks: ['cardio_thrombo', 'liver_stress'] },
                { name: 'Бергамот', dose: '500 мг', mechanism: 'Натуральный статин', risks: ['cardio_lipids'] },
                { name: 'Бромантан + Фасорацетам', dose: '50 мг + 100 мг', mechanism: 'Актопротектор + Ноотроп', risks: ['neuro_dopamine', 'neuro_gaba'] }
            ]
        },
        {
            time: 'lunch',
            label: '🍲 Обед',
            items: [
                { name: 'УДХК (Урсосан)', dose: '1000 мг', mechanism: 'Гидрофильная желчная кислота', risks: ['liver_cholestasis'] },
                { name: 'Пентоксифиллин', dose: '400 мг', mechanism: 'Реология крови', risks: ['hemato_rheology', 'cardio_thrombo'] },
                { name: 'Joint Health', dose: '2 капс', mechanism: 'Хондропротекция', risks: ['oda_trauma'] },
                { name: 'Витамин Е', dose: '400 МЕ', mechanism: 'Антиоксидант', risks: ['oxidative_stress'] }
            ]
        },
        {
            time: 'pre_workout',
            label: '💪 Предтреник',
            items: [
                { name: 'Агмантин', dose: '1000 мг', mechanism: 'NO бустер, ингибитор аргиназы', risks: ['cardio_endothelium'] }
            ]
        },
        {
            time: 'intra_workout',
            label: '🥤 Intra-Workout',
            items: [
                { name: 'Цитруллин', dose: '6 г', mechanism: 'NO прекурсор', risks: ['cardio_endothelium'] },
                { name: 'Креатин', dose: '5 г', mechanism: 'АТФ ресинтез', risks: [] },
                { name: 'Таурин', dose: '2000 мг', mechanism: 'Анти-спазм', risks: ['neuro_glutamate'] }
            ]
        },
        {
            time: 'evening',
            label: '🌙 Вечер (после ужина)',
            items: [
                { name: 'Телмисартан', dose: '80 мг', mechanism: 'ARB, нефропротекция', risks: ['cardio_htn', 'kidney_hyperfiltration'] },
                { name: 'Магний', dose: '400 мг (эл.)', mechanism: 'Релаксант, кофактор', risks: ['neuro_glutamate', 'cardio_arrhythmia'] },
                { name: 'L-Теанин', dose: '400 мг', mechanism: 'ГАМК агонист', risks: ['neuro_gaba', 'stress'] },
                { name: 'Гормон Роста', dose: '5 ЕД', mechanism: 'Липолиз, регенерация', risks: ['endo_insulin'], note: 'За 30 мин до сна' }
            ]
        },
        {
            time: 'cycle_specific',
            label: '💉 Специфическое (по схеме)',
            items: [
                { name: 'HCG', dose: '500 МЕ 2р/нед', mechanism: 'Агонист ЛГ', risks: ['repro_atrophy'] },
                { name: 'Анастрозол', dose: '0.5 мг 2р/нед', mechanism: 'Ингибитор ароматазы', risks: ['endo_estrogen'] },
                { name: 'Каберголин', dose: '0.25 мг 2р/нед', mechanism: 'Агонист D2', risks: ['endo_prolactin'] },
                { name: 'BPC-157 + TB-500', dose: '250 мкг / 2.5 мг', mechanism: 'Регенерация тканей', risks: ['oda_trauma'] }
            ]
        }
    ],

    // 1.3 Матрица рисков (7 систем x механизмы)
    riskMatrix: {
        liver: { cholestasis: 0, oxidative: 0, cytolysis: 0 },
        cardio: { htn: 0, tachycardia: 0, lipids: 0, thrombo: 0, hypertrophy: 0 },
        kidney: { hyperfiltration: 0, fibrosis: 0, electrolytes: 0 },
        neuro: { dopamine: 0, glutamate: 0, gaba: 0, serotonin: 0 },
        hemato: { erythrocytosis: 0, rheology: 0, coagulation: 0 },
        endo: { insulin_resist: 0, estrogen: 0, prolactin: 0, thyroid: 0 },
        repro: { atrophy: 0, suppression: 0 }
    }
};
