const DB = {
    substances: [
        {id:'test', name:'Тестостерон', tox:{liver:1, lipid:3, hct:4, neuro:0, kid:1, endo:2, repro:5}},
        {id:'nandrolone', name:'Нандролон', tox:{liver:1, lipid:4, hct:2, neuro:0, kid:2, endo:4, repro:4}},
        {id:'trenbolone', name:'Тренболон', tox:{liver:2, lipid:5, hct:3, neuro:5, kid:4, endo:4, repro:5}},
        {id:'boldenone', name:'Болденон', tox:{liver:1, lipid:3, hct:6, neuro:0, kid:1, endo:1, repro:3}},
        {id:'dhb', name:'Дигидроболденон', tox:{liver:1, lipid:4, hct:5, neuro:0, kid:3, endo:1, repro:3}},
        {id:'masteron', name:'Мастерон', tox:{liver:1, lipid:4, hct:3, neuro:0, kid:1, endo:1, repro:4}},
        {id:'primobolan', name:'Примоболан', tox:{liver:1, lipid:3, hct:2, neuro:0, kid:1, endo:1, repro:2}},
        {id:'oxandrolone', name:'Оксандролон', tox:{liver:4, lipid:5, hct:1, neuro:0, kid:1, endo:1, repro:2}},
        {id:'stanozolol', name:'Станозолол', tox:{liver:5, lipid:5, hct:2, neuro:0, kid:2, endo:1, repro:3}},
        {id:'methandienone', name:'Метандиенон', tox:{liver:5, lipid:4, hct:3, neuro:0, kid:1, endo:3, repro:3}},
        {id:'gh', name:'Гормон Роста', tox:{liver:0, lipid:2, hct:0, neuro:0, kid:1, endo:5, repro:0}},
        {id:'insulin', name:'Инсулин', tox:{liver:0, lipid:1, hct:0, neuro:0, kid:0, endo:5, repro:0}},
        {id:'igf1', name:'IGF-1', tox:{liver:0, lipid:0, hct:0, neuro:0, kid:2, endo:4, repro:0}},
        {id:'mgf', name:'MGF', tox:{liver:0, lipid:0, hct:0, neuro:0, kid:1, endo:2, repro:0}}
    ],
    esters: {
        'test': [{id:'p',name:'Пропионат',hl:2}, {id:'e',name:'Энантат',hl:7}, {id:'c',name:'Ципионат',hl:8}, {id:'s',name:'Сустанон',hl:15}],
        'nandrolone': [{id:'p',name:'Фенилпропионат',hl:4.5}, {id:'d',name:'Деканоат',hl:14}],
        'trenbolone': [{id:'a',name:'Ацетат',hl:3}, {id:'e',name:'Энантат',hl:7}, {id:'h',name:'Гекса',hl:10}],
        'boldenone': [{id:'u',name:'Ундесиленат',hl:14}],
        'dhb': [{id:'a',name:'Ацетат',hl:10}],
        'masteron': [{id:'p',name:'Пропионат',hl:2.5}, {id:'e',name:'Энантат',hl:7}],
        'primobolan': [{id:'e',name:'Энантат',hl:10}],
        'stanozolol': [{id:'s',name:'Суспензия',hl:24}],
        'gh': [{id:'d',name:'Ежедневно',hl:0.1}, {id:'l',name:'Пролонг',hl:168}],
        'insulin': [{id:'r',name:'Короткий',hl:0.1}, {id:'l',name:'Продленный',hl:24}],
        'igf1': [{id:'lr3',name:'LR3',hl:24}, {id:'des',name:'DES',hl:0.5}],
        'mgf': [{id:'m',name:'MGF',hl:0.5}, {id:'peg',name:'PEG-MGF',hl:48}]
    },
    risks: {
        liver: [{id:'chol',n:'Холестаз'}, {id:'ox',n:'ОксСтресс'}, {id:'cyt',n:'Цитолиз'}, {id:'fib',n:'Фиброз'}, {id:'mito',n:'Митохондрии'}, {id:'met',n:'Метилирование'}, {id:'apo',n:'Апоптоз'}],
        cardio: [{id:'htn',n:'Гипертония'}, {id:'tach',n:'Тахикардия'}, {id:'lip',n:'Липиды'}, {id:'thr',n:'Тромбоз'}, {id:'lvh',n:'Гипертрофия'}, {id:'endo',n:'Эндотелий'}, {id:'arr',n:'Аритмия'}],
        kidney: [{id:'hyper',n:'Гиперф'}, {id:'fib_k',n:'Фиброз'}, {id:'elec',n:'Электролиты'}, {id:'prot',n:'Протеин'}, {id:'stone',n:'Камни'}, {id:'tub',n:'Некроз'}, {id:'gfr',n:'СКФ'}],
        neuro: [{id:'dop',n:'Дофамин'}, {id:'glu',n:'Глутамат'}, {id:'gaba',n:'ГАМК'}, {id:'ser',n:'Серотонин'}, {id:'inf',n:'Воспаление'}, {id:'cog',n:'Когнитив'}, {id:'add',n:'Зависимость'}],
        hemato: [{id:'ery',n:'Эритроциты'}, {id:'visc',n:'Вязкость'}, {id:'coag',n:'Коагуляция'}, {id:'anem',n:'Анемия'}, {id:'leuk',n:'Лейкоциты'}, {id:'plat',n:'Тромбоциты'}, {id:'hem',n:'Гемолиз'}],
        endo: [{id:'ins',n:'Инсулин'}, {id:'est',n:'Эстроген'}, {id:'prl',n:'Пролактин'}, {id:'thy',n:'Щитовидка'}, {id:'cor',n:'Кортизол'}, {id:'gh_ax',n:'ОсьГР'}, {id:'adr',n:'Надпочечники'}],
        repro: [{id:'atr',n:'Атрофия'}, {id:'sup',n:'Подавление'}, {id:'sp',n:'Сперма'}, {id:'lib',n:'Либидо'}, {id:'ed',n:'Эрекция'}, {id:'gyn',n:'Гино'}, {id:'inf',n:'Бесплодие'}]
    },
    support: [
        {t:'Натощак', items:[{n:'Iron Guard',d:'2к',m:'Гемоглобин'}, {n:'Цитиколин',d:'500мг',m:'Нейро'}, {n:'Наттокиназа',d:'2к',m:'Реология'}, {n:'Таурин',d:'2г',m:'Антиспазм'}]},
        {t:'Завтрак', items:[{n:'Астрагал',d:'500мг',m:'Почки'}, {n:'Небилет',d:'2.5мг',m:'Давление'}, {n:'Тадалафил',d:'5мг',m:'Поток'}, {n:'Берберин',d:'500мг',m:'Инсулин'}, {n:'D3+K2',d:'5000МЕ',m:'Кости'}, {n:'TMG',d:'1г',m:'Метил'}, {n:'Бергамот',d:'500мг',m:'Липиды'}, {n:'Бромантан',d:'5мг',m:'Дофамин'}]},
        {t:'Обед', items:[{n:'УДХК',d:'1000мг',m:'Желчь'}, {n:'Пентоксифиллин',d:'400мг',m:'Вязкость'}, {n:'Joint',d:'2к',m:'Суставы'}, {n:'VitE',d:'400МЕ',m:'Антиокс'}]},
        {t:'Предтреник', items:[{n:'Агмантин',d:'1000мг',m:'NO'}]},
        {t:'Вечер', items:[{n:'Телмисартан',d:'80мг',m:'Давление'}, {n:'Магний',d:'400мг',m:'Расслабление'}, {n:'Теанин',d:'400мг',m:'Сон'}, {n:'ГР',d:'5ЕД',m:'Рост'}]}
    ],
    shop: {'udca': [{p:'Ozon',pr:'1500р'}], 'telmisartan': [{p:'Apteka',pr:'600р'}], 'berberine': [{p:'iHerb',pr:'20$'}], 'taurine': [{p:'Ozon',pr:'800р'}]},
    articles: [{t:'Основы PK/PD', c:'Theory', v:120}, {t:'Защита печени', c:'Safety', v:340}, {t:'IGF-1 LR3 vs DES', c:'Peptides', v:85}, {t:'Контроль Эстрадиола', c:'Hormones', v:210}],
    glossary: {'Raw':'Риск без защиты', 'Net':'Риск с защитой', 'HL':'Период полувыведения'}
};
