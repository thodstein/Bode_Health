#!/bin/bash
echo "🎨 STAGE 2: Building UI & Modules..."

# 1. HTML Structure (8 Tabs)
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
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
    <div class="app-container">
        <header>
            <div>
                <h1>Bode Health <span class="version">v11.0</span></h1>
                <p class="subtitle">Система анализа фармакологических рисков</p>
            </div>
            <div class="status-bar">
                <span id="trust-score">Trust: 0</span>
                <span id="connection-status">🟢 Online</span>
            </div>
        </header>

        <!-- Navigation: 8 Tabs -->
        <nav class="tabs">
            <button class="tab-btn active" data-tab="dashboard">📊 Главная</button>
            <button class="tab-btn" data-tab="stack">💉 Стек</button>
            <button class="tab-btn" data-tab="support">💊 Поддержка</button>
            <button class="tab-btn" data-tab="risks">⚠️ Риски</button>
            <button class="tab-btn" data-tab="nutrition">🍎 Питание</button>
            <button class="tab-btn" data-tab="training">🏋️ Тренировки</button>
            <button class="tab-btn" data-tab="labs">🧬 Анализы</button>
            <button class="tab-btn" data-tab="profile">⚙️ Профиль</button>
        </nav>

        <main>
            <!-- 1. Dashboard -->
            <section id="dashboard" class="tab-content active">
                <div class="cards-grid">
                    <div class="card">
                        <h3>Readiness</h3>
                        <div class="big-value" id="dash-readiness">--</div>
                    </div>
                    <div class="card">
                        <h3>Fatigue</h3>
                        <div class="big-value" id="dash-fatigue">--</div>
                    </div>
                    <div class="card">
                        <h3>Integr. Risk</h3>
                        <div class="big-value" id="dash-risk">--</div>
                    </div>
                </div>
                <div class="alert-box" id="daily-alert">Добавьте препараты во вкладке "Стек" для расчета.</div>
                <div class="forecast-block">
                    <h3>📈 Прогноз на 7 дней</h3>
                    <div id="forecast-content">Загрузка...</div>
                </div>
            </section>

            <!-- 2. Stack -->
            <section id="stack" class="tab-content">
                <h2>Фармакологический стек</h2>
                <form id="add-drug-form" class="input-group">
                    <select id="drug-select" required><option value="">Выберите препарат...</option></select>
                    <input type="number" id="drug-dose" placeholder="Доза (мг/ЕД)" required>
                    <input type="text" id="drug-freq" placeholder="Частота (напр. 2р/нед)" required>
                    <button type="submit" class="btn-primary">Добавить</button>
                </form>
                <div id="stack-list" class="list-container"></div>
            </section>

            <!-- 3. Support -->
            <section id="support" class="tab-content">
                <div class="section-header">
                    <h2>Протокол поддержки</h2>
                    <label class="toggle-switch">
                        <span>Активировать Net Risks</span>
                        <input type="checkbox" id="support-toggle" checked>
                    </label>
                </div>
                <div id="support-schedule" class="schedule-container"></div>
            </section>

            <!-- 4. Risks -->
            <section id="risks" class="tab-content">
                <h2>Матрица рисков (Raw vs Net)</h2>
                <canvas id="risk-chart"></canvas>
                <div id="risk-details" class="details-list"></div>
                <div class="what-if-block">
                    <h3>🔄 What-If Сценарий</h3>
                    <p>Изменение дозы тестостерона:</p>
                    <input type="range" id="test-dose-sim" min="0" max="1000" step="50" value="0">
                    <span id="test-dose-val">0 мг</span>
                </div>
            </section>

            <!-- 5. Nutrition -->
            <section id="nutrition" class="tab-content">
                <h2>Дневник питания</h2>
                <div class="voice-input">
                    <button id="voice-btn" class="btn-icon">🎙️</button>
                    <span id="voice-status">Голосовой ввод</span>
                </div>
                <form id="food-form" class="input-group">
                    <input type="text" id="food-name" placeholder="Продукт" required>
                    <input type="number" id="food-weight" placeholder="Вес (г)" required>
                    <button type="submit" class="btn-primary">Добавить</button>
                </form>
                <div id="food-log"></div>
            </section>

            <!-- 6. Training -->
            <section id="training" class="tab-content">
                <h2>Программа тренировок</h2>
                <div id="workout-plan" class="plan-container">
                    <p>Генерация на основе Readiness и слабых мест...</p>
                </div>
            </section>

            <!-- 7. Labs & Fertility -->
            <section id="labs" class="tab-content">
                <h2>Лабораторный мониторинг</h2>
                <button class="btn-secondary" onclick="alert('OCR в разработке')">📷 Загрузить анализ</button>
                
                <div class="fertility-block">
                    <h3>Индекс фертильности (WHO 2021)</h3>
                    <div class="input-group">
                        <input type="number" id="semen-vol" placeholder="Объем (мл)">
                        <input type="number" id="semen-conc" placeholder="Конц. (млн/мл)">
                        <input type="number" id="semen-pr" placeholder="Подвижность PR (%)">
                        <input type="number" id="semen-morph" placeholder="Морфология (%)">
                    </div>
                    <button onclick="App.calcFertility()" class="btn-primary">Рассчитать IF</button>
                    <div id="fertility-result"></div>
                </div>
                <div id="lab-trends"></div>
            </section>

            <!-- 8. Profile -->
            <section id="profile" class="tab-content">
                <h2>Профиль и Настройки</h2>
                <div class="profile-section">
                    <h3>Генетика</h3>
                    <label><input type="checkbox" id="gene-mthfr"> MTHFR C677T</label>
                    <label><input type="checkbox" id="gene-comt"> COMT Met/Met</label>
                    <label><input type="checkbox" id="gene-agtr1"> AGTR1 A1166C</label>
                </div>
                <div class="profile-section">
                    <h3>Данные</h3>
                    <button class="btn-secondary" onclick="App.exportData()">📥 Экспорт JSON</button>
                    <button class="btn-danger" onclick="App.clearData()">🗑️ Сброс данных</button>
                </div>
                <div class="profile-section">
                    <h3>Магазин</h3>
                    <div id="shop-preview">Загрузка предложений...</div>
                </div>
            </section>
        </main>
    </div>

    <!-- Scripts -->
    <script src="assets/js/core/database.js"></script>
    <script src="assets/js/core/engine.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
