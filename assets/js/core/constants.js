export const DRUGS_DB = [
    { id: 'test_e', name: 'Тестостерон Энантат', type: 'steroid', halfLife: 7 },
    { id: 'dhb', name: 'DHB (Болденон)', type: 'steroid', halfLife: 14 },
    { id: 'nand', name: 'Нандролон Деканоат', type: 'steroid', halfLife: 14 },
    { id: 'oxan', name: 'Оксандролон', type: 'oral', halfLife: 0.5 },
    { id: 'gh', name: 'Гормон Роста', type: 'peptide', halfLife: 0.01 },
    { id: 'ins', name: 'Инсулин', type: 'peptide', halfLife: 0.005 }
];

export const SUPPORT_DB = [
    { id: 1, name: 'Iron Guard', dose: '2 капс', time: 'morning_empty', group: 'base' },
    { id: 2, name: 'Цитиколин', dose: '500 мг', time: 'morning_empty', group: 'neuro' },
    { id: 3, name: 'Таурин', dose: '2000 мг', time: 'morning_empty', group: 'cardio' },
    { id: 4, name: 'Небилет', dose: '2.5 мг', time: 'morning_food', group: 'cardio' },
    { id: 5, name: 'Берберин', dose: '500 мг', time: 'morning_food', group: 'endo' },
    { id: 6, name: 'Витамин D3+K2', dose: '5000 МЕ', time: 'morning_food', group: 'base' },
    { id: 7, name: 'УДХК (Урсосан)', dose: '1000 мг', time: 'lunch', group: 'liver' },
    { id: 8, name: 'Пентоксифиллин', dose: '400 мг', time: 'lunch', group: 'blood' },
    { id: 9, name: 'Joint Health', dose: '2 капс', time: 'lunch', group: 'joints' },
    { id: 10, name: 'Агмантин', dose: '1000 мг', time: 'workout', group: 'pump' },
    { id: 11, name: 'Цитруллин', dose: '6 г', time: 'intra', group: 'pump' },
    { id: 12, name: 'Телмисартан', dose: '80 мг', time: 'evening', group: 'cardio' },
    { id: 13, name: 'Магний', dose: '400 мг', time: 'evening', group: 'neuro' },
    { id: 14, name: 'Гормон Роста', dose: '5 ЕД', time: 'evening', group: 'growth' }
];

export const SYNERGY_DB = [
    "Телмисартан + Небилет: Полный контроль АД",
    "УДХК + TMG: Защита печени",
    "Берберин + ГР: Контроль инсулина",
    "BPC-157 + TB-500: Регенерация связок"
];
