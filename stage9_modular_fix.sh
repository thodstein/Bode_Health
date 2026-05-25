#!/bin/bash
set -e
echo "🔥 STAGE 9: Modular Restore (Separate Files, Fixed Buttons, Full Content)"

# 1. DATABASE (Full Separate File)
echo "💾 Creating assets/js/core/database.js..."
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
        'gh': [ { id: 'gh_short', name: 'Ежедневно', hl: 0.1 }, { id: 'gh_long', name: 'Пролонг', hl: 168.0 } ],
        'insulin': [ { id: 'insulin_r', name: 'Короткий (R)', hl: 0.1 }, { id: 'insulin_l', name: 'Продленный (Glargine)', hl: 24.0 } ],
        'igf1': [ { id: 'igf1_lr3', name: 'LR3 (Длинный)', hl: 24.0 }, { id: 'igf1_des', name: 'DES (Короткий)', hl: 0.5 } ],
        'mgf': [ { id: 'mgf_plain', name: 'MGF', hl: 0.5 }, { id: 'peg_mgf', name: 'PEG-MGF', hl: 48.0 } ]
    },
    risks: {
        liver: [ {id:'chol',n:'Холестаз'}, {id:'ox',n:'Окс.стресс'}, {id:'cyt',n:'Цитолиз'}, {id:'fib',n:'Фиброз'}, {id:'mito',n:'Митохондрии'}, {id:'met',n:'Метилирование'}, {id:'apo',n:'Апоптоз'} ],
        cardio: [ {id:'htn',n:'Гипертония'}, {id:'tach',n:'Тахикардия'}, {id:'lip',n:'Липиды'}, {id:'thr',n:'Тромбоз'}, {id:'lvh',n:'Гипертрофия'}, {id:'endo',n:'Эндотелий'}, {id:'arr',n:'Аритмия'} ],
        kidney: [ {id:'hyper',n:'Гиперфильтрация'}, {id:'fib_k',n:'Фиброз'}, {id:'elec',n:'Электролиты'}, {id:'prot',n:'Протеинурия'}, {id:'stone',n:'Камни'}, {id:'tub',n:'Некроз'}, {id:'gfr',n:'Падение СКФ'} ],
        neuro: [ {id:'dop',n:'Дофамин'}, {id:'glu',n:'Глутамат'}, {id:'gaba',n:'ГАМК'}, {id:'ser',n:'Серотонин'}, {id:'inf',n:'Воспаление'}, {id:'cog',n:'Когнитив'}, {id:'add',n:'Зависимость'} ],
        hemato: [ {id:'ery',n:'Эритроцитоз'}, {id:'visc',n:'Вязкость'}, {id:'coag',n:'Коагуляция'}, {id:'anem',n:'Анемия'}, {id:'leuk',n:'Лейкоцитоз'}, {id:'plat',n:'Тромбоциты'}, {id:'hem',n:'Гемолиз'} ],
        endo: [ {id:'ins',n:'Инсулинорезист.'}, {id:'est',n:'Эстроген'}, {id:'prl',n:'Пролактин'}, {id:'thy',n:'Щитовидка'}, {id:'cor',n:'Кортизол'}, {id:'gh_ax',n:'Ось ГР'}, {id:'adr',n:'Надпочечники'} ],
        repro: [ {id:'atr',n:'Атрофия'}, {id:'sup',n:'Подавление'}, {id:'sp',n:'Спермогенез'}, {id:'lib',n:'Либидо'}, {id:'ed',n:'Эрекция'}, {id:'gyn',n:'Гинекомастия'}, {id:'inf',n:'Бесплодие'} ]
    },
    support: [
        { t: '☀️ Натощак', items: [ {n:'Iron Guard',d:'2 капс',m:'Гемоглобин'}, {n:'Цитиколин',d:'500 мг',m:'Нейро'}, {n:'Наттокиназа',d:'2 капс',m:'Реология'}, {n:'Таурин',d:'2000 мг',m:'Анти-спазм'} ] },
        { t: '🍳 Завтрак', items: [ {n:'Астрагал',d:'500 мг',m:'Почки'}, {n:'Небилет',d:'2.5 мг',m:'Давление'}, {n:'Тадалафил',d:'5 мг',m:'Поток'}, {n:'Берберин',d:'500 мг',m:'Инсулин'}, {n:'D3+K2',d:'5000 МЕ',m:'Кости'}, {n:'TMG+Метилфолат',d:'1г+1капс',m:'Метил'}, {n:'Бергамот',d:'500 мг',m:'Липиды'}, {n:'Бромантан+Фасорацетам',d:'50+100 мг',m:'Дофамин/ГАМК'} ] },
        { t: '🍲 Обед', items: [ {n:'УДХК',d:'1000 мг',m:'Желчь'}, {n:'Пентоксифиллин',d:'400 мг',m:'Вязкость'}, {n:'Joint Health',d:'2 капс',m:'Суставы'}, {n:'Витамин Е',d:'400 МЕ',m:'Антиокс'} ] },
        { t: '💪 Предтреник', items: [ {n:'Агмантин',d:'1000 мг',m:'NO'} ] },
        { t: '🌙 Вечер', items: [ {n:'Телмисартан',d:'80 мг',m:'Давление/Почки'}, {n:'Магний',d:'400 мг',m:'Расслабление'}, {n:'L-Теанин',d:'400 мг',m:'Сон'}, {n:'Гормон Роста',d:'5 ЕД',m:'Рост',note:'Inj'} ] }
    ],
    shop: {
        'udca': [ {p:'Ozon',pr:'1500₽'}, {p:'iHerb',pr:'$25'} ],
        'telmisartan': [ {p:'Apteka.ru',pr:'600₽'} ],
        'nebivolol': [ {p:'Ozon',pr:'400₽'} ],
        'berberine': [ {p:'iHerb',pr:'$20'} ],
        'taurine': [ {p:'Ozon',pr:'800₽'} ],
        'magnesium': [ {p:'Ozon',pr:'900₽'} ]
    },
    articles: [
        { t: 'Основы фармакокинетики', c: 'Theory', v: 120 },
        { t: 'Протоколы защиты печени', c: 'Safety', v: 340 },
        { t: 'IGF-1: LR3 vs DES', c: 'Peptides', v: 85 },
        { t: 'Управление эстрогеном', c: 'Hormones', v: 210 },
        { t: 'ПКТ: Тамоксифен или Кломид?', c: 'PCT', v: 450 },
        { t: 'Гормон роста: Дозировки и схемы', c: 'GH', v: 290 }
    ],
    glossary: {
        'Raw Risk': 'Исходный риск без применения поддержки.',
        'Net Risk': 'Остаточный риск после применения протокола защиты.',
        'Half-life': 'Период полувыведения вещества из организма.',
        'Hematocrit': 'Доля эритроцитов в крови. Критично выше 52%.',
        'IGF-1 LR3': 'Длинная версия IGF-1 с периодом действия до 24 часов.',
        'IGF-1 DES': 'Короткая версия IGF-1 (20 мин), колется локально.',
        'PEG-MGF': 'Пролонгированная форма MGF для системного восстановления.'
    }
};
DBEOF