HTMLEOF

# 2. CSS Styles (Dark Theme, Responsive)
cat > assets/css/style.css << 'CSSEOF'
:root {
    --bg-dark: #121212;
    --bg-card: #1e1e1e;
    --primary: #bb86fc;
    --secondary: #03dac6;
    --error: #cf6679;
    --text-main: #ffffff;
    --text-sec: #b0b0b0;
    --border: #333;
}
body { margin: 0; font-family: 'Segoe UI', Roboto, sans-serif; background: var(--bg-dark); color: var(--text-main); padding-bottom: 60px; }
.app-container { max-width: 900px; margin: 0 auto; }
header { background: var(--bg-card); padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.version { font-size: 0.6em; color: var(--secondary); }
.subtitle { margin: 5px 0 0; font-size: 0.9em; color: var(--text-sec); }
.status-bar { font-size: 0.8em; color: var(--text-sec); display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }

/* Tabs */
.tabs { display: flex; overflow-x: auto; background: var(--bg-card); position: sticky; top: 0; z-index: 100; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab-btn { flex: 1; min-width: 100px; padding: 15px 10px; background: none; border: none; color: var(--text-sec); font-weight: 600; cursor: pointer; border-bottom: 3px solid transparent; white-space: nowrap; transition: 0.2s; }
.tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }
.tab-btn:hover:not(.active) { background: rgba(255,255,255,0.05); }

/* Content */
.tab-content { display: none; padding: 20px; animation: fadeIn 0.3s; }
.tab-content.active { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* Cards */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; margin-bottom: 20px; }
.card { background: var(--bg-card); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid var(--border); }
.big-value { font-size: 2.2em; font-weight: bold; margin-top: 10px; }

/* Forms */
.input-group { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
input, select { background: #2c2c2c; border: 1px solid var(--border); color: white; padding: 12px; border-radius: 8px; flex: 1; min-width: 120px; }
button { padding: 12px 20px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; transition: 0.2s; }
.btn-primary { background: var(--primary); color: #000; }
.btn-primary:hover { opacity: 0.9; }
.btn-secondary { background: #333; color: white; }
.btn-danger { background: #cf6679; color: #000; }
.btn-delete { background: rgba(207, 102, 121, 0.2); color: var(--error); padding: 8px 12px; font-size: 0.9em; }
.btn-icon { font-size: 1.5em; background: none; border: none; cursor: pointer; color: var(--secondary); }

/* Lists */
.list-container, .schedule-container { display: flex; flex-direction: column; gap: 12px; }
.drug-card, .support-item { background: var(--bg-card); padding: 15px; border-radius: 8px; border-left: 4px solid var(--secondary); display: flex; justify-content: space-between; align-items: center; }
.support-item { flex-direction: column; align-items: flex-start; gap: 8px; border-left-color: var(--primary); }
.item-header { display: flex; justify-content: space-between; width: 100%; }
.item-name { font-weight: bold; font-size: 1.1em; }
.item-dose { color: var(--secondary); font-weight: 600; }
.item-mechanism { font-size: 0.9em; color: var(--text-sec); }
.item-risks { font-size: 0.8em; color: var(--primary); opacity: 0.8; }
.time-block { background: #252525; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
.time-block h3 { color: var(--primary); margin: 0 0 10px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }

/* Risk Chart & Details */
#risk-chart { max-width: 100%; margin: 20px auto; display: block; background: var(--bg-card); border-radius: 12px; padding: 10px; }
.risk-comparison { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
.risk-row { display: flex; align-items: center; gap: 10px; }
.sys-name { width: 80px; font-weight: bold; font-size: 0.9em; }
.bars { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.bar-bg { width: 100%; height: 10px; background: #333; border-radius: 5px; overflow: hidden; position: relative; }
.bar-fill { height: 100%; border-radius: 5px; transition: width 0.5s; }
.bar-raw { background: #cf6679; }
.bar-net { background: #03dac6; }
.diff { width: 40px; text-align: right; font-weight: bold; font-size: 0.9em; }
.diff.good { color: #03dac6; }
.diff.bad { color: #cf6679; }

/* Utilities */
.alert-box { background: rgba(207, 102, 121, 0.15); border: 1px solid var(--error); color: var(--error); padding: 15px; border-radius: 8px; margin-top: 20px; }
.empty-state { text-align: center; color: var(--text-sec); padding: 40px; font-style: italic; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
.toggle-switch { display: flex; align-items: center; gap: 10px; font-size: 0.9em; color: var(--text-sec); }
.fertility-block, .profile-section, .what-if-block, .forecast-block { background: var(--bg-card); padding: 20px; border-radius: 12px; margin-top: 20px; }
.plan-container { background: #252525; padding: 15px; border-radius: 8px; }
CSSEOF

# 3. Main App Logic
cat > assets/js/app.js << 'APPEOF'
document.addEventListener('DOMContentLoaded', () => {
    // Init Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    // State
    const state = {
        stack: [],
        supportActive: true,
        genetics: { mthfr: false, comt: false, agtr1: false }
    };

    // Init UI
    initTabs();
    renderDrugSelect();
    renderSupportSchedule();

    // Event: Add Drug
    document.getElementById('add-drug-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('drug-select').value;
        const dose = document.getElementById('drug-dose').value;
        const freq = document.getElementById('drug-freq').value;
        if (!id) return alert('Выберите препарат!');
        
        state.stack.push({ id, dose, freq });
        App.renderAll();
        e.target.reset();
    });

    // Global Expose
    window.App = {
        removeDrug: (idx) => {
            state.stack.splice(idx, 1);
            App.renderAll();
        },
        renderAll: () => {
            renderStackList(state.stack);
            calculateAndRenderRisks();
            updateDashboardMetrics();
        },
        calcFertility: () => {
            const vol = parseFloat(document.getElementById('semen-vol').value);
            const conc = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const morph = parseFloat(document.getElementById('semen-morph').value);
            
            if (!vol || !conc) return alert('Введите объем и концентрацию');
            
            const ifScore = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr, morphology: morph });
            const resDiv = document.getElementById('fertility-result');
            const color = ifScore > 60 ? '#03dac6' : (ifScore > 30 ? '#ffeb3b' : '#cf6679');
            const text = ifScore > 60 ? 'Норма' : (ifScore > 30 ? 'Умеренное снижение' : 'Критическое снижение');
            resDiv.innerHTML = `<h2 style="color:${color}">IF: ${ifScore}/100 <small>(${text})</small></h2>`;
        },
        exportData: () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "bode_health_backup.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },
        clearData: () => {
            if(confirm('Удалить все данные?')) {
                state.stack = [];
                App.renderAll();
            }
        }
    };

    // Helpers
    function initTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });
    }

    function renderDrugSelect() {
        const select = document.getElementById('drug-select');
        DB.drugs.forEach(drug => {
            const opt = document.createElement('option');
            opt.value = drug.id;
            opt.textContent = `${drug.name} (${drug.type})`;
            select.appendChild(opt);
        });
    }

    function renderSupportSchedule() {
        const container = document.getElementById('support-schedule');
        container.innerHTML = '';
        DB.supportProtocol.forEach(block => {
            const blockDiv = document.createElement('div');
            blockDiv.className = 'time-block';
            blockDiv.innerHTML = `<h3>${block.title}</h3>`;
            block.items.forEach(item => {
                blockDiv.innerHTML += `
                    <div class="support-item">
                        <div class="item-header">
                            <span class="item-name">${item.name}</span>
                            <span class="item-dose">${item.dose}</span>
                        </div>
                        <div class="item-mechanism">${item.mechanism}</div>
                        <div class="item-risks">🛡️ ${item.risksCovered.join(', ')}</div>
                    </div>
                `;
            });
            container.appendChild(blockDiv);
        });
    }

    function renderStackList(stack) {
        const list = document.getElementById('stack-list');
        list.innerHTML = '';
        if (stack.length === 0) {
            list.innerHTML = '<div class="empty-state">Стек пуст.</div>';
            return;
        }
        stack.forEach((item, idx) => {
            const drug = DB.drugs.find(d => d.id === item.id);
            const div = document.createElement('div');
            div.className = 'drug-card';
            div.innerHTML = `
                <div class="drug-info">
                    <h4>${drug.name}</h4>
                    <p>Доза: ${item.dose} | Частота: ${item.freq || 'N/A'}</p>
                </div>
                <button class="btn-delete" onclick="App.removeDrug(${idx})">✕</button>
            `;
            list.appendChild(div);
        });
    }

    function calculateAndRenderRisks() {
        const raw = Engine.calculateRawRisks(state.stack);
        const net = Engine.calculateNetRisks(raw, state.supportActive);
        renderRiskChart(net);
        renderRiskDetails(raw, net);
    }

    function renderRiskChart(data) {
        const ctx = document.getElementById('risk-chart');
        if (!ctx) return;
        const labels = ['Печень', 'Кардио', 'Почки', 'Невро', 'Кровь', 'Эндо', 'Репро'];
        const values = labels.map(sys => {
            const sysKey = sys === 'Печень' ? 'liver' : sys === 'Кардио' ? 'cardio' : sys === 'Почки' ? 'kidney' : sys === 'Невро' ? 'neuro' : sys === 'Кровь' ? 'hemato' : sys === 'Эндо' ? 'endo' : 'repro';
            let sum = 0, cnt = 0;
            for(let m in data[sysKey]) { sum += data[sysKey][m]; cnt++; }
            return cnt ? Math.round(sum/cnt) : 0;
        });

        if (window.riskChartInstance) window.riskChartInstance.destroy();
        window.riskChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Net Risk',
                    data: values,
                    backgroundColor: 'rgba(3, 218, 198, 0.3)',
                    borderColor: '#03dac6',
                    borderWidth: 2
                }]
            },
            options: {
                scales: { r: { beginAtZero: true, max: 100, ticks: { color: '#b0b0b0' } } },
                plugins: { legend: { labels: { color: '#fff' } } }
            }
        });
    }

    function renderRiskDetails(raw, net) {
        const container = document.getElementById('risk-details');
        let html = '<div class="risk-comparison">';
        for (let sys in raw) {
            let rawAvg = 0, netAvg = 0, cnt = 0;
            for (let m in raw[sys]) { rawAvg += raw[sys][m]; netAvg += net[sys][m]; cnt++; }
            rawAvg = Math.round(rawAvg/cnt);
            netAvg = Math.round(netAvg/cnt);
            const diff = rawAvg - netAvg;
            html += `
                <div class="risk-row">
                    <span class="sys-name">${sys.toUpperCase()}</span>
                    <div class="bars">
                        <div class="bar-bg"><div class="bar-fill bar-raw" style="width:${rawAvg}%"></div></div>
                        <div class="bar-bg"><div class="bar-fill bar-net" style="width:${netAvg}%"></div></div>
                    </div>
                    <span class="diff ${diff > 0 ? 'good' : 'bad'}">${diff > 0 ? '-' + diff : '+' + Math.abs(diff)}</span>
                </div>
            `;
        }
        html += '</div>';
        container.innerHTML = html;
    }

    function updateDashboardMetrics() {
        const raw = Engine.calculateRawRisks(state.stack);
        const net = Engine.calculateNetRisks(raw, state.supportActive);
        const score = Engine.calculateIntegratedScore(net);
        const readiness = state.stack.length ? Math.max(20, 100 - score) : 100;
        const fatigue = state.stack.length ? Math.min(80, score) : 10;
        
        document.getElementById('dash-readiness').textContent = readiness;
        document.getElementById('dash-fatigue').textContent = fatigue;
        const riskEl = document.getElementById('dash-risk');
        riskEl.textContent = `${score}%`;
        riskEl.style.color = score > 50 ? '#cf6679' : (score > 30 ? '#ffeb3b' : '#03dac6');

        // Mock Forecast
        document.getElementById('forecast-content').innerHTML = `
            <p>Readiness через 3 дня: ${readiness - 5} ⚠️</p>
            <p>Readiness через 7 дней: ${readiness - 10} 🔴</p>
        `;
    }

    // Toggle Support
    document.getElementById('support-toggle').addEventListener('change', (e) => {
        state.supportActive = e.target.checked;
        calculateAndRenderRisks();
        updateDashboardMetrics();
    });

    // Voice Input Mock
    document.getElementById('voice-btn').addEventListener('click', () => {
        alert('Голосовой ввод: "Я съел 200г курицы" (Функция в разработке)');
    });

    // Initial Render
    App.renderAll();
});
APPEOF

echo "✅ Stage 2 Complete! UI Created."
