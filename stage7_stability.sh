#!/bin/bash
echo "🚀 STAGE 7: Core Stability, Ether Fixes, Risk Engine Reload, Data Expansion"

# 1. FULL DATABASE REWRITE (Expanded Toxicity & Safety)
echo "💾 Rebuilding Database with Expanded Toxicity Profiles..."
cat > assets/js/core/database.js << 'DBEOF'
const DB = {
    substances: [
        { id: 'test', name: 'Тестостерон', class: 'AAS', baseTox: { liver: 1, lipid: 3, hct: 4, neuro: 0, kidney: 1, endo: 2, repro: 5 } },
        { id: 'nandrolone', name: 'Нандролон', class: 'AAS', baseTox: { liver: 1, lipid: 4, hct: 2, neuro: 0, kidney: 3, endo: 5, repro: 4 } },
        { id: 'trenbolone', name: 'Тренболон', class: 'AAS', baseTox: { liver: 2, lipid: 5, hct: 3, neuro: 5, kidney: 4, endo: 4, repro: 5 } },
        { id: 'boldenone', name: 'Болденон', class: 'AAS', baseTox: { liver: 1, lipid: 3, hct: 6, neuro: 0, kidney: 1, endo: 1, repro: 3 } },
        { id: 'dhb', name: 'Дигидроболденон (DHB)', class: 'AAS', baseTox: { liver: 1, lipid: 4, hct: 5, neuro: 0, kidney: 3, endo: 1, repro: 3 } },
        { id: 'masteron', name: 'Мастерон', class: 'AAS', baseTox: { liver: 1, lipid: 4, hct: 3, neuro: 0, kidney: 1, endo: 1, repro: 4 } },
        { id: 'primobolan', name: 'Примоболан', class: 'AAS', baseTox: { liver: 1, lipid: 3, hct: 2, neuro: 0, kidney: 1, endo: 1, repro: 2 } },
        { id: 'oxandrolone', name: 'Оксандролон', class: 'Oral', baseTox: { liver: 5, lipid: 5, hct: 1, neuro: 0, kidney: 1, endo: 1, repro: 2 } },
        { id: 'stanozolol', name: 'Станозолол', class: 'Oral/Inj', baseTox: { liver: 5, lipid: 5, hct: 2, neuro: 0, kidney: 3, endo: 1, repro: 3 } },
        { id: 'methandienone', name: 'Метандиенон', class: 'Oral', baseTox: { liver: 5, lipid: 4, hct: 3, neuro: 0, kidney: 1, endo: 3, repro: 3 } },
        { id: 'gh', name: 'Гормон Роста', class: 'Peptide', baseTox: { liver: 0, lipid: 2, hct: 0, neuro: 0, kidney: 1, endo: 5, repro: 0 } },
        { id: 'insulin', name: 'Инсулин', class: 'Hormone', baseTox: { liver: 0, lipid: 1, hct: 0, neuro: 0, kidney: 0, endo: 5, repro: 0 } },
        { id: 'igf1', name: 'IGF-1', class: 'Peptide', baseTox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kidney: 2, endo: 4, repro: 0 } },
        { id: 'mgf', name: 'MGF / PEG-MGF', class: 'Peptide', baseTox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kidney: 1, endo: 2, repro: 0 } }
    ],

    esters: {
        'test': [
            { id: 'test_p', name: 'Пропионат', halfLife: 2.0 },
            { id: 'test_e', name: 'Энантат', halfLife: 7.0 },
            { id: 'test_c', name: 'Ципионат', halfLife: 8.0 },
            { id: 'test_sus', name: 'Сустанон', halfLife: 15.0 }
        ],
        'nandrolone': [
            { id: 'nandrolone_p', name: 'Фенилпропионат', halfLife: 4.5 },
            { id: 'nandrolone_d', name: 'Деканоат', halfLife: 14.0 }
        ],
        'trenbolone': [
            { id: 'trenbolone_a', name: 'Ацетат', halfLife: 3.0 },
            { id: 'trenbolone_e', name: 'Энантат', halfLife: 7.0 },
            { id: 'trenbolone_h', name: 'Гекса', halfLife: 10.0 }
        ],
        'boldenone': [{ id: 'boldenone_u', name: 'Ундесиленат', halfLife: 14.0 }],
        'dhb': [{ id: 'dhb_p', name: 'Ацетат', halfLife: 10.0 }],
        'masteron': [
            { id: 'masteron_p', name: 'Пропионат', halfLife: 2.5 },
            { id: 'masteron_e', name: 'Энантат', halfLife: 7.0 }
        ],
        'primobolan': [{ id: 'primobolan_e', name: 'Энантат', halfLife: 10.0 }],
        'stanozolol': [{ id: 'stanozolol_susp', name: 'Суспензия', halfLife: 24.0 }],
        'gh': [
            { id: 'gh_short', name: 'Ежедневно', halfLife: 0.1 },
            { id: 'gh_long', name: 'Пролонг (Weekly)', halfLife: 168.0 }
        ],
        'insulin': [
            { id: 'insulin_r', name: 'Короткий (R)', halfLife: 0.1 },
            { id: 'insulin_l', name: 'Продленный (Glargine)', halfLife: 24.0 }
        ],
        'igf1': [
            { id: 'igf1_lr3', name: 'LR3 (Длинный)', halfLife: 24.0 },
            { id: 'igf1_des', name: 'DES (Короткий)', halfLife: 0.5 }
        ],
        'mgf': [
            { id: 'mgf_plain', name: 'MGF', halfLife: 0.5 },
            { id: 'peg_mgf', name: 'PEG-MGF', halfLife: 48.0 }
        ]
    },

    riskMatrix: {
        liver: { mechanisms: [
            { id: 'cholestasis', name: 'Холестаз', desc: 'Застой желчи' },
            { id: 'oxidative', name: 'Окс. стресс', desc: 'Свободные радикалы' },
            { id: 'cytolysis', name: 'Цитолиз', desc: 'Разрушение клеток (ALT/AST)' },
            { id: 'fibrosis', name: 'Фиброз', desc: 'Рубцевание ткани' },
            { id: 'mito', name: 'Митохондрии', desc: 'Энергодефицит' },
            { id: 'methylation', name: 'Метилирование', desc: 'Дефицит метил-групп' },
            { id: 'apoptosis', name: 'Апоптоз', desc: 'Гибель клеток' }
        ]},
        cardio: { mechanisms: [
            { id: 'htn', name: 'Гипертония', desc: 'Высокое АД' },
            { id: 'tachycardia', name: 'Тахикардия', desc: 'Высокий пульс' },
            { id: 'lipids', name: 'Дислипидемия', desc: 'ЛПНП↑ / ЛПВП↓' },
            { id: 'thrombo', name: 'Тромбоз', desc: 'Сгущение крови' },
            { id: 'lvh', name: 'Гипертрофия', desc: 'Утолщение стенок' },
            { id: 'endo', name: 'Эндотелий', desc: 'Дисфункция сосудов' },
            { id: 'arrhythmia', name: 'Аритмия', desc: 'Сбой ритма' }
        ]},
        kidney: { mechanisms: [
            { id: 'hyperfiltration', name: 'Гиперфильтрация', desc: 'Перегрузка клубочков' },
            { id: 'fibrosis_k', name: 'Фиброз почек', desc: 'Рубцевание' },
            { id: 'electrolytes', name: 'Электролиты', desc: 'Дисбаланс K/Na' },
            { id: 'proteinuria', name: 'Протеинурия', desc: 'Белок в моче' },
            { id: 'stones', name: 'Камни', desc: 'Нефролитиаз' },
            { id: 'tubular', name: 'Тубулярный некроз', desc: 'Отмирание канальцев' },
            { id: 'gfr_drop', name: 'Падение СКФ', desc: 'Снижение функции' }
        ]},
        neuro: { mechanisms: [
            { id: 'dopamine', name: 'Дофамин', desc: 'Дисбаланс (агрессия/апатия)' },
            { id: 'glutamate', name: 'Глутамат', desc: 'Эксайтотоксичность' },
            { id: 'gaba', name: 'ГАМК', desc: 'Тревожность/Бессонница' },
            { id: 'serotonin', name: 'Серотонин', desc: 'Перепады настроения' },
            { id: 'inflammation', name: 'Нейровоспаление', desc: 'Микроглия' },
            { id: 'cognitive', name: 'Когнитивный спад', desc: 'Память/Фокус' },
            { id: 'addiction', name: 'Зависимость', desc: 'Дофаминовая яма' }
        ]},
        hemato: { mechanisms: [
            { id: 'erythrocytosis', name: 'Эритроцитоз', desc: 'Высокий гематокрит' },
            { id: 'viscosity', name: 'Вязкость', desc: 'Густая кровь' },
            { id: 'coagulation', name: 'Коагуляция', desc: 'Свертываемость' },
            { id: 'anemia', name: 'Анемия', desc: 'Дефицит железа/B12' },
            { id: 'leukocytosis', name: 'Лейкоцитоз', desc: 'Воспаление' },
            { id: 'platelets', name: 'Тромбоциты', desc: 'Агрегация' },
            { id: 'hemolysis', name: 'Гемолиз', desc: 'Разрушение эритроцитов' }
        ]},
        endo: { mechanisms: [
            { id: 'insulin_res', name: 'Инсулинорезистентность', desc: 'Рост сахара' },
            { id: 'estrogen', name: 'Эстроген', desc: 'Гинекомастия/Отеки' },
            { id: 'prolactin', name: 'Пролактин', desc: 'Либидо↓/Потенция' },
            { id: 'thyroid', name: 'Щитовидка', desc: 'Снижение Т3/Т4' },
            { id: 'cortisol', name: 'Кортизол', desc: 'Катаболизм/Стресс' },
            { id: 'gh_axis', name: 'Ось ГР', desc: 'Снижение собственного' },
            { id: 'adrenal', name: 'Надпочечники', desc: 'Истощение' }
        ]},
        repro: { mechanisms: [
            { id: 'atrophy', name: 'Атрофия', desc: 'Уменьшение тестикул' },
            { id: 'suppression', name: 'Подавление оси', desc: 'Нет своего Тестостерона' },
            { id: 'sperm', name: 'Спермогенез', desc: 'Качество спермы↓' },
            { id: 'libido', name: 'Либидо', desc: 'Падение влечения' },
            { id: 'erectile', name: 'Эрекция', desc: 'ЭД' },
            { id: 'gyno', name: 'Гинекомастия', desc: 'Рост груди' },
            { id: 'infertility', name: 'Бесплодие', desc: 'Невозможность зачатия' }
        ]}
    },

    supportProtocol: [
        { timeId: 'morning_empty', title: '☀️ Натощак', items: [
            { name: 'Iron Guard', dose: '2 капс', mechanism: 'Гемоглобин', risks: ['hemato_anemia'] },
            { name: 'Цитиколин', dose: '500 мг', mechanism: 'Нейропротекция', risks: ['neuro_cognitive'] },
            { name: 'Наттокиназа', dose: '2 капс', mechanism: 'Реология', risks: ['hemato_viscosity'] },
            { name: 'Таурин', dose: '2000 мг', mechanism: 'Анти-спазм', risks: ['cardio_htn', 'neuro_glutamate'] }
        ]},
        { timeId: 'morning_food', title: '🍳 Завтрак', items: [
            { name: 'Астрагал', dose: '500 мг', mechanism: 'Почки', risks: ['kidney_fibrosis_k'] },
            { name: 'Небилет', dose: '2.5 мг', mechanism: 'Давление', risks: ['cardio_htn', 'cardio_tachycardia'] },
            { name: 'Тадалафил', dose: '5 мг', mechanism: 'Поток крови', risks: ['cardio_endo'] },
            { name: 'Берберин', dose: '500 мг', mechanism: 'Инсулин', risks: ['endo_insulin_res'] },
            { name: 'D3 + K2', dose: '5000 МЕ', mechanism: 'Кости', risks: [] },
            { name: 'TMG + Метилфолат', dose: '1г + 1капс', mechanism: 'Метилирование', risks: ['liver_methylation', 'cardio_thrombo'] },
            { name: 'Бергамот', dose: '500 мг', mechanism: 'Липиды', risks: ['cardio_lipids'] },
            { name: 'Бромантан + Фасорацетам', dose: '50+100 мг', mechanism: 'Дофамин/ГАМК', risks: ['neuro_dopamine', 'neuro_gaba'] }
        ]},
        { timeId: 'lunch', title: '🍲 Обед', items: [
            { name: 'УДХК', dose: '1000 мг', mechanism: 'Желчь', risks: ['liver_cholestasis'] },
            { name: 'Пентоксифиллин', dose: '400 мг', mechanism: 'Вязкость', risks: ['hemato_viscosity'] },
            { name: 'Joint Health', dose: '2 капс', mechanism: 'Суставы', risks: [] },
            { name: 'Витамин Е', dose: '400 МЕ', mechanism: 'Антиоксидант', risks: ['liver_oxidative'] }
        ]},
        { timeId: 'pre_workout', title: '💪 Предтреник', items: [
            { name: 'Агмантин', dose: '1000 мг', mechanism: 'NO', risks: ['cardio_endo'] }
        ]},
        { timeId: 'evening', title: '🌙 Вечер', items: [
            { name: 'Телмисартан', dose: '80 мг', mechanism: 'Давление/Почки', risks: ['cardio_htn', 'kidney_hyperfiltration'] },
            { name: 'Магний', dose: '400 мг', mechanism: 'Расслабление', risks: ['neuro_gaba', 'cardio_arrhythmia'] },
            { name: 'L-Теанин', dose: '400 мг', mechanism: 'Сон', risks: ['neuro_gaba'] },
            { name: 'Гормон Роста', dose: '5 ЕД', mechanism: 'Рост', risks: ['endo_gh_axis'], note: 'Инъекция' }
        ]}
    ],
    
    glossary: {
        'Raw Risk': 'Исходный риск без поддержки.',
        'Net Risk': 'Риск после применения протокола.',
        'Half-life': 'Период полувыведения вещества.',
        'Hematocrit': 'Густота крови (доля эритроцитов). Критично >52%.',
        'IGF-1 LR3': 'Длинная версия IGF-1 (24ч), работает системно.',
        'IGF-1 DES': 'Короткая версия (20 мин), колется локально перед тренировкой.',
        'PEG-MGF': 'Пролонгированный MGF для восстановления мышц.',
        'Insulin Glargine': 'Продленный инсулин (фон), без пиков.'
    },
    
    shopItems: {
        'udca': [{ platform: 'Ozon', price: '1500 ₽', url: '#' }, { platform: 'iHerb', price: '$25', url: '#' }],
        'telmisartan': [{ platform: 'Apteka.ru', price: '600 ₽', url: '#' }],
        'nebivolol': [{ platform: 'Ozon', price: '400 ₽', url: '#' }],
        'berberine': [{ platform: 'iHerb', price: '$20', url: '#' }],
        'taurine': [{ platform: 'Ozon', price: '800 ₽', url: '#' }],
        'magnesium': [{ platform: 'Ozon', price: '900 ₽', url: '#' }]
    }
};
DBEOF

