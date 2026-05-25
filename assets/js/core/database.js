const DB_DATA = {
  substances: [
    {id:'test', name:'Тестостерон', tox:{liv:1,lip:3,hct:4,neu:0,kid:1,end:2,rep:5}},
    {id:'tren', name:'Тренболон', tox:{liv:2,lip:5,hct:3,neu:5,kid:4,end:4,rep:5}},
    {id:'nand', name:'Нандролон', tox:{liv:1,lip:4,hct:2,neu:0,kid:2,end:4,rep:4}},
    {id:'bold', name:'Болденон', tox:{liv:1,lip:3,hct:6,neu:0,kid:1,end:1,rep:3}},
    {id:'dhb', name:'DHB', tox:{liv:1,lip:4,hct:5,neu:0,kid:3,end:1,rep:3}},
    {id:'mast', name:'Мастерон', tox:{liv:1,lip:4,hct:3,neu:0,kid:1,end:1,rep:4}},
    {id:'prim', name:'Примоболан', tox:{liv:1,lip:3,hct:2,neu:0,kid:1,end:1,rep:2}},
    {id:'oxan', name:'Оксандролон', tox:{liv:4,lip:5,hct:1,neu:0,kid:1,end:1,rep:2}},
    {id:'stan', name:'Станозолол', tox:{liv:5,lip:5,hct:2,neu:0,kid:2,end:1,rep:3}},
    {id:'meth', name:'Метандиенон', tox:{liv:5,lip:4,hct:3,neu:0,kid:1,end:3,rep:3}},
    {id:'gh', name:'Гормон Роста', tox:{liv:0,lip:2,hct:0,neu:0,kid:1,end:5,rep:0}},
    {id:'ins', name:'Инсулин', tox:{liv:0,lip:1,hct:0,neu:0,kid:0,end:5,rep:0}},
    {id:'igf', name:'IGF-1', tox:{liv:0,lip:0,hct:0,neu:0,kid:2,end:4,rep:0}},
    {id:'mgf', name:'MGF/PEG', tox:{liv:0,lip:0,hct:0,neu:0,kid:1,end:2,rep:0}}
  ],
  esters: {
    'test': [{id:'tp',n:'Пропионат',h:2},{id:'te',n:'Энантат',h:7},{id:'tc',n:'Ципионат',h:8},{id:'ts',n:'Сустанон',h:15}],
    'tren': [{id:'ta',n:'Ацетат',h:3},{id:'te',n:'Энантат',h:7},{id:'th',n:'Гекса',h:10}],
    'nand': [{id:'np',n:'Фенилпропионат',h:4.5},{id:'nd',n:'Деканоат',h:14}],
    'bold': [{id:'bu',n:'Ундесиленат',h:14}],
    'dhb': [{id:'da',n:'Ацетат',h:10}],
    'mast': [{id:'mp',n:'Пропионат',h:2.5},{id:'me',n:'Энантат',h:7}],
    'prim': [{id:'pe',n:'Энантат',h:10}],
    'stan': [{id:'ss',n:'Суспензия',h:24}],
    'gh': [{id:'gs',n:'Ежедневно',h:0.1},{id:'gl',n:'Пролонг',h:168}],
    'ins': [{id:'ir',n:'Короткий',h:0.1},{id:'il',n:'Продленный',h:24}],
    'igf': [{id:'lr3',n:'LR3',h:24},{id:'des',n:'DES',h:0.5}],
    'mgf': [{id:'mgf',n:'MGF',h:0.5},{id:'peg',n:'PEG-MGF',h:48}]
  },
  risks: {
    liver: [{id:'chol',n:'Холестаз'},{id:'ox',n:'Окс.стресс'},{id:'cyt',n:'Цитолиз'},{id:'fib',n:'Фиброз'},{id:'mit',n:'Митохондрии'},{id:'met',n:'Метилирование'},{id:'apo',n:'Апоптоз'}],
    cardio: [{id:'htn',n:'Гипертония'},{id:'tach',n:'Тахикардия'},{id:'lip',n:'Липиды'},{id:'thr',n:'Тромбоз'},{id:'lvh',n:'Гипертрофия'},{id:'end',n:'Эндотелий'},{id:'arr',n:'Аритмия'}],
    kidney: [{id:'hf',n:'Гиперфильтрация'},{id:'fibk',n:'Фиброз'},{id:'elec',n:'Электролиты'},{id:'prot',n:'Протеинурия'},{id:'ston',n:'Камни'},{id:'tub',n:'Некроз'},{id:'gfr',n:'Падение СКФ'}],
    neuro: [{id:'dop',n:'Дофамин'},{id:'glu',n:'Глутамат'},{id:'gaba',n:'ГАМК'},{id:'ser',n:'Серотонин'},{id:'inf',n:'Воспаление'},{id:'cog',n:'Когнитив'},{id:'add',n:'Зависимость'}],
    hemato: [{id:'ery',n:'Эритроцитоз'},{id:'vis',n:'Вязкость'},{id:'coa',n:'Коагуляция'},{id:'ane',n:'Анемия'},{id:'leu',n:'Лейкоцитоз'},{id:'pla',n:'Тромбоциты'},{id:'hem',n:'Гемолиз'}],
    endo: [{id:'insr',n:'Инсулинорез.'},{id:'est',n:'Эстроген'},{id:'prol',n:'Пролактин'},{id:'thy',n:'Щитовидка'},{id:'cor',n:'Кортизол'},{id:'ghax',n:'Ось ГР'},{id:'adr',n:'Надпочечники'}],
    repro: [{id:'atr',n:'Атрофия'},{id:'sup',n:'Подавление'},{id:'sp erm',n:'Спермогенез'},{id:'lib',n:'Либидо'},{id:'ed',n:'Эрекция'},{id:'gyn',n:'Гинекомастия'},{id:'inf',n:'Бесплодие'}]
  },
  support: [
    {t:'☀️ Натощак', items:[{n:'Iron Guard',d:'2 капс',m:'Гемоглобин'},{n:'Цитиколин',d:'500мг',m:'Нейро'},{n:'Наттокиназа',d:'2 капс',m:'Реология'},{n:'Таурин',d:'2г',m:'Анти-спазм'}]},
    {t:'🍳 Завтрак', items:[{n:'Астрагал',d:'500мг',m:'Почки'},{n:'Небилет',d:'2.5мг',m:'Давление'},{n:'Тадалафил',d:'5мг',m:'Поток'},{n:'Берберин',d:'500мг',m:'Инсулин'},{n:'D3+K2',d:'5000МЕ',m:'Кости'},{n:'TMG+Метилфолат',d:'1г',m:'Метил'},{n:'Бергамот',d:'500мг',m:'Липиды'},{n:'Бромантан+Фасорацетам',d:'50+100мг',m:'Дофамин'}]},
    {t:'🍲 Обед', items:[{n:'УДХК',d:'1000мг',m:'Желчь'},{n:'Пентоксифиллин',d:'400мг',m:'Вязкость'},{n:'Joint Health',d:'2 капс',m:'Суставы'},{n:'Витамин Е',d:'400МЕ',m:'Антиокс'}]},
    {t:'💪 Предтреник', items:[{n:'Агмантин',d:'1г',m:'NO'}]},
    {t:'🌙 Вечер', items:[{n:'Телмисартан',d:'80мг',m:'Давление'},{n:'Магний',d:'400мг',m:'Расслабление'},{n:'L-Теанин',d:'400мг',m:'Сон'},{n:'ГР',d:'5ЕД',m:'Рост'}]}
  ],
  shop: {
    'udca':[{p:'Ozon',pr:'1500₽',u:'#'},{p:'iHerb',pr:'$25',u:'#'}],
    'telmisartan':[{p:'Apteka',pr:'600₽',u:'#'}],
    'nebivolol':[{p:'Ozon',pr:'400₽',u:'#'}],
    'berberine':[{p:'iHerb',pr:'$20',u:'#'}],
    'taurine':[{p:'Ozon',pr:'800₽',u:'#'}],
    'magnesium':[{p:'Ozon',pr:'900₽',u:'#'}]
  },
  articles: [
    {t:'Основы фармакокинетики',c:'Theory',v:120},
    {t:'Протоколы защиты печени',c:'Safety',v:340},
    {t:'IGF-1: LR3 vs DES',c:'Peptides',v:85},
    {t:'Управление эстрогеном',c:'Hormones',v:210},
    {t:'Гайд по ПКТ',c:'Recovery',v:150}
  ],
  glossary: {
    'Raw Risk':'Риск без поддержки',
    'Net Risk':'Риск с поддержкой',
    'Half-life':'Период полувыведения',
    'Hematocrit':'Густота крови',
    'IGF-1 LR3':'Длинный IGF (24ч)',
    'IGF-1 DES':'Короткий IGF (20мин)',
    'PEG-MGF':'Пролонгированный MGF'
  }
};