# 2. ENGINE (Separate File)
echo "⚙️ Creating assets/js/core/engine.js..."
cat > assets/js/core/engine.js << 'ENGINEEOF'
const Engine = {
    calcConc: function(hl, start, end, week) {
        if (week < start) return 0;
        if (week <= end) {
            return Math.min(1, (week - start) / (hl / 7 + 1));
        } else {
            return Math.max(0, 1 - (week - end) * 0.2);
        }
    },
    generatePlan: function(stack) {
        let maxW = 12;
        stack.forEach(i => { if (i.end > maxW) maxW = i.end; });
        const total = maxW + 6;
        const plan = [];
        
        for (let w = 1; w <= total; w++) {
            let r = {};
            for (let sys in DB.risks) {
                r[sys] = {};
                DB.risks[sys].forEach(m => r[sys][m.id] = 0);
            }
            
            stack.forEach(it => {
                const ester = DB.esters[it.sub]?.find(e => e.id === it.est);
                const hl = ester ? ester.hl : 1;
                const conc = this.calcConc(hl, it.start, it.end, w);
                
                if (conc > 0.05) {
                    const t = DB.substances.find(s => s.id === it.sub).tox;
                    const load = conc * (it.dose / 100);
                    
                    r.liver.chol += t.liver * 3 * load; r.liver.cyt += t.liver * 2 * load;
                    r.cardio.lip += t.lipid * 3 * load; r.cardio.htn += t.lipid * 1.5 * load;
                    r.hemato.ery += t.hct * 4 * load; r.hemato.visc += t.hct * 3 * load;
                    r.neuro.dop += t.neuro * 5 * load;
                    r.kidney.hyper += t.kid * 3 * load;
                    r.endo.ins += t.endo * 3 * load; r.endo.est += t.endo * 2 * load;
                    r.repro.sup += t.repro * 5 * load; r.repro.atr += t.repro * 4 * load;
                }
            });
            
            for (let sys in r) {
                for (let k in r[sys]) {
                    r[sys][k] = Math.min(100, Math.round(r[sys][k]));
                }
            }
            plan.push({ w, r });
        }
        return plan;
    },
    getColor: function(v) {
        if (v < 20) return '#4caf50';
        if (v < 40) return '#8bc34a';
        if (v < 60) return '#ffeb3b';
        if (v < 80) return '#ff9800';
        return '#f44336';
    }
};
ENGINEEOF