# 2. ENGINE REWRITE (Robust Calculation)
echo "⚙️ Rewriting Engine for Robust Risk Calculation..."
cat > assets/js/core/engine.js << 'ENGINEEOF'
const Engine = {
    // Расчет концентрации с учетом фаз: Рост -> Плато -> Спад
    calculateConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        
        const weeksOnDrug = currentWeek - startWeek;
        const timeToSteady = (halfLife / 7) * 4; // 4 периода полувыведения для выхода на плато
        
        // Фаза приема
        if (currentWeek <= endWeek) {
            if (weeksOnDrug < timeToSteady) {
                // Фаза накопления (линейная аппроксимация для простоты)
                return weeksOnDrug / timeToSteady;
            } else {
                // Плато
                return 1.0;
            }
        } 
        // Фаза выведения (после курса)
        else {
            const weeksOff = currentWeek - endWeek;
            // Экспоненциальный спад
            return Math.max(0, Math.exp(-0.693 * weeksOff / (halfLife / 7)));
        }
    },

    generateWeeklyPlan(stack, totalWeeksForecast) {
        if (!stack || stack.length === 0) return [];
        
        let maxEnd = 0;
        let maxHalfLife = 1;
        
        stack.forEach(s => { 
            if (s.endWeek > maxEnd) maxEnd = s.endWeek; 
            const ester = DB.esters[s.substanceId]?.find(e => e.id === s.esterId);
            const hl = ester ? ester.halfLife : 1;
            if (hl > maxHalfLife) maxHalfLife = hl;
        });
        
        // Прогноз: конец последнего курса + 5 периодов полувыведения самого долгого эфира
        const forecastEnd = Math.ceil(maxEnd + (maxHalfLife / 7) * 5);
        const finalDuration = Math.max(totalWeeksForecast || 12, forecastEnd);

        const weeks = [];
        for (let w = 1; w <= finalDuration; w++) {
            let risks = {};
            // Инициализация нулями
            for (let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].mechanisms.forEach(m => risks[sys][m.id] = 0);
            }

            let activeCount = 0;
            stack.forEach(item => {
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const halfLife = ester ? ester.halfLife : 1;
                
                const conc = this.calculateConcentration(halfLife, item.startWeek, item.endWeek, w);
                
                if (conc > 0.01) {
                    activeCount++;
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    if (!sub) return;

                    const tox = sub.baseTox;
                    const load = conc * (item.dose / 100); // Нормализация к 100мг

                    // Маппинг общей токсичности на конкретные механизмы
                    // Печень
                    risks.liver.cholestasis += (tox.liver * 3) * load;
                    risks.liver.cytolysis += (tox.liver * 2.5) * load;
                    risks.liver.mito += (tox.liver * 2) * load;
                    
                    // Кардио
                    risks.cardio.lipids += (tox.lipid * 3) * load;
                    risks.cardio.htn += (tox.lipid * 1.5) * load;
                    risks.cardio.thrombo += (tox.lipid * 1) * load;
                    
                    // Кровь
                    risks.hemato.erythrocytosis += (tox.hct * 4) * load;
                    risks.hemato.viscosity += (tox.hct * 3) * load;
                    
                    // Нейро
                    risks.neuro.dopamine += (tox.neuro * 5) * load;
                    risks.neuro.gaba += (tox.neuro * 2) * load;
                    
                    // Почки
                    risks.kidney.hyperfiltration += (tox.kidney * 3) * load;
                    
                    // Эндо
                    risks.endo.insulin_res += (tox.endo * 3) * load;
                    risks.endo.estrogen += (tox.endo * 2) * load; 
                    risks.endo.prolactin += (tox.endo * 1.5) * load;
                    
                    // Репро
                    risks.repro.suppression += (tox.repro * 5) * load;
                    risks.repro.atrophy += (tox.repro * 4) * load;
                }
            });

            // Нормализация до 100%
            for (let sys in risks) {
                for (let m in risks[sys]) {
                    risks[sys][m] = Math.min(100, Math.round(risks[sys][m]));
                }
            }

            weeks.push({ week: w, risks, activeCount });
        }
        return weeks;
    },

    getRiskColor(value) {
        if (value < 20) return '#2e7d32'; // Dark Green
        if (value < 40) return '#66bb6a'; // Light Green
        if (value < 60) return '#fdd835'; // Yellow
        if (value < 80) return '#fb8c00'; // Orange
        return '#c62828'; // Dark Red
    }
};
ENGINEEOF

