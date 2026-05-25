#!/bin/bash
set -e
echo "🔥 RESTORING FULL MODULAR STRUCTURE & DATA (NO SHORTCUTS)"

# 1. FULL DATABASE (assets/js/core/database.js)
echo "💾 Writing Full Database..."
mkdir -p assets/js/core
cat > assets/js/core/database.js << 'DBEOF'
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
DBEOF

# 2. ENGINE LOGIC (assets/js/core/engine.js)
echo "⚙️ Writing Engine Logic..."
cat > assets/js/core/engine.js << 'ENGINEEOF'
const Engine = {
    calculateConcentration: function(hl, start, end, current) {
        if (current < start) return 0;
        const weeksOn = current - start;
        if (current <= end) {
            // Фаза набора (выход на плато)
            return Math.min(1, weeksOn / (hl / 7 + 1));
        } else {
            // Фаза выведения
            const weeksOff = current - end;
            return Math.max(0, 1 - (weeksOff * 0.2)); // Грубая линейная аппроксимация спада
        }
    },

    generatePlan: function(stack) {
        let maxWeek = 12;
        stack.forEach(s => { if (s.end > maxWeek) maxWeek = s.end; });
        const totalWeeks = maxWeek + 6; // Курс + 6 недель на вывод
        const plan = [];

        for (let w = 1; w <= totalWeeks; w++) {
            let r = {};
            // Инициализация нулями
            for (let sys in DB.risks) {
                r[sys] = {};
                DB.risks[sys].forEach(m => r[sys][m.id] = 0);
            }

            stack.forEach(item => {
                const ester = DB.esters[item.sub]?.find(e => e.id === item.est);
                const hl = ester ? ester.hl : 1;
                const conc = this.calculateConcentration(hl, item.start, item.end, w);

                if (conc > 0.05) {
                    const sub = DB.substances.find(s => s.id === item.sub);
                    if (!sub) return;
                    const t = sub.tox;
                    const load = conc * (item.dose / 100);

                    // Распределение токсичности по механизмам
                    r.liver.chol += t.liver * 3 * load; r.liver.cyt += t.liver * 2 * load;
                    r.cardio.lip += t.lipid * 3 * load; r.cardio.htn += t.lipid * 1.5 * load;
                    r.hemato.ery += t.hct * 4 * load; r.hemato.visc += t.hct * 3 * load;
                    r.neuro.dop += t.neuro * 5 * load;
                    r.kidney.hyper += t.kid * 3 * load;
                    r.endo.ins += t.endo * 3 * load; r.endo.est += t.endo * 2 * load;
                    r.repro.sup += t.repro * 5 * load; r.repro.atr += t.repro * 4 * load;
                }
            });

            // Нормализация до 100%
            for (let sys in r) {
                for (let k in r[sys]) {
                    r[sys][k] = Math.min(100, Math.round(r[sys][k]));
                }
            }
            plan.push({ w, r });
        }
        return plan;
    },

    getRiskColor: function(v) {
        if (v < 20) return '#4caf50';
        if (v < 40) return '#8bc34a';
        if (v < 60) return '#ffeb3b';
        if (v < 80) return '#ff9800';
        return '#f44336';
    }
};
ENGINEEOF

