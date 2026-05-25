#!/bin/bash
echo "🚀 STAGE 7: Fixing Buttons, Gamification, Predictive Analytics & What-If"

# 1. Обновляем App.js с исправлением кнопок и новой логикой
echo "🔧 Fixing Button Logic & Adding New Features..."
cat > assets/js/app.js << 'APPEOF'
// Глобальное состояние
window.AppState = {
    stack: [],
    plan: [],
    currentWeekIdx: 0,
    xp: 0,
    level: 1,
    chartVisibility: { liver:true, cardio:true, hemato:true, neuro:false, kidney:false, endo:false, repro:false },
    whatIfTempStack: null
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized");
    
    // Telegram Init
    if (window.Telegram && window.Telegram.WebApp) { 
        window.Telegram.WebApp.ready(); 
        window.Telegram.WebApp.expand(); 
    }

    // --- ИНИЦИАЛИЗАЦИЯ UI ---
    
    // 1. Табы
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Если перешли на вкладку рисков, перерисовываем графики (фикс бака с размером canvas)
            if(tabId === 'risks' && AppState.plan.length > 0) {
                setTimeout(() => { App.renderTrendChart(); App.renderHeatmap(); }, 100);
            }
        });
    });

    // 2. Выпадающий список веществ
    const subSelect = document.getElementById('drug-substance');
    if(subSelect) {
        DB.substances.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            subSelect.appendChild(opt);
        });
        subSelect.addEventListener('change', App.loadEsters);
    }

    // 3. Форма добавления препарата
    const form = document.getElementById('add-drug-form');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            App.addDrug();
        });
    }

    // 4. Кнопка расчета
    const calcBtn = document.querySelector('#stack .btn-success');
    if(calcBtn) calcBtn.addEventListener('click', App.generatePlan);

    // Рендер начальных данных
    App.renderStack();
    App.renderShop();
    App.renderGlossary();
    App.updateGamificationUI();
});

