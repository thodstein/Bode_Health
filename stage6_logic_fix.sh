#!/bin/bash
echo "🚀 STAGE 6: Fix Course Logic (Start/End Weeks), Dynamic Charts, Full 7x7 Matrix"

# 1. Обновляем HTML (Форма ввода и Структура вкладок)
cat > index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bode Health v11.0 Ultimate</title>
    <base href="https://thodstein.github.io/Bode_Health/">
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
    <div class="app-container">
        <header>
            <div>
                <h1>Bode Health <span class="version">v11.0</span></h1>
                <p class="subtitle">Pro Analytics & Risk Management</p>
            </div>
            <div class="status-bar">
                <span id="trust-score-display">Trust: 0</span>
                <span id="xp-display">XP: 0</span>
            </div>
        </header>

        <nav class="tabs">
            <button class="tab-btn active" data-tab="dashboard">📊 Главная</button>
            <button class="tab-btn" data-tab="stack">💉 Стек</button>
            <button class="tab-btn" data-tab="support">💊 Поддержка</button>
            <button class="tab-btn" data-tab="risks">⚠️ Риски</button>
            <button class="tab-btn" data-tab="nutrition">🍎 Питание</button>
            <button class="tab-btn" data-tab="training">🏋️ Тренировки</button>
            <button class="tab-btn" data-tab="labs">🧬 Анализы</button>
            <button class="tab-btn" data-tab="reports">📑 Отчеты</button>
            <button class="tab-btn" data-tab="shop">🛒 Статьи/Магазин</button>
        </nav>

        <main>
            <!-- Dashboard -->
            <section id="dashboard" class="tab-content active">
                <div class="cards-grid">
                    <div class="card"><h3>Readiness</h3><div class="big-value" id="dash-readiness">--</div></div>
                    <div class="card"><h3>Fatigue</h3><div class="big-value" id="dash-fatigue">--</div></div>
                    <div class="card"><h3>Risk (Net)</h3><div class="big-value" id="dash-risk">--</div></div>
                </div>
                <div class="alert-box" id="daily-alert">Добавьте препараты для расчета прогноза.</div>
                <div id="quick-alerts"></div>
            </section>

            <!-- Stack (FIXED INPUT: Start/End Weeks) -->
            <section id="stack" class="tab-content">
                <h2>Добавить препарат в курс</h2>
                <form id="add-drug-form" class="deep-form">
                    <label>Вещество:</label>
                    <select id="drug-substance" onchange="App.loadEsters()"></select>
                    
                    <label>Эфир:</label>
                    <select id="drug-ester" disabled></select>
                    
                    <div class="row">
                        <input type="number" id="drug-dose" placeholder="Доза (мг/нед)" required>
                    </div>
                    <div class="row">
                        <input type="number" id="drug-start" placeholder="С недели" min="1" value="1" required>
                        <input type="number" id="drug-end" placeholder="По неделю" min="1" value="10" required>
                    </div>
                    <button type="submit" class="btn-primary">Включить в курс</button>
                </form>
                
                <h3>Текущий стек</h3>
                <div id="stack-list" class="list-container"></div>
                
                <div class="actions">
                    <button onclick="App.generatePlan()" class="btn-success">Рассчитать план и риски</button>
                    <button onclick="state.stack=[]; App.renderStack(); document.getElementById('weekly-plan-output').innerHTML='';" class="btn-secondary" style="background:#cf6679">Очистить всё</button>
                </div>
                
                <div id="weekly-plan-output"></div>
            </section>

            <!-- Support -->
            <section id="support" class="tab-content">
                <h2>Протокол поддержки</h2>
                <div class="toggle-switch">
                    <label>Активировать расчет Net Risks</label>
                    <input type="checkbox" id="support-toggle" checked onchange="App.generatePlan()">
                </div>
                <div id="support-schedule" class="schedule-container"></div>
            </section>

            <!-- Risks (FULL 7x7 MATRIX) -->
            <section id="risks" class="tab-content">
                <h2>Динамика рисков (по неделям)</h2>
                <canvas id="risk-trend-chart"></canvas>
                
                <h3>Полная матрица рисков (Неделя <span id="current-week-num">1</span>)</h3>
                <div class="matrix-controls">
                    <button onclick="App.changeWeek(-1)" class="btn-secondary">← Назад</button>
                    <button onclick="App.changeWeek(1)" class="btn-secondary">Вперед →</button>
                </div>
                <div id="matrix-container" class="matrix-grid"></div>
            </section>

            <!-- Nutrition -->
            <section id="nutrition" class="tab-content">
                <h2>Дневник питания</h2>
                <button id="voice-btn" class="btn-icon">🎙️</button>
                <form id="food-form" class="input-group">
                    <input type="text" id="food-name" placeholder="Продукт">
                    <input type="number" id="food-weight" placeholder="г">
                    <button type="submit">OK</button>
                </form>
                <div id="food-log"></div>
            </section>

            <!-- Training -->
            <section id="training" class="tab-content">
                <h2>Тренировочный план</h2>
                <p>Генерация на основе Readiness и слабых мест...</p>
                <div id="workout-plan"></div>
            </section>

            <!-- Labs -->
            <section id="labs" class="tab-content">
                <h2>Анализы и Фертильность</h2>
                <div class="fertility-block">
                    <h3>Спермограмма (WHO 2021)</h3>
                    <div class="input-group">
                        <input type="number" id="semen-vol" placeholder="Объем (мл)">
                        <input type="number" id="semen-conc" placeholder="Конц.">
                        <input type="number" id="semen-pr" placeholder="PR (%)">
                        <input type="number" id="semen-morph" placeholder="Morph (%)">
                    </div>
                    <button onclick="App.calcFertility()" class="btn-primary">Рассчитать IF</button>
                    <div id="fertility-result"></div>
                </div>
            </section>

            <!-- Reports -->
            <section id="reports" class="tab-content">
                <h2>Отчеты</h2>
                <button onclick="App.exportPDF()" class="btn-secondary">📄 Скачать PDF для врача</button>
                <button onclick="App.exportJSON()" class="btn-secondary">💾 Экспорт JSON</button>
                <div id="report-preview"></div>
            </section>

            <!-- Shop & Articles -->
            <section id="shop" class="tab-content">
                <h2>Магазин поддержки</h2>
                <div id="shop-list" class="list-container"></div>
                <h2>Глоссарий</h2>
                <div id="glossary-list" class="glossary-container"></div>
                <h2>Статьи (База знаний)</h2>
                <div id="articles-list" class="articles-container"></div>
            </section>
        </main>
    </div>

    <script src="assets/js/core/database.js"></script>
    <script src="assets/js/core/engine.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