# 3. APP LOGIC (Fixed Event Listeners & Rendering)
echo "🔧 Fixing App Logic & Event Listeners..."
cat > assets/js/app.js << 'APPEOF'
document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized");
    if (window.Telegram && window.Telegram.WebApp) { 
        window.Telegram.WebApp.ready(); 
        window.Telegram.WebApp.expand(); 
    }

    const state = { 
        stack: [], 
        plan: [], 
        currentWeekIdx: 0, 
        chartVisibility: { liver:true, cardio:true, hemato:true, neuro:false, kidney:false, endo:false, repro:false },
        xp: 0
    };

    // --- TABS ---
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // --- SUBSTANCE SELECT INIT ---
    const subSelect = document.getElementById('drug-substance');
    if (subSelect) {
        DB.substances.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            subSelect.appendChild(opt);
        });
    }

    // --- GLOBAL APP OBJECT ---
    window.App = {
        loadEsters: function() {
            console.log("Loading esters...");
            const subId = document.getElementById('drug-substance').value;
            const estSelect = document.getElementById('drug-ester');
            if (!estSelect) return;
            
            estSelect.innerHTML = '';
            const esters = DB.esters[subId];
            
            if (esters && esters.length > 0) {
                estSelect.disabled = false;
                esters.forEach(e => {
                    const opt = document.createElement('option');
                    opt.value = e.id;
                    opt.textContent = `${e.name} (T1/2: ${e.halfLife} дн.)`;
                    estSelect.appendChild(opt);
                });
            } else {
                estSelect.disabled = true;
                const opt = document.createElement('option');
                opt.textContent = "Нет эфиров (Орал/Пептид)";
                estSelect.appendChild(opt);
            }
        },

        addDrug: function(e) {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const doseVal = document.getElementById('drug-dose').value;
            const startVal = document.getElementById('drug-start').value;
            const endVal = document.getElementById('drug-end').value;

            if (!subId || !doseVal) return alert('Заполните название и дозу!');
            
            const dose = parseFloat(doseVal);
            const start = parseInt(startVal);
            const end = parseInt(endVal);
            
            if (start >= end) return alert('Неделя финиша должна быть больше старта!');
            
            state.stack.push({ 
                substanceId: subId, 
                esterId: (esterId && esterId !== 'undefined') ? esterId : null, 
                dose, 
                startWeek: start, 
                endWeek: end 
            });
            
            App.renderStack();
            e.target.reset();
            // Reset defaults
            document.getElementById('drug-start').value = 1;
            document.getElementById('drug-end').value = 8;
            App.loadEsters(); // Reset ester select state
        },

        renderStack: function() {
            const list = document.getElementById('stack-list');
            if (!list) return;
            list.innerHTML = '';
            if (state.stack.length === 0) {
                list.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Стек пуст</div>';
                return;
            }
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = item.esterId ? DB.esters[item.substanceId]?.find(e => e.id === item.esterId) : null;
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div>
                        <strong>${sub ? sub.name : 'Unknown'}</strong> 
                        ${ester ? '('+ester.name+')' : ''}
                        <br><small>${item.dose}мг | Недели ${item.startWeek}-${item.endWeek}</small>
                    </div>
                    <button class="btn-delete" onclick="window.App.removeDrug(${idx})">✕</button>
                `;
                list.appendChild(div);
            });
        },

        removeDrug: function(idx) {
            state.stack.splice(idx, 1);
            App.renderStack();
        },

        generatePlan: function() {
            if (state.stack.length === 0) return alert('Сначала добавьте препараты!');
            state.plan = Engine.generateWeeklyPlan(state.stack, 20);
            state.currentWeekIdx = 0;
            App.renderHeatmap();
            App.renderTrendChart();
            
            const out = document.getElementById('weekly-plan-output');
            if (out) out.innerHTML = `<p style="color:#03dac6; text-align:center; font-weight:bold;">Курс рассчитан на ${state.plan.length} недель (включая выведение).</p>`;
            
            state.xp += 150;
            document.getElementById('xp-display').textContent = `XP: ${state.xp}`;
        },

        changeWeek: function(dir) {
            if (!state.plan.length) return;
            state.currentWeekIdx += dir;
            if (state.currentWeekIdx < 0) state.currentWeekIdx = 0;
            if (state.currentWeekIdx >= state.plan.length) state.currentWeekIdx = state.plan.length - 1;
            App.renderHeatmap();
        },

        toggleChart: function(sys) {
            state.chartVisibility[sys] = !state.chartVisibility[sys];
            App.renderTrendChart();
        },

        renderHeatmap: function() {
            if (!state.plan.length) return;
            const weekData = state.plan[state.currentWeekIdx];
            const display = document.getElementById('current-week-display');
            if (display) display.textContent = `Неделя ${weekData.week}`;
            
            const container = document.getElementById('heatmap-container');
            if (!container) return;
            container.innerHTML = '';
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(110px, 1fr))';
            container.style.gap = '8px';

            for (let sys in DB.riskMatrix) {
                const sysDiv = document.createElement('div');
                sysDiv.style.gridColumn = '1 / -1';
                sysDiv.style.marginTop = '15px';
                sysDiv.style.color = '#bb86fc';
                sysDiv.style.fontWeight = 'bold';
                sysDiv.style.textTransform = 'uppercase';
                sysDiv.style.fontSize = '0.9em';
                sysDiv.textContent = sys;
                container.appendChild(sysDiv);

                DB.riskMatrix[sys].mechanisms.forEach(mech => {
                    const val = weekData.risks[sys][mech.id] || 0;
                    const cell = document.createElement('div');
                    cell.className = 'heatmap-cell';
                    cell.style.backgroundColor = Engine.getRiskColor(val);
                    cell.style.padding = '12px';
                    cell.style.borderRadius = '6px';
                    cell.style.color = val > 50 ? '#000' : '#fff';
                    cell.style.textAlign = 'center';
                    cell.style.fontSize = '0.85em';
                    cell.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                    cell.innerHTML = `<div style="font-weight:600; margin-bottom:4px;">${mech.name}</div><div style="font-size:1.1em; font-weight:bold;">${val}%</div>`;
                    cell.title = `${mech.name}: ${mech.desc}`;
                    container.appendChild(cell);
                });
            }
        },

        renderTrendChart: function() {
            const ctx = document.getElementById('risk-trend-chart');
            if (!ctx || !state.plan.length) return;
            if (window.trendChartInstance) window.trendChartInstance.destroy();

            const labels = state.plan.map(p => `W${p.week}`);
            const datasets = [];
            const colors = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', neuro: '#9966ff', kidney: '#4bc0c0', endo: '#c9cbcf', repro: '#e7e9ed' };

            for (let sys in state.chartVisibility) {
                if (state.chartVisibility[sys]) {
                    const data = state.plan.map(p => {
                        let sum = 0, cnt = 0;
                        for(let m in p.risks[sys]) { sum += p.risks[sys][m]; cnt++; }
                        return cnt ? Math.round(sum/cnt) : 0;
                    });
                    datasets.push({
                        label: sys.toUpperCase(),
                        data: data,
                        borderColor: colors[sys],
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 2
                    });
                }
            }

            window.trendChartInstance = new Chart(ctx, {
                type: 'line',
                data: { labels, datasets },
                options: {
                    responsive: true,
                    interaction: { mode: 'index', intersect: false },
                    plugins: { legend: { labels: { color: '#fff' } } },
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } },
                        x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
                    }
                }
            });
        },

        calcFertility: function() {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            
            // Mock calculation if engine func missing
            let score = 0;
            if(vol) score += (vol/1.5)*20;
            if(conc) score += (conc/16)*30;
            if(pr) score += (pr/30)*30;
            if(morph) score += (morph/4)*20;
            
            const res = document.getElementById('fertility-result');
            if(res) res.innerHTML = `<h3 style="color:${score>60?'#03dac6':'#ff6384'}">IF: ${Math.round(score)}/100</h3>`;
        },

        exportJSON: function() {
            const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr);
            node.setAttribute("download", "bode_health_course.json");
            document.body.appendChild(node);
            node.click();
            node.remove();
        },

        renderShop: function() {
            const list = document.getElementById('shop-list');
            if(!list) return;
            list.innerHTML = '';
            if(DB.shopItems) {
                for (const [key, items] of Object.entries(DB.shopItems)) {
                    items.forEach(item => {
                        list.innerHTML += `<div class="drug-card"><div><strong>${key.toUpperCase()}</strong><br><small>${item.platform}</small></div><div><span style="color:#03dac6">${item.price}</span> <a href="${item.url}" class="btn-primary" style="padding:5px 10px; font-size:0.8em; margin-left:10px; text-decoration:none;">Buy</a></div></div>`;
                    });
                }
            }
        },

        renderGlossary: function() {
            const list = document.getElementById('glossary-list');
            if(!list) return;
            list.innerHTML = '';
            for (const [term, def] of Object.entries(DB.glossary || {})) {
                list.innerHTML += `<div class="drug-card" style="display:block;"><strong style="color:#bb86fc">${term}</strong><p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${def}</p></div>`;
            }
        }
    };

    // Bind Form
    const form = document.getElementById('add-drug-form');
    if(form) form.addEventListener('submit', window.App.addDrug);

    // Init Views
    window.App.renderStack();
    window.App.renderShop();
    window.App.renderGlossary();
});
APPEOF

# 4. CSS UPDATES
cat > assets/css/style.css << 'CSSEOF'
:root { --bg-dark: #121212; --bg-card: #1e1e1e; --primary: #bb86fc; --secondary: #03dac6; --error: #cf6679; --text-main: #fff; --text-sec: #b0b0b0; --border: #333; }
body { margin: 0; font-family: 'Segoe UI', sans-serif; background: var(--bg-dark); color: var(--text-main); padding-bottom: 60px; }
.app-container { max-width: 900px; margin: 0 auto; }
header { background: var(--bg-card); padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.version { font-size: 0.6em; color: var(--secondary); }
.subtitle { margin: 5px 0 0; font-size: 0.9em; color: var(--text-sec); }
.status-bar { font-size: 0.9em; color: var(--primary); font-weight: bold; }

.tabs { display: flex; overflow-x: auto; background: var(--bg-card); position: sticky; top: 0; z-index: 100; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab-btn { flex: 1; min-width: 100px; padding: 15px 10px; background: none; border: none; color: var(--text-sec); font-weight: 600; cursor: pointer; border-bottom: 3px solid transparent; white-space: nowrap; }
.tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }

.tab-content { display: none; padding: 20px; animation: fadeIn 0.3s; }
.tab-content.active { display: block; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; margin-bottom: 20px; }
.card { background: var(--bg-card); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid var(--border); }
.big-value { font-size: 2.2em; font-weight: bold; margin-top: 10px; color: var(--secondary); }

.deep-form { background: var(--bg-card); padding: 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 12px; }
.row { display: flex; gap: 10px; }
input, select { background: #2c2c2c; border: 1px solid var(--border); color: white; padding: 12px; border-radius: 8px; flex: 1; }
button { padding: 12px 20px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; background: var(--primary); color: #000; }
.btn-delete { background: rgba(207, 102, 121, 0.2); color: var(--error); padding: 8px 12px; font-size: 0.9em; }
.btn-success { background: #03dac6; color: #000; width: 100%; margin-top: 20px; font-size: 1.1em; }
.btn-secondary { background: #333; color: white; margin-right: 10px; margin-top: 10px; }

.list-container, .schedule-container { display: flex; flex-direction: column; gap: 12px; }
.drug-card, .support-item { background: var(--bg-card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--secondary); display: flex; justify-content: space-between; align-items: center; }
.support-item { flex-direction: column; align-items: flex-start; border-left-color: var(--primary); }
.time-block { background: #252525; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.time-block h3 { color: var(--primary); margin: 0 0 10px; font-size: 0.9em; text-transform: uppercase; }

/* Heatmap */
.heatmap-grid { display: grid; gap: 8px; margin-top: 15px; }
.heatmap-cell { transition: transform 0.2s, filter 0.2s; cursor: help; }
.heatmap-cell:hover { transform: scale(1.05); z-index: 10; filter: brightness(1.2); }

/* Chart Controls */
.chart-controls { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; background: var(--bg-card); padding: 10px; border-radius: 8px; }
.chart-controls label { display: flex; align-items: center; gap: 5px; font-size: 0.9em; cursor: pointer; }
.week-selector { display: flex; justify-content: center; align-items: center; gap: 20px; margin: 20px 0; }
.week-selector button { padding: 5px 15px; font-size: 1.2em; }
#current-week-display { font-size: 1.2em; font-weight: bold; color: var(--secondary); min-width: 120px; text-align: center; }

canvas { max-width: 100%; margin: 20px 0; background: var(--bg-card); border-radius: 12px; padding: 10px; }
CSSEOF

# 5. GIT PUSH
echo "🚀 Committing Stage 7..."
git add -A
git commit -m "Stage 7: Core Stability, Ether Fixes, Risk Engine Reload, Data Expansion"
git push origin main --force

echo "✅ Stage 7 Complete!"