// --- ЛОГИКА ПРИЛОЖЕНИЯ (Глобальный объект App) ---
window.App = {
    loadEsters: function() {
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
            opt.textContent = "Без эфира";
            estSelect.appendChild(opt);
        }
    },

    addDrug: function() {
        const subId = document.getElementById('drug-substance').value;
        const esterId = document.getElementById('drug-ester').value;
        const doseVal = document.getElementById('drug-dose').value;
        const startVal = document.getElementById('drug-start').value;
        const endVal = document.getElementById('drug-end').value;

        if(!subId || !doseVal) return alert("Заполните поля!");
        
        const dose = parseFloat(doseVal);
        const start = parseInt(startVal);
        const end = parseInt(endVal);
        
        if (start >= end) return alert('Неделя финиша должна быть больше старта!');
        
        AppState.stack.push({ 
            id: Date.now(), 
            substanceId: subId, 
            esterId, 
            dose, 
            startWeek: start, 
            endWeek: end 
        });
        
        this.renderStack();
        
        // Сброс формы
        document.getElementById('drug-dose').value = '';
        document.getElementById('drug-start').value = '1';
        document.getElementById('drug-end').value = '8';
        document.getElementById('drug-ester').disabled = true;
        
        // Геймификация
        this.addXP(50);
    },

    renderStack: function() {
        const list = document.getElementById('stack-list');
        if(!list) return;
        list.innerHTML = '';
        if(AppState.stack.length === 0) {
            list.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Стек пуст</div>';
            return;
        }
        
        AppState.stack.forEach((item, idx) => {
            const sub = DB.substances.find(s => s.id === item.substanceId);
            const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
            const div = document.createElement('div');
            div.className = 'drug-card';
            div.innerHTML = `
                <div>
                    <strong>${sub ? sub.name : 'Unknown'}</strong> 
                    ${ester ? '('+ester.name+')':''}
                    <br><small>${item.dose}мг | Недели ${item.startWeek}-${item.endWeek}</small>
                </div>
                <button class="btn-delete" onclick="App.removeDrug(${idx})">✕</button>
            `;
            list.appendChild(div);
        });
    },

    removeDrug: function(idx) {
        AppState.stack.splice(idx, 1);
        this.renderStack();
        if(AppState.plan.length > 0) this.generatePlan(); // Пересчет если был план
    },

    generatePlan: function() {
        if(AppState.stack.length === 0) return alert("Добавьте препараты!");
        
        AppState.plan = Engine.generateWeeklyPlan(AppState.stack, 24);
        AppState.currentWeekIdx = 0;
        
        const output = document.getElementById('weekly-plan-output');
        if(output) {
            output.innerHTML = `
                <div style="background:#1e3a3a; padding:15px; border-radius:8px; margin-top:15px; border:1px solid #03dac6">
                    <h3 style="margin:0; color:#03dac6">✅ План рассчитан</h3>
                    <p>Длительность: ${AppState.plan.length} недель (вкл. выведение)</p>
                    <p>Перейдите во вкладку <b>Риски</b> для детального анализа.</p>
                </div>
            `;
        }
        
        this.renderHeatmap();
        this.renderTrendChart();
        this.addXP(100);
        
        // Автопереход на риски (опционально)
        // document.querySelector('[data-tab="risks"]').click();
    },

    changeWeek: function(dir) {
        if (!AppState.plan.length) return;
        AppState.currentWeekIdx += dir;
        if (AppState.currentWeekIdx < 0) AppState.currentWeekIdx = 0;
        if (AppState.currentWeekIdx >= AppState.plan.length) AppState.currentWeekIdx = AppState.plan.length - 1;
        this.renderHeatmap();
    },

    toggleChart: function(sys) {
        AppState.chartVisibility[sys] = !AppState.chartVisibility[sys];
        this.renderTrendChart();
    },

    renderHeatmap: function() {
        if (!AppState.plan.length) return;
        const weekData = AppState.plan[AppState.currentWeekIdx];
        const display = document.getElementById('current-week-display');
        if(display) display.textContent = `Неделя ${weekData.week}`;
        
        const container = document.getElementById('heatmap-container');
        if(!container) return;
        container.innerHTML = '';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(90px, 1fr))';
        container.style.gap = '8px';

        for (let sys in DB.riskMatrix) {
            // Заголовок системы
            const sysDiv = document.createElement('div');
            sysDiv.style.gridColumn = '1 / -1';
            sysDiv.style.marginTop = '15px';
            sysDiv.style.marginBottom = '5px';
            sysDiv.style.color = '#bb86fc';
            sysDiv.style.fontWeight = 'bold';
            sysDiv.style.borderBottom = '1px solid #333';
            sysDiv.textContent = sys.toUpperCase();
            container.appendChild(sysDiv);

            // Ячейки механизмов
            DB.riskMatrix[sys].mechanisms.forEach(mech => {
                const val = weekData.risks[sys][mech.id] || 0;
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                cell.style.backgroundColor = Engine.getRiskColor(val);
                cell.style.padding = '8px';
                cell.style.borderRadius = '6px';
                cell.style.color = val > 60 ? '#000' : '#fff';
                cell.style.textAlign = 'center';
                cell.style.fontSize = '0.75em';
                cell.style.cursor = 'help';
                cell.title = `${mech.name}: ${mech.desc}\nРиск: ${val}%`;
                cell.innerHTML = `<div style="opacity:0.9">${mech.name}</div><div style="font-weight:bold; font-size:1.1em">${val}%</div>`;
                container.appendChild(cell);
            });
        }
    },

    renderTrendChart: function() {
        const ctx = document.getElementById('risk-trend-chart');
        if (!ctx || !AppState.plan.length) return;
        
        if (window.trendChartInstance) window.trendChartInstance.destroy();

        const labels = AppState.plan.map(p => `W${p.week}`);
        const datasets = [];
        const colors = { 
            liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', 
            neuro: '#9966ff', kidney: '#4bc0c0', endo: '#c9cbcf', repro: '#e7e9ed' 
        };

        let hasData = false;
        for (let sys in AppState.chartVisibility) {
            if (AppState.chartVisibility[sys]) {
                hasData = true;
                const data = AppState.plan.map(p => {
                    let sum = 0, cnt = 0;
                    for(let m in p.risks[sys]) { sum += p.risks[sys][m]; cnt++; }
                    return cnt ? Math.round(sum/cnt) : 0;
                });
                datasets.push({
                    label: sys.toUpperCase(),
                    data: data,
                    borderColor: colors[sys],
                    backgroundColor: colors[sys],
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: false,
                    tension: 0.3
                });
            }
        }

        if(!hasData) {
            ctx.parentElement.innerHTML += '<p style="text-align:center; color:#666">Выберите хотя бы одну систему для отображения</p>';
            return;
        }

        window.trendChartInstance = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { 
                    legend: { labels: { color: '#b0b0b0', font: {size: 10} }, position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } },
                    x: { ticks: { color: '#aaa', maxRotation: 0 }, grid: { color: '#333' } }
                }
            }
        });
    },

    calcFertility: function() {
        const vol = parseFloat(document.getElementById('semen-vol').value);
        const conc = parseFloat(document.getElementById('semen-conc').value);
        const pr = parseFloat(document.getElementById('semen-pr').value);
        const morph = parseFloat(document.getElementById('semen-morph').value);
        
        if(!vol && !conc) return alert("Введите данные");
        
        const score = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr, morphology: morph });
        const res = document.getElementById('fertility-result');
        if(res) {
            const color = score > 60 ? '#03dac6' : (score > 30 ? '#ff9800' : '#f44336');
            const text = score > 60 ? 'Норма' : (score > 30 ? 'Умеренное снижение' : 'Критическое');
            res.innerHTML = `<h3 style="color:${color}">IF: ${score}/100 <small>(${text})</small></h3>`;
        }
        this.addXP(20);
    },

    exportJSON: function() {
        const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState));
        const node = document.createElement('a');
        node.setAttribute("href", dataStr);
        node.setAttribute("download", "bode_health_backup.json");
        document.body.appendChild(node);
        node.click();
        node.remove();
    },

    renderShop: function() {
        const list = document.getElementById('shop-list');
        if(!list || !DB.shopItems) return;
        list.innerHTML = '';
        for (const [key, items] of Object.entries(DB.shopItems)) {
            items.forEach(item => {
                list.innerHTML += `
                    <div class="drug-card">
                        <div><strong>${key.toUpperCase()}</strong><br><small>${item.platform}</small></div>
                        <div>
                            <span style="color:#03dac6; margin-right:10px">${item.price}</span>
                            <a href="${item.url}" target="_blank" class="btn-primary" style="padding:5px 10px; font-size:0.8em; text-decoration:none;">Buy</a>
                        </div>
                    </div>`;
            });
        }
    },

    renderGlossary: function() {
        const list = document.getElementById('glossary-list');
        if(!list || !DB.glossary) return;
        list.innerHTML = '';
        for (const [term, def] of Object.entries(DB.glossary)) {
            list.innerHTML += `
                <div class="drug-card" style="display:block">
                    <strong style="color:#bb86fc">${term}</strong>
                    <p style="margin:5px 0 0; font-size:0.9em; color:#aaa">${def}</p>
                </div>`;
        }
    },

    // --- ГАМИФИКАЦИЯ ---
    addXP: function(amount) {
        AppState.xp += amount;
        const newLevel = Math.floor(AppState.xp / 500) + 1;
        if(newLevel > AppState.level) {
            AppState.level = newLevel;
            alert(`🎉 НОВЫЙ УРОВЕНЬ: ${AppState.level}!`);
        }
        this.updateGamificationUI();
    },

    updateGamificationUI: function() {
        const xpEl = document.getElementById('xp-display');
        if(xpEl) xpEl.textContent = `Lvl ${AppState.level} | XP: ${AppState.xp}`;
        
        // Тут можно добавить прогресс бар и список ачивок
    }
};
APPEOF