# 3. APP JS (Fixed Buttons & Logic)
echo "🧠 Creating assets/js/app.js..."
cat > assets/js/app.js << 'APPEOF'
// Global App State
const AppState = {
    stack: [],
    plan: [],
    wIdx: 0,
    xp: 0,
    charts: { liver: true, cardio: true, hemato: true, kidney: false, neuro: false, endo: false, repro: false }
};

// Init Function
function initApp() {
    // Populate Substance Select
    const subSel = document.getElementById('sub-select');
    if (subSel) {
        subSel.innerHTML = '';
        DB.substances.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            subSel.appendChild(opt);
        });
    }
    
    renderSupport();
    renderArticles();
    renderShop();
    renderGlossary();
    renderChartControls();
}

// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    // Find button that triggered this (if clicked) or match by text/data
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(b => {
        if(b.getAttribute('onclick').includes(tabId)) b.classList.add('active');
    });

    if (tabId === 'risks' && AppState.plan.length > 0) {
        setTimeout(() => { renderChart(); renderHeatmap(); }, 100);
    }
}

// Load Esters
function loadEsters() {
    const subId = document.getElementById('sub-select').value;
    const estSel = document.getElementById('est-select');
    estSel.innerHTML = '';
    
    const list = DB.esters[subId];
    if (list && list.length > 0) {
        estSel.disabled = false;
        list.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.id;
            opt.textContent = `${e.name} (${e.hl} дн.)`;
            estSel.appendChild(opt);
        });
    } else {
        estSel.disabled = true;
    }
}

// Add Drug
function addDrug() {
    const sub = document.getElementById('sub-select').value;
    const est = document.getElementById('est-select').value;
    const dose = parseFloat(document.getElementById('in-dose').value);
    const start = parseInt(document.getElementById('in-start').value);
    const end = parseInt(document.getElementById('in-end').value);
    
    if (!dose || start >= end) {
        alert('Проверьте дозу и недели (Финиш > Старт)!');
        return;
    }
    
    AppState.stack.push({ sub, est, dose, start, end });
    renderStack();
    
    // Reset inputs
    document.getElementById('in-dose').value = '';
    document.getElementById('in-start').value = '1';
    document.getElementById('in-end').value = '8';
}

// Render Stack List
function renderStack() {
    const div = document.getElementById('stack-list');
    div.innerHTML = '';
    AppState.stack.forEach((it, idx) => {
        const s = DB.substances.find(x => x.id === it.sub);
        const e = DB.esters[it.sub]?.find(x => x.id === it.est);
        const name = s ? s.name : 'Unknown';
        const esterName = e ? `(${e.name})` : '';
        
        div.innerHTML += `
            <div class="item">
                <div>
                    <strong>${name}</strong> ${esterName}<br>
                    <small>${it.dose} мг | Недели ${it.start}–${it.end}</small>
                </div>
                <button class="btn-del" onclick="removeDrug(${idx})">✕</button>
            </div>
        `;
    });
}

