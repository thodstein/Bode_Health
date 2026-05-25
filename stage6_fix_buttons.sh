#!/bin/bash
echo "🔧 STAGE 6 FIX: Buttons Logic + Content Enrichment"

# Исправляем app.js (Надежная инициализация событий)
cat > assets/js/app.js << 'APPEOF'
document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initialized");
    
    // Инициализация Telegram
    if (window.Telegram && window.Telegram.WebApp) { 
        window.Telegram.WebApp.ready(); 
        window.Telegram.WebApp.expand(); 
    }

    // Глобальное состояние
    window.appState = { 
        stack: [], 
        plan: [], 
        currentWeekIdx: 0, 
        xp: 0,
        chartVisibility: { liver:true, cardio:true, hemato:true, neuro:false, kidney:false, endo:false, repro:false } 
    };

    // --- НАВИГАЦИЯ ---
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
        btn.addEventListener('click', function() {
            tabs.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const target = this.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
            console.log("Tab switched:", target);
        });
    });

    // --- ЗАПОЛНЕНИЕ СЕЛЕКТА ВЕЩЕСТВ ---
    const subSelect = document.getElementById('drug-substance');
    if (subSelect && DB.substances) {
        DB.substances.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            subSelect.appendChild(opt);
        });
    }

    // --- ГЛОБАЛЬНЫЕ ФУНКЦИИ (Window.App) ---
    window.App = {
        loadEsters: function() {
            const subId = document.getElementById('drug-substance').value;
            const estSelect = document.getElementById('drug-ester');
            if (!estSelect) return;
            
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

        addDrug: function(e) {
            e.preventDefault();
            const subId = document.getElementById('drug-substance').value;
            const esterId = document.getElementById('drug-ester').value;
            const doseVal = document.getElementById('drug-dose').value;
            const startVal = document.getElementById('drug-start').value;
            const endVal = document.getElementById('drug-end').value;

            if (!subId || !doseVal) return alert("Заполните обязательные поля!");
            
            const start = parseInt(startVal);
            const end = parseInt(endVal);
            
            if (start >= end) return alert("Неделя финиша должна быть больше старта!");

            window.appState.stack.push({
                substanceId: subId,
                esterId: esterId || 'none',
                dose: parseFloat(doseVal),
                startWeek: start,
                endWeek: end
            });

            App.renderStack();
            
            // Сброс формы
            document.getElementById('drug-dose').value = '';
            document.getElementById('drug-start').value = '1';
            document.getElementById('drug-end').value = '8';
            document.getElementById('drug-ester').disabled = true;
            
            alert("Препарат добавлен в стек!");
        },

        renderStack: function() {
            const list = document.getElementById('stack-list');
            if (!list) return;
            list.innerHTML = '';
            
            if (window.appState.stack.length === 0) {
                list.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">Стек пуст</div>';
                return;
            }

            window.appState.stack.forEach((item, idx) => {
                const sub = DB.substances.find(s => s.id === item.substanceId);
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                
                const div = document.createElement('div');
                div.className = 'drug-card';
                div.innerHTML = `
                    <div>
                        <strong>${sub ? sub.name : item.substanceId}</strong> 
                        ${ester ? '('+ester.name+')' : ''}
                        <br><small>💉 ${item.dose}мг/нед | 📅 Недели ${item.startWeek}-${item.endWeek}</small>
                    </div>
                    <button class="btn-delete" onclick="App.removeDrug(${idx})">✕</button>
                `;
                list.appendChild(div);
            });
        },

        removeDrug: function(idx) {
            window.appState.stack.splice(idx, 1);
            App.renderStack();
        },

        generatePlan: function() {
            if (window.appState.stack.length === 0) return alert("Сначала добавьте препараты в стек!");
            
            window.appState.plan = Engine.generateWeeklyPlan(window.appState.stack, 24);
            window.appState.currentWeekIdx = 0;
            
            App.renderHeatmap();
            App.renderTrendChart();
            
            const out = document.getElementById('weekly-plan-output');
            if (out) {
                out.innerHTML = `<div class="alert-box" style="background:rgba(3,218,198,0.1); border-color:#03dac6; color:#03dac6">
                    ✅ Курс рассчитан на ${window.appState.plan.length} недель (включая период выведения).
                </div>`;
            }
            
            // XP Gain
            window.appState.xp += 150;
            document.getElementById('xp-display').textContent = `XP: ${window.appState.xp}`;
        },

        changeWeek: function(dir) {
            if (!window.appState.plan.length) return;
            window.appState.currentWeekIdx += dir;
            if (window.appState.currentWeekIdx < 0) window.appState.currentWeekIdx = 0;
            if (window.appState.currentWeekIdx >= window.appState.plan.length) window.appState.currentWeekIdx = window.appState.plan.length - 1;
            App.renderHeatmap();
        },

        toggleChart: function(sys) {
            window.appState.chartVisibility[sys] = !window.appState.chartVisibility[sys];
            App.renderTrendChart();
        },

        renderHeatmap: function() {
            const container = document.getElementById('heatmap-container');
            const weekDisplay = document.getElementById('current-week-display');
            if (!container || !window.appState.plan.length) return;

            const weekData = window.appState.plan[window.appState.currentWeekIdx];
            weekDisplay.textContent = `Неделя ${weekData.week}`;
            
            container.innerHTML = '';
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(110px, 1fr))';
            container.style.gap = '8px';

            for (let sys in DB.riskMatrix) {
                // Заголовок системы
                const sysTitle = document.createElement('div');
                sysTitle.style.gridColumn = '1 / -1';
                sysTitle.style.marginTop = '15px';
                sysTitle.style.marginBottom = '5px';
                sysTitle.style.color = '#bb86fc';
                sysTitle.style.fontWeight = 'bold';
                sysTitle.style.fontSize = '1.1em';
                sysTitle.style.borderBottom = '1px solid #333';
                sysTitle.textContent = sys.toUpperCase();
                container.appendChild(sysTitle);

                // Ячейки механизмов
                DB.riskMatrix[sys].mechanisms.forEach(mech => {
                    const val = weekData.risks[sys][mech.id] || 0;
                    const color = Engine.getRiskColor(val);
                    
                    const cell = document.createElement('div');
                    cell.className = 'heatmap-cell';
                    cell.style.backgroundColor = color;
                    cell.style.padding = '12px 8px';
                    cell.style.borderRadius = '6px';
                    cell.style.color = val > 50 ? '#000' : '#fff';
                    cell.style.textAlign = 'center';
                    cell.style.fontSize = '0.85em';
                    cell.style.cursor = 'help';
                    cell.style.transition = 'transform 0.2s';
                    cell.onmouseover = function() { this.style.transform = 'scale(1.05)'; this.style.zIndex = '10'; };
                    cell.onmouseout = function() { this.style.transform = 'scale(1)'; this.style.zIndex = '1'; };
                    
                    cell.innerHTML = `
                        <div style="font-weight:600; margin-bottom:4px;">${mech.name}</div>
                        <div style="font-size:1.2em; font-weight:bold;">${val}%</div>
                        <div style="font-size:0.7em; opacity:0.8; margin-top:2px;">${mech.desc}</div>
                    `;
                    container.appendChild(cell);
                });
            }
        },

        renderTrendChart: function() {
            const ctx = document.getElementById('risk-trend-chart');
            if (!ctx || !window.appState.plan.length) return;
            
            if (window.trendChartInstance) {
                window.trendChartInstance.destroy();
            }

            const labels = window.appState.plan.map(p => `W${p.week}`);
            const datasets = [];
            const colors = { 
                liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', 
                neuro: '#9966ff', kidney: '#4bc0c0', endo: '#c9cbcf', repro: '#e7e9ed' 
            };

            for (let sys in window.appState.chartVisibility) {
                if (window.appState.chartVisibility[sys]) {
                    const data = window.appState.plan.map(p => {
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
                        fill: false,
                        tension: 0.3,
                        pointRadius: 2
                    });
                }
            }

            window.trendChartInstance = new Chart(ctx, {
                type: 'line',
                data: { labels, datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: { 
                        legend: { labels: { color: '#b0b0b0', font: {size: 10} } },
                        tooltip: { mode: 'index', intersect: false }
                    },
                    scales: {
                        y: { 
                            beginAtZero: true, 
                            max: 100, 
                            ticks: { color: '#666' }, 
                            grid: { color: '#333' } 
                        },
                        x: { 
                            ticks: { color: '#666' }, 
                            grid: { display: false } 
                        }
                    }
                }
            });
        },

        calcFertility: function() {
            const v = parseFloat(document.getElementById('semen-vol').value);
            const c = parseFloat(document.getElementById('semen-conc').value);
            const p = parseFloat(document.getElementById('semen-pr').value);
            const m = parseFloat(document.getElementById('semen-morph').value);
            
            if(!v || !c) return alert("Введите объем и концентрацию");
            
            const score = Engine.calculateFertilityIndex({ volume: v, concentration: c, pr: p, morphology: m });
            const resDiv = document.getElementById('fertility-result');
            const color = score > 60 ? '#03dac6' : (score > 30 ? '#ff9800' : '#f44336');
            resDiv.innerHTML = `<h3 style="color:${color}">IF: ${score}/100</h3><p>${score > 60 ? 'Норма' : 'Требуется внимание'}</p>`;
        },

        exportJSON: function() {
            const dataStr = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.appState));
            const node = document.createElement('a');
            node.setAttribute("href", dataStr);
            node.setAttribute("download", "bode_health_backup.json");
            document.body.appendChild(node);
            node.click();
            node.remove();
        },

        renderShop: function() {
            const list = document.getElementById('shop-list');
            if (!list || !DB.shopItems) return;
            list.innerHTML = '';
            
            for (const [key, items] of Object.entries(DB.shopItems)) {
                items.forEach(item => {
                    list.innerHTML += `
                        <div class="drug-card">
                            <div>
                                <strong>${key.toUpperCase()}</strong><br>
                                <small style="color:#aaa">${item.platform}</small>
                            </div>
                            <div style="display:flex; align-items:center; gap:10px;">
                                <span style="color:#03dac6; font-weight:bold;">${item.price}</span>
                                <a href="${item.url}" target="_blank" class="btn-primary" style="padding:6px 12px; font-size:0.8em; text-decoration:none;">Купить</a>
                            </div>
                        </div>
                    `;
                });
            }
        },

        renderGlossary: function() {
            const list = document.getElementById('glossary-list');
            if (!list || !DB.glossary) return;
            list.innerHTML = '';
            
            for (const [term, def] of Object.entries(DB.glossary)) {
                list.innerHTML += `
                    <div class="support-item" style="margin-bottom:10px;">
                        <strong style="color:#bb86fc; font-size:1.1em;">${term}</strong>
                        <p style="margin:5px 0 0; color:#ccc; line-height:1.4;">${def}</p>
                    </div>
                `;
            }
        }
    };

    // --- ПРИВЯЗКА СОБЫТИЙ ---
    const form = document.getElementById('add-drug-form');
    if (form) form.addEventListener('submit', window.App.addDrug);

    // Инициализация контента
    window.App.renderStack();
    window.App.renderShop();
    window.App.renderGlossary();
    
    // Обновление XP при загрузке (если есть сохранение)
    document.getElementById('xp-display').textContent = `XP: ${window.appState.xp}`;
});
APPEOF

# Обновляем CSS для кнопок и heatmap
cat >> assets/css/style.css << 'CSSEOF'

/* Fix for Buttons */
button:active { transform: scale(0.98); }
.btn-delete:hover { background: rgba(207, 102, 121, 0.4); }
.heatmap-cell { user-select: none; }

/* Scrollbar for Tabs */
.tabs::-webkit-scrollbar { height: 4px; }
.tabs::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
CSSEOF

echo "🚀 Committing Fix..."
git add -A
git commit -m "Stage 6 FIXED: Buttons Logic, Content Enrichment, Heatmap UI Polish"
git push origin main --force

echo "✅ Done! Check site."
