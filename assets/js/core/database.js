const DB = {
    substances: [
        { id: 'test', name: 'Тестостерон', class: 'AAS', tox: { liver: 1, lipid: 3, hct: 4, neuro: 0, kid: 1, endo: 2, repro: 5 } },
        { id: 'nandrolone', name: 'Нандролон', class: 'AAS', tox: { liver: 1, lipid: 4, hct: 2, neuro: 0, kid: 2, endo: 4, repro: 4 } },
        { id: 'trenbolone', name: 'Тренболон', class: 'AAS', tox: { liver: 2, lipid: 5, hct: 3, neuro: 5, kid: 4, endo: 4, repro: 5 } },
        { id: 'boldenone', name: 'Болденон', class: 'AAS', tox: { liver: 1, lipid: 3, hct: 6, neuro: 0, kid: 1, endo: 1, repro: 3 } },
        { id: 'dhb', name: 'Дигидроболденон (DHB)', class: 'AAS', tox: { liver: 1, lipid: 4, hct: 5, neuro: 0, kid: 3, endo: 1, repro: 3 } },
        { id: 'masteron', name: 'Мастерон', class: 'AAS', tox: { liver: 1, lipid: 4, hct: 3, neuro: 0, kid: 1, endo: 1, repro: 4 } },
        { id: 'primobolan', name: 'Примоболан', class: 'AAS', tox: { liver: 1, lipid: 3, hct: 2, neuro: 0, kid: 1, endo: 1, repro: 2 } },
        { id: 'oxandrolone', name: 'Оксандролон', class: 'Oral', tox: { liver: 4, lipid: 5, hct: 1, neuro: 0, kid: 1, endo: 1, repro: 2 } },
        { id: 'stanozolol', name: 'Станозолол', class: 'Oral/Inj', tox: { liver: 5, lipid: 5, hct: 2, neuro: 0, kid: 2, endo: 1, repro: 3 } },
        { id: 'methandienone', name: 'Метандиенон', class: 'Oral', tox: { liver: 5, lipid: 4, hct: 3, neuro: 0, kid: 1, endo: 3, repro: 3 } },
        { id: 'gh', name: 'Гормон Роста', class: 'Peptide', tox: { liver: 0, lipid: 2, hct: 0, neuro: 0, kid: 1, endo: 5, repro: 0 } },
        { id: 'insulin', name: 'Инсулин', class: 'Hormone', tox: { liver: 0, lipid: 1, hct: 0, neuro: 0, kid: 0, endo: 5, repro: 0 } },
        { id: 'igf1', name: 'IGF-1', class: 'Peptide', tox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kid: 2, endo: 4, repro: 0 } },
        { id: 'mgf', name: 'MGF / PEG-MGF', class: 'Peptide', tox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kid: 1, endo: 2, repro: 0 } }
    ],
    esters: {
        'test': [ { id: 'test_p', name: 'Пропионат', hl: 2.0 }, { id: 'test_e', name: 'Энантат', hl: 7.0 }, { id: 'test_c', name: 'Ципионат', hl: 8.0 }, { id: 'test_sus', name: 'Сустанон', hl: 15.0 } ],
        'nandrolone': [ { id: 'nandrolone_p', name: 'Фенилпропионат', hl: 4.5 }, { id: 'nandrolone_d', name: 'Деканоат', hl: 14.0 } ],
        'trenbolone': [ { id: 'trenbolone_a', name: 'Ацетат', hl: 3.0 }, { id: 'trenbolone_e', name: 'Энантат', hl: 7.0 }, { id: 'trenbolone_h', name: 'Гекса', hl: 10.0 } ],
        'boldenone': [ { id: 'boldenone_u', name: 'Ундесиленат', hl: 14.0 } ],
        'dhb': [ { id: 'dhb_p', name: 'Ацетат', hl: 10.0 } ],
        'masteron': [ { id: 'masteron_p', name: 'Пропионат', hl: 2.5 }, { id: 'masteron_e', name: 'Энантат', hl: 7.0 } ],
        'primobolan': [ { id: 'primobolan_e', name: 'Энантат', hl: 10.0 } ],
        'stanozolol': [ { id: 'stanozolol_s', name: 'Суспензия', hl: 24.0 } ],
        'gh': [ { id: 'gh_short', name: 'Ежедневно', hl: 0.1 }, { id: 'gh_long', name: 'Пролонг (Weekly)', hl: 168.0 } ],
        'insulin': [ { id: 'insulin_r', name: 'Короткий (R)', hl: 0.1 }, { id: 'insulin_l', name: 'Продленный (Glargine)', hl: 24.0 } ],
        'igf1': [ { id: 'igf1_lr3', name: 'LR3 (Длинный)', hl: 24.0 }, { id: 'igf1_des', name: 'DES (Короткий)', hl: 0.5 } ],
        'mgf': [ { id: 'mgf_plain', name: 'MGF', hl: 0.5 }, { id: 'peg_mgf', name: 'PEG-MGF', hl: 48.0 } ]
    },
    risks: {
        liver: [ {id:'chol', n:'Холестаз'}, {id:'ox', n:'Окс.стресс'}, {id:'cyt', n:'Цитолиз'}, {id:'fib', n:'Фиброз'}, {id:'mito', n:'Митохондрии'}, {id:'met', n:'Метилирование'}, {id:'apo', n:'Апоптоз'} ],
        cardio: [ {id:'htn', n:'Гипертония'}, {id:'tach', n:'Тахикардия'}, {id:'lip', n:'Липиды'}, {id:'thr', n:'Тромбоз'}, {id:'lvh', n:'Гипертрофия'}, {id:'endo', n:'Эндотелий'}, {id:'arr', n:'Аритмия'} ],
        kidney: [ {id:'hyper', n:'Гиперфильтрация'}, {id:'fib_k', n:'Фиброз'}, {id:'elec', n:'Электролиты'}, {id:'prot', n:'Протеинурия'}, {id:'stone', n:'Камни'}, {id:'tub', n:'Некроз'}, {id:'gfr', n:'Падение СКФ'} ],
        neuro: [ {id:'dop', n:'Дофамин'}, {id:'glu', n:'Глутамат'}, {id:'gaba', n:'ГАМК'}, {id:'ser', n:'Серотонин'}, {id:'inf', n:'Воспаление'}, {id:'cog', n:'Когнитив'}, {id:'add', n:'Зависимость'} ],
        hemato: [ {id:'ery', n:'Эритроцитоз'}, {id:'visc', n:'Вязкость'}, {id:'coag', n:'Коагуляция'}, {id:'anem', n:'Анемия'}, {id:'leuk', n:'Лейкоцитоз'}, {id:'plat', n:'Тромбоциты'}, {id:'hem', n:'Гемолиз'} ],
        endo: [ {id:'ins', n:'Инсулинорезист.'}, {id:'est', n:'Эстроген'}, {id:'prl', n:'Пролактин'}, {id:'thy', n:'Щитовидка'}, {id:'cor', n:'Кортизол'}, {id:'gh_ax', n:'Ось ГР'}, {id:'adr', n:'Надпочечники'} ],
        repro: [ {id:'atr', n:'Атрофия'}, {id:'sup', n:'Подавление'}, {id:'sp', n:'Спермогенез'}, {id:'lib', n:'Либидо'}, {id:'ed', n:'Эрекция'}, {id:'gyn', n:'Гинекомастия'}, {id:'inf', n:'Бесплодие'} ]
    },
    support: [
        { t: '☀️ Натощак', items: [ {n:'Iron Guard', d:'2 капс', m:'Гемоглобин'}, {n:'Цитиколин', d:'500 мг', m:'Нейропротекция'}, {n:'Наттокиназа', d:'2 капс', m:'Реология крови'}, {n:'Таурин', d:'2000 мг', m:'Анти-спазм, давление'} ] },
        { t: '🍳 Завтрак', items: [ {n:'Астрагал', d:'500 мг', m:'Нефропротекция'}, {n:'Небилет', d:'2.5 мг', m:'Контроль АД и ЧСС'}, {n:'Тадалафил', d:'5 мг', m:'Эндотелий, кровоток'}, {n:'Берберин', d:'500 мг', m:'Чувствительность к инсулину'}, {n:'Витамин D3 + K2', d:'5000 МЕ', m:'Кости, иммунитет'}, {n:'TMG + Метилфолат', d:'1000 мг', m:'Метилирование, гомоцистеин'}, {n:'Бергамот', d:'500 мг', m:'Контроль липидов'}, {n:'Бромантан + Фасорацетам', d:'50+100 мг', m:'Дофамин/ГАМК баланс'} ] },
        { t: '🍲 Обед', items: [ {n:'УДХК (Урсосан)', d:'1000 мг', m:'Защита печени, желчеотток'}, {n:'Пентоксифиллин', d:'400 мг', m:'Вязкость крови, микроциркуляция'}, {n:'Joint Health', d:'2 капс', m:'Поддержка суставов'}, {n:'Витамин Е', d:'400 МЕ', m:'Антиоксидант'} ] },
        { t: '💪 Предтреник', items: [ {n:'Агмантин', d:'1000 мг', m:'NO бустер, памп'} ] },
        { t: '🌙 Вечер', items: [ {n:'Телмисартан', d:'80 мг', m:'Мощная защита почек и сердца'}, {n:'Магний', d:'400 мг', m:'Расслабление, сон, судороги'}, {n:'L-Теанин', d:'400 мг', m:'Снижение тревожности'}, {n:'Гормон Роста', d:'5 ЕД', m:'Регенерация, липолиз', note:'Инъекция'} ] }
    ],
    shop: {
        'udca': [ {p:'Ozon', pr:'1500₽', u:'#'}, {p:'iHerb', pr:'$25', u:'#'} ],
        'telmisartan': [ {p:'Apteka.ru', pr:'600₽', u:'#'} ],
        'nebivolol': [ {p:'Ozon', pr:'400₽', u:'#'} ],
        'berberine': [ {p:'iHerb', pr:'$20', u:'#'} ],
        'taurine': [ {p:'Ozon', pr:'800₽', u:'#'} ],
        'magnesium': [ {p:'Ozon', pr:'900₽', u:'#'} ]
    },
    articles: [
        { id: 1, t: 'Основы фармакокинетики', c: 'Theory', v: 120 },
        { id: 2, t: 'Протоколы защиты печени на курсе', c: 'Safety', v: 340 },
        { id: 3, t: 'IGF-1: Разбор LR3 и DES', c: 'Peptides', v: 85 },
        { id: 4, t: 'Управление эстрадиолом и пролактином', c: 'Hormones', v: 210 },
        { id: 5, t: 'Гематокрит: Как снизить риски', c: 'Blood', v: 150 }
    ],
    glossary: {
        'Raw Risk': 'Исходный уровень риска без применения поддержки.',
        'Net Risk': 'Остаточный риск после применения протокола безопасности.',
        'Half-life': 'Период полувыведения: время, за которое концентрация вещества падает в 2 раза.',
        'Hematocrit': 'Показатель густоты крови (доля эритроцитов). Критическое значение >52%.',
        'IGF-1 LR3': 'Длинная версия IGF-1 с периодом действия до 24 часов.',
        'IGF-1 DES': 'Короткая версия IGF-1 (20 мин), используется локально.',
        'PEG-MGF': 'Пролонгированная форма фактора роста мышц.',
        'Aromatization': 'Процесс превращения андрогенов в эстрогены.'
    }
};