function removeDrug(idx) {
    AppState.stack.splice(idx, 1);
    renderStack();
}

// Calculate Plan
function calcPlan() {
    if (AppState.stack.length === 0) {
        alert('Сначала добавьте препараты в стек!');
        return;
    }
    
    AppState.plan = Engine.generatePlan(AppState.stack);
    AppState.wIdx = 0;
    
    renderHeatmap();
    renderChart();
    
    const msg = document.getElementById('plan-msg');
    msg.textContent = `Расчет выполнен на ${AppState.plan.length} недель!`;
    msg.style.color = 'var(--sec)';
    
    AppState.xp += 100;
    document.getElementById('xp-display').textContent = `XP: ${AppState.xp}`;
    
    // Update Dashboard
    const firstWeek = AppState.plan[0].r;
    let sum = 0, cnt = 0;
    for(let sys in firstWeek) {
        for(let k in firstWeek[sys]) { sum += firstWeek[sys][k]; cnt++; }
    }
    const avg = cnt ? Math.round(sum / cnt) : 0;
    document.getElementById('d-risk').textContent = `${avg}%`;
    document.getElementById('d-readiness').textContent = Math.max(10, 100 - avg);
}

// Change Week
function changeWeek(dir) {
    if (AppState.plan.length === 0) return;
    AppState.wIdx += dir;
    if (AppState.wIdx < 0) AppState.wIdx = 0;
    if (AppState.wIdx >= AppState.plan.length) AppState.wIdx = AppState.plan.length - 1;
    renderHeatmap();
}

// Render Heatmap
function renderHeatmap() {
    const div = document.getElementById('heatmap');
    if (!div || AppState.plan.length === 0) return;
    
    const data = AppState.plan[AppState.wIdx];
    document.getElementById('week-label').textContent = `Неделя ${data.w}`;
    div.innerHTML = '';
    
    for (let sys in DB.risks) {
        div.innerHTML += `<div style="grid-column: 1 / -1; color: var(--pri); font-weight: bold; margin-top: 10px;">${sys.toUpperCase()}</div>`;
        DB.risks[sys].forEach(m => {
            const val = data.r[sys][m.id] || 0;
            const col = Engine.getColor(val);
            const txt = val > 50 ? '#000' : '#fff';
            
            const cell = document.createElement('div');
            cell.className = 'hm-cell';
            cell.style.backgroundColor = col;
            cell.style.color = txt;
            cell.innerHTML = `<b>${m.n}</b><br>${val}%`;
            div.appendChild(cell);
        });
    }
}

// Chart Controls
function renderChartControls() {
    const div = document.getElementById('chart-controls');
    if(!div) return;
    const names = { liver:'Печень', cardio:'Сердце', hemato:'Кровь', kidney:'Почки', neuro:'Невро', endo:'Эндо', repro:'Репро' };
    let html = '';
    for (let k in names) {
        const checked = AppState.charts[k] ? 'checked' : '';
        html += `<label><input type="checkbox" ${checked} onchange="toggleChart('${k}')"> ${names[k]}</label>`;
    }
    div.innerHTML = html;
}

function toggleChart(sys) {
    AppState.charts[sys] = !AppState.charts[sys];
    renderChart();
}

