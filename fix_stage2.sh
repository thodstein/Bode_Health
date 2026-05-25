#!/bin/bash
echo "🎨 Stage 2: Building UI..."

# 1. Создаем HTML
cat > index.html << 'HTMLEND'
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
            <h1>Bode Health <span class="version">v11.0</span></h1>
            <div class="status-bar">Trust: <span id="trust-score">0</span></div>
        </header>
        <nav class="tabs">
            <button class="tab-btn active" data-tab="dashboard">Главная</button>
            <button class="tab-btn" data-tab="stack">Стек</button>
            <button class="tab-btn" data-tab="support">Поддержка</button>
            <button class="tab-btn" data-tab="risks">Риски</button>
            <button class="tab-btn" data-tab="nutrition">Питание</button>
            <button class="tab-btn" data-tab="training">Тренировки</button>
            <button class="tab-btn" data-tab="labs">Анализы</button>
        </nav>
        <main>
            <section id="dashboard" class="tab-content active">
                <div class="cards-grid">
                    <div class="card"><h3>Readiness</h3><div class="big-value" id="dash-readiness">--</div></div>
                    <div class="card"><h3>Fatigue</h3><div class="big-value" id="dash-fatigue">--</div></div>
                    <div class="card"><h3>Risk</h3><div class="big-value" id="dash-risk">--</div></div>
                </div>
            </section>
            <section id="stack" class="tab-content">
                <h2>Стек препаратов</h2>
                <form id="add-drug-form" class="input-group">
                    <select id="drug-select"></select>
                    <input type="number" id="drug-dose" placeholder="Доза">
                    <input type="text" id="drug-freq" placeholder="Частота">
                    <button type="submit" class="btn-primary">Добавить</button>
                </form>
                <div id="stack-list"></div>
            </section>
            <section id="support" class="tab-content">
                <h2>Поддержка</h2>
                <label><input type="checkbox" id="support-toggle" checked> Активно</label>
                <div id="support-schedule"></div>
            </section>
            <section id="risks" class="tab-content">
                <h2>Риски</h2>
                <canvas id="risk-chart"></canvas>
                <div id="risk-details"></div>
            </section>
            <section id="nutrition" class="tab-content">
                <h2>Питание</h2>
                <button id="voice-btn" class="btn-icon">🎙️</button>
                <form id="food-form" class="input-group">
                    <input type="text" id="food-name" placeholder="Продукт">
                    <input type="number" id="food-weight" placeholder="Граммы">
                    <button type="submit">OK</button>
                </form>
            </section>
            <section id="training" class="tab-content"><h2>Тренировки</h2><p>В разработке...</p></section>
            <section id="labs" class="tab-content">
                <h2>Анализы и Фертильность</h2>
                <input type="number" id="semen-vol" placeholder="Объем">
                <input type="number" id="semen-conc" placeholder="Конц.">
                <button onclick="App.calcFertility()">Рассчитать IF</button>
                <div id="fertility-result"></div>
            </section>
        </main>
    </div>
    <script src="assets/js/core/database.js"></script>
    <script src="assets/js/core/engine.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
HTMLEND

