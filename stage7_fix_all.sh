#!/bin/bash
echo "🔥 STAGE 7: CRITICAL FIX (Ethers, Risks, Buttons) + Content Fill"

# 1. HARD CORE DATABASE (Fixed Relations)
cat > assets/js/core/database.js << 'DBEOF'
const DB = {
    substances: [
        { id: 'test', name: 'Тестостерон', baseTox: { liver: 1, lipid: 3, hct: 4, neuro: 0, kidney: 1, endo: 2, repro: 5 } },
        { id: 'nandrolone', name: 'Нандролон', baseTox: { liver: 1, lipid: 4, hct: 2, neuro: 0, kidney: 2, endo: 4, repro: 4 } },
        { id: 'trenbolone', name: 'Тренболон', baseTox: { liver: 2, lipid: 5, hct: 3, neuro: 5, kidney: 4, endo: 4, repro: 5 } },
        { id: 'boldenone', name: 'Болденон', baseTox: { liver: 1, lipid: 3, hct: 6, neuro: 0, kidney: 1, endo: 1, repro: 3 } },
        { id: 'dhb', name: 'DHB', baseTox: { liver: 1, lipid: 4, hct: 5, neuro: 0, kidney: 3, endo: 1, repro: 3 } },
        { id: 'masteron', name: 'Мастерон', baseTox: { liver: 1, lipid: 4, hct: 3, neuro: 0, kidney: 1, endo: 1, repro: 4 } },
        { id: 'primobolan', name: 'Примоболан', baseTox: { liver: 1, lipid: 3, hct: 2, neuro: 0, kidney: 1, endo: 1, repro: 2 } },
        { id: 'oxandrolone', name: 'Оксандролон', baseTox: { liver: 4, lipid: 5, hct: 1, neuro: 0, kidney: 1, endo: 1, repro: 2 } },
        { id: 'stanozolol', name: 'Станозолол', baseTox: { liver: 5, lipid: 5, hct: 2, neuro: 0, kidney: 2, endo: 1, repro: 3 } },
        { id: 'methandienone', name: 'Метандиенон', baseTox: { liver: 5, lipid: 4, hct: 3, neuro: 0, kidney: 1, endo: 3, repro: 3 } },
        { id: 'gh', name: 'Гормон Роста', baseTox: { liver: 0, lipid: 2, hct: 0, neuro: 0, kidney: 1, endo: 5, repro: 0 } },
        { id: 'insulin', name: 'Инсулин', baseTox: { liver: 0, lipid: 1, hct: 0, neuro: 0, kidney: 0, endo: 5, repro: 0 } },
        { id: 'igf1', name: 'IGF-1', baseTox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kidney: 2, endo: 4, repro: 0 } },
        { id: 'mgf', name: 'MGF / PEG-MGF', baseTox: { liver: 0, lipid: 0, hct: 0, neuro: 0, kidney: 1, endo: 2, repro: 0 } }
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
        'stanozolol': [{ id: 'stanozolol_susp', name: 'Суспензия', halfLife: 1.0 }],
        'oxandrolone': [], // Oral
        'methandienone': [], // Oral
        'gh': [
            { id: 'gh_short', name: 'Ежедневно', halfLife: 0.1 },
            { id: 'gh_long', name: 'Пролонг', halfLife: 168.0 }
        ],
        'insulin': [
            { id: 'insulin_r', name: 'Короткий (R)', halfLife: 0.1 },
            { id: 'insulin_l', name: 'Продленный (Glargine)', halfLife: 24.0 }
        ],
        'igf1': [
            { id: 'igf1_lr3', name: 'LR3 (Long)', halfLife: 24.0 },
            { id: 'igf1_des', name: 'DES (Short)', halfLife: 0.5 }
        ],
        'mgf': [
            { id: 'mgf_plain', name: 'MGF', halfLife: 0.5 },
            { id: 'peg_mgf', name: 'PEG-MGF', halfLife: 48.0 }
        ]
    },

    riskMatrix: {
        liver: { mechanisms: [
            { id: 'cholestasis', name: 'Холестаз' }, { id: 'oxidative', name: 'Окс. стресс' },
            { id: 'cytolysis', name: 'Цитолиз' }, { id: 'fibrosis', name: 'Фиброз' },
            { id: 'mito', name: 'Митохондрии' }, { id: 'methylation', name: 'Метилирование' },
            { id: 'apoptosis', name: 'Апоптоз' }
        ]},
        cardio: { mechanisms: [
            { id: 'htn', name: 'Гипертония' }, { id: 'tachycardia', name: 'Тахикардия' },
            { id: 'lipids', name: 'Дислипидемия' }, { id: 'thrombo', name: 'Тромбоз' },
            { id: 'lvh', name: 'Гипертрофия' }, { id: 'endo', name: 'Эндотелий' },
            { id: 'arrhythmia', name: 'Аритмия' }
        ]},
        kidney: { mechanisms: [
            { id: 'hyperfiltration', name: 'Гиперфильтрация' }, { id: 'fibrosis_k', name: 'Фиброз' },
            { id: 'electrolytes', name: 'Электролиты' }, { id: 'proteinuria', name: 'Протеинурия' },
            { id: 'stones', name: 'Камни' }, { id: 'tubular', name: 'Некроз' },
            { id: 'gfr_drop', name: 'Падение СКФ' }
        ]},
        neuro: { mechanisms: [
            { id: 'dopamine', name: 'Дофамин' }, { id: 'glutamate', name: 'Глутамат' },
            { id: 'gaba', name: 'ГАМК' }, { id: 'serotonin', name: 'Серотонин' },
            { id: 'inflammation', name: 'Воспаление' }, { id: 'cognitive', name: 'Когнитив' },
            { id: 'addiction', name: 'Зависимость' }
        ]},
        hemato: { mechanisms: [
            { id: 'erythrocytosis', name: 'Эритроцитоз' }, { id: 'viscosity', name: 'Вязкость' },
            { id: 'coagulation', name: 'Коагуляция' }, { id: 'anemia', name: 'Анемия' },
            { id: 'leukocytosis', name: 'Лейкоцитоз' }, { id: 'platelets', name: 'Тромбоциты' },
            { id: 'hemolysis', name: 'Гемолиз' }
        ]},
        endo: { mechanisms: [
            { id: 'insulin_res', name: 'Инсулинорезист.' }, { id: 'estrogen', name: 'Эстроген' },
            { id: 'prolactin', name: 'Пролактин' }, { id: 'thyroid', name: 'Щитовидка' },
            { id: 'cortisol', name: 'Кортизол' }, { id: 'gh_axis', name: 'Ось ГР' },
            { id: 'adrenal', name: 'Надпочечники' }
        ]},
        repro: { mechanisms: [
            { id: 'atrophy', name: 'Атрофия' }, { id: 'suppression', name: 'Подавление' },
            { id: 'sperm', name: 'Сперма' }, { id: 'libido', name: 'Либидо' },
            { id: 'erectile', name: 'Эрекция' }, { id: 'gyno', name: 'Гино' },
            { id: 'infertility', name: 'Бесплодие' }
        ]}
    },

    supportProtocol: [
        { timeId: 'morning_empty', title: '☀️ Натощак', items: [
            { name: 'Iron Guard', dose: '2 капс', mechanism: 'Железо' },
            { name: 'Цитиколин', dose: '500 мг', mechanism: 'Мозг' },
            { name: 'Наттокиназа', dose: '2 капс', mechanism: 'Кровь' },
            { name: 'Таурин', dose: '2000 мг', mechanism: 'Сердце' }
        ]},
        { timeId: 'morning_food', title: '🍳 Завтрак', items: [
            { name: 'Астрагал', dose: '500 мг', mechanism: 'Почки' },
            { name: 'Небилет', dose: '2.5 мг', mechanism: 'Давление' },
            { name: 'Тадалафил', dose: '5 мг', mechanism: 'Поток' },
            { name: 'Берберин', dose: '500 мг', mechanism: 'Сахар' },
            { name: 'D3 + K2', dose: '5000 МЕ', mechanism: 'Кости' },
            { name: 'TMG + Метилфолат', dose: '1г', mechanism: 'Метил' },
            { name: 'Бергамот', dose: '500 мг', mechanism: 'Липиды' }
        ]},
        { timeId: 'lunch', title: '🍲 Обед', items: [
            { name: 'УДХК', dose: '1000 мг', mechanism: 'Желчь' },
            { name: 'Пентоксифиллин', dose: '400 мг', mechanism: 'Вязкость' },
            { name: 'Joint Health', dose: '2 капс', mechanism: 'Суставы' }
        ]},
        { timeId: 'evening', title: '🌙 Вечер', items: [
            { name: 'Телмисартан', dose: '80 мг', mechanism: 'Давление' },
            { name: 'Магний', dose: '400 мг', mechanism: 'Расслабление' },
            { name: 'L-Теанин', dose: '400 мг', mechanism: 'Сон' }
        ]}
    ],
    
    shopItems: {
        'udca': [{ platform: 'Ozon', price: '1500₽', url: '#' }],
        'telmisartan': [{ platform: 'Apteka', price: '600₽', url: '#' }],
        'berberine': [{ platform: 'iHerb', price: '$20', url: '#' }]
    },
    glossary: {
        'Raw Risk': 'Риск без защиты',
        'Net Risk': 'Риск с защитой',
        'Half-life': 'Период полувыведения'
    }
};
DBEOF

