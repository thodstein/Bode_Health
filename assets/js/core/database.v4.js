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
        { id: 'gh', name: 'Гормон Роста (Somatropin)', class: 'Peptide', tox: { liver: 0, lipid: 2, hct: 0, neuro: 0, kid: 1, endo: 5, repro: 0 } },
        { id: 'insulin', name: 'Инсулин', class: 'Hormone', tox: { liver: 0, lipid: 1, hct: 0, neuro: 0, kid: 0, endo: 5, repro: 0 } },
        { id: 'igf1', name: 'IGF-1', class: 'Peptide', tox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kid: 2, endo: 4, repro: 0 } },
        { id: 'mgf', name: 'MGF / PEG-MGF', class: 'Peptide', tox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kid: 1, endo: 2, repro: 0 } },
        { id: 'hcg', name: 'Хорионический гонадотропин', class: 'Hormone', tox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kid: 0, endo: 2, repro: 0 } },
        { id: 'anastrozole', name: 'Анастрозол', class: 'AI', tox: { liver: 1, lipid: 2, hct: 0, neuro: 1, kid: 0, endo: 3, repro: 1 } },
        { id: 'cabergoline', name: 'Каберголин', class: 'Dopamine Agonist', tox: { liver: 0, lipid: 0, hct: 0, neuro: 2, kid: 0, endo: 1, repro: 0 } }
    ],
    esters: {
        'test': [ {id:'test_p', name:'Пропионат', hl:2}, {id:'test_e', name:'Энантат', hl:7}, {id:'test_c', name:'Ципионат', hl:8}, {id:'test_sus', name:'Сустанон 250', hl:15} ],
        'nandrolone': [ {id:'nandrolone_p', name:'Фенилпропионат (NPP)', hl:4.5}, {id:'nandrolone_d', name:'Деканоат (Deca)', hl:14} ],
        'trenbolone': [ {id:'trenbolone_a', name:'Ацетат', hl:3}, {id:'trenbolone_e', name:'Энантат', hl:7}, {id:'trenbolone_h', name:'Гексагидробензилкарбонат', hl:10} ],
        'boldenone': [ {id:'boldenone_u', name:'Ундесиленат', hl:14} ],
        'dhb': [ {id:'dhb_p', name:'Ацетат (Boldenone Acetate)', hl:10} ],
        'masteron': [ {id:'masteron_p', name:'Пропионат', hl:2.5}, {id:'masteron_e', name:'Энантат', hl:7} ],
        'primobolan': [ {id:'primobolan_e', name:'Энантат', hl:10} ],
        'stanozolol': [ {id:'stanozolol_s', name:'Водная суспензия', hl:1}, {id:'stanozolol_o', name:'Оральная форма', hl:9} ],
        'methandienone': [ {id:'methandienone_o', name:'Оральная форма', hl:5} ],
        'oxandrolone': [ {id:'oxandrolone_o', name:'Оральная форма', hl:9} ],
        'gh': [ {id:'gh_short', name:'Ежедневный укол', hl:0.2}, {id:'gh_long', name:'Пролонгированный (Weekly)', hl:168} ],
        'insulin': [ {id:'insulin_r', name:'Короткий (Actrapid/Humulin R)', hl:0.15}, {id:'insulin_l', name:'Продленный (Glargine/Tresiba)', hl:24} ],
        'igf1': [ {id:'igf1_lr3', name:'LR3 (Long R3)', hl:24}, {id:'igf1_des', name:'DES (1-3)', hl:0.3} ],
        'mgf': [ {id:'mgf_plain', name:'MGF (Mechano)', hl:0.5}, {id:'peg_mgf', name:'PEG-MGF', hl:48} ],
        'hcg': [ {id:'hcg_inj', name:'Лиофилизат', hl:36} ]
    },
    risks: {
        liver: [ {id:'chol',n:'Холестаз'}, {id:'ox',n:'Окс. стресс'}, {id:'cyt',n:'Цитолиз (ALT/AST)'}, {id:'fib',n:'Фиброз'}, {id:'mito',n:'Митохондрии'}, {id:'met',n:'Метилирование'}, {id:'apo',n:'Апоптоз'} ],
        cardio: [ {id:'htn',n:'Гипертония'}, {id:'tach',n:'Тахикардия'}, {id:'lip',n:'Дислипидемия'}, {id:'thr',n:'Тромбоз'}, {id:'lvh',n:'Гипертрофия ЛЖ'}, {id:'endo',n:'Эндотелий'}, {id:'arr',n:'Аритмия'} ],
        kidney: [ {id:'hyper',n:'Гиперфильтрация'}, {id:'fib_k',n:'Фиброз почек'}, {id:'elec',n:'Электролиты'}, {id:'prot',n:'Протеинурия'}, {id:'stone',n:'Камни'}, {id:'tub',n:'Тубулярный некроз'}, {id:'gfr',n:'СКФ'} ],
        neuro: [ {id:'dop',n:'Дофамин'}, {id:'glu',n:'Глутамат'}, {id:'gaba',n:'ГАМК'}, {id:'ser',n:'Серотонин'}, {id:'inf',n:'Нейровоспаление'}, {id:'cog',n:'Когнитивные ф-ции'}, {id:'add',n:'Зависимость'} ],
        hemato: [ {id:'ery',n:'Эритроцитоз'}, {id:'visc',n:'Вязкость'}, {id:'coag',n:'Коагуляция'}, {id:'anem',n:'Анемия'}, {id:'leuk',n:'Лейкоцитоз'}, {id:'plat',n:'Тромбоциты'}, {id:'hem',n:'Гемолиз'} ],
        endo: [ {id:'ins',n:'Инсулинорезист.'}, {id:'est',n:'Эстроген'}, {id:'prl',n:'Пролактин'}, {id:'thy',n:'Щитовидка'}, {id:'cor',n:'Кортизол'}, {id:'gh_ax',n:'Ось ГР/ИФР'}, {id:'adr',n:'Надпочечники'} ],
        repro: [ {id:'atr',n:'Атрофия тестикул'}, {id:'sup',n:'Подавление оси HPTA'}, {id:'sp',n:'Спермогенез'}, {id:'lib',n:'Либидо'}, {id:'ed',n:'Эректильная ф-ция'}, {id:'gyn',n:'Гинекомастия'}, {id:'inf',n:'Бесплодие'} ]
    },
    support: [
        { t:'☀️ Натощак', icon:'🌅', items:[ {n:'Iron Guard', d:'2 капс', m:'Субстрат для гема, профилактика анемии'}, {n:'Цитиколин (CDP-Choline)', d:'500 мг', m:'Нейропротекция, прекурсор ацетилхолина'}, {n:'Наттокиназа + Серрапептаза', d:'2 капс', m:'Фибринолиз, снижение вязкости крови'}, {n:'Таурин', d:'2000 мг', m:'Антагонист AngII, мембраностабилизатор, анти-спазм'} ] },
        { t:'🍳 Завтрак', icon:'🍳', items:[ {n:'Астрагал', d:'500 мг', m:'Нефропротекция, снижение протеинурии'}, {n:'Небилет (Небиволол)', d:'2.5 мг', m:'Beta-1 блокатор, NO-вазодилатация, контроль ЧСС'}, {n:'Тадалафил', d:'5 мг', m:'PDE5 ингибитор, улучшение эндотелиальной функции'}, {n:'Берберин', d:'500 мг', m:'AMPK активатор, снижение инсулинорезистентности'}, {n:'Витамин D3 + K2 (MK-7)', d:'5000 МЕ / 100 мкг', m:'Кальций-менеджмент, иммунитет, здоровье костей'}, {n:'TMG (Бетаин) + Метилфолат', d:'1000 мг + 1 капс', m:'Донор метила, снижение гомоцистеина'}, {n:'Бергамот', d:'500 мг', m:'Натуральный статин, контроль липидного профиля'}, {n:'Бромантан + Фасорацетам', d:'50 мг + 100 мг', m:'Актопротектор + Ноотроп (дофамин/ГАМК баланс)'} ] },
        { t:'🍲 Обед', icon:'🍲', items:[ {n:'УДХК (Урсосан)', d:'1000 мг', m:'Гидрофильная желчная кислота, защита от холестаза'}, {n:'Пентоксифиллин (Трентал)', d:'400 мг', m:'Улучшение реологии крови, гибкость эритроцитов'}, {n:'Joint Health (Glucosamine/Chondroitin)', d:'2 капс', m:'Субстрат для хрящевой ткани'}, {n:'Витамин Е (Tocopherol)', d:'400 МЕ', m:'Жирорастворимый антиоксидант'} ] },
        { t:'💪 Предтреник', icon:'⚡', items:[ {n:'Агмантин Сульфат', d:'1000 мг', m:'Ингибитор аргиназы, буст NO, нейропротекция'} ] },
        { t:'🌙 Вечер', icon:'🌙', items:[ {n:'Телмисартан', d:'80 мг', m:'ARB, мощная нефро- и кардиопротекция, контроль АД'}, {n:'Магний (Глицинат/Цитрат)', d:'400 мг (эл.)', m:'Релаксация ЦНС, профилактика судорог, контроль ритма'}, {n:'L-Теанин', d:'400 мг', m:'Альфа-волны мозга, снижение тревожности, улучшение сна'}, {n:'Гормон Роста', d:'5 ЕД', m:'Липолиз, регенерация тканей (колется за 30 мин до сна)', note:'Inj'} ] },
        { t:'💉 По схеме', icon:'💉', items:[ {n:'HCG', d:'500 МЕ 2р/нед', m:'Сохранение размера и функции тестикул'}, {n:'Анастрозол', d:'По анализам', m:'Контроль уровня эстрадиола (при превышении)'}, {n:'Каберголин', d:'По анализам', m:'Контроль пролактина (при использовании 19-нор препаратов)'}, {n:'BPC-157 + TB-500', d:'Курс', m:'Системная и локальная регенерация связок и мышц'} ] }
    ],
    shop: {
        'udca': [ {p:'Ozon', pr:'1500₽'}, {p:'iHerb', pr:'$25'}, {p:'Apteka.ru', pr:'1800₽'} ],
        'telmisartan': [ {p:'Apteka.ru', pr:'600₽'}, {p:'Ozon', pr:'750₽'} ],
        'nebivolol': [ {p:'Ozon', pr:'400₽'}, {p:'Eapteka', pr:'450₽'} ],
        'berberine': [ {p:'iHerb', pr:'$20'}, {p:'Ozon', pr:'2200₽'} ],
        'taurine': [ {p:'Ozon', pr:'800₽'}, {p:'SportFood', pr:'900₽'} ],
        'magnesium': [ {p:'Ozon', pr:'900₽'}, {p:'iHerb', pr:'$15'} ],
        'omega3': [ {p:'iHerb', pr:'$25'}, {p:'Ozon', pr:'1200₽'} ]
    },
    articles: [
        { t:'Основы фармакокинетики (PK/PD)', c:'Theory', v:120, desc:'Как работают эфиры и период полувыведения.' },
        { t:'Протоколы защиты печени', c:'Safety', v:340, desc:'УДХК, TMG и борьба с холестазом.' },
        { t:'IGF-1: LR3 vs DES', c:'Peptides', v:85, desc:'Разбор форм, дозировок и времени введения.' },
        { t:'Контроль Эстрадиола и Пролактина', c:'Hormones', v:210, desc:'Когда нужны ИА и КА, побочки.' },
        { t:'Протоколы ПКТ (After Cycle Therapy)', c:'Recovery', v:150, desc:'Кломид, Тамоксифен, ХГЧ: схемы.' },
        { t:'Анализ крови: полная расшифровка', c:'Labs', v:400, desc:'На что смотреть в первую очередь.' },
        { t:'Гормон роста: мифы и реальность', c:'Peptides', v:180, desc:'Схемы приема, липолиз, инсулинорезистентность.' }
    ],
    glossary: {
        'Raw Risk': 'Исходный уровень риска, рассчитанный на основе свойств препаратов и дозировок без учета средств защиты.',
        'Net Risk': 'Остаточный риск после применения протокола поддержки (снижается благодаря УДХК, антигипертензивным и др.).',
        'Half-life (T1/2)': 'Период полувыведения — время, за которое концентрация вещества в крови уменьшается вдвое.',
        'Hematocrit': 'Показатель густоты крови (доля эритроцитов). Критическое значение >52-54%, риск тромбозов.',
        'IGF-1 LR3': 'Длинная версия инсулиноподобного фактора роста (до 24 часов), работает системно.',
        'IGF-1 DES': 'Короткая версия (20 минут), обладает высокой аффинностью, колется локально перед тренировкой.',
        'PEG-MGF': 'Пролонгированная версия MGF с полиэтиленгликолем для увеличения периода жизни в крови.',
        'Insulin Glargine': 'Продленный инсулин (фон), имитирует базальную секрецию, используется для контроля сахара.',
        'Erythrocytosis': 'Повышение уровня эритроцитов, частый побочный эффект андрогенов.',
        'Gynecomastia': 'Рост железистой ткани груди у мужчин вследствие высокого эстрадиола или пролактина.'
    },
    achievements: [
        { id: 'first_stack', name: 'Новичок', desc: 'Добавь первый препарат в стек', xp: 100, icon: '💊' },
        { id: 'full_support', name: 'Защитник', desc: 'Изучи полный протокол поддержки', xp: 200, icon: '🛡️' },
        { id: 'lab_geek', name: 'Биохакер', desc: 'Рассчитай индекс фертильности', xp: 150, icon: '🧬' },
        { id: 'risk_master', name: 'Аналитик', desc: 'Посмотри матрицу рисков на 10 неделе', xp: 250, icon: '📊' }
    ]
};
