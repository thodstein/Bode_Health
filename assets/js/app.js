// Глобальное состояние приложения
const AppState = {
    stack: [],
    plan: [],
    currentWeekIndex: 0,
    xp: 0,
    chartVisibility: {
        liver: true,
        cardio: true,
        hemato: true,
        kidney: false,
        neuro: false,
        endo: false,
        repro: false
    }
};

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bode Health App Starting...');
    
    // Проверка загрузки БД
    if (typeof DB === 'undefined') {
        alert('Ошибка: База данных не загружена! Проверьте подключение database.js');
        return;
    }

    App.init();
});

const App = {
    init: function() {
        this.populateSubstanceSelect();
        this.renderSupportProtocol();
        this.renderArticlesList();
        this.renderShopList();
        this.renderGlossaryList();
        this.renderChartControls();
        console.log('App Initialized successfully.');
    },

    // Переключение вкладок
    switchTab: function(tabId) {
        // Скрыть все вкладки
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        
        // Показать нужную
        const target = document.getElementById(tabId);
        if (target) target.classList.add('active');
        
        // Подсветка кнопки (простой поиск по индексу или тексту, здесь хардкод для надежности)
        const buttons = document.querySelectorAll('.tab-btn');
        if (tabId === 'dashboard') buttons[0].classList.add('active');
        else if (tabId === 'stack') buttons[1].classList.add('active');
        else if (tabId === 'risks') {
            buttons[2].classList.add('active');
            // Перерисовать графики при открытии вкладки рисков
            setTimeout(() => {
                this.renderRiskChart();
                this.renderHeatmap();
            }, 100);
        }
        else if (tabId === 'support') buttons[3].classList.add('active');
        else if (tabId === 'labs') buttons[4].classList.add('active');
        else if (tabId === 'articles') buttons[5].classList.add('active');
        else if (tabId === 'shop') buttons[6].classList.add('active');
    },

    populateSubstanceSelect: function() {
        const select = document.getElementById('sub-select');
        if (!select) return;
        select.innerHTML = '<option value="">Выберите вещество...</option>';
        DB.substances.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.id;
            option.textContent = sub.name + ' (' + sub.class + ')';
            select.appendChild(option);
        });
    },

    loadEsters: function() {
        const subId = document.getElementById('sub-select').value;
        const esterSelect = document.getElementById('est-select');
        if (!esterSelect) return;
        
        esterSelect.innerHTML = '';
        
        if (subId && DB.esters[subId]) {
            esterSelect.disabled = false;
            DB.esters[subId].forEach(est => {
                const option = document.createElement('option');
                option.value = est.id;
                option.textContent = `${est.name} (T1/2: ${est.hl} дн.)`;
                esterSelect.appendChild(option);
            });
        } else {
            esterSelect.disabled = true;
            const option = document.createElement('option');
            option.textContent = 'Нет эфиров (Орал/Пептид)';
            esterSelect.appendChild(option);
        }
    },

    addDrugToStack: function() {
        const subId = document.getElementById('sub-select').value;
        const estId = document.getElementById('est-select').value;
        const doseVal = document.getElementById('in-dose').value;
        const startVal = document.getElementById('in-start').value;
        const endVal = document.getElementById('in-end').value;

        if (!subId) { alert('Выберите вещество!'); return; }
        if (!doseVal || parseFloat(doseVal) <= 0) { alert('Введите корректную дозу!'); return; }
        
        const startWeek = parseInt(startVal);
        const endWeek = parseInt(endVal);
        
        if (startWeek >= endWeek) { alert('Неделя финиша должна быть больше недели старта!'); return; }

        AppState.stack.push({
            sub: subId,
            est: estId,
            dose: parseFloat(doseVal),
            start: startWeek,
            end: endWeek
        });

        this.renderStackList();
        
        // Очистка полей
        document.getElementById('in-dose').value = '';
        document.getElementById('in-start').value = '1';
        document.getElementById('in-end').value = '8';
        if(document.getElementById('est-select')) document.getElementById('est-select').disabled = true;
    },

    renderStackList: function() {
        const listDiv = document.getElementById('stack-list');
        if (!listDiv) return;
        listDiv.innerHTML = '';

        if (AppState.stack.length === 0) {
            listDiv.innerHTML = '<div style="text-align:center; color:#888; padding:20px;">Стек пуст</div>';
            return;
        }

        AppState.stack.forEach((item, index) => {
            const sub = DB.substances.find(s => s.id === item.sub);
            const est = item.est ? DB.esters[item.sub]?.find(e => e.id === item.est) : null;
            
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <div>
                    <strong>${sub ? sub.name : 'Unknown'}</strong> 
                    ${est ? '(' + est.name + ')' : ''}<br>
                    <small style="color:#aaa">
                        ${item.dose} мг/нед | Недели ${item.start} – ${item.end}
                    </small>
                </div>
                <button class="btn-del" onclick="App.removeDrug(${index})">✕</button>
            `;
            listDiv.appendChild(div);
        });
    },

    removeDrug: function(index) {
        AppState.stack.splice(index, 1);
        this.renderStackList();
    },

    calculateCoursePlan: function() {
        if (AppState.stack.length === 0) {
            alert('Добавьте хотя бы один препарат в стек!');
            return;
        }

        AppState.plan = Engine.generatePlan(AppState.stack);
        AppState.currentWeekIndex = 0;

        // Обновление UI
        const msgDiv = document.getElementById('plan-msg');
        if (msgDiv) {
            msgDiv.textContent = `План рассчитан на ${AppState.plan.length} недель (включая период выведения).`;
            msgDiv.style.color = 'var(--sec)';
        }

        // Обновление Dashboard
        const firstWeekRisks = AppState.plan[0].risks;
        let totalRisk = 0;
        let count = 0;
        for (let sys in firstWeekRisks) {
            for (let m in firstWeekRisks[sys]) {
                totalRisk += firstWeekRisks[sys][m];
                count++;
            }
        }
        const avgRisk = count > 0 ? Math.round(totalRisk / count) : 0;
        
        document.getElementById('d-risk').textContent = avgRisk + '%';
        document.getElementById('d-readiness').textContent = Math.max(0, 100 - avgRisk);

        // XP
        AppState.xp += 150;
        document.getElementById('xp-display').textContent = 'XP: ' + AppState.xp;

        // Рендер графиков
        this.renderRiskChart();
        this.renderHeatmap();
        
        // Переключиться на вкладку рисков? Нет, оставим пользователя решать.
        alert('Расчет завершен! Перейдите во вкладку "Риски" для просмотра.');
    },

    changeWeek: function(direction) {
        if (AppState.plan.length === 0) return;
        
        AppState.currentWeekIndex += direction;
        if (AppState.currentWeekIndex < 0) AppState.currentWeekIndex = 0;
        if (AppState.currentWeekIndex >= AppState.plan.length) AppState.currentWeekIndex = AppState.plan.length - 1;

        this.renderHeatmap();
    },

    toggleChartSystem: function(system) {
        AppState.chartVisibility[system] = !AppState.chartVisibility[system];
        this.renderRiskChart();
    },

    renderChartControls: function() {
        const container = document.getElementById('chart-controls');
        if (!container) return;
        
        const labels = {
            liver: 'Печень', cardio: 'Сердце', hemato: 'Кровь',
            kidney: 'Почки', neuro: 'Нервы', endo: 'Гормоны', repro: 'Репро'
        };

        container.innerHTML = '';
        for (const [key, label] of Object.entries(labels)) {
            const isChecked = AppState.chartVisibility[key] ? 'checked' : '';
            container.innerHTML += `
                <label>
                    <input type="checkbox" ${isChecked} onchange="App.toggleChartSystem('${key}')">
                    ${label}
                </label>
            `;
        }
    },

    renderRiskChart: function() {
        const canvas = document.getElementById('trend-chart');
        if (!canvas || AppState.plan.length === 0) return;
        
        const ctx = canvas.getContext('2d');
        if (window.riskChartInstance) {
            window.riskChartInstance.destroy();
        }

        const labels = AppState.plan.map(p => 'Нед ' + p.week);
        const datasets = [];
        const colors = {
            liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40',
            kidney: '#4bc0c0', neuro: '#9966ff', endo: '#c9cbcf', repro: '#e7e9ed'
        };

        for (const [sys, visible] of Object.entries(AppState.chartVisibility)) {
            if (!visible) continue;

            const dataPoints = AppState.plan.map(weekData => {
                const risks = weekData.risks[sys];
                let sum = 0;
                let count = 0;
                for (let key in risks) {
                    sum += risks[key];
                    count++;
                }
                return count > 0 ? Math.round(sum / count) : 0;
            });

            datasets.push({
                label: sys.toUpperCase(),
                data: dataPoints,
                borderColor: colors[sys],
                backgroundColor: colors[sys],
                borderWidth: 2,
                fill: false,
                tension: 0.4
            });
        }

        window.riskChartInstance = new Chart(ctx, {
            type: 'line',
            data: { labels: labels, datasets: datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#ffffff' } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#aaaaaa' },
                        grid: { color: '#333333' }
                    },
                    x: {
                        ticks: { color: '#aaaaaa' },
                        grid: { color: '#333333' }
                    }
                }
            }
        });
    },

    renderHeatmap: function() {
        const container = document.getElementById('heatmap');
        if (!container || AppState.plan.length === 0) return;

        const currentData = AppState.plan[AppState.currentWeekIndex];
        document.getElementById('week-label').textContent = 'Неделя ' + currentData.week;

        container.innerHTML = '';

        for (const [sysName, mechanisms] of Object.entries(DB.risks)) {
            // Заголовок системы
            const header = document.createElement('div');
            header.style.gridColumn = '1 / -1';
            header.style.marginTop = '15px';
            header.style.marginBottom = '5px';
            header.style.color = 'var(--pri)';
            header.style.fontWeight = 'bold';
            header.style.textTransform = 'uppercase';
            header.style.fontSize = '0.9rem';
            header.textContent = sysName;
            container.appendChild(header);

            // Ячейки механизмов
            mechanisms.forEach(mech => {
                const riskValue = currentData.risks[sysName][mech.id] || 0;
                const color = Engine.getRiskColor(riskValue);
                const textColor = riskValue > 50 ? '#000000' : '#ffffff';

                const cell = document.createElement('div');
                cell.className = 'hm-cell';
                cell.style.backgroundColor = color;
                cell.style.color = textColor;
                cell.title = mech.d; // Tooltip с описанием
                cell.innerHTML = `<div style="font-size:0.7em">${mech.n}</div><div style="font-weight:bold">${riskValue}%</div>`;
                
                container.appendChild(cell);
            });
        }
    },

    renderSupportProtocol: function() {
        const container = document.getElementById('support-list');
        if (!container) return;
        container.innerHTML = '';

        DB.support.forEach(block => {
            const blockDiv = document.createElement('div');
            blockDiv.className = 'time-block';
            
            let itemsHtml = '';
            block.items.forEach(item => {
                itemsHtml += `
                    <div class="item" style="margin: 8px 0; padding: 12px; flex-direction: column; align-items: flex-start;">
                        <div style="display:flex; justify-content:space-between; width:100%">
                            <strong style="color:var(--sec)">${item.n}</strong>
                            <span style="font-size:0.9em; color:#aaa">${item.d}</span>
                        </div>
                        <div style="font-size:0.85em; color:#ccc; margin-top:4px;">${item.m}</div>
                        ${item.note ? `<div style="font-size:0.8em; color:var(--err); margin-top:4px;">⚠️ ${item.note}</div>` : ''}
                    </div>
                `;
            });

            blockDiv.innerHTML = `<h3>${block.t}</h3>${itemsHtml}`;
            container.appendChild(blockDiv);
        });
    },

    calculateFertility: function() {
        const vol = parseFloat(document.getElementById('lab-vol').value) || 0;
        const conc = parseFloat(document.getElementById('lab-conc').value) || 0;
        const pr = parseFloat(document.getElementById('lab-pr').value) || 0;
        
        const score = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr: pr });
        
        const resDiv = document.getElementById('fert-res');
        if (!resDiv) return;

        let color = '#cf6679'; // Red
        let text = 'Низкий';
        if (score > 80) { color = '#4caf50'; text = 'Отличный'; }
        else if (score > 50) { color = '#ffeb3b'; text = 'Средний'; }

        resDiv.innerHTML = `<span style="color:${color}; font-size:1.5em">IF: ${score}/100</span> <span style="color:#aaa">(${text})</span>`;
    },

    renderArticlesList: function() {
        const container = document.getElementById('articles-list');
        if (!container) return;
        container.innerHTML = '';

        DB.articles.forEach(art => {
            const div = document.createElement('div');
            div.className = 'item';
            div.style.flexDirection = 'column';
            div.style.alignItems = 'flex-start';
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; width:100%">
                    <strong style="color:var(--pri)">${art.title}</strong>
                    <span style="font-size:0.8em; background:#333; padding:2px 6px; border-radius:4px">${art.category}</span>
                </div>
                <div style="font-size:0.9em; color:#aaa; margin-top:5px">👁 ${art.views} просмотров</div>
                <div style="font-size:0.85em; color:#ccc; margin-top:8px; line-height:1.4">${art.content.substring(0, 100)}...</div>
                <button style="margin-top:10px; padding:5px 10px; font-size:0.8em; width:auto; background:var(--bor); color:#fff">Читать далее</button>
            `;
            container.appendChild(div);
        });
    },

    renderShopList: function() {
        const container = document.getElementById('shop-list');
        if (!container) return;
        container.innerHTML = '';

        for (const [prodName, offers] of Object.entries(DB.shop)) {
            offers.forEach(offer => {
                const div = document.createElement('div');
                div.className = 'item';
                div.innerHTML = `
                    <div>
                        <strong style="text-transform:uppercase">${prodName}</strong><br>
                        <small style="color:#aaa">${offer.p}</small>
                    </div>
                    <div style="text-align:right">
                        <div style="color:var(--sec); font-weight:bold; font-size:1.1em">${offer.pr}</div>
                        <a href="${offer.url}" target="_blank" style="display:inline-block; margin-top:5px; padding:4px 8px; background:var(--pri); color:#000; text-decoration:none; border-radius:4px; font-size:0.8em; font-weight:bold">Купить</a>
                    </div>
                `;
                container.appendChild(div);
            });
        }
    },

    renderGlossaryList: function() {
        const container = document.getElementById('glossary-list');
        if (!container) return;
        container.innerHTML = '';

        for (const [term, def] of Object.entries(DB.glossary)) {
            const div = document.createElement('div');
            div.className = 'item';
            div.style.flexDirection = 'column';
            div.style.alignItems = 'flex-start';
            div.innerHTML = `
                <strong style="color:var(--sec)">${term}</strong>
                <p style="margin:5px 0 0; font-size:0.9em; color:#ccc; line-height:1.4">${def}</p>
            `;
            container.appendChild(div);
        }
    }
};
