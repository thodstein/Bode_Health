// Глобальный объект приложения
const App = {
    state: {
        stack: [],
        plan: [],
        wIdx: 0,
        xp: 0,
        charts: { liver: true, cardio: true, hemato: true, kidney: false, neuro: false, endo: false, repro: false }
    },

    init: function() {
        // Заполнение селекта веществ
        const sel = document.getElementById('sub-select');
        if (sel) {
            sel.innerHTML = '';
            DB.substances.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = s.name;
                sel.appendChild(opt);
            });
        }
        this.renderSupport();
        this.renderArticles();
        this.renderShop();
        this.renderGlossary();
        this.renderChartControls();
    },

    // Переключение вкладок
    switchTab: function(tabId) {
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        
        document.getElementById(tabId).classList.add('active');
        // Находим кнопку и активируем её (простой перебор)
        const btns = document.querySelectorAll('.tab-btn');
        if(tabId === 'dashboard') btns[0].classList.add('active');
        if(tabId === 'stack') btns[1].classList.add('active');
        if(tabId === 'risks') {
            btns[2].classList.add('active');
            setTimeout(() => {
                if (this.state.plan.length) {
                    this.renderChart();
                    this.renderHeatmap();
                }
            }, 100);
        }
        if(tabId === 'support') btns[3].classList.add('active');
        if(tabId === 'labs') btns[4].classList.add('active');
        if(tabId === 'articles') btns[5].classList.add('active');
        if(tabId === 'shop') btns[6].classList.add('active');
    },

    // Загрузка эфиров
    loadEsters: function() {
        const subId = document.getElementById('sub-select').value;
        const estSel = document.getElementById('est-select');
        estSel.innerHTML = '';
        const list = DB.esters[subId];
        
        if (list && list.length > 0) {
            estSel.disabled = false;
            list.forEach(e => {
                const opt = document.createElement('option');
                opt.value = e.id;
                opt.textContent = e.name + ' (T1/2: ' + e.hl + ' дн.)';
                estSel.appendChild(opt);
            });
        } else {
            estSel.disabled = true;
        }
    },

    // Добавление препарата
    addDrug: function() {
        const sub = document.getElementById('sub-select').value;
        const est = document.getElementById('est-select').value;
        const dose = parseFloat(document.getElementById('in-dose').value);
        const start = parseInt(document.getElementById('in-start').value);
        const end = parseInt(document.getElementById('in-end').value);

        if (!dose || start >= end) {
            alert('Проверьте дозировку и недели (Старт < Финиш)!');
            return;
        }

        this.state.stack.push({ sub, est, dose, start, end });
        this.renderStack();
        
        // Сброс формы
        document.getElementById('in-dose').value = '';
        document.getElementById('in-start').value = '1';
        document.getElementById('in-end').value = '8';
    },

    renderStack: function() {
        const div = document.getElementById('stack-list');
        div.innerHTML = '';
        this.state.stack.forEach((item, idx) => {
            const s = DB.substances.find(x => x.id === item.sub);
            const e = DB.esters[item.sub] ? DB.esters[item.sub].find(x => x.id === item.est) : null;
            
            const html = `
                <div class="item">
                    <div>
                        <b>${s.name}</b> ${e ? '(' + e.name + ')' : ''}<br>
                        <small>${item.dose} мг/нед | Недели ${item.start}–${item.end}</small>
                    </div>
                    <button class="btn-del" onclick="App.removeDrug(${idx})">✕</button>
                </div>
            `;
            div.innerHTML += html;
        });
    },

    removeDrug: function(idx) {
        this.state.stack.splice(idx, 1);
        this.renderStack();
    },

    // Расчет плана
    calcPlan: function() {
        if (this.state.stack.length === 0) {
            alert('Сначала добавьте препараты в стек!');
            return;
        }
        this.state.plan = Engine.generatePlan(this.state.stack);
        this.state.wIdx = 0;
        
        this.renderHeatmap();
        this.renderChart();
        
        const msg = document.getElementById('plan-msg');
        msg.textContent = `✅ Расчет выполнен на ${this.state.plan.length} недель!`;
        msg.style.color = 'var(--sec)';
        
        this.state.xp += 100;
        document.getElementById('xp-display').textContent = 'XP: ' + this.state.xp;

        // Обновление дэшборда
        const firstWeek = this.state.plan[0];
        let sum = 0, cnt = 0;
        for(let sys in firstWeek.r) {
            for(let k in firstWeek.r[sys]) { sum += firstWeek.r[sys][k]; cnt++; }
        }
        const avg = Math.round(sum / cnt);
        document.getElementById('d-risk').textContent = avg + '%';
        document.getElementById('d-readiness').textContent = Math.max(10, 100 - avg);
    },

    // Навигация по неделям
    changeWeek: function(dir) {
        if (!this.state.plan.length) return;
        this.state.wIdx += dir;
        if (this.state.wIdx < 0) this.state.wIdx = 0;
        if (this.state.wIdx >= this.state.plan.length) this.state.wIdx = this.state.plan.length - 1;
        this.renderHeatmap();
    },

    // Рендер Heatmap
    renderHeatmap: function() {
        if (!this.state.plan.length) return;
        const data = this.state.plan[this.state.wIdx];
        document.getElementById('week-label').textContent = 'Неделя ' + data.w;
        
        const container = document.getElementById('heatmap');
        container.innerHTML = '';

        for (let sys in DB.risks) {
            // Заголовок системы
            container.innerHTML += `<div style="grid-column: 1 / -1; color: var(--pri); font-weight: bold; margin-top: 10px; text-transform: uppercase;">${sys}</div>`;
            
            DB.risks[sys].forEach(m => {
                const val = data.r[sys][m.id] || 0;
                const color = Engine.getRiskColor(val);
                const txtColor = val > 50 ? '#000' : '#fff';
                
                const cell = document.createElement('div');
                cell.className = 'hm-cell';
                cell.style.backgroundColor = color;
                cell.style.color = txtColor;
                cell.innerHTML = `<b>${m.n}</b><br>${val}%`;
                container.appendChild(cell);
            });
        }
    },

    // Рендер графика
    renderChart: function() {
        const ctx = document.getElementById('trend-chart');
        if (!ctx) return;
        
        if (window.myChart) window.myChart.destroy();

        const labels = this.state.plan.map(p => 'W' + p.w);
        const datasets = [];
        const colors = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', kidney: '#4bc0c0', neuro: '#9966ff', endo: '#c9cbcf', repro: '#e7e9ed' };

        for (let sys in this.state.charts) {
            if (this.state.charts[sys]) {
                const dataPoints = this.state.plan.map(p => {
                    let sum = 0, cnt = 0;
                    for (let k in p.r[sys]) { sum += p.r[sys][k]; cnt++; }
                    return cnt ? Math.round(sum / cnt) : 0;
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

        window.myChart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: '#aaa' } } },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } },
                    x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
                }
            }
        });
    },

    toggleChart: function(sys) {
        this.state.charts[sys] = !this.state.charts[sys];
        this.renderChart();
    },

    renderChartControls: function() {
        const div = document.getElementById('chart-controls');
        const names = { liver: 'Печень', cardio: 'Сердце', hemato: 'Кровь', kidney: 'Почки', neuro: 'Невро', endo: 'Эндо', repro: 'Репро' };
        div.innerHTML = '';
        for (let k in names) {
            const checked = this.state.charts[k] ? 'checked' : '';
            div.innerHTML += `<label><input type="checkbox" ${checked} onchange="App.toggleChart('${k}')"> ${names[k]}</label>`;
        }
    },

    // Рендер поддержки
    renderSupport: function() {
        const div = document.getElementById('support-list');
        div.innerHTML = '';
        DB.support.forEach(block => {
            let itemsHtml = block.items.map(i => `
                <div class="item" style="margin: 5px 0; padding: 10px; border-left-color: var(--pri);">
                    <div><b>${i.n}</b> ${i.d}<br><small>${i.m}</small></div>
                </div>
            `).join('');
            
            div.innerHTML += `<div class="time-block"><h3>${block.t}</h3>${itemsHtml}</div>`;
        });
    },

    // Фертильность
    calcFert: function() {
        const v = parseFloat(document.getElementById('lab-vol').value) || 0;
        const c = parseFloat(document.getElementById('lab-conc').value) || 0;
        const res = Math.round((v / 1.5) * 20 + (c / 16) * 30);
        const color = res > 50 ? 'var(--sec)' : 'var(--err)';
        document.getElementById('fert-res').innerHTML = `<span style="color:${color}">IF: ${res}/100</span>`;
    },

    renderArticles: function() {
        const div = document.getElementById('articles-list');
        div.innerHTML = '';
        DB.articles.forEach(a => {
            div.innerHTML += `<div class="item"><div><b>${a.t}</b><br><small>${a.c} | 👁 ${a.v}</small></div></div>`;
        });
    },

    renderShop: function() {
        const div = document.getElementById('shop-list');
        div.innerHTML = '';
        for (let k in DB.shop) {
            DB.shop[k].forEach(i => {
                div.innerHTML += `<div class="item"><div><b>${k.toUpperCase()}</b><br>${i.p}</div><div style="color:var(--sec)">${i.pr}</div></div>`;
            });
        }
    },

    renderGlossary: function() {
        const div = document.getElementById('glossary-list');
        div.innerHTML = '';
        for (let k in DB.glossary) {
            div.innerHTML += `<div class="item"><b>${k}</b><br><small>${DB.glossary[k]}</small></div>`;
        }
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