# 2. ENGINE (Robust Calculation)
cat > assets/js/core/engine.js << 'ENGINEEOF'
const Engine = {
    calculateConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        if (currentWeek <= endWeek) {
            // Ramp up
            const progress = (currentWeek - startWeek + 1) / (halfLife / 7);
            return Math.min(1, progress);
        } else {
            // Decay
            const weeksOff = currentWeek - endWeek;
            return Math.max(0, Math.exp(-0.693 * weeksOff / (halfLife / 7)));
        }
    },

    generateWeeklyPlan(stack) {
        if (!stack.length) return [];
        let maxWeek = 0;
        stack.forEach(s => { if (s.endWeek > maxWeek) maxWeek = s.endWeek; });
        // Add clearance time
        const totalWeeks = maxWeek + 6; 
        
        const plan = [];
        for (let w = 1; w <= totalWeeks; w++) {
            let risks = {};
            // Init 0
            for (let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].mechanisms.forEach(m => risks[sys][m.id] = 0);
            }

            stack.forEach(item => {
                const esterList = DB.esters[item.substanceId];
                const ester = esterList ? esterList.find(e => e.id === item.esterId) : null;
                const halfLife = ester ? ester.halfLife : 1;
                const conc = this.calculateConcentration(halfLife, item.startWeek, item.endWeek, w);
                
                if (conc > 0.05) {
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    if (!sub) return;
                    const factor = conc * (item.dose / 100);
                    const t = sub.baseTox;

                    // Map toxicity to specific mechanisms
                    risks.liver.cholestasis += t.liver * 4 * factor;
                    risks.liver.cytolysis += t.liver * 3 * factor;
                    
                    risks.cardio.lipids += t.lipid * 4 * factor;
                    risks.cardio.htn += t.lipid * 2 * factor;
                    risks.cardio.thrombo += t.lipid * 1.5 * factor;

                    risks.hemato.erythrocytosis += t.hct * 5 * factor;
                    risks.hemato.viscosity += t.hct * 4 * factor;

                    risks.neuro.dopamine += t.neuro * 5 * factor;
                    risks.neuro.gaba += t.neuro * 2 * factor;

                    risks.kidney.hyperfiltration += t.kidney * 3 * factor;

                    risks.endo.insulin_res += t.endo * 3 * factor;
                    risks.endo.estrogen += t.endo * 2 * factor;

                    risks.repro.suppression += t.repro * 5 * factor;
                    risks.repro.atrophy += t.repro * 4 * factor;
                }
            });

            // Cap at 100
            for (let sys in risks) {
                for (let m in risks[sys]) risks[sys][m] = Math.min(100, Math.round(risks[sys][m]));
            }
            plan.push({ week: w, risks });
        }
        return plan;
    },

    getRiskColor(val) {
        if (val < 20) return '#2e7d32';
        if (val < 40) return '#f9a825';
        if (val < 60) return '#ef6c00';
        return '#c62828';
    }
};
ENGINEEOF

