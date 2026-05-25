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