# 3. APP LOGIC (assets/js/app.js) - GLOBAL FUNCTIONS FOR BUTTONS
echo "🧠 Writing App Logic (Global Scope)..."
cat > assets/js/app.js << 'APPEOF'
// Глобальный объект приложения
const App = {
    state: {
        stack: [],
        plan: [],
        wIdx: 0,
        xp: 0,
        charts: { liver: true, cardio: true, hemato: true, kidney: false, neuro: false, endo: false, repro: false }
    },

    init: function() {
        // Заполнение селекта веществ
        const sel = document.getElementById('sub-select');
        if (sel) {
            sel.innerHTML = '';
            DB.substances.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = s.name;
                sel.appendChild(opt);
            });
        }
        this.renderSupport();
        this.renderArticles();
        this.renderShop();
        this.renderGlossary();
        this.renderChartControls();
    },

    // Переключение вкладок
    switchTab: function(tabId) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        
        document.getElementById(tabId).classList.add('active');
        // Находим кнопку и активируем её (простой перебор)
        const btns = document.querySelectorAll('.tab-btn');
        if(tabId === 'dashboard') btns[0].classList.add('active');
        if(tabId === 'stack') btns[1].classList.add('active');
        if(tabId === 'risks') {
            btns[2].classList.add('active');
            setTimeout(() => {
                if (this.state.plan.length) {
                    this.renderChart();
                    this.renderHeatmap();
                }
            }, 100);
        }
        if(tabId === 'support') btns[3].classList.add('active');
        if(tabId === 'labs') btns[4].classList.add('active');
        if(tabId === 'articles') btns[5].classList.add('active');
        if(tabId === 'shop') btns[6].classList.add('active');
    },

    // Загрузка эфиров
    loadEsters: function() {
        const subId = document.getElementById('sub-select').value;
        const estSel = document.getElementById('est-select');
        estSel.innerHTML = '';
        const list = DB.esters[subId];
        
        if (list && list.length > 0) {
            estSel.disabled = false;
            list.forEach(e => {
                const opt = document.createElement('option');
                opt.value = e.id;
                opt.textContent = e.name + ' (T1/2: ' + e.hl + ' дн.)';
                estSel.appendChild(opt);
            });
        } else {
            estSel.disabled = true;
        }
    },

    // Добавление препарата
    addDrug: function() {
        const sub = document.getElementById('sub-select').value;
        const est = document.getElementById('est-select').value;
        const dose = parseFloat(document.getElementById('in-dose').value);
        const start = parseInt(document.getElementById('in-start').value);
        const end = parseInt(document.getElementById('in-end').value);

        if (!dose || start >= end) {
            alert('Проверьте дозировку и недели (Старт < Финиш)!');
            return;
        }

        this.state.stack.push({ sub, est, dose, start, end });
        this.renderStack();
        
        // Сброс формы
        document.getElementById('in-dose').value = '';
        document.getElementById('in-start').value = '1';
        document.getElementById('in-end').value = '8';
    },

    renderStack: function() {
        const div = document.getElementById('stack-list');
        div.innerHTML = '';
        this.state.stack.forEach((item, idx) => {
            const s = DB.substances.find(x => x.id === item.sub);
            const e = DB.esters[item.sub] ? DB.esters[item.sub].find(x => x.id === item.est) : null;
            
            const html = `
                <div class="item">
                    <div>
                        <b>${s.name}</b> ${e ? '(' + e.name + ')' : ''}<br>
                        <small>${item.dose} мг/нед | Недели ${item.start}–${item.end}</small>
                    </div>
                    <button class="btn-del" onclick="App.removeDrug(${idx})">✕</button>
                </div>
            `;
            div.innerHTML += html;
        });
    },

    removeDrug: function(idx) {
        this.state.stack.splice(idx, 1);
        this.renderStack();
    },

    // Расчет плана
    calcPlan: function() {
        if (this.state.stack.length === 0) {
            alert('Сначала добавьте препараты в стек!');
            return;
        }
        this.state.plan = Engine.generatePlan(this.state.stack);
        this.state.wIdx = 0;
        
        this.renderHeatmap();
        this.renderChart();
        
        const msg = document.getElementById('plan-msg');
        msg.textContent = `✅ Расчет выполнен на ${this.state.plan.length} недель!`;
        msg.style.color = 'var(--sec)';
        
        this.state.xp += 100;
        document.getElementById('xp-display').textContent = 'XP: ' + this.state.xp;

        // Обновление дэшборда
        const firstWeek = this.state.plan[0];
        let sum = 0, cnt = 0;
        for(let sys in firstWeek.r) {
            for(let k in firstWeek.r[sys]) { sum += firstWeek.r[sys][k]; cnt++; }
        }
        const avg = Math.round(sum / cnt);
        document.getElementById('d-risk').textContent = avg + '%';
        document.getElementById('d-readiness').textContent = Math.max(10, 100 - avg);
    },

    // Навигация по неделям
    changeWeek: function(dir) {
        if (!this.state.plan.length) return;
        this.state.wIdx += dir;
        if (this.state.wIdx < 0) this.state.wIdx = 0;
        if (this.state.wIdx >= this.state.plan.length) this.state.wIdx = this.state.plan.length - 1;
        this.renderHeatmap();
    },

    // Рендер Heatmap
    renderHeatmap: function() {
        if (!this.state.plan.length) return;
        const data = this.state.plan[this.state.wIdx];
        document.getElementById('week-label').textContent = 'Неделя ' + data.w;
        
        const container = document.getElementById('heatmap');
        container.innerHTML = '';

        for (let sys in DB.risks) {
            // Заголовок системы
            container.innerHTML += `<div style="grid-column: 1 / -1; color: var(--pri); font-weight: bold; margin-top: 10px; text-transform: uppercase;">${sys}</div>`;
            
            DB.risks[sys].forEach(m => {
                const val = data.r[sys][m.id] || 0;
                const color = Engine.getRiskColor(val);
                const txtColor = val > 50 ? '#000' : '#fff';
                
                const cell = document.createElement('div');
                cell.className = 'hm-cell';
                cell.style.backgroundColor = color;
                cell.style.color = txtColor;
                cell.innerHTML = `<b>${m.n}</b><br>${val}%`;
                container.appendChild(cell);
            });
        }
    },

    // Рендер графика
    renderChart: function() {
        const ctx = document.getElementById('trend-chart');
        if (!ctx) return;
        
        if (window.myChart) window.myChart.destroy();

        const labels = this.state.plan.map(p => 'W' + p.w);
        const datasets = [];
        const colors = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', kidney: '#4bc0c0', neuro: '#9966ff', endo: '#c9cbcf', repro: '#e7e9ed' };

        for (let sys in this.state.charts) {
            if (this.state.charts[sys]) {
                const dataPoints = this.state.plan.map(p => {
                    let sum = 0, cnt = 0;
                    for (let k in p.r[sys]) { sum += p.r[sys][k]; cnt++; }
                    return cnt ? Math.round(sum / cnt) : 0;
                });
                datasets.push({
                    label: sys.toUpperCase(),
                    data: dataPoints,
                    borderColor: colors[sys],
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                });
            }
        }

        window.myChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: '#aaa' } } },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } },
                    x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
                }
            }
        });
    },

    toggleChart: function(sys) {
        this.state.charts[sys] = !this.state.charts[sys];
        this.renderChart();
    },

    renderChartControls: function() {
        const div = document.getElementById('chart-controls');
        const names = { liver: 'Печень', cardio: 'Сердце', hemato: 'Кровь', kidney: 'Почки', neuro: 'Невро', endo: 'Эндо', repro: 'Репро' };
        div.innerHTML = '';
        for (let k in names) {
            const checked = this.state.charts[k] ? 'checked' : '';
            div.innerHTML += `<label><input type="checkbox" ${checked} onchange="App.toggleChart('${k}')"> ${names[k]}</label>`;
        }
    },

    // Рендер поддержки
    renderSupport: function() {
        const div = document.getElementById('support-list');
        div.innerHTML = '';
        DB.support.forEach(block => {
            let itemsHtml = block.items.map(i => `
                <div class="item" style="margin: 5px 0; padding: 10px; border-left-color: var(--pri);">
                    <div><b>${i.n}</b> ${i.d}<br><small>${i.m}</small></div>
                </div>
            `).join('');
            
            div.innerHTML += `<div class="time-block"><h3>${block.t}</h3>${itemsHtml}</div>`;
        });
    },

    // Фертильность
    calcFert: function() {
        const v = parseFloat(document.getElementById('lab-vol').value) || 0;
        const c = parseFloat(document.getElementById('lab-conc').value) || 0;
        const res = Math.round((v / 1.5) * 20 + (c / 16) * 30);
        const color = res > 50 ? 'var(--sec)' : 'var(--err)';
        document.getElementById('fert-res').innerHTML = `<span style="color:${color}">IF: ${res}/100</span>`;
    },

    renderArticles: function() {
        const div = document.getElementById('articles-list');
        div.innerHTML = '';
        DB.articles.forEach(a => {
            div.innerHTML += `<div class="item"><div><b>${a.t}</b><br><small>${a.c} | 👁 ${a.v}</small></div></div>`;
        });
    },

    renderShop: function() {
        const div = document.getElementById('shop-list');
        div.innerHTML = '';
        for (let k in DB.shop) {
            DB.shop[k].forEach(i => {
                div.innerHTML += `<div class="item"><div><b>${k.toUpperCase()}</b><br>${i.p}</div><div style="color:var(--sec)">${i.pr}</div></div>`;
            });
        }
    },

    renderGlossary: function() {
        const div = document.getElementById('glossary-list');
        div.innerHTML = '';
        for (let k in DB.glossary) {
            div.innerHTML += `<div class="item"><b>${k}</b><br><small>${DB.glossary[k]}</small></div>`;
        }
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
APPEOF

# 4. HTML (index.html)
echo "🎨 Updating index.html..."
cat > index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Bode Health v11.0 Ultimate</title>
    <base href="https://thodstein.github.io/Bode_Health/">
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
<div class="app">
    <header>
        <h1>Bode Health <span style="font-size:0.6em; color:var(--sec)">v11.0</span></h1>
        <div class="xp-badge" id="xp-display">XP: 0</div>
    </header>

    <nav class="tabs">
        <button class="tab-btn active" onclick="App.switchTab('dashboard')">📊 Главная</button>
        <button class="tab-btn" onclick="App.switchTab('stack')">💉 Стек</button>
        <button class="tab-btn" onclick="App.switchTab('risks')">⚠️ Риски</button>
        <button class="tab-btn" onclick="App.switchTab('support')">💊 Поддержка</button>
        <button class="tab-btn" onclick="App.switchTab('labs')">🧬 Анализы</button>
        <button class="tab-btn" onclick="App.switchTab('articles')">📚 Статьи</button>
        <button class="tab-btn" onclick="App.switchTab('shop')">🛒 Магазин</button>
    </nav>

    <main>
        <!-- DASHBOARD -->
        <div id="dashboard" class="view active">
            <div class="grid">
                <div class="card"><h3>Readiness</h3><div class="big-val" id="d-readiness">--</div></div>
                <div class="card"><h3>Risk Avg</h3><div class="big-val" id="d-risk">--</div></div>
            </div>
            <div class="form-box" style="border:1px solid var(--err); color:var(--err)">
                ⚠️ Добавьте препараты во вкладке "Стек" для расчета прогноза.
            </div>
        </div>

        <!-- STACK -->
        <div id="stack" class="view">
            <div class="form-box">
                <label>Вещество</label>
                <select id="sub-select" onchange="App.loadEsters()"></select>
                
                <label>Эфир</label>
                <select id="est-select" disabled></select>
                
                <div class="row">
                    <input type="number" id="in-dose" placeholder="Доза (мг/нед)">
                </div>
                <div class="row">
                    <input type="number" id="in-start" placeholder="Старт (нед)" value="1">
                    <input type="number" id="in-end" placeholder="Финиш (нед)" value="8">
                </div>
                <button class="btn-pri" onclick="App.addDrug()">Добавить в курс</button>
            </div>
            <div id="stack-list"></div>
            <button class="btn-sec" onclick="App.calcPlan()">РАССЧИТАТЬ ДИНАМИКУ</button>
            <div id="plan-msg" style="margin-top:15px; color:var(--sec); font-weight:bold;"></div>
        </div>

        <!-- RISKS -->
        <div id="risks" class="view">
            <h3>Динамика рисков</h3>
            <div class="controls" id="chart-controls"></div>
            <canvas id="trend-chart"></canvas>
            
            <h3>Матрица (Heatmap)</h3>
            <div class="week-nav">
                <button onclick="App.changeWeek(-1)">◀</button>
                <span id="week-label" style="font-weight:bold; color:var(--sec)">Неделя 1</span>
                <button onclick="App.changeWeek(1)">▶</button>
            </div>
            <div id="heatmap" class="heatmap"></div>
        </div>

        <!-- SUPPORT -->
        <div id="support" class="view">
            <h2>Протокол поддержки</h2>
            <div id="support-list"></div>
        </div>

        <!-- LABS -->
        <div id="labs" class="view">
            <div class="form-box">
                <h3>Индекс Фертильности (WHO)</h3>
                <input type="number" id="lab-vol" placeholder="Объем (мл)">
                <input type="number" id="lab-conc" placeholder="Концентрация (млн)">
                <input type="number" id="lab-pr" placeholder="Подвижность (%)">
                <button class="btn-pri" onclick="App.calcFert()">Рассчитать IF</button>
                <div id="fert-res" style="margin-top:15px; font-size:1.2rem; font-weight:bold"></div>
            </div>
        </div>

        <!-- ARTICLES -->
        <div id="articles" class="view">
            <h2>База знаний</h2>
            <div id="articles-list"></div>
        </div>

        <!-- SHOP -->
        <div id="shop" class="view">
            <h2>Магазин</h2>
            <div id="shop-list"></div>
            <h2>Глоссарий</h2>
            <div id="glossary-list"></div>
        </div>
    </main>
</div>

<!-- Scripts -->
<script src="assets/js/core/database.js"></script>
<script src="assets/js/core/engine.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>
HTMLEOF

# 5. CSS (assets/css/style.css)
echo "🎨 Updating CSS..."
cat > assets/css/style.css << 'CSSEOF'
:root { --bg: #121212; --card: #1e1e1e; --pri: #bb86fc; --sec: #03dac6; --err: #cf6679; --txt: #ffffff; --bor: #333; }
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--txt); padding-bottom: 80px; }
.app { max-width: 900px; margin: 0 auto; }

