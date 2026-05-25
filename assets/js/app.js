document.addEventListener('DOMContentLoaded', () => {
    // Init Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        document.documentElement.style.setProperty('--bg-dark', window.Telegram.WebApp.themeParams.bg_color || '#121212');
    }

    // State
    const state = {
        stack: JSON.parse(localStorage.getItem('bh_stack')) || [],
        food: JSON.parse(localStorage.getItem('bh_food')) || [],
        supportActive: true,
        currentRiskView: 'raw'
    };

    // DOM Elements
    const els = {
        drugSelect: document.getElementById('drug-select'),
        stackList: document.getElementById('stack-list'),
        supportSchedule: document.getElementById('support-schedule'),
        riskDetails: document.getElementById('risk-details'),
        foodLog: document.getElementById('food-log'),
        dashReadiness: document.getElementById('dash-readiness'),
        dashFatigue: document.getElementById('dash-fatigue'),
        dashRisk: document.getElementById('dash-risk'),
        alertBox: document.getElementById('daily-alert')
    };

    // 1. Init Drug Select
    DB.drugs.forEach(drug => {
        const opt = document.createElement('option');
        opt.value = drug.id;
        opt.textContent = `${drug.name} (${drug.type})`;
        els.drugSelect.appendChild(opt);
    });

    // 2. Render Functions
    function renderStack() {
        els.stackList.innerHTML = '';
        if (state.stack.length === 0) {
            els.stackList.innerHTML = '<p style="text-align:center;color:#666;">Стек пуст. Добавьте препараты.</p>';
            return;
        }
        state.stack.forEach((item, idx) => {
            const drug = DB.drugs.find(d => d.id === item.id);
            const div = document.createElement('div');
            div.className = 'item-card';
            div.innerHTML = `
                <div>
                    <strong>${drug.name}</strong>
                    <small>${item.dose} ${item.freq}</small>
                </div>
                <button class="btn-danger" style="padding:5px 10px;" onclick="app.removeDrug(${idx})">✕</button>
            `;
            els.stackList.appendChild(div);
        });
        localStorage.setItem('bh_stack', JSON.stringify(state.stack));
        updateCalculations();
    }

    function renderSupport() {
        els.supportSchedule.innerHTML = '';
        DB.supportProtocol.forEach(block => {
            const div = document.createElement('div');
            div.className = 'time-block';
            div.innerHTML = `<h3>${block.label}</h3>`;
            block.items.forEach(item => {
                div.innerHTML += `
                    <div class="support-item">
                        <div><span class="dose">${item.name}</span> <span style="color:#fff">${item.dose}</span></div>
                        <span class="mech">${item.mechanism}</span>
                    </div>
                `;
            });
            els.supportSchedule.appendChild(div);
        });
    }

    function renderFood() {
        els.foodLog.innerHTML = '';
        state.food.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'item-card';
            div.innerHTML = `
                <div><strong>${item.name}</strong> <small>${item.weight}г</small></div>
                <button class="btn-danger" style="padding:5px 10px;" onclick="app.removeFood(${idx})">✕</button>
            `;
            els.foodLog.appendChild(div);
        });
        localStorage.setItem('bh_food', JSON.stringify(state.food));
    }

    // 3. Calculations Core
    function updateCalculations() {
        const rawRisks = Engine.calculateRawRisks(state.stack);
        const netRisks = Engine.calculateNetRisks(rawRisks, state.supportActive);
        
        // Avg Risk Calc
        const getAvg = (r) => {
            let sum = 0, cnt = 0;
            for(let s in r) for(let m in r[s]) { sum += r[s][m]; cnt++; }
            return Math.round(sum / cnt);
        };

        const avgRaw = getAvg(rawRisks);
        const avgNet = getAvg(netRisks);

        // Mock Readiness/Fatigue based on stack size and risk
        const baseReadiness = 90 - (state.stack.length * 5);
        const baseFatigue = 10 + (state.stack.length * 8);
        
        els.dashReadiness.textContent = Math.max(0, baseReadiness);
        els.dashFatigue.textContent = Math.min(100, baseFatigue);
        els.dashRisk.textContent = `${avgRaw}% → ${avgNet}%`;

        // Alerts
        if (avgRaw > 50) {
            els.alertBox.innerHTML = `⚠️ <strong>Внимание!</strong> Сырой риск ${avgRaw}%. Рекомендуется усилить поддержку (УДХК, Телмисартан).`;
        } else {
            els.alertBox.innerHTML = `✅ Риски под контролем. Продолжайте мониторинг.`;
        }

        // Store risks for chart
        state.currentRisks = { raw: rawRisks, net: netRisks };
        if (state.currentRiskView === 'raw') drawRiskChart(rawRisks);
        else drawRiskChart(netRisks);
    }

    // 4. Charts
    let riskChart = null;
    function drawRiskChart(data) {
        const ctx = document.getElementById('risk-chart').getContext('2d');
        const labels = ['Печень', 'Кардио', 'Почки', 'Невро', 'Кровь', 'Эндо', 'Репро'];
        const values = [
            (data.liver.cholestasis + data.liver.cytolysis)/2,
            (data.cardio.htn + data.cardio.lipids)/2,
            (data.kidney.hyperfiltration + data.kidney.fibrosis)/2,
            (data.neuro.dopamine + data.neuro.anxiety)/2,
            (data.hemato.erythrocytosis + data.hemato.rheology)/2,
            (data.endo.insulin_resist + data.endo.prolactin)/2,
            (data.repro.atrophy + data.repro.suppression)/2
        ];

        if (riskChart) riskChart.destroy();
        riskChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: state.currentRiskView === 'raw' ? 'RAW Risk' : 'NET Risk',
                    data: values,
                    backgroundColor: state.currentRiskView === 'raw' ? 'rgba(207, 102, 121, 0.4)' : 'rgba(3, 218, 198, 0.4)',
                    borderColor: state.currentRiskView === 'raw' ? '#cf6679' : '#03dac6',
                    borderWidth: 2,
                    pointBackgroundColor: '#fff'
                }]
            },
            options: {
                scales: { 
                    r: { 
                        beginAtZero: true, 
                        max: 100, 
                        ticks: { color: '#b0b0b0', stepSize: 20 },
                        grid: { color: '#333' },
                        angleLines: { color: '#333' },
                        pointLabels: { color: '#fff', font: { size: 12 } }
                    } 
                },
                plugins: { legend: { labels: { color: '#fff' } } },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // 5. Event Listeners
    document.getElementById('add-drug-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.stack.push({
            id: document.getElementById('drug-select').value,
            dose: document.getElementById('drug-dose').value,
            freq: document.getElementById('drug-freq').value
        });
        renderStack();
        e.target.reset();
    });

    document.getElementById('support-toggle').addEventListener('change', (e) => {
        state.supportActive = e.target.checked;
        updateCalculations();
    });

    document.getElementById('food-form').addEventListener('submit', (e) => {
        e.preventDefault();
        state.food.push({
            name: document.getElementById('food-name').value,
            weight: document.getElementById('food-weight').value
        });
        renderFood();
        e.target.reset();
    });

    // Voice Input Mock
    document.getElementById('voice-btn').addEventListener('click', () => {
        const status = document.getElementById('voice-status');
        status.textContent = "Слушаю...";
        status.style.color = "var(--error)";
        setTimeout(() => {
            status.textContent = "Распознавание не доступно в демо-режиме. Введите вручную.";
            status.style.color = "var(--text-sec)";
        }, 2000);
    });

    // Global App Methods
    window.app = {
        removeDrug: (idx) => { state.stack.splice(idx, 1); renderStack(); },
        removeFood: (idx) => { state.food.splice(idx, 1); renderFood(); },
        calcFertility: () => {
            const data = {
                volume: parseFloat(document.getElementById('semen-vol').value),
                concentration: parseFloat(document.getElementById('semen-conc').value),
                total: parseFloat(document.getElementById('semen-total').value),
                pr: parseFloat(document.getElementById('semen-pr').value),
                morphology: parseFloat(document.getElementById('semen-morph').value)
            };
            const score = Engine.calculateFertilityIndex(data);
            const resDiv = document.getElementById('fertility-result');
            let color = score > 60 ? 'var(--success)' : (score > 30 ? 'var(--warning)' : 'var(--error)');
            let text = score > 60 ? 'Норма' : (score > 30 ? 'Умеренное снижение' : 'Критическое снижение');
            resDiv.innerHTML = `<span style="color:${color}">IF: ${score}/100 (${text})</span>`;
        },
        renderRisks: (type) => {
            state.currentRiskView = type;
            document.querySelectorAll('.risk-toggles .toggle').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
            drawRiskChart(state.currentRisks[type]);
        }
    };

    // Init
    renderStack();
    renderSupport();
    renderFood();
    
    // Date
    document.getElementById('date-display').textContent = new Date().toLocaleDateString('ru-RU');
});
