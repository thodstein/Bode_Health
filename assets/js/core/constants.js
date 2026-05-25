// БАЗА ДАННЫХ ПРЕПАРАТОВ (v11.0)
const DRUGS_DB = [
    {
        id: 'dhb', name: 'DHB (Параболан)', type: 'inject', 
        halfLife: 14, anabolic: 100, androgenic: 100, 
        aromatization: 0, progestin: 50, hepatotoxicity: 0,
        risks: { cv: 4, hep: 0, neuro: 3, lipid: 3, nephro: 4, hemo: 5 },
        desc: 'Дигидроболденон. Не ароматизируется. Высокий риск гематокрита.'
    },
    {
        id: 'boldenone', name: 'Болденон (Эквипойз)', type: 'inject', 
        halfLife: 14, anabolic: 100, androgenic: 50, 
        aromatization: 20, progestin: 0, hepatotoxicity: 0,
        risks: { cv: 3, hep: 0, neuro: 1, lipid: 2, nephro: 2, hemo: 4 },
        desc: 'Эквипойз. Слабая ароматизация. Стимулирует аппетит.'
    },
    {
        id: 'test_e', name: 'Тестостерон Энантат', type: 'inject', 
        halfLife: 7, anabolic: 100, androgenic: 100, 
        aromatization: 100, progestin: 0, hepatotoxicity: 0,
        risks: { cv: 3, hep: 0, neuro: 1, lipid: 2, nephro: 1, hemo: 3 },
        desc: 'Базовый эфир тестостерона.'
    },
    {
        id: 'nandrolone', name: 'Нандролон (Дека)', type: 'inject', 
        halfLife: 14, anabolic: 125, androgenic: 37, 
        aromatization: 20, progestin: 80, hepatotoxicity: 0,
        risks: { cv: 2, hep: 0, neuro: 2, lipid: 2, nephro: 1, hemo: 2 },
        desc: 'Высокая прогестиновая активность. Бережет суставы.'
    },
    {
        id: 'oxandrolone', name: 'Оксандролон (Анавар)', type: 'oral', 
        halfLife: 9, anabolic: 300, androgenic: 20, 
        aromatization: 0, progestin: 0, hepatotoxicity: 30,
        risks: { cv: 4, hep: 3, neuro: 1, lipid: 5, nephro: 1, hemo: 1 },
        desc: 'Мягкий орал. Сильно бьет по липидам.'
    },
    {
        id: 'stanozolol', name: 'Станозолол (Винстрол)', type: 'oral', 
        halfLife: 9, anabolic: 320, androgenic: 30, 
        aromatization: 0, progestin: 0, hepatotoxicity: 60,
        risks: { cv: 5, hep: 5, neuro: 2, lipid: 5, nephro: 2, hemo: 2 },
        desc: 'Сушит суставы. Высокая гепатотоксичность.'
    },
    {
        id: 'trenbolone', name: 'Тренболон Ацетат', type: 'inject', 
        halfLife: 3, anabolic: 500, androgenic: 500, 
        aromatization: 0, progestin: 100, hepatotoxicity: 0,
        risks: { cv: 5, hep: 0, neuro: 5, lipid: 4, nephro: 3, hemo: 3 },
        desc: 'Мощнейший андроген. Нейротоксичен, повышает пролактин.'
    },
    {
        id: 'gh', name: 'Гормон Роста (Соматропин)', type: 'inject', 
        halfLife: 0.5, anabolic: 0, androgenic: 0, 
        aromatization: 0, progestin: 0, hepatotoxicity: 0,
        risks: { cv: 2, hep: 0, neuro: 1, lipid: 1, nephro: 2, hemo: 1 },
        desc: 'Рост тканей, липолиз. Повышает инсулинорезистентность.'
    }
];

