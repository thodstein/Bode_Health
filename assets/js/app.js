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
