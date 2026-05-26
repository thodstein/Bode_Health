const App = {
    state: {
        stack: [],
        plan: [],
        wIdx: 0,
        xp: 0,
        charts: {
            liver: true,
            cardio: true,
            hemato: true,
            kidney: false,
            neuro: false,
            endo: false,
            repro: false
        }
    },

    init: function() {
        console.log("App Initializing...");
        
        // Заполнение селекта веществ
        const subSelect = document.getElementById('sub-select');
        if (subSelect && DB.substances) {
            subSelect.innerHTML = '';
            DB.substances.forEach(function(s) {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.innerText = s.name;
                subSelect.appendChild(opt);
            });
        }

        // Рендер статических разделов
        this.renderSupport();
        this.renderArticles();
        this.renderShop();
        this.renderGlossary();
        this.renderControls();
        
        console.log("App Initialized Successfully.");
    },

    switchTab: function(tabId) {
        // Скрыть все вкладки
        const views = document.querySelectorAll('.view');
        for (let i = 0; i < views.length; i++) {
            views[i].classList.remove('active');
        }
        
        // Убрать активность с кнопок
        const btns = document.querySelectorAll('.tab-btn');
        for (let i = 0; i < btns.length; i++) {
            btns[i].classList.remove('active');
        }

        // Показать нужную
        const target = document.getElementById(tabId);
        if (target) {
            target.classList.add('active');
        }

        // Подсветить кнопку (ищем по onclick)
        for (let i = 0; i < btns.length; i++) {
            if (btns[i].getAttribute('onclick').indexOf(tabId) > -1) {
                btns[i].classList.add('active');
            }
        }

        // Если вкладка рисков - перерисовать график
        if (tabId === 'risks' && this.state.plan.length > 0) {
            setTimeout(() => {
                this.renderChart();
                this.renderHeatmap();
            }, 100);
        }
    },

    loadEsters: function() {
        const subId = document.getElementById('sub-select').value;
        const estSelect = document.getElementById('est-select');
        estSelect.innerHTML = '';
        
        const esters = DB.esters[subId];
        if (esters && esters.length > 0) {
            estSelect.disabled = false;
            esters.forEach(function(e) {
                const opt = document.createElement('option');
                opt.value = e.id;
                opt.innerText = e.name + ' (' + e.hl + ' дн.)';
                estSelect.appendChild(opt);
            });
        } else {
            estSelect.disabled = true;
        }
    },

    addDrug: function() {
        const subId = document.getElementById('sub-select').value;
        const esterId = document.getElementById('est-select').value;
        const doseVal = document.getElementById('in-dose').value;
        const startVal = document.getElementById('in-start').value;
        const endVal = document.getElementById('in-end').value;

        const dose = parseFloat(doseVal);
        const start = parseInt(startVal);
        const end = parseInt(endVal);

        if (!dose || !start || !end) {
            alert('Пожалуйста, заполните дозу и недели.');
            return;
        }
        if (start >= end) {
            alert('Неделя финиша должна быть больше недели старта.');
            return;
        }

        this.state.stack.push({
            sub: subId,
            est: esterId,
            dose: dose,
            start: start,
            end: end
        });

        this.renderStack();
        document.getElementById('in-dose').value = '';
    },

    renderStack: function() {
        const container = document.getElementById('stack-list');
        if (!container) return;
        container.innerHTML = '';

        this.state.stack.forEach((item, index) => {
            const sub = DB.substances.find(s => s.id === item.sub);
            const esterList = DB.esters[item.sub];
            const ester = esterList ? esterList.find(e => e.id === item.est) : null;
            
            const nameDisplay = ester ? (sub.name + ' (' + ester.name + ')') : sub.name;

            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <div>
                    <strong>${nameDisplay}</strong><br>
                    <small>${item.dose} мг | Недели ${item.start} - ${item.end}</small>
                </div>
                <button class="btn-del" onclick="App.removeDrug(${index})">✕</button>
            `;
            container.appendChild(div);
        });
    },

    removeDrug: function(index) {
        this.state.stack.splice(index, 1);
        this.renderStack();
    },

    calcPlan: function() {
        if (this.state.stack.length === 0) {
            alert('Сначала добавьте препараты в стек!');
            return;
        }

        this.state.plan = Engine.generatePlan(this.state.stack);
        this.state.wIdx = 0;

        // Обновление UI
        const msg = document.getElementById('plan-msg');
        if (msg) msg.innerText = `Расчет выполнен на ${this.state.plan.length} недель.`;
        
        this.state.xp += 100;
        const xpDisplay = document.getElementById('xp-display');
        if (xpDisplay) xpDisplay.innerText = 'XP: ' + this.state.xp;

        // Расчет среднего риска для главной
        let totalRisk = 0;
        let count = 0;
        const firstWeek = this.state.plan[0].r;
        for (let sys in firstWeek) {
            for (let m in firstWeek[sys]) {
                totalRisk += firstWeek[sys][m];
                count++;
            }
        }
        const avg = count > 0 ? Math.round(totalRisk / count) : 0;
        
        const dRisk = document.getElementById('d-risk');
        const dReadiness = document.getElementById('d-readiness');
        if (dRisk) dRisk.innerText = avg + '%';
        if (dReadiness) dReadiness.innerText = Math.max(0, 100 - avg) + '%';

        // Переход на вкладку рисков и отрисовка
        this.renderHeatmap();
        this.renderChart();
        
        // Автоматически переключаем вкладку (опционально, можно убрать)
        // this.switchTab('risks'); 
        alert('Расчет завершен! Перейдите во вкладку "Риски".');
    },

    changeWeek: function(dir) {
        if (this.state.plan.length === 0) return;
        
        this.state.wIdx += dir;
        if (this.state.wIdx < 0) this.state.wIdx = 0;
        if (this.state.wIdx >= this.state.plan.length) this.state.wIdx = this.state.plan.length - 1;
        
        this.renderHeatmap();
    },

    renderHeatmap: function() {
        const container = document.getElementById('heatmap');
        const label = document.getElementById('week-label');
        if (!container || this.state.plan.length === 0) return;

        const data = this.state.plan[this.state.wIdx];
        if (label) label.innerText = 'Неделя ' + data.w;

        container.innerHTML = '';

        for (let sys in DB.risks) {
            // Заголовок системы
            const sysTitle = document.createElement('div');
            sysTitle.style.gridColumn = '1 / -1';
            sysTitle.style.color = 'var(--pri)';
            sysTitle.style.fontWeight = 'bold';
            sysTitle.style.marginTop = '10px';
            sysTitle.style.textTransform = 'uppercase';
            sysTitle.innerText = sys;
            container.appendChild(sysTitle);

            // Механизмы
            DB.risks[sys].forEach(m => {
                const val = data.r[sys][m.id] || 0;
                const color = Engine.getColor(val);
                const txtColor = val > 50 ? '#000' : '#fff';

                const cell = document.createElement('div');
                cell.className = 'hm-cell';
                cell.style.backgroundColor = color;
                cell.style.color = txtColor;
                cell.style.padding = '8px';
                cell.style.borderRadius = '4px';
                cell.style.fontSize = '0.75rem';
                cell.style.textAlign = 'center';
                cell.innerHTML = `<b>${m.n}</b><br>${val}%`;
                container.appendChild(cell);
            });
        }
    },

    renderChart: function() {
        const ctxCanvas = document.getElementById('trend-chart');
        if (!ctxCanvas || this.state.plan.length === 0) return;

        if (window.myChartInstance) {
            window.myChartInstance.destroy();
        }

        const ctx = ctxCanvas.getContext('2d');
        const labels = this.state.plan.map(p => 'W' + p.w);
        const datasets = [];
        const colors = {
            liver: '#ff6384',
            cardio: '#36a2eb',
            hemato: '#ff9f40',
            kidney: '#4bc0c0',
            neuro: '#9966ff',
            endo: '#c9cbcf',
            repro: '#e7e9ed'
        };

        for (let sys in this.state.charts) {
            if (this.state.charts[sys]) {
                const dataPoints = this.state.plan.map(p => {
                    let sum = 0;
                    let cnt = 0;
                    for (let k in p.r[sys]) {
                        sum += p.r[sys][k];
                        cnt++;
                    }
                    return cnt > 0 ? Math.round(sum / cnt) : 0;
                });

                datasets.push({
                    label: sys.toUpperCase(),
                    data: dataPoints,
                    borderColor: colors[sys],
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                });
            }
        }

        window.myChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#aaa' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#aaa' },
                        grid: { color: '#333' }
                    },
                    x: {
                        ticks: { color: '#aaa' },
                        grid: { color: '#333' }
                    }
                }
            }
        });
    },

    toggleChart: function(sys) {
        this.state.charts[sys] = !this.state.charts[sys];
        this.renderChart();
    },

    renderControls: function() {
        const container = document.getElementById('chart-controls');
        if (!container) return;

        const names = {
            liver: 'Печень',
            cardio: 'Сердце',
            hemato: 'Кровь',
            kidney: 'Почки',
            neuro: 'Невро',
            endo: 'Эндо',
            repro: 'Репро'
        };

        container.innerHTML = '';
        for (let k in names) {
            const isChecked = this.state.charts[k] ? 'checked' : '';
            const label = document.createElement('label');
            label.style.display = 'inline-flex';
            label.style.alignItems = 'center';
            label.style.gap = '5px';
            label.style.marginRight = '10px';
            label.style.color = '#fff';
            label.style.fontSize = '0.85rem';
            label.innerHTML = `<input type="checkbox" ${isChecked} onchange="App.toggleChart('${k}')"> ${names[k]}`;
            container.appendChild(label);
        }
    },

    renderSupport: function() {
        const container = document.getElementById('support-list');
        if (!container || !DB.support) return;

        container.innerHTML = '';
        DB.support.forEach(block => {
            const blockDiv = document.createElement('div');
            blockDiv.className = 'time-block';
            blockDiv.style.background = '#252525';
            blockDiv.style.padding = '15px';
            blockDiv.style.borderRadius = '8px';
            blockDiv.style.marginBottom = '15px';

            const title = document.createElement('h3');
            title.style.color = 'var(--pri)';
            title.style.margin = '0 0 10px';
            title.style.fontSize = '0.9rem';
            title.style.textTransform = 'uppercase';
            title.innerText = block.t;
            blockDiv.appendChild(title);

            block.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';
                itemDiv.style.margin = '5px 0';
                itemDiv.style.padding = '10px';
                itemDiv.innerHTML = `<div><b>${item.n}</b> ${item.d}<br><small>${item.m}</small></div>`;
                blockDiv.appendChild(itemDiv);
            });

            container.appendChild(blockDiv);
        });
    },

    calcFert: function() {
        const v = parseFloat(document.getElementById('lab-vol').value) || 0;
        const c = parseFloat(document.getElementById('lab-conc').value) || 0;
        const res = Math.round((v / 1.5) * 20 + (c / 16) * 30);
        
        const resDiv = document.getElementById('fert-res');
        if (resDiv) {
            const color = res > 50 ? 'var(--sec)' : 'var(--err)';
            resDiv.innerHTML = `<span style="color:${color}; font-size:1.2rem; font-weight:bold">IF: ${res}/100</span>`;
        }
    },

    renderArticles: function() {
        const container = document.getElementById('articles-list');
        if (!container || !DB.articles) return;
        container.innerHTML = '';
        DB.articles.forEach(a => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `<div><b>${a.t}</b><br><small>${a.c} | 👁 ${a.v}</small></div>`;
            container.appendChild(div);
        });
    },

    renderShop: function() {
        const container = document.getElementById('shop-list');
        if (!container || !DB.shop) return;
        container.innerHTML = '';
        for (let k in DB.shop) {
            DB.shop[k].forEach(i => {
                const div = document.createElement('div');
                div.className = 'item';
                div.innerHTML = `<div><b>${k.toUpperCase()}</b><br>${i.p}</div><div style="color:var(--sec)">${i.pr}</div>`;
                container.appendChild(div);
            });
        }
    },

    renderGlossary: function() {
        const container = document.getElementById('glossary-list');
        if (!container || !DB.glossary) return;
        container.innerHTML = '';
        for (let k in DB.glossary) {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `<b>${k}</b><br><small>${DB.glossary[k]}</small>`;
            container.appendChild(div);
        }
    },

    updateProfile: function() {
        const xpEl = document.getElementById('prof-xp');
        const trustEl = document.getElementById('prof-trust');
        if (xpEl) xpEl.innerText = this.state.xp;
        if (trustEl) trustEl.innerText = Math.min(100, Math.floor(this.state.xp / 10));
    }
};

// Автозапуск после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Ready. Starting App...");
    if (typeof App !== 'undefined') {
        App.init();
        setInterval(function() {
            if (typeof App !== 'undefined') App.updateProfile();
        }, 1000);
    } else {
        console.error("App object not found!");
    }
});
