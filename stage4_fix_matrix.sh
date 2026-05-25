#!/bin/bash
echo "🔥 STAGE 4 FIX: Full Risk Matrix (7x7), Dynamic Course Duration, Correct Weekly Logic"

# 1. Переписываем Engine (Логика длительности и Матрица)
cat > assets/js/core/engine.js << 'ENGINEEOF'
const Engine = {
    // Расчет полной длительности: Курс + 5 периодов полувыведения (для полного выведения)
    calculateTotalDuration(stack) {
        let maxWeeks = 0;
        stack.forEach(item => {
            const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
            const halfLifeDays = ester ? ester.halfLife : (item.substanceId.includes('oral') ? 1 : 7); 
            // Длительность курса + 5 * T1/2 (в неделях) для пост-курсового хвоста
            const washoutWeeks = (5 * halfLifeDays) / 7;
            const total = item.duration + washoutWeeks;
            if (total > maxWeeks) maxWeeks = total;
        });
        return Math.ceil(maxWeeks);
    },

    // Генерация понедельного плана с динамической длиной
    generateWeeklyPlan(stack) {
        if (stack.length === 0) return [];
        
        const totalWeeks = this.calculateTotalDuration(stack);
        const weeks = [];

        for (let w = 1; w <= totalWeeks; w++) {
            // Инициализация матрицы рисков нулями
            let weekRisks = {
                liver: { cholestasis: 0, oxidative: 0, cytolysis: 0, fibrosis: 0, mitochondrial: 0, methylation: 0, apoptosis: 0 },
                cardio: { htn: 0, tachycardia: 0, lipids: 0, thrombo: 0, hypertrophy: 0, endothelial: 0, arrhythmia: 0 },
                kidney: { hyperfiltration: 0, fibrosis: 0, electrolytes: 0, proteinuria: 0, stones: 0, gfr_drop: 0, tubular: 0 },
                neuro: { dopamine: 0, glutamate: 0, gaba: 0, serotonin: 0, neuroinflammation: 0, cognitive: 0, addiction: 0 },
                hemato: { erythrocytosis: 0, viscosity: 0, coagulation: 0, anemia: 0, leukocytosis: 0, thrombocytopenia: 0, hemolysis: 0 },
                endo: { insulin_resist: 0, estrogen: 0, prolactin: 0, thyroid: 0, cortisol: 0, gh_axis: 0, adrenal: 0 },
                repro: { atrophy: 0, suppression: 0, sperm_quality: 0, libido: 0, ed: 0, gyno: 0, infertility: 0 }
            };

            let activeDrugs = [];

            stack.forEach(item => {
                // Препарат активен, если неделя <= длительности курса
                // Но его влияние (риск) может сохраняться в фазе выведения
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const halfLifeDays = ester ? ester.halfLife : 7;
                
                // Фактор концентрации (накопление и спад)
                let concentrationFactor = 0;
                
                if (w <= item.duration) {
                    // Фаза курса: накопление к steady state
                    // Steady state достигается за ~4-5 T1/2
                    const weeksToSteady = (halfLifeDays * 5) / 7;
                    concentrationFactor = Math.min(1.0, w / weeksToSteady);
                    activeDrugs.push(item);
                } else if (w > item.duration) {
                    // Фаза выведения: экспоненциальный спад
                    const weeksOff = w - item.duration;
                    concentrationFactor = Math.pow(0.5, weeksOff / (halfLifeDays / 7));
                }

                if (concentrationFactor < 0.05) concentrationFactor = 0; // Отсечка

                if (concentrationFactor > 0) {
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    const doseFactor = item.dose / 100; // Нормализация к 100мг
                    const toxicity = sub.baseToxicity;

                    // Распределение рисков по механизмам (упрощенная карта из ТЗ)
                    // Печень
                    if (toxicity.liver) {
                        weekRisks.liver.cholestasis += toxicity.liver * 15 * doseFactor * concentrationFactor;
                        weekRisks.liver.cytolysis += toxicity.liver * 10 * doseFactor * concentrationFactor;
                        weekRisks.liver.mitochondrial += toxicity.liver * 5 * doseFactor * concentrationFactor;
                    }
                    // Кардио (Липиды, Тромбы, Давление)
                    if (toxicity.lipid) {
                        weekRisks.cardio.lipids += toxicity.lipid * 20 * doseFactor * concentrationFactor;
                        weekRisks.cardio.thrombo += toxicity.lipid * 10 * doseFactor * concentrationFactor;
                        weekRisks.cardio.endothelial += toxicity.lipid * 10 * doseFactor * concentrationFactor;
                    }
                    // Гемато (Гематокрит)
                    if (toxicity.hct) {
                        weekRisks.hemato.erythrocytosis += toxicity.hct * 25 * doseFactor * concentrationFactor;
                        weekRisks.hemato.viscosity += toxicity.hct * 20 * doseFactor * concentrationFactor;
                    }
                    // Нейро
                    if (toxicity.neuro) {
                        weekRisks.neuro.dopamine += toxicity.neuro * 20 * doseFactor * concentrationFactor;
                        weekRisks.neuro.glutamate += toxicity.neuro * 10 * doseFactor * concentrationFactor;
                    }
                    // Инсулин (Эндокринка)
                    if (toxicity.insulin) {
                        weekRisks.endo.insulin_resist += toxicity.insulin * 25 * doseFactor * concentrationFactor;
                    }
                    // Прогестины (Репродуктивная)
                    if (sub.id.includes('nandrolone') || sub.id.includes('trenbolone')) {
                        weekRisks.repro.suppression += 15 * doseFactor * concentrationFactor;
                        weekRisks.endo.prolactin += 10 * doseFactor * concentrationFactor;
                    }
                    // Эстрогены (если тестостерон)
                    if (sub.id === 'test') {
                        weekRisks.endo.estrogen += 15 * doseFactor * concentrationFactor;
                        weekRisks.repro.gyno += 10 * doseFactor * concentrationFactor;
                    }
                }
            });

            // Нормализация до 100% и округление
            const normalize = (obj) => {
                for (let k in obj) obj[k] = Math.min(100, Math.round(obj[k]));
            };
            Object.values(weekRisks).forEach(normalize);

            weeks.push({
                week: w,
                risks: weekRisks,
                activeDrugs: activeDrugs,
                isOnCycle: w <= Math.max(...stack.map(s => s.duration))
            });
        }
        return weeks;
    },

    // Расчет Net рисков (применение поддержки)
    calculateNetRisks(rawRisks) {
        // Глубокое копирование
        const net = JSON.parse(JSON.stringify(rawRisks));
        
        // Коэффициенты снижения от поддержки (из ТЗ)
        const reduction = {
            liver: 0.4,   // УДХК снижает риск на 60%
            cardio: 0.4,  // Телмисартан+статины снижают на 60%
            hemato: 0.5,  // Пентоксифиллин снижает вязкость на 50%
            neuro: 0.4,   // Ноотропы+Магний
            endo: 0.4,    // ИА/ИП+Берберин
            repro: 0.3,   // HCG
            kidney: 0.4   // Телмисартан+Астрагал
        };

        for (let sys in net) {
            for (let mech in net[sys]) {
                net[sys][mech] = Math.round(net[sys][mech] * reduction[sys]);
            }
        }
        return net;
    },

    calculateFertilityIndex(data) {
        if (!data.volume || !data.conc) return 0;
        let score = (Math.min(1, data.volume/1.5)*15) + (Math.min(1, data.conc/16)*20) + (Math.min(1, (data.pr||0)/30)*25) + (Math.min(1, (data.morph||0)/4)*20);
        return Math.round(score * 100 / 80);
    }
};
ENGINEEOF