# 2. Создаем CSS
cat > assets/css/style.css << 'CSSEND'
body { background: #121212; color: #fff; font-family: sans-serif; margin: 0; }
.app-container { max-width: 800px; margin: 0 auto; padding-bottom: 50px; }
header { background: #1e1e1e; padding: 15px; display: flex; justify-content: space-between; }
.version { color: #03dac6; font-size: 0.7em; }
.tabs { display: flex; overflow-x: auto; background: #1e1e1e; }
.tab-btn { flex: 1; padding: 15px; background: none; border: none; color: #aaa; border-bottom: 3px solid transparent; }
.tab-btn.active { color: #bb86fc; border-bottom-color: #bb86fc; }
.tab-content { display: none; padding: 20px; }
.tab-content.active { display: block; }
.cards-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.card { background: #1e1e1e; padding: 15px; text-align: center; border-radius: 8px; }
.big-value { font-size: 1.5em; font-weight: bold; color: #03dac6; }
.input-group { display: flex; gap: 5px; margin: 10px 0; flex-wrap: wrap; }
input, select { background: #2c2c2c; border: 1px solid #333; color: white; padding: 10px; flex: 1; }
button { padding: 10px 20px; background: #bb86fc; border: none; border-radius: 4px; cursor: pointer; color: #000; font-weight: bold; }
.drug-card { background: #1e1e1e; padding: 10px; margin: 5px 0; border-left: 3px solid #03dac6; display: flex; justify-content: space-between; }
.time-block { background: #2c2c2c; padding: 10px; margin: 10px 0; border-radius: 4px; }
.time-block h3 { color: #bb86fc; margin: 0 0 5px; font-size: 0.9em; }
.btn-icon { font-size: 1.5em; background: none; border: none; padding: 5px; }
CSSEND

# 3. Создаем App JS
cat > assets/js/app.js << 'APPEND'
document.addEventListener('DOMContentLoaded', () => {
    if(window.Telegram) Telegram.WebApp.ready();
    
    // State
    let stack = [];
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            document.getElementById(b.dataset.tab).classList.add('active');
        };
    });

    // Init Select
    const sel = document.getElementById('drug-select');
    DB.drugs.forEach(d => {
        let o = document.createElement('option');
        o.value = d.id; o.textContent = d.name;
        sel.appendChild(o);
    });

    // Add Drug
    document.getElementById('add-drug-form').onsubmit = (e) => {
        e.preventDefault();
        stack.push({
            id: document.getElementById('drug-select').value,
            dose: document.getElementById('drug-dose').value,
            freq: document.getElementById('drug-freq').value
        });
        render();
        e.target.reset();
    };

    // Render
    window.App = {
        render: () => {
            const list = document.getElementById('stack-list');
            list.innerHTML = '';
            stack.forEach((s, i) => {
                let d = DB.drugs.find(x => x.id === s.id);
                list.innerHTML += `<div class="drug-card"><span>${d.name} (${s.dose})</span><button onclick="stack.splice(${i},1);App.render()">X</button></div>`;
            });
            
            // Calc Risks
            const raw = Engine.calculateRawRisks(stack);
            const net = Engine.calculateNetRisks(raw, document.getElementById('support-toggle').checked);
            const score = Engine.calculateIntegratedScore(net);
            
            document.getElementById('dash-readiness').textContent = 100 - score;
            document.getElementById('dash-fatigue').textContent = score;
            document.getElementById('dash-risk').textContent = score + '%';
            
            // Chart
            const ctx = document.getElementById('risk-chart');
            if(ctx) {
                const labels = ['Печень','Кардио','Почки','Невро','Кровь','Эндо','Репро'];
                const data = labels.map(l => {
                    let k = l==='Печень'?'liver':l==='Кардио'?'cardio':l==='Почки'?'kidney':l==='Невро'?'neuro':l==='Кровь'?'hemato':l==='Эндо'?'endo':'repro';
                    let sum=0,cnt=0; for(let m in net[k]){sum+=net[k][m];cnt++;} return cnt?sum/cnt:0;
                });
                if(window.chart) window.chart.destroy();
                window.chart = new Chart(ctx, {
                    type: 'radar',
                    data: { labels: labels, datasets: [{ label: 'Risk', data: data, backgroundColor: 'rgba(3,218,198,0.3)', borderColor: '#03dac6' }] },
                    options: { scales: { r: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }
                });
            }
        },
        calcFertility: () => {
            const v = parseFloat(document.getElementById('semen-vol').value);
            const c = parseFloat(document.getElementById('semen-conc').value);
            if(!v||!c) return;
            const ifScore = Engine.calculateFertilityIndex({volume:v, concentration:c});
            document.getElementById('fertility-result').innerHTML = '<h3>IF: '+ifScore+'</h3>';
        }
    };

    document.getElementById('support-toggle').onchange = App.render;
    App.render();
    
    // Support Schedule
    const sup = document.getElementById('support-schedule');
    DB.supportProtocol.forEach(b => {
        sup.innerHTML += `<div class="time-block"><h3>${b.title}</h3>${b.items.map(i=>'<div>'+i.name+' '+i.dose+'</div>').join('')}</div>`;
    });
});
APPEND

echo "✅ Files created. Pushing..."
git add -A
git commit -m "Stage 2: UI Interface (8 tabs, Charts, Dark Theme)"
git push origin main --force
echo "🚀 Done! Check GitHub Actions."
