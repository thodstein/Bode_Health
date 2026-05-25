document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    const state = { stack: [], supportActive: true };

    // Инициализация табов
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Заполнение селекта препаратами
    const drugSelect = document.getElementById('drug-select');
    if(drugSelect) {
        DB.drugs.forEach(drug => {
            const opt = document.createElement('option');
            opt.value = drug.id;
            opt.textContent = `${drug.name} (${drug.type})`;
            drugSelect.appendChild(opt);
        });
    }

    // Добавление препарата
    const drugForm = document.getElementById('add-drug-form');
    if(drugForm) {
        drugForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('drug-select').value;
            const dose = document.getElementById('drug-dose').value;
            const freq = document.getElementById('drug-freq').value;
            if (!id) return alert('Выберите препарат!');
            
            state.stack.push({ id, dose, freq });
            App.renderAll();
            e.target.reset();
        });
    }

    // Глобальный объект App
    window.App = {
        removeDrug: (idx) => {
            state.stack.splice(idx, 1);
            App.renderAll();
        },
        renderAll: () => {
            App.renderStack();
            App.renderSupport();
            App.calculateAndRenderRisks();
            App.updateDashboard();
        },
        renderStack: () => {
            const list = document.getElementById('stack-list');
            if (!list) return;
            list.innerHTML = '';
            if (state.stack.length === 0) {
                list.innerHTML = '<div class="empty-state">Стек пуст. Добавьте препараты.</div>';
                return;
            }
            state.stack.forEach((item, idx) => {
                const drug = DB.drugs.find(d => d.id === item.id);
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div class="drug-info">
                        <h4>${drug.name}</h4>
                        <p>Доза: ${item.dose} | Частота: ${item.freq || 'N/A'}</p>
                        <small>${drug.note || ''}</small>
                    </div>
                    <button class="btn-delete" onclick="App.removeDrug(${idx})">✕</button>
                `;
                list.appendChild(div);
            });
        },
        renderSupport: () => {
            const container = document.getElementById('support-schedule');
            if (!container) return;
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
        },
        calculateAndRenderRisks: () => {
            const raw = Engine.calculateRawRisks(state.stack);
            const net = Engine.calculateNetRisks(raw, state.supportActive);
            App.renderRiskChart(net);
            App.renderRiskDetails(raw, net);
        },
        renderRiskChart: (data) => {
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
                        label: 'Net Risk Profile',
                        data: values,
                        backgroundColor: 'rgba(3, 218, 198, 0.3)',
                        borderColor: '#03dac6',
                        borderWidth: 2,
                        pointBackgroundColor: '#fff'
                    }]
                },
                options: {
                    scales: { r: { beginAtZero: true, max: 100, ticks: { color: '#b0b0b0' }, grid: { color: '#333' } } },
                    plugins: { legend: { labels: { color: '#fff' } } },
                    responsive: true
                }
            });
        },
        renderRiskDetails: (raw, net) => {
            const container = document.getElementById('risk-details');
            if (!container) return;
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
        },
        updateDashboard: () => {
            const raw = Engine.calculateRawRisks(state.stack);
            const net = Engine.calculateNetRisks(raw, state.supportActive);
            const score = Engine.calculateIntegratedScore(net);
            const readiness = state.stack.length ? Math.max(20, 100 - score) : 100;
            const fatigue = state.stack.length ? Math.min(80, score) : 10;
            
            document.getElementById('dash-readiness').textContent = readiness;
            document.getElementById('dash-fatigue').textContent = fatigue;
            const riskEl = document.getElementById('dash-risk');
            riskEl.textContent = score + '%';
            riskEl.style.color = score > 50 ? '#cf6679' : (score > 30 ? '#ffeb3b' : '#03dac6');
            
            const alertBox = document.getElementById('daily-alert');
            if(state.stack.length === 0) {
                alertBox.textContent = "Добавьте препараты во вкладке 'Стек' для расчета рисков.";
            } else {
                alertBox.textContent = score > 40 ? "⚠️ Высокий риск! Проверьте протокол поддержки." : "✅ Риски в пределах нормы.";
                alertBox.style.borderColor = score > 40 ? '#cf6679' : '#03dac6';
                alertBox.style.color = score > 40 ? '#cf6679' : '#03dac6';
            }
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
        }
    };

    // Toggle Support
    const supportToggle = document.getElementById('support-toggle');
    if(supportToggle) {
        supportToggle.addEventListener('change', (e) => {
            state.supportActive = e.target.checked;
            App.calculateAndRenderRisks();
            App.updateDashboard();
        });
    }

    // Voice Input Mock
    const voiceBtn = document.getElementById('voice-btn');
    if(voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            alert('Голосовой ввод: "Я съел 200г курицы и 100г гречки" (Функция в разработке)');
        });
    }

    // Initial Render
    App.renderAll();
});