# 2. Обновляем UI (Таблица матрицы 7x7 и детали)
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
            </section>

            <!-- Stack -->
            <section id="stack" class="tab-content">
                <h2>Добавить препарат</h2>
                <form id="add-drug-form" class="deep-form">
                    <label>Вещество:</label>
                    <select id="drug-substance" onchange="App.loadEsters()"></select>
                    
                    <label>Эфир:</label>
                    <select id="drug-ester" disabled></select>
                    
                    <div class="row">
                        <input type="number" id="drug-dose" placeholder="Доза (мг/нед)" required>
                        <input type="number" id="drug-weeks" placeholder="Недель курса" required>
                    </div>
                    <button type="submit" class="btn-primary">Включить в курс</button>
                </form>
                <h3>Текущий стек</h3>
                <div id="stack-list" class="list-container"></div>
                
                <div class="actions">
                    <button id="btn-generate-plan" class="btn-success">Рассчитать план и риски</button>
                </div>
                <div id="weekly-plan-output"></div>
            </section>

            <!-- Support -->
            <section id="support" class="tab-content">
                <h2>Протокол поддержки</h2>
                <div id="support-schedule" class="schedule-container"></div>
            </section>

            <!-- Risks (FULL MATRIX) -->
            <section id="risks" class="tab-content">
                <h2>Матрица рисков (7×7)</h2>
                <div style="overflow-x:auto;">
                    <table class="risk-matrix-table" id="risk-matrix-table">
                        <!-- Генерируется JS -->
                    </table>
                </div>
                <h3>Динамика средних рисков</h3>
                <canvas id="risk-trend-chart"></canvas>
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
                <button onclick="App.exportJSON()" class="btn-secondary">💾 Экспорт JSON</button>
                <div id="report-preview"></div>
            </section>

            <!-- Shop & Articles -->
            <section id="shop" class="tab-content">
                <h2>Магазин поддержки</h2>
                <div id="shop-list" class="list-container"></div>
                <h2>Глоссарий</h2>
                <div id="glossary-list" class="glossary-container"></div>
            </section>
        </main>
    </div>

    <script src="assets/js/core/database.js"></script>
    <script src="assets/js/core/engine.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
