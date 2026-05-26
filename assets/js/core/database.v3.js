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
        'test': [ {id:'test_p', name:'Пропионат', hl:2}, {id:'test_e', name:'Энантат', hl:7}, {id:'test_c', name:'Ципионат', hl:8}, {id:'test_sus', name:'Сустанон', hl:15} ],
        'nandrolone': [ {id:'nandrolone_p', name:'Фенилпропионат', hl:4.5}, {id:'nandrolone_d', name:'Деканоат', hl:14} ],
        'trenbolone': [ {id:'trenbolone_a', name:'Ацетат', hl:3}, {id:'trenbolone_e', name:'Энантат', hl:7}, {id:'trenbolone_h', name:'Гекса', hl:10} ],
        'boldenone': [ {id:'boldenone_u', name:'Ундесиленат', hl:14} ],
        'dhb': [ {id:'dhb_p', name:'Ацетат', hl:10} ],
        'masteron': [ {id:'masteron_p', name:'Пропионат', hl:2.5}, {id:'masteron_e', name:'Энантат', hl:7} ],
        'primobolan': [ {id:'primobolan_e', name:'Энантат', hl:10} ],
        'stanozolol': [ {id:'stanozolol_s', name:'Суспензия', hl:24} ],
        'gh': [ {id:'gh_short', name:'Ежедневно', hl:0.1}, {id:'gh_long', name:'Пролонг', hl:168} ],
        'insulin': [ {id:'insulin_r', name:'Короткий', hl:0.1}, {id:'insulin_l', name:'Продленный', hl:24} ],
        'igf1': [ {id:'igf1_lr3', name:'LR3 (Длинный)', hl:24}, {id:'igf1_des', name:'DES (Короткий)', hl:0.5} ],
        'mgf': [ {id:'mgf_plain', name:'MGF', hl:0.5}, {id:'peg_mgf', name:'PEG-MGF', hl:48} ]
    },
    risks: {
        liver: [ {id:'chol',n:'Холестаз',d:'Застой желчи'}, {id:'ox',n:'Окс.стресс',d:'Свободные радикалы'}, {id:'cyt',n:'Цитолиз',d:'Разрушение клеток (ALT/AST)'}, {id:'fib',n:'Фиброз',d:'Рубцевание ткани'}, {id:'mito',n:'Митохондрии',d:'Энергодефицит'}, {id:'met',n:'Метилирование',d:'Дефицит метил-групп'}, {id:'apo',n:'Апоптоз',d:'Гибель клеток'} ],
        cardio: [ {id:'htn',n:'Гипертония',d:'Высокое АД'}, {id:'tach',n:'Тахикардия',d:'Высокий пульс'}, {id:'lip',n:'Липиды',d:'ЛПНП↑ / ЛПВП↓'}, {id:'thr',n:'Тромбоз',d:'Сгущение крови'}, {id:'lvh',n:'Гипертрофия',d:'Утолщение стенок'}, {id:'endo',n:'Эндотелий',d:'Дисфункция сосудов'}, {id:'arr',n:'Аритмия',d:'Сбой ритма'} ],
        kidney: [ {id:'hyper',n:'Гиперф.',d:'Перегрузка клубочков'}, {id:'fib_k',n:'Фиброз',d:'Рубцевание'}, {id:'elec',n:'Электролиты',d:'Дисбаланс K/Na'}, {id:'prot',n:'Протеин',d:'Белок в моче'}, {id:'stone',n:'Камни',d:'Нефролитиаз'}, {id:'tub',n:'Некроз',d:'Отмирание канальцев'}, {id:'gfr',n:'СКФ',d:'Снижение функции'} ],
        neuro: [ {id:'dop',n:'Дофамин',d:'Агрессия/Апатия'}, {id:'glu',n:'Глутамат',d:'Эксайтотоксичность'}, {id:'gaba',n:'ГАМК',d:'Тревожность'}, {id:'ser',n:'Серотонин',d:'Перепады настроения'}, {id:'inf',n:'Воспаление',d:'Микроглия'}, {id:'cog',n:'Когнитив',d:'Память/Фокус'}, {id:'add',n:'Зависимость',d:'Дофаминовая яма'} ],
        hemato: [ {id:'ery',n:'Эритроциты',d:'Высокий гематокрит'}, {id:'visc',n:'Вязкость',d:'Густая кровь'}, {id:'coag',n:'Коагуляция',d:'Свертываемость'}, {id:'anem',n:'Анемия',d:'Дефицит железа'}, {id:'leuk',n:'Лейкоциты',d:'Воспаление'}, {id:'plat',n:'Тромбоциты',d:'Агрегация'}, {id:'hem',n:'Гемолиз',d:'Разрушение эритроцитов'} ],
        endo: [ {id:'ins',n:'Инсулин',d:'Рост сахара'}, {id:'est',n:'Эстроген',d:'Гинекомастия'}, {id:'prl',n:'Пролактин',d:'Либидо↓'}, {id:'thy',n:'Щитовидка',d:'Снижение Т3/Т4'}, {id:'cor',n:'Кортизол',d:'Катаболизм'}, {id:'gh_ax',n:'Ось ГР',d:'Снижение своего ГР'}, {id:'adr',n:'Надпочечники',d:'Истощение'} ],
        repro: [ {id:'atr',n:'Атрофия',d:'Уменьшение тестикул'}, {id:'sup',n:'Подавление',d:'Нет своего Т'}, {id:'sp',n:'Сперма',d:'Качество↓'}, {id:'lib',n:'Либидо',d:'Падение влечения'}, {id:'ed',n:'Эрекция',d:'ЭД'}, {id:'gyn',n:'Гино',d:'Рост груди'}, {id:'inf',n:'Бесплодие',d:'Невозможность зачатия'} ]
    },
    support: [
        { t:'☀️ Натощак', items:[ {n:'Iron Guard', d:'2 капс', m:'Субстрат для гема', r:['hemato_anem'] }, {n:'Цитиколин', d:'500мг', m:'Прекурсор ацетилхолина', r:['neuro_cog'] }, {n:'Наттокиназа', d:'2 капс', m:'Фибринолиз', r:['cardio_thr','hemato_visc'] }, {n:'Таурин', d:'2г', m:'Антагонист AngII', r:['cardio_htn','neuro_glu']} ] },
        { t:'🍳 Завтрак', items:[ {n:'Астрагал', d:'500мг', m:'Нефропротекция', r:['kidney_fib_k'] }, {n:'Небилет', d:'2.5мг', m:'Beta-1 блокатор + NO', r:['cardio_htn','cardio_tach'] }, {n:'Тадалафил', d:'5мг', m:'PDE5 ингибитор', r:['cardio_endo'] }, {n:'Берберин', d:'500мг', m:'AMPK активатор', r:['endo_ins'] }, {n:'D3+K2', d:'5000МЕ+100мкг', m:'Кальций-менеджмент', r:['endo_thy','cardio_lvh'] }, {n:'TMG+Метилфолат', d:'1г+1капс', m:'Метилирование', r:['liver_met','cardio_thr'] }, {n:'Бергамот', d:'500мг', m:'Натуральный статин', r:['cardio_lip'] }, {n:'Бромантан+Фасорацетам', d:'50+100мг', m:'Актопротектор+Ноотроп', r:['neuro_dop','neuro_gaba']} ] },
        { t:'🍲 Обед', items:[ {n:'УДХК', d:'1000мг', m:'Гидрофильная желчь', r:['liver_chol'] }, {n:'Пентоксифиллин', d:'400мг', m:'Реология крови', r:['hemato_visc','cardio_thr'] }, {n:'Joint Health', d:'2 капс', m:'Хондропротекция', r:['oda_trauma'] }, {n:'Витамин Е', d:'400МЕ', m:'Антиоксидант', r:['liver_ox']} ] },
        { t:'💪 Предтреник', items:[ {n:'Агмантин', d:'1000мг', m:'NO бустер', r:['cardio_endo']} ] },
        { t:'🥤 Intra-Workout', items:[ {n:'Цитруллин', d:'6г', m:'NO прекурсор', r:['cardio_endo'] }, {n:'Креатин', d:'5г', m:'АТФ ресинтез', r:['power']} ] },
        { t:'🌙 Вечер', items:[ {n:'Телмисартан', d:'80мг', m:'ARB, нефропротекция', r:['cardio_htn','kidney_hyper'] }, {n:'Магний', d:'400мг', m:'Релаксант', r:['neuro_gaba','cardio_arr'] }, {n:'L-Теанин', d:'400мг', m:'ГАМК агонист', r:['neuro_gaba','stress'] }, {n:'Гормон Роста', d:'5ЕД', m:'Липолиз, регенерация', r:['recovery'], note:'Inj'} ] }
    ],
    shop: {
        'udca': [ {p:'Ozon', pr:'1500₽', l:'#'}, {p:'iHerb', pr:'$25', l:'#'} ],
        'telmisartan': [ {p:'Apteka.ru', pr:'600₽', l:'#'} ],
        'nebivolol': [ {p:'Ozon', pr:'400₽', l:'#'} ],
        'berberine': [ {p:'iHerb', pr:'$20', l:'#'} ],
        'taurine': [ {p:'Ozon', pr:'800₽', l:'#'} ],
        'magnesium': [ {p:'Ozon', pr:'900₽', l:'#'} ],
        'citriculline': [ {p:'Ozon', pr:'1200₽', l:'#'} ],
        'creatine': [ {p:'Ozon', pr:'900₽', l:'#'} ]
    },
    articles: [
        { t:'Основы PK/PD: Эфиры и Периоды', c:'Theory', v:120, txt:'Период полувыведения определяет частоту инъекций. Короткие эфиры (Пропионат) требуют ежедневного или через день введения для стабильного фона.' },
        { t:'Протоколы защиты печени на курсе', c:'Safety', v:340, txt:'УДХК является золотым стандартом защиты печени. Она замещает токсичные желчные кислоты и предотвращает холестаз.' },
        { t:'IGF-1: LR3 vs DES - что выбрать?', c:'Peptides', v:85, txt:'LR3 работает системно до 24 часов, идеален для общего анаболизма. DES работает локально 20 минут, колется строго перед тренировкой в целевую мышцу.' },
        { t:'Контроль Эстрадиола и Пролактина', c:'Hormones', v:210, txt:'Высокий эстрадиол ведет к гинекомастии и отекам. Высокий пролактин (от тренболона/нандролона) убивает либидо и потенцию.' },
        { t:'ПКТ: Тамоксифен или Кломифен?', c:'Recovery', v:150, txt:'Тамоксифен сильнее поднимает ЛГ, но повышает чувствительность рецепторов к эстрогену. Кломифен менее токсичен для сетчатки.' },
        { t:'Анализ крови: полный разбор маркеров', c:'Labs', v:400, txt:'Гематокрит выше 52% требует сдачи крови или увеличения дозировки телмисартана/пентоксифиллина.' }
    ],
    glossary: {
        'Raw Risk': 'Исходный риск без применения поддержки.',
        'Net Risk': 'Остаточный риск после применения протокола защиты.',
        'Half-life': 'Период полувыведения вещества из организма.',
        'Hematocrit': 'Показатель густоты крови (доля эритроцитов). Критично >52%.',
        'IGF-1 LR3': 'Длинная версия IGF-1 с периодом действия до 24 часов.',
        'IGF-1 DES': 'Короткая версия IGF-1 (20 мин), колется локально.',
        'PEG-MGF': 'Пролонгированная версия MGF для восстановления мышц.',
        'Insulin Glargine': 'Продленный инсулин без пиковых значений.',
        'AR Affinity': 'Сродство к андрогенным рецепторам. Чем выше, тем мощнее эффект.',
        'Aromatization': 'Конвертация тестостерона в эстроген.'
    },
    workouts: [
        { name: 'Heavy Push', muscles: 'Chest, Shoulders, Triceps', vol: 'High', rec: 'For mass gain' },
        { name: 'Hypertrophy Pull', muscles: 'Back, Biceps, Rear Delts', vol: 'Medium', rec: 'Balanced growth' },
        { name: 'Leg Day (Quad Focus)', muscles: 'Quads, Calves', vol: 'Very High', rec: 'Leg development' },
        { name: 'Leg Day (Hamstring Focus)', muscles: 'Hamstrings, Glutes', vol: 'High', rec: 'Posterior chain' }
    ]
};