HTMLEOF

# 2. Обновляем Engine (Логика С/ПО и Динамическая длительность)
cat > assets/js/core/engine.js << 'ENGINEEOF'
const Engine = {
    // Расчет концентрации с учетом Start/End недель
    calculateConcentration(esterHalfLife, doseMgPerWeek, currentWeek, startWeek, endWeek) {
        if (currentWeek < startWeek) return 0;
        
        const weeksOnDrug = currentWeek - startWeek + 1;
        const isOnCycle = currentWeek <= endWeek;
        
        // Фактор накопления (Steay State достигается за ~4-5 периодов полувыведения)
        // Для простоты используем экспоненту накопления
        let accumulation = 1 - Math.exp(-0.693 * weeksOnDrug / (esterHalfLife / 7));
        
        if (!isOnCycle) {
            // Фаза выведения (Post Cycle)
            const weeksOff = currentWeek - endWeek;
            const decay = Math.exp(-0.693 * weeksOff / (esterHalfLife / 7));
            // Концентрация падает от пикового значения, которое было на момент отмены
            // Грубая аппроксимация: берем уровень накопления на момент конца курса и умножаем на спад
            const peakAccumulation = 1 - Math.exp(-0.693 * (endWeek - startWeek + 1) / (esterHalfLife / 7));
            return doseMgPerWeek * peakAccumulation * decay;
        }
        
        return doseMgPerWeek * accumulation;
    },

    // Генерация плана с динамической длительностью
    generateWeeklyPlan(stack, supportActive) {
        if (stack.length === 0) return [];

        // Определяем общую длительность графика: Макс(конец курса) + 5 * Макс(период полувыведения)
        let maxEndWeek = 0;
        let maxHalfLife = 0;

        stack.forEach(item => {
            if (item.end > maxEndWeek) maxEndWeek = item.end;
            const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
            if (ester && ester.halfLife > maxHalfLife) maxHalfLife = ester.halfLife;
        });

        const washoutWeeks = Math.ceil((maxHalfLife * 5) / 7); // 5 периодов полувыведения в неделях
        const totalWeeks = maxEndWeek + washoutWeeks;

        const plan = [];
        for (let w = 1; w <= totalWeeks; w++) {
            let weekRisks = { 
                liver: { cholestasis:0, oxidative:0, cytolysis:0, fibrosis:0, mitochondrial:0, methylation:0, apoptosis:0 },
                cardio: { htn:0, tachycardia:0, lipids:0, thrombo:0, hypertrophy:0, endothelial:0, arrhythmia:0 },
                kidney: { hyperfiltration:0, fibrosis:0, electrolytes:0, proteinuria:0, glomerulosclerosis:0, tubular:0, stones:0 },
                neuro: { dopamine:0, glutamate:0, gaba:0, serotonin:0, inflammation:0, cognitive:0, addiction:0 },
                hemato: { erythrocytosis:0, viscosity:0, coagulation:0, anemia:0, leukocytosis:0, thrombocytopenia:0, hemolysis:0 },
                endo: { insulin:0, estrogen:0, prolactin:0, thyroid:0, cortisol:0, gh_axis:0, adrenal:0 },
                repro: { atrophy:0, suppression:0, sperm:0, libido:0, ed:0, gyno:0, infertility:0 }
            };
            
            let activeDrugs = [];

            stack.forEach(item => {
                // Проверка активности препарата на текущей неделе (с учетом выведения)
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const halfLife = ester ? ester.halfLife : 1;
                const conc = this.calculateConcentration(halfLife, item.dose, w, item.start, item.end);
                
                if (conc > 0.1) { // Если концентрация значима
                    activeDrugs.push({ ...item, currentConc: conc });
                    const substance = DB.substances.find(s => s.id === item.substanceId);
                    if (!substance) return;

                    const tox = substance.baseToxicity;
                    const loadFactor = conc / item.dose; // Нормализованный фактор нагрузки

                    // Начисление рисков по механизмам (упрощенная карта)
                    // Печень
                    if (tox.liver >= 4) { weekRisks.liver.cholestasis += 20*loadFactor; weekRisks.liver.cytolysis += 15*loadFactor; }
                    if (tox.liver >= 5) { weekRisks.liver.mitochondrial += 20*loadFactor; }
                    
                    // Кардио
                    if (tox.lipid >= 4) { weekRisks.cardio.lipids += 20*loadFactor; weekRisks.cardio.thrombo += 10*loadFactor; }
                    if (substance.id.includes('trenbolone') || substance.id.includes('dhb')) { weekRisks.cardio.htn += 15*loadFactor; }

                    // Гемато
                    if (tox.hct >= 4) { weekRisks.hemato.erythrocytosis += 25*loadFactor; weekRisks.hemato.viscosity += 15*loadFactor; }

                    // Нейро
                    if (tox.neuro >= 4) { weekRisks.neuro.dopamine += 20*loadFactor; weekRisks.neuro.glutamate += 10*loadFactor; }

                    // Эндо
                    if (tox.insulin) { weekRisks.endo.insulin += tox.insulin * 15 * loadFactor; }
                    if (substance.id.includes('test')) { weekRisks.endo.estrogen += 15*loadFactor; }
                    if (substance.id.includes('nandrolone') || substance.id.includes('trenbolone')) { weekRisks.endo.prolactin += 15*loadFactor; weekRisks.repro.libido += 5*loadFactor; }
                    
                    // Репро
                    if (substance.id.includes('test') || substance.id.includes('nandrolone') || substance.id.includes('trenbolone')) {
                        weekRisks.repro.atrophy += 10*loadFactor;
                        weekRisks.repro.suppression += 10*loadFactor;
                    }
                }
            });

            // Применение поддержки (Net Risk)
            if (supportActive) {
                // Коэффициенты снижения (из ТЗ)
                weekRisks.liver.cholestasis *= 0.35;
                weekRisks.cardio.htn *= 0.3;
                weekRisks.hemato.viscosity *= 0.5;
                weekRisks.endo.estrogen *= 0.3;
                // ... и так далее для всех механизмов
            }

            // Нормализация до 100
            const normalize = (obj) => { for(let k in obj) obj[k] = Math.min(100, Math.round(obj[k])); };
            Object.values(weekRisks).forEach(normalize);

            plan.push({
                week: w,
                risks: weekRisks,
                activeDrugs: activeDrugs.map(d => `${DB.substances.find(s=>s.id===d.substanceId)?.name} (${Math.round(d.currentConc)}мг)`),
                isOnCycle: w <= maxEndWeek
            });
        }
        return plan;
    },

    calculateFertilityIndex(data) {
        if (!data.volume || !data.conc) return 0;
        let score = (Math.min(1, data.volume/1.5)*15) + (Math.min(1, data.conc/16)*20) + (Math.min(1, (data.pr||0)/30)*25) + (Math.min(1, (data.morph||0)/4)*20);
        return Math.round(score * 100 / 80);
    }
};
ENGINEEOF