// БАЗА ПОДДЕРЖКИ (ИЗ РЕАЛЬНОГО СТЕКА ТЗ)
const SUPPORT_DB = [
    { id: 'udhk', name: 'УДХК (Урсосан)', time: 'lunch', dose: '1000 мг', group: 'liver', synergy: ['tmg', 'nac'] },
    { id: 'telmisartan', name: 'Телмисартан', time: 'evening', dose: '80 мг', group: 'cv', synergy: ['nebilat', 'taurine'] },
    { id: 'nebilat', name: 'Небилет (Небиволол)', time: 'morning', dose: '2.5 мг', group: 'cv', synergy: ['telmisartan'] },
    { id: 'tadalafil', name: 'Тадалафил', time: 'morning', dose: '5 мг', group: 'cv', synergy: ['agmatine'] },
    { id: 'berberine', name: 'Берберин', time: 'morning', dose: '500 мг', group: 'endo', synergy: ['alk'] },
    { id: 'tmg', name: 'TMG (Бетаин)', time: 'morning', dose: '1000 мг', group: 'cv', synergy: ['folate'] },
    { id: 'folate', name: 'Метилфолат', time: 'morning', dose: '1 мг', group: 'cv', synergy: ['tmg', 'b12'] },
    { id: 'bergamot', name: 'Бергамот', time: 'morning', dose: '500 мг', group: 'cv', synergy: [] },
    { id: 'bromantan', name: 'Бромантан', time: 'morning', dose: '50 мг', group: 'neuro', synergy: ['fasoracetam'] },
    { id: 'fasoracetam', name: 'Фасорацетам', time: 'morning', dose: '100 мг', group: 'neuro', synergy: ['citicoline'] },
    { id: 'astragalus', name: 'Астрагал', time: 'morning', dose: '500 мг', group: 'kidney', synergy: ['telmisartan'] },
    { id: 'pentoxifylline', name: 'Пентоксифиллин', time: 'lunch', dose: '400 мг', group: 'blood', synergy: ['aspirin'] },
    { id: 'joint_health', name: 'Joint Health (Глюкозамин+)', time: 'lunch', dose: '2 капс', group: 'oda', synergy: ['bpc157'] },
    { id: 'magnesium', name: 'Магний (Цитрат)', time: 'evening', dose: '400 мг', group: 'neuro', synergy: ['taurine', 'theanine'] },
    { id: 'theanine', name: 'L-Теанин', time: 'evening', dose: '400 мг', group: 'neuro', synergy: ['magnesium'] },
    { id: 'bpc157', name: 'BPC-157', time: 'evening', dose: '250 мкг', group: 'oda', synergy: ['tb500'] },
    { id: 'tb500', name: 'TB-500', time: 'evening', dose: '2.5 мг/нед', group: 'oda', synergy: ['bpc157'] },
    { id: 'hcg', name: 'HCG', time: 'evening', dose: '500 МЕ 2р/нед', group: 'repro', synergy: [] },
    { id: 'anastrozole', name: 'Анастрозол', time: 'evening', dose: '0.5 мг 2р/нед', group: 'endo', synergy: [] },
    { id: 'cabergoline', name: 'Каберголин', time: 'evening', dose: '0.25 мг 2р/нед', group: 'repro', synergy: [] }
];

// МАТРИЦА РИСКОВ (Коэффициенты влияния)
const RISK_MATRIX = {
    cv: ['hypertension', 'tachycardia', 'lipid_profile', 'thrombosis', 'lv_hypertrophy', 'endo_dysfunction', 'calcification'],
    hep: ['cholestasis', 'oxidative_stress', 'cytolysis', 'fibrosis', 'steatosis', 'mitochondrial', 'bile_acids'],
    neuro: ['dopamine_imbalance', 'gaba_dysregulation', 'glutamate_excitotoxicity', 'serotonin_imbalance', 'anxiety', 'insomnia', 'cognitive_decline'],
    lipid: ['ldl_up', 'hdl_down', 'tg_up', 'oxidized_ldl', 'lipoprotein_a', 'remnant_cholesterol', 'apo_b'],
    nephro: ['glomerular_htn', 'tubular_fibrosis', 'proteinuria', 'electrolyte_imbalance', 'gfr_decline', 'hyperfiltration', 'stone_risk'],
    hemo: ['erythrocytosis', 'viscosity_up', 'platelet_aggregation', 'fibrinogen_up', 'hematocrit_crit', 'thrombin_time', 'd_dimer'],
    endo: ['insulin_resistance', 'aromatization', 'prolactin_surge', 'thyroid_suppression', 'cortisol_up', 'gh_igf1_axis', 'leptin_resistance']
};