// Render Chart
function renderChart() {
    const ctx = document.getElementById('trend-chart');
    if (!ctx || AppState.plan.length === 0) return;
    
    if (window.myChart) window.myChart.destroy();
    
    const labels = AppState.plan.map(p => `W${p.w}`);
    const datasets = [];
    const colors = { liver:'#ff6384', cardio:'#36a2eb', hemato:'#ff9f40', kidney:'#4bc0c0', neuro:'#9966ff', endo:'#c9cbcf', repro:'#e7e9ed' };
    
    for (let sys in AppState.charts) {
        if (AppState.charts[sys]) {
            const d = AppState.plan.map(p => {
                let sum = 0, cnt = 0;
                for (let k in p.r[sys]) { sum += p.r[sys][k]; cnt++; }
                return cnt ? Math.round(sum / cnt) : 0;
            });
            datasets.push({
                label: sys.toUpperCase(),
                data: d,
                borderColor: colors[sys],
                borderWidth: 2,
                fill: false,
                tension: 0.4
            });
        }
    }
    
    window.myChart = new Chart(ctx, {
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
}

// Render Support
function renderSupport() {
    const div = document.getElementById('support-list');
    if(!div) return;
    div.innerHTML = '';
    DB.support.forEach(b => {
        let itemsHtml = b.items.map(i => `
            <div class="item" style="margin:5px 0; padding:10px;">
                <div><strong>${i.n}</strong> ${i.d}<br><small>${i.m}</small></div>
            </div>
        `).join('');
        div.innerHTML += `<div class="time-block"><h3>${b.t}</h3>${itemsHtml}</div>`;
    });
}

// Fertility Calc
function calcFert() {
    const v = parseFloat(document.getElementById('lab-vol').value) || 0;
    const c = parseFloat(document.getElementById('lab-conc').value) || 0;
    const res = Math.round((v / 1.5) * 20 + (c / 16) * 30);
    const color = res > 50 ? 'var(--sec)' : 'var(--err)';
    document.getElementById('fert-res').innerHTML = `<span style="color:${color}">IF: ${res}/100</span>`;
}

// Render Articles
function renderArticles() {
    const div = document.getElementById('articles-list');
    if(!div) return;
    div.innerHTML = '';
    DB.articles.forEach(a => {
        div.innerHTML += `<div class="item"><div><strong>${a.t}</strong><br><small>${a.c} | 👁 ${a.v}</small></div></div>`;
    });
}

// Render Shop
function renderShop() {
    const div = document.getElementById('shop-list');
    if(!div) return;
    div.innerHTML = '';
    for (let k in DB.shop) {
        DB.shop[k].forEach(i => {
            div.innerHTML += `<div class="item"><div><strong>${k.toUpperCase()}</strong><br>${i.p}</div><div style="color:var(--sec)">${i.pr}</div></div>`;
        });
    }
}

// Render Glossary
function renderGlossary() {
    const div = document.getElementById('glossary-list');
    if(!div) return;
    div.innerHTML = '';
    for (let k in DB.glossary) {
        div.innerHTML += `<div class="item"><strong>${k}</strong><br><small>${DB.glossary[k]}</small></div>`;
    }
}

// Start App when DOM ready
document.addEventListener('DOMContentLoaded', initApp);
APPEOF

# 4. HTML (Clean Structure)
echo "🎨 Updating index.html..."
cat > index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Bode Health v11.0 Ultimate</title>
    <base href="https://thodstein.github.io/Bode_Health/">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<div class="app">
    <header>
        <h1>Bode Health <span style="font-size:0.6em; color:var(--sec)">v11.0</span></h1>
        <div class="xp-badge" id="xp-display">XP: 0</div>
    </header>

    <nav class="tabs">
        <button class="tab-btn active" onclick="switchTab('dashboard')">📊 Главная</button>
        <button class="tab-btn" onclick="switchTab('stack')">💉 Стек</button>
        <button class="tab-btn" onclick="switchTab('risks')">⚠️ Риски</button>
        <button class="tab-btn" onclick="switchTab('support')">💊 Поддержка</button>
        <button class="tab-btn" onclick="switchTab('labs')">🧬 Анализы</button>
        <button class="tab-btn" onclick="switchTab('articles')">📚 Статьи</button>
        <button class="tab-btn" onclick="switchTab('shop')">🛒 Магазин</button>
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
                <select id="sub-select" onchange="loadEsters()"></select>
                
                <label>Эфир</label>
                <select id="est-select" disabled></select>
                
                <div class="row">
                    <input type="number" id="in-dose" placeholder="Доза (мг/нед)">
                </div>
                <div class="row">
                    <input type="number" id="in-start" placeholder="Старт (нед)" value="1">
                    <input type="number" id="in-end" placeholder="Финиш (нед)" value="8">
                </div>
                <button class="btn-pri" onclick="addDrug()">Добавить в курс</button>
            </div>
            <div id="stack-list"></div>
            <button class="btn-sec" onclick="calcPlan()">РАССЧИТАТЬ ДИНАМИКУ</button>
            <div id="plan-msg" style="margin-top:15px; color:var(--sec); font-weight:bold;"></div>
        </div>

        <!-- RISKS -->
        <div id="risks" class="view">
            <h3>Динамика рисков</h3>
            <div class="controls" id="chart-controls"></div>
            <canvas id="trend-chart"></canvas>
            
            <h3>Матрица (Heatmap)</h3>
            <div class="week-nav">
                <button onclick="changeWeek(-1)">◀</button>
                <span id="week-label" style="font-weight:bold; color:var(--sec)">Неделя 1</span>
                <button onclick="changeWeek(1)">▶</button>
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
                <button class="btn-pri" onclick="calcFert()">Рассчитать IF</button>
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

<!-- Scripts in Order -->
<script src="assets/js/core/database.js"></script>
<script src="assets/js/core/engine.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>
HTMLEOF

# 5. CSS
echo "🎨 Updating assets/css/style.css..."
cat > assets/css/style.css << 'CSSEOF'
:root { --bg: #121212; --card: #1e1e1e; --pri: #bb86fc; --sec: #03dac6; --err: #cf6679; --txt: #ffffff; --bor: #333; }
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--txt); padding-bottom: 80px; }
.app { max-width: 900px; margin: 0 auto; }

header { background: var(--card); padding: 15px 20px; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--bor); display: flex; justify-content: space-between; align-items: center; }
h1 { margin: 0; font-size: 1.2rem; color: var(--pri); }
.xp-badge { background: rgba(187, 134, 252, 0.2); color: var(--pri); padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; }

