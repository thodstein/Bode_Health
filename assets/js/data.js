const DRUGS_DB = [
    { id: 'test_e', name: 'Тестостерон Энантат', type: 'ester', halfLife: 7, risks: { liver: 10, cardio: 40, hemo: 50, neuro: 20, kidney: 10, endo: 60 } },
    { id: 'test_p', name: 'Тестостерон Пропионат', type: 'ester', halfLife: 2, risks: { liver: 10, cardio: 40, hemo: 50, neuro: 20, kidney: 10, endo: 60 } },
    { id: 'dhb', name: 'DHB (Дигидроболденон)', type: 'ester', halfLife: 14, risks: { liver: 20, cardio: 60, hemo: 80, neuro: 40, kidney: 50, endo: 30 } }, // ОТДЕЛЬНО
    { id: 'bold', name: 'Болденон Ундесиленат', type: 'ester', halfLife: 14, risks: { liver: 15, cardio: 50, hemo: 70, neuro: 30, kidney: 40, endo: 20 } }, // ОТДЕЛЬНО
    { id: 'nand', name: 'Нандролон Деканоат', type: 'ester', halfLife: 14, risks: { liver: 10, cardio: 30, hemo: 40, neuro: 50, kidney: 30, endo: 70 } },
    { id: 'tren_e', name: 'Тренболон Энантат', type: 'ester', halfLife: 7, risks: { liver: 30, cardio: 70, hemo: 60, neuro: 90, kidney: 60, endo: 80 } },
    { id: 'oxan', name: 'Оксандролон', type: 'oral', halfLife: 9, risks: { liver: 60, cardio: 50, hemo: 20, neuro: 10, kidney: 20, endo: 40 } },
    { id: 'stan', name: 'Станозолол', type: 'oral', halfLife: 9, risks: { liver: 70, cardio: 60, hemo: 30, neuro: 20, kidney: 30, endo: 50 } },
    { id: 'meth', name: 'Метандиенон', type: 'oral', halfLife: 5, risks: { liver: 80, cardio: 50, hemo: 40, neuro: 30, kidney: 20, endo: 60 } },
    { id: 'turin', name: 'Туринабол', type: 'oral', halfLife: 16, risks: { liver: 50, cardio: 40, hemo: 30, neuro: 20, kidney: 20, endo: 50 } },
    { id: 'prim', name: 'Примоболан', type: 'ester', halfLife: 10, risks: { liver: 10, cardio: 20, hemo: 30, neuro: 10, kidney: 10, endo: 30 } },
    { id: 'mast', name: 'Мастерон', type: 'ester', halfLife: 7, risks: { liver: 10, cardio: 40, hemo: 20, neuro: 30, kidney: 10, endo: 40 } },
    { id: 'gh', name: 'Гормон Роста (Соматропин)', type: 'peptide', halfLife: 0.5, risks: { liver: 5, cardio: 20, hemo: 10, neuro: 10, kidney: 20, endo: 60 } },
    { id: 'ins', name: 'Инсулин', type: 'peptide', halfLife: 0.1, risks: { liver: 5, cardio: 30, hemo: 10, neuro: 40, kidney: 10, endo: 90 } }
    // Сюда можно добавить остальные 116 препаратов по аналогии
];

const SUPPORT_DB = [
    { id: 'telmi', name: 'Телмисартан', dose: '40-80 мг', time: 'morning', targets: ['cardio', 'kidney'], synergy: ['nebi'] },
    { id: 'nebi', name: 'Небилет', dose: '2.5-5 мг', time: 'morning', targets: ['cardio'], synergy: ['telmi'] },
    { id: 'udca', name: 'УДХК (Урсосан)', dose: '1000 мг', time: 'lunch', targets: ['liver'], synergy: ['tmg'] },
    { id: 'tmg', name: 'TMG', dose: '1000 мг', time: 'lunch', targets: ['liver', 'cardio'], synergy: ['udca'] },
    { id: 'pentox', name: 'Пентоксифиллин', dose: '400 мг', time: 'lunch', targets: ['hemo', 'cardio'], synergy: [] },
    { id: 'berb', name: 'Берберин', dose: '500 мг', time: 'lunch', targets: ['endo'], synergy: [] },
    { id: 'citicol', name: 'Цитиколин', dose: '500 мг', time: 'morning', targets: ['neuro'], synergy: ['fasor'] },
    { id: 'fasor', name: 'Фасорацетам', dose: '100 мг', time: 'morning', targets: ['neuro'], synergy: ['citicol'] },
    { id: 'magn', name: 'Магний', dose: '400 мг', time: 'evening', targets: ['neuro', 'cardio'], synergy: [] },
    { id: 'zinc', name: 'Цинк', dose: '50 мг', time: 'evening', targets: ['endo'], synergy: [] },
    { id: 'hcg', name: 'ХГЧ', dose: '500 МЕ', time: 'evening', targets: ['repro'], synergy: [] }
];

const SYNERGY_RULES = {
    'telmi_nebi': 'Максимальный контроль АД и ЧСС',
    'udca_tmg': 'Полная защита печени (холестаз + метилирование)',
    'citicol_fasor': 'Мощная ноотропная связка',
    'pentox_aspirin': 'Разжижение крови (синергия)'
};