# 2. Обновляем HTML (добавляем блок прогноза и что-иф)
echo "📝 Updating HTML with Predictive Blocks..."
cat > index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bode Health v11.0 Pro</title>
    <base href="https://thodstein.github.io/Bode_Health/">
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
    <div class="app-container">
        <header>
            <div><h1>Bode Health <span class="version">v11.0</span></h1><p class="subtitle">Advanced Analytics</p></div>
            <div class="status-bar" id="xp-display">Lvl 1 | XP: 0</div>
        </header>

        <nav class="tabs">
            <button class="tab-btn active" data-tab="dashboard">📊 Главная</button>
            <button class="tab-btn" data-tab="stack">💉 Стек</button>
            <button class="tab-btn" data-tab="risks">⚠️ Риски</button>
            <button class="tab-btn" data-tab="support">💊 Поддержка</button>
            <button class="tab-btn" data-tab="labs">🧬 Анализы</button>
            <button class="tab-btn" data-tab="reports">📑 Отчеты</button>
            <button class="tab-btn" data-tab="shop">🛒 Магазин</button>
        </nav>

        <main>
            <!-- Dashboard with Predictions -->
            <section id="dashboard" class="tab-content active">
                <div class="cards-grid">
                    <div class="card"><h3>Readiness</h3><div class="big-value" id="dash-readiness">--</div></div>
                    <div class="card"><h3>Fatigue</h3><div class="big-value" id="dash-fatigue">--</div></div>
                    <div class="card"><h3>Avg Risk</h3><div class="big-value" id="dash-risk">--</div></div>
                </div>
                
                <div class="prediction-block">
                    <h3>🔮 Прогноз состояния (7 дней)</h3>
                    <canvas id="prediction-chart" height="100"></canvas>
                    <div id="prediction-alerts" style="margin-top:15px; color:#ff9800"></div>
                </div>
            </section>

            <!-- Stack -->
            <section id="stack" class="tab-content">
                <h2>Добавить препарат</h2>
                <form id="add-drug-form" class="deep-form">
                    <label>Вещество:</label>
                    <select id="drug-substance"></select>
                    
                    <label>Эфир:</label>
                    <select id="drug-ester" disabled></select>
                    
                    <div class="row">
                        <input type="number" id="drug-dose" placeholder="Доза (мг/нед)" required>
                    </div>
                    <div class="row">
                        <input type="number" id="drug-start" placeholder="Старт (нед)" value="1" min="1" required>
                        <input type="number" id="drug-end" placeholder="Финиш (нед)" value="8" min="1" required>
                    </div>
                    <button type="submit" class="btn-primary">Добавить в курс</button>
                </form>
                <div id="stack-list" class="list-container"></div>
                <button class="btn-success">Рассчитать динамику курса</button>
                <div id="weekly-plan-output"></div>
                
                <!-- What-If Simulator Placeholder -->
                <div class="what-if-block" style="margin-top:30px; background:#252525; padding:15px; border-radius:8px;">
                    <h3>🔄 What-If Симулятор</h3>
                    <p style="font-size:0.9em; color:#aaa">Измените дозу тестостерона и посмотрите на риск без сохранения:</p>
                    <div class="row">
                        <input type="range" min="0" max="1000" value="0" id="whatif-slider" oninput="App.runWhatIf(this.value)">
                        <span id="whatif-val" style="color:#03dac6; font-weight:bold">0 мг</span>
                    </div>
                    <div id="whatif-result" style="margin-top:10px; font-size:0.9em"></div>
                </div>
            </section>

            <!-- Risks -->
            <section id="risks" class="tab-content">
                <h2>Динамика рисков</h2>
                <div class="chart-controls">
                    <label><input type="checkbox" checked onchange="App.toggleChart('liver')"> Печень</label>
                    <label><input type="checkbox" checked onchange="App.toggleChart('cardio')"> Сердце</label>
                    <label><input type="checkbox" checked onchange="App.toggleChart('hemato')"> Кровь</label>
                    <label><input type="checkbox" onchange="App.toggleChart('neuro')"> Нейро</label>
                    <label><input type="checkbox" onchange="App.toggleChart('kidney')"> Почки</label>
                    <label><input type="checkbox" onchange="App.toggleChart('endo')"> Эндо</label>
                    <label><input type="checkbox" onchange="App.toggleChart('repro')"> Репро</label>
                </div>
                <div style="height:300px"><canvas id="risk-trend-chart"></canvas></div>

                <h2>Матрица рисков (Heatmap)</h2>
                <div class="week-selector">
                    <button onclick="App.changeWeek(-1)">◀</button>
                    <span id="current-week-display">Неделя 1</span>
                    <button onclick="App.changeWeek(1)">▶</button>
                </div>
                <div id="heatmap-container" class="heatmap-grid"></div>
            </section>

            <!-- Support -->
            <section id="support" class="tab-content">
                <h2>Протокол поддержки</h2>
                <div id="support-schedule" class="schedule-container"></div>
            </section>

            <!-- Labs -->
            <section id="labs" class="tab-content">
                <h2>Фертильность (WHO 2021)</h2>
                <div class="input-group">
                    <input type="number" id="semen-vol" placeholder="Объем">
                    <input type="number" id="semen-conc" placeholder="Конц.">
                    <input type="number" id="semen-pr" placeholder="PR%">
                    <input type="number" id="semen-morph" placeholder="Morph%">
                </div>
                <button onclick="App.calcFertility()" class="btn-primary">Рассчитать IF</button>
                <div id="fertility-result"></div>
            </section>

            <!-- Reports -->
            <section id="reports" class="tab-content">
                <h2>Отчеты</h2>
                <button onclick="App.exportJSON()" class="btn-secondary">💾 Экспорт JSON</button>
                <div id="report-preview"></div>
            </section>

            <!-- Shop -->
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