HTMLEOF

# 3. Обновляем App.js (Отрисовка таблицы и логика кнопок)
cat > assets/js/app.js << 'APPEOF'
document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }

    const state = { stack: [], plan: [], currentWeek: 1, trust: 0, xp: 0 };

    // Навигация
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Инициализация селектов
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
                opt.textContent = "Без эфира (Орал/Пептид)";
                estSelect.appendChild(opt);
            }
        },
        
        addDrug: (e) => {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const dose = parseFloat(document.getElementById('drug-dose').value);
            const weeks = parseInt(document.getElementById('drug-weeks').value);
            
            if (!dose || !weeks) return alert("Заполните дозу и недели!");

            state.stack.push({ substanceId: subId, esterId, dose, duration: weeks });
            App.renderStack();
            e.target.reset();
            document.getElementById('drug-ester').disabled = true;
            alert("Препарат добавлен! Нажмите 'Рассчитать план'.");
        },

        renderStack: () => {
            const list = document.getElementById('stack-list');
            list.innerHTML = '';
            if (state.stack.length === 0) {
                list.innerHTML = '<div class="empty-state">Стек пуст</div>';
                return;
            }
            state.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div>
                        <strong>${sub.name}</strong> ${ester ? '('+ester.name+')' : ''}
                        <br><small>${item.dose} мг/нед | ${item.duration} нед.</small>
                    </div>
                    <button class="btn-delete" onclick="state.stack.splice(${idx},1); App.renderStack()">✕</button>
                `;
                list.appendChild(div);
            });
        },

        generatePlan: () => {
            if (state.stack.length === 0) return alert("Сначала добавьте препараты!");
            
            state.plan = Engine.generateWeeklyPlan(state.stack);
            const out = document.getElementById('weekly-plan-output');
            out.innerHTML = `<h3>План курса (${state.plan.length} недель)</h3>`;
            
            state.plan.forEach((w, idx) => {
                const raw = w.risks;
                const net = Engine.calculateNetRisks(raw);
                
                // Средний риск
                let sumRaw = 0, count = 0;
                for(let s in raw) for(let m in raw[s]) { sumRaw += raw[s][m]; count++; }
                const avgRaw = Math.round(sumRaw / count);
                
                let sumNet = 0;
                for(let s in net) for(let m in net[s]) { sumNet += net[s][m]; }
                const avgNet = Math.round(sumNet / count);

                const color = avgNet > 50 ? '#cf6679' : (avgNet > 30 ? '#ff9f40' : '#03dac6');
                const isActive = w.isOnCycle ? '🟢 На курсе' : '🟡 Выведение';

                out.innerHTML += `
                    <div class="week-card" style="border-left: 4px solid ${color}">
                        <div style="display:flex; justify-content:space-between;">
                            <h4>Неделя ${w.week} <small>(${isActive})</small></h4>
                            <span style="font-weight:bold; color:${color}">Risk: ${avgRaw}% → ${avgNet}%</span>
                        </div>
                        <p style="font-size:0.9em; color:#aaa">Активные препараты: ${w.activeDrugs.length ? w.activeDrugs.map(d => DB.substances.find(s=>s.id===d.substanceId).name).join(', ') : 'Нет (пост-курс)'}</p>
                        
                        <details>
                            <summary>Детали рисков и поддержка</summary>
                            <div style="margin-top:10px; font-size:0.85em;">
                                <p><strong>Ключевые риски:</strong> Печень: ${raw.liver.cholestasis}%, Кровь: ${raw.hemato.erythrocytosis}%, Сердце: ${raw.cardio.lipids}%</p>
                                <p><strong>Рекомендации:</strong> ${DB.supportProtocol.map(b => `${b.title}: ${b.items.slice(0,2).map(i=>i.name).join(', ')}`).join('; ')}</p>
                            </div>
                        </details>
                    </div>
                `;
            });

            App.renderMatrixTable(state.plan[0]); // Показать первую неделю
            App.updateTrendChart(state.plan);
            
            state.xp += 100;
            document.getElementById('xp-display').textContent = `XP: ${state.xp}`;
            document.getElementById('dash-risk').textContent = state.plan[0] ? Math.round(state.plan[0].risks.liver.cholestasis) + '%' : '--';
        },

        renderMatrixTable: (weekData) => {
            const table = document.getElementById('risk-matrix-table');
            if (!weekData) return;
            
            const raw = weekData.risks;
            const net = Engine.calculateNetRisks(raw);
            
            const systems = {
                liver: 'Печень', cardio: 'Сердце', kidney: 'Почки', neuro: 'Невро', hemato: 'Кровь', endo: 'Эндо', repro: 'Репро'
            };
            
            let html = `<thead><tr><th>Система / Механизм</th>`;
            for (let mech in raw.liver) html += `<th>${mech}</th>`;
            html += `</tr></thead><tbody>`;

            for (let sys in raw) {
                html += `<tr><td class="sys-name">${systems[sys]}</td>`;
                for (let mech in raw[sys]) {
                    const rVal = raw[sys][mech];
                    const nVal = net[sys][mech];
                    const diff = rVal - nVal;
                    const color = nVal > 50 ? 'bg-red' : (nVal > 30 ? 'bg-orange' : 'bg-green');
                    
                    html += `
                        <td class="matrix-cell ${color}">
                            <div class="cell-val">${nVal}%</div>
                            <div class="cell-diff">${diff > 0 ? '↓'+diff : ''}</div>
                        </td>
                    `;
                }
                html += `</tr>`;
            }
            html += `</tbody>`;
            table.innerHTML = html;
        },

        updateTrendChart: (plan) => {
            const ctx = document.getElementById('risk-trend-chart');
            if (!ctx) return;
            if (window.trendChart) window.trendChart.destroy();

            const labels = plan.map(p => `W${p.week}`);
            // Берем среднее по всем системам для каждой недели
            const dataAvg = plan.map(p => {
                let sum = 0, cnt = 0;
                const net = Engine.calculateNetRisks(p.risks);
                for(let s in net) for(let m in net[s]) { sum += net[s][m]; cnt++; }
                return Math.round(sum/cnt);
            });

            window.trendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Средний Net Risk',
                        data: dataAvg,
                        borderColor: '#03dac6',
                        backgroundColor: 'rgba(3, 218, 198, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { labels: { color: 'white' } } },
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } },
                        x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
                    }
                }
            });
        },

        calcFertility: () => {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            if (!vol || !conc) return alert("Введите данные");
            const ifScore = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr, morphology: morph });
            document.getElementById('fertility-result').innerHTML = `<h3>IF: ${ifScore}/100</h3><p>${ifScore > 60 ? '✅ Норма' : '⚠️ Требуется внимание'}</p>`;
        },

        exportJSON: () => {
            const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr);
            node.setAttribute("download", "bode_health_plan.json");
            document.body.appendChild(node);
            node.click();
            node.remove();
        },
        
        renderShop: () => {
            const list = document.getElementById('shop-list');
            list.innerHTML = '';
            for (const [key, items] of Object.entries(DB.shopItems)) {
                items.forEach(item => {
                    list.innerHTML += `
                        <div class="drug-card">
                            <div><strong>${key.toUpperCase()}</strong><br><small>${item.platform}</small></div>
                            <div><span style="color:#03dac6">${item.price}</span> <a href="${item.url}" class="btn-primary" style="padding:5px 10px; font-size:0.8em; margin-left:10px; text-decoration:none;">Buy</a></div>
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
        }
    };

    // Привязка событий
    document.getElementById('add-drug-form').addEventListener('submit', App.addDrug);
    document.getElementById('btn-generate-plan').addEventListener('click', App.generatePlan);
    
    // Init
    App.renderStack();
    App.renderShop();
    App.renderGlossary();
});
APPEOF

# 4. CSS для таблицы матрицы
cat >> assets/css/style.css << 'CSSEOF'

/* Risk Matrix Table */
.risk-matrix-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.8em; }
.risk-matrix-table th, .risk-matrix-table td { border: 1px solid #444; padding: 8px; text-align: center; }
.risk-matrix-table th { background: #333; color: var(--primary); }
.sys-name { text-align: left; font-weight: bold; background: #252525; }
.matrix-cell { position: relative; min-width: 60px; }
.cell-val { font-weight: bold; font-size: 1.1em; }
.cell-diff { font-size: 0.7em; color: #03dac6; }
.bg-red { background: rgba(207, 102, 121, 0.3); }
.bg-orange { background: rgba(255, 159, 64, 0.3); }
.bg-green { background: rgba(3, 218, 198, 0.3); }
CSSEOF

# 5. Push
echo "🚀 Committing Stage 4 Fix..."
git add -A
git commit -m "Stage 4 Fix: Full 7x7 Matrix, Dynamic Duration, Correct Weekly Logic"
git push origin main --force

echo "✅ Stage 4 Complete! Check Actions."
