document.addEventListener('DOMContentLoaded', () => {
    // Инициализация Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    // Состояние
    let state = {
        stack: [],
        supportActive: true,
        risks: { raw: {}, net: {} }
    };

    // 1. Навигация
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // 2. Заполнение селекта препаратами
    const drugSelect = document.getElementById('drug-select');
    DB.drugs.forEach(drug => {
        const opt = document.createElement('option');
        opt.value = drug.id;
        opt.textContent = `${drug.name} (${drug.type})`;
        drugSelect.appendChild(opt);
    });

    // 3. Добавление препарата в стек
    document.getElementById('add-drug-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('drug-select').value;
        const dose = document.getElementById('drug-dose').value;
        const freq = document.getElementById('drug-freq').value;
        
        state.stack.push({ id, dose, freq });
        renderStack();
        updateDashboard();
        e.target.reset();
    });

    function renderStack() {
        const list = document.getElementById('stack-list');
        list.innerHTML = '';
        state.stack.forEach((item, idx) => {
            const drug = DB.drugs.find(d => d.id === item.id);
            const div = document.createElement('div');
            div.className = 'item-card';
            div.innerHTML = `
                <div>
                    <strong>${drug.name}</strong><br>
                    <small>${item.dose} | ${item.freq}</small>
                </div>
                <button class="btn-secondary" onclick="app.removeDrug(${idx})">✕</button>
            `;
            list.appendChild(div);
        });
    }

    // Экспорт функции удаления в глобальную область
    window.app = {
        removeDrug: (idx) => {
            state.stack.splice(idx, 1);
            renderStack();
            updateDashboard();
        }
    };

    // 4. Рендеринг поддержки
    function renderSupport() {
        const container = document.getElementById('support-schedule');
        container.innerHTML = '';
        DB.support.forEach(block => {
            const div = document.createElement('div');
            div.className = 'time-block';
            div.innerHTML = `<h3>${block.label}</h3>`;
            block.items.forEach(item => {
                div.innerHTML += `
                    <div class="item-card" style="padding:10px; margin-bottom:5px;">
                        <div>
                            <strong>${item.name}</strong> <span style="color:var(--secondary)">${item.dose}</span>
                            <div style="font-size:0.8em; color:#888;">${item.mechanism}</div>
                        </div>
                    </div>
                `;
            });
            container.appendChild(div);
        });
    }

    // 5. Обновление дэшборда и рисков
    function updateDashboard() {
        const raw = Engine.calculateRawRisks(state.stack);
        const net = Engine.calculateNetRisks(raw, state.supportActive);
        state.risks = { raw, net };

        // Расчет интегрального риска (среднее по всем системам)
        let totalRaw = 0, count = 0;
        for(let sys in raw) for(let m in raw[sys]) { totalRaw += raw[sys][m]; count++; }
        const avgRaw = Math.round(totalRaw / count);
        
        let totalNet = 0;
        for(let sys in net) for(let m in net[sys]) { totalNet += net[sys][m]; }
        const avgNet = Math.round(totalNet / count);

        document.getElementById('dash-readiness').textContent = state.stack.length ? '65' : '90'; // Mock
        document.getElementById('dash-fatigue').textContent = state.stack.length ? '45' : '10';
        document.getElementById('dash-risk').textContent = `${avgRaw}% → ${avgNet}%`;
        
        renderRiskChart(net);
    }

    // 6. График рисков
    let chartInstance = null;
    function renderRiskChart(data) {
        const ctx = document.getElementById('risk-chart').getContext('2d');
        const labels = ['Печень', 'Кардио', 'Почки', 'Невро', 'Кровь', 'Эндо', 'Репро'];
        const values = [
            (data.liver.cholestasis + data.liver.cytolysis)/2,
            (data.cardio.htn + data.cardio.lipids)/2,
            (data.kidney.hyperfiltration + data.kidney.fibrosis)/2,
            (data.neuro.dopamine + data.neuro.gaba)/2,
            (data.hemato.erythrocytosis + data.hemato.rheology)/2,
            (data.endo.insulin_resist + data.endo.estrogen)/2,
            (data.repro.atrophy + data.repro.suppression)/2
        ];

        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctx, {
            type: 'radar',
             {
                labels: labels,
                datasets: [{
                    label: 'Net Risk',
                    data: values,
                    backgroundColor: 'rgba(3, 218, 198, 0.4)',
                    borderColor: '#03dac6',
                    borderWidth: 2
                }]
            },
            options: {
                scales: { r: { beginAtZero: true, max: 100, ticks: { color: '#fff' } } },
                plugins: { legend: { labels: { color: '#fff' } } }
            }
        });
    }

    // 7. Фертильность
    window.calcFertility = () => {
        const vol = parseFloat(document.getElementById('semen-vol').value);
        const conc = parseFloat(document.getElementById('semen-conc').value);
        const pr = parseFloat(document.getElementById('semen-pr').value);
        
        if(!vol || !conc) return alert('Введите данные');
        
        const ifScore = Engine.calculateFertilityIndex({ volume: vol, concentration: conc, pr: pr });
        const resDiv = document.getElementById('fertility-result');
        resDiv.innerHTML = `<h2 style="color:${ifScore > 60 ? 'green' : 'red'}">IF: ${ifScore}/100</h2>`;
    };

    // Инициализация
    renderSupport();
    updateDashboard();
});