.tabs { display: flex; overflow-x: auto; background: var(--card); position: sticky; top: 60px; z-index: 99; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab-btn { flex: 0 0 auto; padding: 15px 20px; background: none; border: none; color: #888; font-weight: 600; font-size: 0.9rem; border-bottom: 3px solid transparent; cursor: pointer; white-space: nowrap; }
.tab-btn.active { color: var(--sec); border-bottom-color: var(--sec); }

.view { display: none; padding: 20px; animation: fade 0.3s; }
.view.active { display: block; }
@keyframes fade { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
.card { background: var(--card); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid var(--bor); }
.big-val { font-size: 1.8rem; font-weight: bold; color: var(--sec); margin-top: 5px; }

.form-box { background: var(--card); padding: 20px; border-radius: 12px; margin-bottom: 20px; }
label { display: block; margin-bottom: 5px; color: #aaa; font-size: 0.9rem; }
input, select { width: 100%; background: #2c2c2c; border: 1px solid var(--bor); color: #fff; padding: 12px; border-radius: 8px; margin-bottom: 10px; font-size: 1rem; }
.row { display: flex; gap: 10px; }

button { width: 100%; padding: 14px; border: none; border-radius: 8px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: 0.2s; }
.btn-pri { background: var(--pri); color: #000; }
.btn-sec { background: var(--sec); color: #000; margin-top: 10px; }
.btn-del { background: rgba(207, 102, 121, 0.2); color: var(--err); width: auto; padding: 5px 10px; font-size: 0.8rem; }

.item { background: var(--card); padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid var(--sec); display: flex; justify-content: space-between; align-items: center; }
.time-block { background: #252525; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.time-block h3 { color: var(--pri); margin: 0 0 10px; font-size: 0.9rem; text-transform: uppercase; }

.heatmap { display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 6px; margin-top: 15px; }
.hm-cell { padding: 8px; border-radius: 4px; text-align: center; font-size: 0.75rem; color: #fff; cursor: help; }
.week-nav { display: flex; justify-content: center; align-items: center; gap: 20px; margin: 20px 0; }
.week-nav button { width: auto; padding: 5px 15px; background: #333; color: #fff; }

canvas { background: var(--card); border-radius: 12px; padding: 10px; margin-bottom: 20px; }
.controls { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; background: var(--card); padding: 10px; border-radius: 8px; }
.controls label { display: flex; align-items: center; gap: 5px; margin: 0; color: #fff; font-size: 0.85rem; }
CSSEOF

# 6. PUSH
echo "🚀 Committing Stage 9 (Modular Fix)..."
git add -A
git commit -m "Stage 9: Modular Fix (Separate Files, Full DB, Working Buttons)"
git push origin main --force
echo "✅ DONE! Check Actions. Hard Refresh (Ctrl+F5) required!"