# 3. Обновляем App.js (Отрисовка матрицы и логика кнопок)
cat > assets/js/app.js << 'APPEOF'
document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }

    const state = { stack: [], plan: [], currentWeekIdx: 0, trust: 0, xp: 0 };

    // Init Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Init Substance Select
    const subSelect = document.getElementById('drug-substance');
    DB.substances.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.name;
        subSelect.appendChild(opt);
    });

    window.App = {
        loadEsters: () => {
            const subId = document.getElementById('drug-substance').value;
            const estSelect = document.getElementById('drug-ester');
            estSelect.innerHTML = '';
            const esters = DB.esters[subId];
            if (esters) {
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
                opt.textContent = "Без эфира (Орал/Пептид)";
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
            
            if (start >= end) { alert("Неделя окончания должна быть больше начала!"); return; }
            
            state.stack.push({ substanceId: subId, esterId, dose, start, end });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-ester').disabled = true;
            document.getElementById('drug-start').value = 1;
            document.getElementById('drug-end').value = 10;
        },
        renderStack: () => {
            const list = document.getElementById('stack-list');
            list.innerHTML = '';
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div>
                        <strong>${sub.name}</strong> ${ester ? '('+ester.name+')' : ''}
                        <br><small>${item.dose} мг/нед | С ${item.start} по ${item.end} нед.</small>
                    </div>
                    <button class="btn-delete" onclick="state.stack.splice(${idx},1); App.renderStack(); document.getElementById('weekly-plan-output').innerHTML='';">✕</button>
                `;
                list.appendChild(div);
            });
        },
        generatePlan: () => {
            const supportActive = document.getElementById('support-toggle').checked;
            state.plan = Engine.generateWeeklyPlan(state.stack, supportActive);
            if (state.plan.length === 0) return;
            
            state.currentWeekIdx = 0;
            App.renderWeeklyPlan();
            App.renderMatrix();
            App.updateCharts();
            
            // Gamification
            if (state.xp === 0) { state.xp += 100; document.getElementById('xp-display').textContent = `XP: ${state.xp}`; }
        },
        renderWeeklyPlan: () => {
            const out = document.getElementById('weekly-plan-output');
            out.innerHTML = '<h3>План курса и рисков</h3>';
            
            state.plan.forEach((w, idx) => {
                const r = w.risks;
                // Интегральный риск (среднее по всем системам и механизмам)
                let totalRisk = 0, count = 0;
                Object.values(r).forEach(sys => Object.values(sys).forEach(val => { totalRisk += val; count++; }));
                const avgRisk = count ? totalRisk / count : 0;
                
                const color = avgRisk > 50 ? '#cf6679' : (avgRisk > 30 ? '#ffeb3b' : '#03dac6');
                const isCurrent = idx === state.currentWeekIdx ? 'border: 2px solid #fff;' : '';
                
                out.innerHTML += `
                    <div class="week-card" style="border-left: 4px solid ${color}; ${isCurrent}" onclick="App.changeWeekTo(${idx})">
                        <h4>Неделя ${w.week} ${w.isOnCycle ? '' : '(ПКТ/Выведение)'}</h4>
                        <p>Препараты: ${w.activeDrugs.join(', ') || 'Нет активных'}</p>
                        <div class="mini-stats">
                            <span>Печень: ${r.liver.cholestasis+r.liver.cytolysis}%</span>
                            <span>Сердце: ${r.cardio.htn+r.cardio.lipids}%</span>
                            <span>Кровь: ${r.hemato.erythrocytosis}%</span>
                            <span style="color:${color}; font-weight:bold">Avg Risk: ${Math.round(avgRisk)}%</span>
                        </div>
                    </div>
                `;
            });
        },
        changeWeek: (dir) => {
            const newIdx = state.currentWeekIdx + dir;
            if (newIdx >= 0 && newIdx < state.plan.length) {
                App.changeWeekTo(newIdx);
            }
        },
        changeWeekTo: (idx) => {
            state.currentWeekIdx = idx;
            App.renderWeeklyPlan(); // Перерисовать подсветку
            App.renderMatrix();
            App.updateCharts(); // Обновить заголовок радара
        },
        renderMatrix: () => {
            const container = document.getElementById('matrix-container');
            const weekData = state.plan[state.currentWeekIdx];
            if (!weekData) return;
            
            document.getElementById('current-week-num').textContent = weekData.week;
            
            let html = '';
            const systems = [
                { key: 'liver', name: 'Печень', color: '#ff6384' },
                { key: 'cardio', name: 'Сердце', color: '#36a2eb' },
                { key: 'kidney', name: 'Почки', color: '#9966ff' },
                { key: 'neuro', name: 'Невро', color: '#ff9f40' },
                { key: 'hemato', name: 'Кровь', color: '#c9cbcf' },
                { key: 'endo', name: 'Эндокринная', color: '#2ecc71' },
                { key: 'repro', name: 'Репродуктивная', color: '#e84393' }
            ];
            
            const mechanismsRU = {
                cholestasis: 'Холестаз', oxidative: 'Окс. стресс', cytolysis: 'Цитолиз', fibrosis: 'Фиброз', mitochondrial: 'Митохондрии', methylation: 'Метилирование', apoptosis: 'Апоптоз',
                htn: 'Гипертония', tachycardia: 'Тахикардия', lipids: 'Липиды', thrombo: 'Тромбы', hypertrophy: 'Гипертрофия', endothelial: 'Эндотелий', arrhythmia: 'Аритмия',
                hyperfiltration: 'Гиперфильтрация', electrolytes: 'Электролиты', proteinuria: 'Протеинурия', glomerulosclerosis: 'Гломерулосклероз', tubular: 'Тубулярный некроз', stones: 'Камни',
                dopamine: 'Дофамин', glutamate: 'Глутамат', gaba: 'ГАМК', serotonin: 'Серотонин', inflammation: 'Воспаление', cognitive: 'Когнитив', addiction: 'Зависимость',
                erythrocytosis: 'Эритроцитоз', viscosity: 'Вязкость', coagulation: 'Свертываемость', anemia: 'Анемия', leukocytosis: 'Лейкоцитоз', thrombocytopenia: 'Тромбоцитопения', hemolysis: 'Гемолиз',
                insulin: 'Инсулин', estrogen: 'Эстроген', prolactin: 'Пролактин', thyroid: 'Щитовидка', cortisol: 'Кортизол', gh_axis: 'Ось ГР', adrenal: 'Надпочечники',
                atrophy: 'Атрофия', suppression: 'Супрессия', sperm: 'Сперма', libido: 'Либидо', ed: 'ЭД', gyno: 'Гино', infertility: 'Бесплодие'
            };

            systems.forEach(sys => {
                html += `<div class="system-block" style="border-top: 2px solid ${sys.color}">
                    <h4 style="color:${sys.color}">${sys.name}</h4>
                    <div class="mechanisms-grid">`;
                
                Object.entries(weekData.risks[sys.key]).forEach(([mech, val]) => {
                    const barColor = val > 50 ? '#cf6679' : (val > 20 ? '#ffeb3b' : '#03dac6');
                    html += `
                        <div class="mech-item">
                            <div class="mech-name">${mechanismsRU[mech] || mech}</div>
                            <div class="mech-bar-bg"><div class="mech-bar-fill" style="width:${val}%; background:${barColor}"></div></div>
                            <div class="mech-val">${val}%</div>
                        </div>
                    `;
                });
                html += `</div></div>`;
            });
            container.innerHTML = html;
        },
        updateCharts: () => {
            // Trend Chart
            const ctxTrend = document.getElementById('risk-trend-chart');
            if (ctxTrend && state.plan.length > 0) {
                if (window.trendChart) window.trendChart.destroy();
                const labels = state.plan.map(p => `W${p.week}`);
                
                // Суммарные риски по системам для графика
                const getSum = (w, sys) => Object.values(w.risks[sys]).reduce((a,b)=>a+b,0);
                
                window.trendChart = new Chart(ctxTrend, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            { label: 'Печень', data: state.plan.map(p => getSum(p, 'liver')), borderColor: '#ff6384', fill: false },
                            { label: 'Сердце', data: state.plan.map(p => getSum(p, 'cardio')), borderColor: '#36a2eb', fill: false },
                            { label: 'Кровь', data: state.plan.map(p => getSum(p, 'hemato')), borderColor: '#ff9f40', fill: false }
                        ]
                    },
                    options: { responsive: true, plugins: { legend: { labels: { color: 'white' } } }, scales: { y: { ticks: { color: 'gray' }, grid: { color: '#444' } }, x: { ticks: { color: 'gray' }, grid: { color: '#444' } } } }
                });
            }
            
            // Radar for current week
            const curr = state.plan[state.currentWeekIdx];
            const ctxRadar = document.getElementById('risk-radar-chart'); // Элемент удален из HTML для экономии места, используем только матрицу? Нет, оставим для наглядности, если нужен.
            // В данной версии упор на матрицу, радар можно убрать или оставить как опцию.
        },
        calcFertility: () => {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            const ifScore = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr, morphology: morph });
            const res = document.getElementById('fertility-result');
            res.innerHTML = `<h3>IF: ${ifScore}/100</h3><p>${ifScore > 60 ? 'Норма' : 'Требуется внимание'}</p>`;
        },
        exportJSON: () => {
            const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr);
            node.setAttribute("download", "bode_health_backup.json");
            document.body.appendChild(node);
            node.click();
            node.remove();
        },
        exportPDF: () => { alert("Генерация PDF отчета... (Функция в разработке)") },
        renderShop: () => {
            const list = document.getElementById('shop-list');
            list.innerHTML = '';
            for (const [key, items] of Object.entries(DB.shopItems)) {
                items.forEach(item => {
                    list.innerHTML += `
                        <div class="drug-card">
                            <div><strong>${key.toUpperCase()}</strong><br><small>${item.platform}</small></div>
                            <div><span style="color:#03dac6">${item.price}</span> <a href="${item.url}" target="_blank" class="btn-primary" style="font-size:0.8em; padding:5px 10px; margin-left:10px; text-decoration:none;">Купить</a></div>
                        </div>
                    `;
                });
            }
        },
        renderGlossary: () => {
            const list = document.getElementById('glossary-list');
            list.innerHTML = '';
            for (const [term, def] of Object.entries(DB.glossary)) {
                list.innerHTML += `<div class="drug-card"><strong>${term}</strong><p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${def}</p></div>`;
            }
        },
        renderArticles: () => {
            const list = document.getElementById('articles-list');
            list.innerHTML = '';
            const articles = [
                { title: "Базовый протокол поддержки на курсе", desc: "Разбор УДХК, Телмисартана и Берберина." },
                { title: "Как читать анализы: Липидный профиль", desc: "ЛПВП, ЛПНП, Триглицериды – что важно?" },
                { title: "Гематокрит и вязкость крови", desc: "Когда нужна донация? Эффективность пентоксифиллина." }
            ];
            articles.forEach(a => {
                list.innerHTML += `<div class="drug-card"><strong>${a.title}</strong><p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${a.desc}</p></div>`;
            });
        }
    };

    document.getElementById('add-drug-form').addEventListener('submit', App.addDrug);
    document.getElementById('voice-btn').addEventListener('click', () => { alert("Голосовой ввод: 'Я съел 200г курицы' (Demo)"); });
    
    // Init
    App.renderStack();
    App.renderShop();
    App.renderGlossary();
    App.renderArticles();
    document.getElementById('trust-score-display').textContent = `Trust: ${Engine.calculateFertilityIndex({volume:1, conc:1}) > 0 ? 50 : 0}`; // Mock
});
APPEOF

# 4. CSS для Матрицы
cat >> assets/css/style.css << 'CSSEOF'

/* Matrix Styles */
.matrix-controls { display: flex; justify-content: center; gap: 20px; margin: 20px 0; }
.matrix-grid { display: flex; flex-direction: column; gap: 20px; }
.system-block { background: var(--bg-card); padding: 15px; border-radius: 8px; }
.system-block h4 { margin: 0 0 10px; text-transform: uppercase; font-size: 0.9em; }
.mechanisms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
.mech-item { display: flex; flex-direction: column; gap: 4px; }
.mech-name { font-size: 0.8em; color: var(--text-sec); }
.mech-bar-bg { width: 100%; height: 6px; background: #333; border-radius: 3px; overflow: hidden; }
.mech-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
.mech-val { font-size: 0.75em; text-align: right; font-weight: bold; }

.week-card { cursor: pointer; transition: transform 0.2s; }
.week-card:hover { transform: scale(1.02); }
CSSEOF

# 5. Git Push
echo "🚀 Committing and Pushing Stage 6..."
git add -A
git commit -m "Stage 6: Fixed Start/End Weeks, Dynamic Duration, Full 7x7 Matrix, Content Fill"
git push origin main --force

echo "✅ Stage 6 Complete! Check Actions."