# 3. CSS Updates
cat > assets/css/style.css << 'CSSEOF'
:root { --bg-dark: #121212; --bg-card: #1e1e1e; --primary: #bb86fc; --secondary: #03dac6; --error: #cf6679; --text-main: #fff; --text-sec: #b0b0b0; --border: #333; }
body { margin: 0; font-family: 'Segoe UI', sans-serif; background: var(--bg-dark); color: var(--text-main); padding-bottom: 60px; }
.app-container { max-width: 900px; margin: 0 auto; }
header { background: var(--bg-card); padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.version { font-size: 0.6em; color: var(--secondary); }
.subtitle { margin: 5px 0 0; font-size: 0.9em; color: var(--text-sec); }
.status-bar { font-size: 0.9em; color: var(--primary); font-weight: bold; background: rgba(0,0,0,0.3); padding: 5px 10px; border-radius: 15px; }

.tabs { display: flex; overflow-x: auto; background: var(--bg-card); position: sticky; top: 0; z-index: 100; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab-btn { flex: 1; min-width: 100px; padding: 15px 10px; background: none; border: none; color: var(--text-sec); font-weight: 600; cursor: pointer; border-bottom: 3px solid transparent; white-space: nowrap; transition: 0.2s; }
.tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); background: rgba(187, 134, 252, 0.1); }

.tab-content { display: none; padding: 20px; animation: fadeIn 0.3s; }
.tab-content.active { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; margin-bottom: 20px; }
.card { background: var(--bg-card); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid var(--border); box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
.big-value { font-size: 2.2em; font-weight: bold; margin-top: 10px; color: var(--secondary); text-shadow: 0 0 10px rgba(3, 218, 198, 0.3); }

.deep-form { background: var(--bg-card); padding: 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 12px; border: 1px solid var(--border); }
.row { display: flex; gap: 10px; }
input, select { background: #2c2c2c; border: 1px solid var(--border); color: white; padding: 12px; border-radius: 8px; flex: 1; outline: none; }
input:focus, select:focus { border-color: var(--primary); }
button { padding: 12px 20px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; background: var(--primary); color: #000; transition: 0.2s; }
button:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-delete { background: rgba(207, 102, 121, 0.2); color: var(--error); padding: 8px 12px; font-size: 0.9em; }
.btn-success { background: #03dac6; color: #000; width: 100%; margin-top: 20px; font-size: 1.1em; box-shadow: 0 0 15px rgba(3, 218, 198, 0.4); }
.btn-secondary { background: #333; color: white; margin-right: 10px; margin-top: 10px; }

.list-container, .schedule-container { display: flex; flex-direction: column; gap: 12px; }
.drug-card, .support-item { background: var(--bg-card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--secondary); display: flex; justify-content: space-between; align-items: center; transition: 0.2s; }
.drug-card:hover { background: #252525; }
.support-item { flex-direction: column; align-items: flex-start; border-left-color: var(--primary); }
.time-block { background: #252525; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.time-block h3 { color: var(--primary); margin: 0 0 10px; font-size: 0.9em; text-transform: uppercase; }

/* Heatmap */
.heatmap-grid { display: grid; gap: 8px; margin-top: 15px; }
.heatmap-cell { transition: all 0.2s; cursor: help; border: 1px solid rgba(255,255,255,0.1); }
.heatmap-cell:hover { transform: scale(1.05); z-index: 10; box-shadow: 0 0 15px rgba(0,0,0,0.5); filter: brightness(1.2); }

/* Charts */
.chart-controls { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; background: var(--bg-card); padding: 10px; border-radius: 8px; border: 1px solid var(--border); }
.chart-controls label { display: flex; align-items: center; gap: 5px; font-size: 0.9em; cursor: pointer; color: var(--text-sec); }
.chart-controls input[type="checkbox"] { accent-color: var(--primary); }
.week-selector { display: flex; justify-content: center; align-items: center; gap: 20px; margin: 20px 0; background: var(--bg-card); padding: 10px; border-radius: 8px; }
.week-selector button { padding: 5px 15px; font-size: 1.2em; background: #333; color: white; }
#current-week-display { font-size: 1.2em; font-weight: bold; color: var(--secondary); min-width: 120px; text-align: center; }

canvas { max-width: 100%; margin: 10px 0; background: var(--bg-card); border-radius: 12px; padding: 10px; }
.prediction-block, .what-if-block { background: var(--bg-card); padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid var(--border); }
.prediction-block h3, .what-if-block h3 { margin-top: 0; color: var(--primary); }
CSSEOF

# 4. Git Push
echo "🚀 Committing and Pushing Stage 7 (Fixes + Features)..."
git add -A
git commit -m "Stage 7: Fixed Buttons Logic, Gamification (XP/Lvl), What-If Simulator, Predictive Charts"
git push origin main --force

echo "✅ Stage 7 Complete! Check Actions."