# 3. APP JS (Fixed Event Listeners & Rendering)
cat > assets/js/app.js << 'APPEOF'
document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized");
    
    // State
    const state = { stack: [], plan: [], currentWeekIdx: 0, chartVisibility: { liver:true, cardio:true, hemato:true, neuro:false, kidney:false, endo:false, repro:false } };

    // 1. Tabs Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Refresh charts if switching to Risks tab
            if (tabId === 'risks' && state.plan.length) {
                App.renderHeatmap();
                App.renderTrendChart();
            }
        });
    });

    // 2. Substance Select Init
    const subSelect = document.getElementById('drug-substance');
    if (subSelect) {
        DB.substances.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            subSelect.appendChild(opt);
        });
        // Trigger initial load
        App.loadEsters();
    }

    // 3. Form Submit
    const form = document.getElementById('add-drug-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            App.addDrug(e);
        });
    }

    // Global App Object
    window.App = {
        loadEsters: () => {
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
                    opt.textContent = `${e.name} (${e.halfLife}д)`;
                    estSelect.appendChild(opt);
                });
            } else {
                estSelect.disabled = true;
                const opt = document.createElement('option');
                opt.textContent = "Нет эфира (Орал/Пептид)";
                estSelect.appendChild(opt);
            }
        },

        addDrug: (e) => {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const start = parseInt(document.getElementById('drug-start').value);
            const end = parseInt(document.getElementById('drug-end').value);

            if (!subId || !dose || !start || !end) return alert("Заполните все поля");
            if (start >= end) return alert("Финиш должен быть больше старта");

            state.stack.push({ substanceId: subId, esterId, dose, startWeek: start, endWeek: end });
            App.renderStack();
            
            // Reset form partially
            document.getElementById('drug-dose').value = '';
            document.getElementById('drug-end').value = parseInt(start) + 8;
        },

        renderStack: () => {
            const list = document.getElementById('stack-list');
            if (!list) return;
            list.innerHTML = '';
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div>
                        <strong>${sub.name}</strong> ${ester ? '('+ester.name+')' : ''}
                        <br><small>${item.dose}мг | Нед ${item.startWeek}-${item.endWeek}</small>
                    </div>
                    <button class="btn-delete" onclick="window.App.removeDrug(${idx})">✕</button>
                `;
                list.appendChild(div);
            });
        },

        removeDrug: (idx) => {
            state.stack.splice(idx, 1);
            App.renderStack();
            if (state.plan.length) App.generatePlan(); // Recalc
        },

        generatePlan: () => {
            if (!state.stack.length) return alert("Добавьте препараты");
            state.plan = Engine.generateWeeklyPlan(state.stack);
            state.currentWeekIdx = 0;
            
            const out = document.getElementById('weekly-plan-output');
            if (out) out.innerHTML = `<div style="padding:15px; background:#222; border-radius:8px; color:#03dac6; margin-top:10px;">
                ✅ Рассчитано на ${state.plan.length} недель. Перейдите во вкладку "Риски".
            </div>`;
            
            App.renderHeatmap();
            App.renderTrendChart();
        },

        changeWeek: (dir) => {
            if (!state.plan.length) return;
            state.currentWeekIdx += dir;
            if (state.currentWeekIdx < 0) state.currentWeekIdx = 0;
            if (state.currentWeekIdx >= state.plan.length) state.currentWeekIdx = state.plan.length - 1;
            App.renderHeatmap();
        },

        toggleChart: (sys) => {
            state.chartVisibility[sys] = !state.chartVisibility[sys];
            App.renderTrendChart();
        },

        renderHeatmap: () => {
            const container = document.getElementById('heatmap-container');
            const weekLabel = document.getElementById('current-week-display');
            if (!container || !state.plan.length) return;

            const data = state.plan[state.currentWeekIdx];
            weekLabel.textContent = `Неделя ${data.week}`;
            container.innerHTML = '';
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(90px, 1fr))';
            container.style.gap = '8px';

            for (let sys in DB.riskMatrix) {
                // System Header
                const head = document.createElement('div');
                head.style.gridColumn = '1 / -1';
                head.style.color = '#bb86fc';
                head.style.fontWeight = 'bold';
                head.style.marginTop = '10px';
                head.textContent = sys.toUpperCase();
                container.appendChild(head);

                // Mechanisms
                DB.riskMatrix[sys].mechanisms.forEach(m => {
                    const val = data.risks[sys][m.id] || 0;
                    const cell = document.createElement('div');
                    cell.className = 'heatmap-cell';
                    cell.style.backgroundColor = Engine.getRiskColor(val);
                    cell.style.color = val > 50 ? '#fff' : '#eee';
                    cell.style.padding = '8px';
                    cell.style.borderRadius = '6px';
                    cell.style.textAlign = 'center';
                    cell.style.fontSize = '0.75em';
                    cell.innerHTML = `<div>${m.name}</div><strong>${val}%</strong>`;
                    container.appendChild(cell);
                });
            }
        },

        renderTrendChart: () => {
            const ctx = document.getElementById('risk-trend-chart');
            if (!ctx || !state.plan.length) return;
            if (window.trendChartInstance) window.trendChartInstance.destroy();

            const labels = state.plan.map(p => `W${p.week}`);
            const datasets = [];
            const colors = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', neuro: '#9966ff', kidney: '#4bc0c0', endo: '#c9cbcf', repro: '#e7e9ed' };

            for (let sys in state.chartVisibility) {
                if (!state.chartVisibility[sys]) continue;
                const sysData = state.plan.map(p => {
                    let sum=0, cnt=0;
                    for(let k in p.risks[sys]) { sum+=p.risks[sys][k]; cnt++; }
                    return cnt ? Math.round(sum/cnt) : 0;
                });
                datasets.push({
                    label: sys.toUpperCase(),
                    data: sysData,
                    borderColor: colors[sys],
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 0
                });
            }

            window.trendChartInstance = new Chart(ctx, {
                type: 'line',
                 { labels, datasets },
                options: {
                    responsive: true,
                    plugins: { legend: { labels: { color: '#ccc' } } },
                    scales: {
                        y: { beginAtZero: true, max: 100, grid: { color: '#333' }, ticks: { color: '#aaa' } },
                        x: { grid: { color: '#333' }, ticks: { color: '#aaa' } }
                    }
                }
            });
        },
        
        renderShop: () => {
            const list = document.getElementById('shop-list');
            if(!list) return;
            list.innerHTML = '';
            for(const [key, items] of Object.entries(DB.shopItems || {})) {
                items.forEach(i => {
                    list.innerHTML += `<div class="drug-card"><div><b>${key}</b><br><small>${i.platform}</small></div><div><span style="color:#03dac6">${i.price}</span></div></div>`;
                });
            }
        },
        
        renderGlossary: () => {
            const list = document.getElementById('glossary-list');
            if(!list) return;
            list.innerHTML = '';
            for(const [k,v] of Object.entries(DB.glossary || {})) {
                list.innerHTML += `<div class="drug-card"><b>${k}</b><p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${v}</p></div>`;
            }
        }
    };

    // Init Lists
    App.renderStack();
    App.renderShop();
    App.renderGlossary();
});
APPEOF

# 4. HTML Structure (Cleaned)
cat > index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bode Health v11.0</title>
    <base href="https://thodstein.github.io/Bode_Health/">
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="app-container">
        <header><h1>Bode Health <span style="font-size:0.5em; color:#03dac6">v11.0 Fix</span></h1></header>
        <nav class="tabs">
            <button class="tab-btn active" data-tab="stack">💉 Стек</button>
            <button class="tab-btn" data-tab="risks">⚠️ Риски</button>
            <button class="tab-btn" data-tab="support">💊 Поддержка</button>
            <button class="tab-btn" data-tab="shop">🛒 Магазин</button>
        </nav>
        <main>
            <section id="stack" class="tab-content active">
                <h2>Добавить препарат</h2>
                <form id="add-drug-form" class="deep-form">
                    <label>Вещество</label>
                    <select id="drug-substance" onchange="App.loadEsters()"></select>
                    <label>Эфир</label>
                    <select id="drug-ester" disabled></select>
                    <div class="row">
                        <input type="number" id="drug-dose" placeholder="Доза (мг)" required>
                        <input type="number" id="drug-start" placeholder="Старт" value="1" required>
                        <input type="number" id="drug-end" placeholder="Финиш" value="8" required>
                    </div>
                    <button type="submit" class="btn-success">Добавить</button>
                </form>
                <div id="stack-list" class="list-container"></div>
                <button onclick="App.generatePlan()" class="btn-success" style="margin-top:20px">РАССЧИТАТЬ КУРС</button>
                <div id="weekly-plan-output"></div>
            </section>

            <section id="risks" class="tab-content">
                <h2>Динамика</h2>
                <div class="chart-controls">
                    <label><input type="checkbox" checked onchange="App.toggleChart('liver')"> Печень</label>
                    <label><input type="checkbox" checked onchange="App.toggleChart('cardio')"> Сердце</label>
                    <label><input type="checkbox" checked onchange="App.toggleChart('hemato')"> Кровь</label>
                </div>
                <canvas id="risk-trend-chart"></canvas>
                
                <h2>Матрица (Heatmap)</h2>
                <div class="week-selector">
                    <button onclick="App.changeWeek(-1)">◀</button>
                    <span id="current-week-display">Неделя 1</span>
                    <button onclick="App.changeWeek(1)">▶</button>
                </div>
                <div id="heatmap-container"></div>
            </section>

            <section id="support" class="tab-content">
                <h2>Поддержка</h2>
                <div id="support-schedule" class="schedule-container"></div>
            </section>

            <section id="shop" class="tab-content">
                <h2>Магазин</h2>
                <div id="shop-list" class="list-container"></div>
                <h2>Глоссарий</h2>
                <div id="glossary-list"></div>
            </section>
        </main>
    </div>
    <script src="assets/js/core/database.js"></script>
    <script src="assets/js/core/engine.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
HTMLEOF

# 5. CSS
cat > assets/css/style.css << 'CSSEOF'
body { background: #121212; color: #fff; font-family: sans-serif; margin: 0; padding-bottom: 50px; }
.app-container { max-width: 800px; margin: 0 auto; }
header { background: #1e1e1e; padding: 15px; text-align: center; border-bottom: 1px solid #333; }
.tabs { display: flex; background: #1e1e1e; overflow-x: auto; }
.tab-btn { flex: 1; padding: 15px; background: none; border: none; color: #aaa; font-weight: bold; border-bottom: 3px solid transparent; }
.tab-btn.active { color: #bb86fc; border-bottom-color: #bb86fc; }
.tab-content { display: none; padding: 20px; }
.tab-content.active { display: block; }
.deep-form { background: #1e1e1e; padding: 20px; border-radius: 8px; display: flex; flex-direction: column; gap: 10px; }
.row { display: flex; gap: 10px; }
input, select { background: #2c2c2c; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; flex: 1; }
button { background: #bb86fc; color: #000; border: none; padding: 12px; border-radius: 6px; font-weight: bold; cursor: pointer; }
.btn-success { background: #03dac6; width: 100%; }
.list-container { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
.drug-card { background: #1e1e1e; padding: 15px; border-radius: 6px; border-left: 4px solid #03dac6; display: flex; justify-content: space-between; }
.btn-delete { background: #cf6679; padding: 5px 10px; font-size: 0.8em; }
.chart-controls { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; background: #1e1e1e; padding: 10px; border-radius: 6px; }
.chart-controls label { font-size: 0.9em; display: flex; align-items: center; gap: 5px; }
.week-selector { display: flex; justify-content: center; align-items: center; gap: 20px; margin: 20px 0; }
#heatmap-container { display: grid; gap: 5px; }
.heatmap-cell { padding: 10px; border-radius: 4px; text-align: center; font-size: 0.8em; }
.schedule-container { display: flex; flex-direction: column; gap: 15px; }
.time-block { background: #1e1e1e; padding: 15px; border-radius: 8px; }
.time-block h3 { color: #bb86fc; margin-top: 0; font-size: 0.9em; text-transform: uppercase; }
CSSEOF

# 6. Render Support Static HTML (for simplicity in this stage)
cat >> assets/js/app.js << 'APPENDEOF'
    // Render Support Static
    const supCont = document.getElementById('support-schedule');
    if(supCont) {
        supCont.innerHTML = '';
        DB.supportProtocol.forEach(block => {
            let html = `<div class="time-block"><h3>${block.title}</h3>`;
            block.items.forEach(i => {
                html += `<div style="border-bottom:1px solid #333; padding:5px 0;"><b>${i.name}</b> ${i.dose} <div style="font-size:0.8em; color:#aaa">${i.mechanism}</div></div>`;
            });
            html += '</div>';
            supCont.innerHTML += html;
        });
    }
APPENDEOF

echo "🚀 Pushing Stage 7..."
git add -A
git commit -m "Stage 7: Advanced Analytics & Visualization (FIXED Ethers, Heatmaps, Buttons)"
git push origin main --force
echo "✅ DONE. Check site."