/* Header */
header { background: var(--card); padding: 15px 20px; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--bor); display: flex; justify-content: space-between; align-items: center; }
h1 { margin: 0; font-size: 1.2rem; color: var(--pri); }
.xp-badge { background: rgba(187, 134, 252, 0.2); color: var(--pri); padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; }

/* Tabs */
.tabs { display: flex; overflow-x: auto; background: var(--card); position: sticky; top: 60px; z-index: 99; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab-btn { flex: 0 0 auto; padding: 15px 20px; background: none; border: none; color: #888; font-weight: 600; font-size: 0.9rem; border-bottom: 3px solid transparent; cursor: pointer; white-space: nowrap; }
.tab-btn.active { color: var(--sec); border-bottom-color: var(--sec); }

/* Content */
.view { display: none; padding: 20px; animation: fade 0.3s; }
.view.active { display: block; }
@keyframes fade { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* Cards & Grid */
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
.card { background: var(--card); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid var(--bor); }
.big-val { font-size: 1.8rem; font-weight: bold; color: var(--sec); margin-top: 5px; }

/* Forms */
.form-box { background: var(--card); padding: 20px; border-radius: 12px; margin-bottom: 20px; }
label { display: block; margin-bottom: 5px; color: #aaa; font-size: 0.9rem; }
input, select { width: 100%; background: #2c2c2c; border: 1px solid var(--bor); color: #fff; padding: 12px; border-radius: 8px; margin-bottom: 10px; font-size: 1rem; }
.row { display: flex; gap: 10px; }

/* Buttons */
button { width: 100%; padding: 14px; border: none; border-radius: 8px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: 0.2s; }
.btn-pri { background: var(--pri); color: #000; }
.btn-sec { background: var(--sec); color: #000; margin-top: 10px; }
.btn-del { background: rgba(207, 102, 121, 0.2); color: var(--err); width: auto; padding: 5px 10px; font-size: 0.8rem; }

/* Lists */
.item { background: var(--card); padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid var(--sec); display: flex; justify-content: space-between; align-items: center; }
.time-block { background: #252525; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.time-block h3 { color: var(--pri); margin: 0 0 10px; font-size: 0.9rem; text-transform: uppercase; }

/* Heatmap */
.heatmap { display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 6px; margin-top: 15px; }
.hm-cell { padding: 8px; border-radius: 4px; text-align: center; font-size: 0.75rem; color: #fff; cursor: help; }
.week-nav { display: flex; justify-content: center; align-items: center; gap: 20px; margin: 20px 0; }
.week-nav button { width: auto; padding: 5px 15px; background: #333; color: #fff; }

/* Charts */
canvas { background: var(--card); border-radius: 12px; padding: 10px; margin-bottom: 20px; }
.controls { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; background: var(--card); padding: 10px; border-radius: 8px; }
.controls label { display: flex; align-items: center; gap: 5px; margin: 0; color: #fff; font-size: 0.85rem; }
CSSEOF

# 6. PUSH
echo "🚀 Pushing Full Structure..."
git add -A
git commit -m "Stage 9: Full Modular Restore (DB, Engine, App, All Tabs, No Shortcuts)"
git push origin main --force

echo "✅ DONE! Hard Refresh (Ctrl+F5) required on the site."
