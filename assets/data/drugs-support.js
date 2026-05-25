window.DB_SUPPORT = [
    // Сердце и Сосуды
    { id: 'telmisartan', name: 'Телмисартан', category: 'cardio', dose: '20-80 мг', time: 'evening', mechanism: 'Блокатор AT1, снижение АД, нефропротекция', synergy: ['nebivolol', 'astragalus'] },
    { id: 'nebivolol', name: 'Небилет (Небиволол)', category: 'cardio', dose: '2.5-5 мг', time: 'morning', mechanism: 'Бета-1 блокатор, NO вазодилатация', synergy: ['telmisartan', 'taurine'] },
    { id: 'tadalafil', name: 'Тадалафил', category: 'cardio', dose: '5 мг', time: 'morning', mechanism: 'ФДЭ-5 ингибитор, кровоток', synergy: ['agmatine', 'citrulline'] },
    { id: 'aspirin', name: 'Аспирин Кардио', category: 'cardio', dose: '75-100 мг', time: 'morning', mechanism: 'Антиагрегант', synergy: ['nattokinase'] },
    { id: 'omega3', name: 'Омега-3', category: 'cardio', dose: '2-3 г', time: 'morning', mechanism: 'Снижение ТГ, противовоспалительное', synergy: ['statins'] },
    { id: 'coq10', name: 'Коэнзим Q10', category: 'cardio', dose: '100-200 мг', time: 'morning', mechanism: 'Энергия миокарда', synergy: ['d-ribose'] },
    { id: 'magnesium', name: 'Магний (Цитрат/Глицинат)', category: 'cardio', dose: '400-800 мг', time: 'evening', mechanism: 'Антиаритмик, расслабление', synergy: ['taurine', 'theanine'] },
    { id: 'taurine', name: 'Таурин', category: 'cardio', dose: '2-4 г', time: 'morning', mechanism: 'Осморегулятор, антиаритмик', synergy: ['magnesium', 'nebivolol'] },
    
    // Печень
    { id: 'udca', name: 'УДХК (Урсосан)', category: 'liver', dose: '1000-1500 мг', time: 'split', mechanism: 'Защита от холестаза', synergy: ['nac', 'tmG'] },
    { id: 'nac', name: 'NAC (Ацетилцистеин)', category: 'liver', dose: '600-1200 мг', time: 'morning', mechanism: 'Предшественник глутатиона', synergy: ['udca', 'milk_thistle'] },
    { id: 'tmG', name: 'TMG (Бетаин)', category: 'liver', dose: '1-2 г', time: 'morning', mechanism: 'Метилирование, снижение гомоцистеина', synergy: ['folate', 'b12'] },
    { id: 'milk_thistle', name: 'Расторопша', category: 'liver', dose: '200 мг', time: 'morning', mechanism: 'Силимарин, антиоксидант', synergy: ['nac'] },
    
    // Почки
    { id: 'astragalus', name: 'Астрагал', category: 'kidney', dose: '1-2 г', time: 'split', mechanism: 'Снижение протеинурии, фильтрация', synergy: ['telmisartan'] },
    { id: 'sodium_bicarb', name: 'Сода (Бикарбонат)', category: 'kidney', dose: '3-5 г', time: 'preworkout', mechanism: 'Буферизация кислоты', synergy: ['water'] },
    
    // Нейро и Психо
    { id: 'citicholine', name: 'Цитиколин', category: 'neuro', dose: '500 мг', time: 'morning', mechanism: 'Ацетилхолин, фокус', synergy: ['fasoracetam'] },
    { id: 'fasoracetam', name: 'Фасорацетам', category: 'neuro', dose: '100 мг', time: 'morning', mechanism: 'ГАМК модуляция, снижение толерантности', synergy: ['citicholine'] },
    { id: 'bromantan', name: 'Бромантан', category: 'neuro', dose: '50 мг', time: 'morning', mechanism: 'Актопротектор, дофамин', synergy: ['phenibut'] },
    { id: 'theanine', name: 'L-Теанин', category: 'neuro', dose: '200-400 мг', time: 'evening', mechanism: 'Расслабление без седации', synergy: ['magnesium', 'caffeine'] },
    { id: 'zma', name: 'ZMA', category: 'neuro', dose: '1 капс', time: 'evening', mechanism: 'Сон, тестостерон', synergy: ['melatonin'] },
    
    // Гематология
    { id: 'nattokinase', name: 'Наттокиназа', category: 'blood', dose: '2000 FU', time: 'morning', mechanism: 'Фибринолиз, разжижение', synergy: ['aspirin', 'pentoxifylline'] },
    { id: 'pentoxifylline', name: 'Пентоксифиллин', category: 'blood', dose: '400-800 мг', time: 'split', mechanism: 'Реология крови, гибкость эритроцитов', synergy: ['nattokinase'] },
    { id: 'diosmin', name: 'Диосмин', category: 'blood', dose: '500 мг', time: 'morning', mechanism: 'Венозный тонус', synergy: ['hesperidin'] },
    
    // Эндокринная
    { id: 'berberine', name: 'Берберин', category: 'endo', dose: '500-1000 мг', time: 'split', mechanism: 'AMPK активатор, чувствительность к инсулину', synergy: ['ALA', 'myo_inositol'] },
    { id: 'ALA', name: 'Альфа-Липоевая Кислота', category: 'endo', dose: '300-600 мг', time: 'morning', mechanism: 'Антиоксидант, глюкоза', synergy: ['berberine'] },
    { id: 'anastrozole', name: 'Анастрозол', category: 'endo', dose: '0.25-0.5 мг', time: 'post_inject', mechanism: 'Ингибитор ароматазы', synergy: [] },
    { id: 'cabergoline', name: 'Каберголин', category: 'endo', dose: '0.25-0.5 мг', time: 'weekly', mechanism: 'Снижение пролактина', synergy: ['vit_b6'] },
    { id: 'vit_d3', name: 'Витамин D3 + K2', category: 'endo', dose: '5000 МЕ', time: 'morning', mechanism: 'Гормональный фон, кости', synergy: ['magnesium', 'zinc'] },
    
    // Пептиды и восстановление
    { id: 'bpc157_oral', name: 'BPC-157 (Орал)', category: 'recovery', dose: '250 мкг', time: 'split', mechanism: 'Заживление ЖКТ и связок', synergy: ['tb500'] },
    { id: 'glucosamine', name: 'Глюкозамин+Хондроитин', category: 'recovery', dose: '1500 мг', time: 'morning', mechanism: 'Суставы', synergy: ['msm', 'collagen'] },
    { id: 'collagen', name: 'Коллаген', category: 'recovery', dose: '10 г', time: 'morning', mechanism: 'Структура тканей', synergy: ['vit_c'] }
];
