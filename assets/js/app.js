document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    const state = {
        stack: [],
        supportActive: true,
        courseWeeks: 10,
        trustScore: 0,
        xp: 0
    };

    // Init UI Renderer
    UIRenderer.init();
    UIRenderer.renderEsters(); // Новые эфиры

    // Add Drug Logic
    document.getElementById('add-drug-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const drugId = document.getElementById('drug-select').value;
        const esterId = document.getElementById('ester-select').value;
        const dose = parseFloat(document.getElementById('drug-dose').value);
        const freqVal = parseFloat(document.getElementById('drug-freq-val').value);
        const freqPeriod = document.getElementById('drug-freq-period').value;
        const weeks = parseInt(document.getElementById('course-weeks').value);

        if (!drugId || !esterId) return alert('Выберите вещество и эфир!');

        state.stack.push({
            id: drugId,
            ester: esterId,
            dose: dose,
            freq: `${freqVal}x/${freqPeriod === 'week' ? 'нед' : 'день'}`,
            weeks: weeks
        });

        state.courseWeeks = Math.max(state.courseWeeks, weeks);
        App.updateAll();
        App.gainXP(50); // XP за действие
        e.target.reset();
    });

    // Global App Object
    window.App = {
        updateAll: () => {
            UIRenderer.renderStackList(state.stack, App.removeDrug);
            App.generateWeeklyPlanUI();
            App.calculateAndRenderRisks();
            App.updateDashboard();
            App.renderShop();
            App.renderArticles();
            App.renderAchievements();
        },
        removeDrug: (idx) => {
            state.stack.splice(idx, 1);
            App.updateAll();
        },
        calculateAndRenderRisks: () => {
            const raw = Engine.calculateRawRisks(state.stack);
            const net = Engine.calculateNetRisks(raw, state.supportActive);
            App.renderRiskChart(net);
            App.renderRiskDetails(raw, net);
        },
        generateWeeklyPlanUI: () => {
            const plan = Engine.generateWeeklyPlan(state.stack, state.courseWeeks);
            const selector = document.getElementById('week-selector');
            selector.innerHTML = '';
            plan.forEach((week, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = `Неделя ${idx + 1}`;
                selector.appendChild(opt);
            });
            App.renderWeekSupport(); // Рендер первой недели
        },
        renderWeekSupport: () => {
            const weekIdx = document.getElementById('week-selector').value;
            const plan = Engine.generateWeeklyPlan(state.stack, state.courseWeeks);
            const container = document.getElementById('support-schedule');
            if (!plan[weekIdx]) return;
            
            // Отображаем поддержку для выбранной недели + алерты
            let html = '';
            if (plan[weekIdx].alerts.length > 0) {
                html += `<div class="alert-box">${plan[weekIdx].alerts.join('<br>')}</div>`;
            }
            // Рендерим стандартный протокол (в полной версии фильтруется по неделе)
            DB.supportProtocol.forEach(block => {
                html += `<div class="time-block"><h3>${block.title}</h3>`;
                block.items.forEach(item => {
                    html += `<div class="support-item"><div class="item-header"><span class="item-name">${item.name}</span><span class="item-dose">${item.dose}</span></div><div class="item-mechanism">${item.mechanism}</div></div>`;
                });
                html += `</div>`;
            });
            container.innerHTML = html;
        },
        renderRiskChart: (data) => {
            const ctx = document.getElementById('risk-chart');
            if (!ctx) return;
            const labels = ['Печень', 'Кардио', 'Почки', 'Невро', 'Кровь', 'Эндо', 'Репро'];
            const values = labels.map(sys => {
                const key = sys === 'Печень' ? 'liver' : sys === 'Кардио' ? 'cardio' : sys === 'Почки' ? 'kidney' : sys === 'Невро' ? 'neuro' : sys === 'Кровь' ? 'hemato' : sys === 'Эндо' ? 'endo' : 'repro';
                let sum = 0, cnt = 0;
                for(let m in data[key]) { sum += data[key][m]; cnt++; }
                return cnt ? Math.round(sum/cnt) : 0;
            });
            if (window.riskChartInstance) window.riskChartInstance.destroy();
            window.riskChartInstance = new Chart(ctx, {
                type: 'radar',
                data: { labels: labels, datasets: [{ label: 'Net Risk', data: values, backgroundColor: 'rgba(3, 218, 198, 0.3)', borderColor: '#03dac6', borderWidth: 2 }] },
                options: { scales: { r: { beginAtZero: true, max: 100, ticks: { color: '#b0b0b0' } } }, plugins: { legend: { labels: { color: '#fff' } } } }
            });
        },
        renderRiskDetails: (raw, net) => {
            const container = document.getElementById('risk-details');
            if (!container) return;
            let html = '<div class="risk-comparison">';
            for (let sys in raw) {
                let rAvg = 0, nAvg = 0, c = 0;
                for (let m in raw[sys]) { rAvg += raw[sys][m]; nAvg += net[sys][m]; c++; }
                rAvg = Math.round(rAvg/c); nAvg = Math.round(nAvg/c);
                html += `<div class="risk-row"><span class="sys-name">${sys.toUpperCase()}</span><div class="bars"><div class="bar-bg"><div class="bar-fill bar-raw" style="width:${rAvg}%"></div></div><div class="bar-bg"><div class="bar-fill bar-net" style="width:${nAvg}%"></div></div></div><span class="diff ${rAvg>nAvg?'good':'bad'}">${rAvg-nAvg}</span></div>`;
            }
            container.innerHTML = html + '</div>';
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
            riskEl.style.color = score > 50 ? '#cf6679' : '#03dac6';

            // Прогноз (Mock)
            document.getElementById('prediction-box').innerHTML = `
                <strong>Прогноз на 7 дней:</strong><br>
                Readiness: ${readiness} → ${readiness-5} (Тренд вниз)<br>
                Рекомендация: Добавить кардио 2 раза в неделю.
            `;
        },
        gainXP: (amount) => {
            state.xp += amount;
            state.trustScore = Math.min(100, Math.floor(state.xp / 10));
            document.getElementById('xp-badge').textContent = `XP: ${state.xp}`;
            document.getElementById('trust-badge').textContent = `Trust: ${state.trustScore}`;
        },
        calcFertility: () => {
            const v = parseFloat(document.getElementById('semen-vol').value);
            const c = parseFloat(document.getElementById('semen-conc').value);
            const pr = parseFloat(document.getElementById('semen-pr').value);
            const m = parseFloat(document.getElementById('semen-morph').value);
            if(!v||!c) return alert('Введите данные');
            const ifScore = Engine.calculateFertilityIndex({volume:v, concentration:c, pr, morphology:m});
            document.getElementById('fertility-result').innerHTML = `<h2 style="color:${ifScore>60?'#03dac6':'#cf6679'}">IF: ${ifScore}/100</h2>`;
        },
        exportJSON: () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr);
            node.setAttribute("download", "bode_health_backup.json");
            document.body.appendChild(node);
            node.click();
            node.remove();
        },
        renderShop: () => {
            const list = document.getElementById('shop-list');
            if(!list) return;
            list.innerHTML = '';
            // Пример маппинга
            for (const [drugId, offers] of Object.entries(DB.shopMapping)) {
                offers.forEach(offer => {
                    list.innerHTML += `<div class="drug-card"><div><b>${drugId.toUpperCase()}</b> <small>(${offer.platform})</small><br>${offer.price}</div><button class="btn-primary">Купить</button></div>`;
                });
            }
        },
        renderArticles: () => {
            const list = document.getElementById('articles-list');
            if(!list) return;
            list.innerHTML = DB.articles.map(a => `<div class="drug-card"><b>${a.title}</b><br><small>👁 ${a.views}</small></div>`).join('');
        },
        renderAchievements: () => {
            const list = document.getElementById('achievements-list');
            if(!list) return;
            list.innerHTML = DB.achievements.map(a => `<div class="drug-card"><span>${a.icon} ${a.title}</span><small>${a.desc}</small></div>`).join('');
        }
    };

    // What-If Slider
    const slider = document.getElementById('sim-slider');
    if(slider) {
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            document.getElementById('sim-val').textContent = val + ' мг';
            if (state.stack.length === 0) return;
            
            // Симуляция изменения первого препарата (для демо)
            const simResult = Engine.simulateWhatIf(state.stack, { [state.stack[0].id]: { dose: parseFloat(val) } });
            const avgRisk = Engine.calculateIntegratedScore(simResult.net);
            
            const resBox = document.getElementById('sim-result');
            resBox.style.display = 'block';
            resBox.innerHTML = `При дозе ${val} мг: Интегральный риск <b>${avgRisk}%</b>`;
        });
    }

    // Support Toggle
    document.getElementById('support-toggle').addEventListener('change', (e) => {
        state.supportActive = e.target.checked;
        App.calculateAndRenderRisks();
        App.updateDashboard();
    });

    // Voice Mock
    document.getElementById('voice-btn').addEventListener('click', () => {
        alert('Слушаю... (Скажите: "Съел 200 грамм курицы")');
    });

    // Init
    App.updateAll();
});
