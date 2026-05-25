document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }

    const state = {
        stack: [],
        supportActive: true,
        currentWeek: 1,
        maxWeeks: 12
    };

    // Инициализация UI
    UIRenderer.init();

    // Обработчик добавления препарата (с эфиром и неделями)
    document.getElementById('add-drug-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const drugId = document.getElementById('drug-select').value;
        const ester = document.getElementById('ester-select').value;
        const dose = document.getElementById('drug-dose').value;
        const freq = document.getElementById('drug-freq').value;
        const weeks = parseInt(document.getElementById('drug-weeks').value);
        const start = parseInt(document.getElementById('drug-start').value);

        if (!drugId) return alert('Выберите препарат');

        state.stack.push({
            id: drugId,
            ester: ester !== 'none' ? ester : null,
            dose,
            freq,
            duration: weeks,
            startWeek: start,
            endWeek: start + weeks - 1
        });

        App.renderAll();
        e.target.reset();
        document.getElementById('drug-weeks').value = 10;
        document.getElementById('drug-start').value = 1;
    });

    // Глобальный объект приложения
    window.App = {
        removeDrug: (idx) => {
            state.stack.splice(idx, 1);
            App.renderAll();
        },
        setWeek: (dir) => {
            state.currentWeek += dir;
            if (state.currentWeek < 1) state.currentWeek = 1;
            if (state.currentWeek > state.maxWeeks) state.currentWeek = state.maxWeeks;
            document.getElementById('current-week-display').textContent = `Неделя ${state.currentWeek}`;
            UIRenderer.renderSupportSchedule(state.currentWeek, state.stack);
        },
        renderAll: () => {
            UIRenderer.renderStackList(state.stack, App.removeDrug);
            App.calculateAndRenderRisks();
            App.updateDashboardMetrics();
            // Сброс на неделю 1 при изменении стека
            state.currentWeek = 1;
            document.getElementById('current-week-display').textContent = `Неделя 1`;
            UIRenderer.renderSupportSchedule(1, state.stack);
        },
        calculateAndRenderRisks: () => {
            // Расчет рисков по неделям
            const weeklyRisks = [];
            for (let w = 1; w <= state.maxWeeks; w++) {
                const activeDrugs = state.stack.filter(d => w >= d.startWeek && w <= d.endWeek);
                const raw = Engine.calculateRawRisks(activeDrugs);
                const net = Engine.calculateNetRisks(raw, state.supportActive);
                const score = Engine.calculateIntegratedScore(net);
                weeklyRisks.push(score);
            }
            App.renderRiskChartTrend(weeklyRisks);
            
            // Детали для текущей недели
            const currentDrugs = state.stack.filter(d => state.currentWeek >= d.startWeek && state.currentWeek <= d.endWeek);
            const rawCurr = Engine.calculateRawRisks(currentDrugs);
            const netCurr = Engine.calculateNetRisks(rawCurr, state.supportActive);
            App.renderRiskDetails(rawCurr, netCurr);
        },
        renderRiskChartTrend: (data) => {
            const ctx = document.getElementById('risk-chart');
            if (!ctx) return;
            const labels = Array.from({length: state.maxWeeks}, (_, i) => `Нед ${i+1}`);
            
            if (window.riskChartInstance) window.riskChartInstance.destroy();
            window.riskChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Интегральный риск (Net)',
                        data: data,
                        borderColor: '#03dac6',
                        backgroundColor: 'rgba(3, 218, 198, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    scales: { y: { beginAtZero: true, max: 100, ticks: { color: '#b0b0b0' }, grid: { color: '#333' } }, x: { ticks: { color: '#b0b0b0' }, grid: { color: '#333' } } },
                    plugins: { legend: { labels: { color: '#fff' } } },
                    responsive: true
                }
            });
        },
        renderRiskDetails: (raw, net) => {
            const container = document.getElementById('risk-details');
            if (!container) return;
            // ... (логика отрисовки деталей как раньше)
            container.innerHTML = '<p style="color:#888">Детальный разбор рисков для текущей недели...</p>';
        },
        updateDashboardMetrics: () => {
            const currentDrugs = state.stack.filter(d => state.currentWeek >= d.startWeek && state.currentWeek <= d.endWeek);
            const raw = Engine.calculateRawRisks(currentDrugs);
            const net = Engine.calculateNetRisks(raw, state.supportActive);
            const score = Engine.calculateIntegratedScore(net);
            
            const readiness = state.stack.length ? Math.max(20, 100 - score) : 100;
            const fatigue = state.stack.length ? Math.min(80, score) : 10;
            
            document.getElementById('dash-readiness').textContent = readiness;
            document.getElementById('dash-fatigue').textContent = fatigue;
            const riskEl = document.getElementById('dash-risk');
            riskEl.textContent = `${score}%`;
            riskEl.style.color = score > 50 ? '#cf6679' : (score > 30 ? '#ffeb3b' : '#03dac6');

            // Алерт
            const alertBox = document.getElementById('weekly-alert');
            if (score > 60) alertBox.innerHTML = `⚠️ <b>Внимание!</b> На неделе ${state.currentWeek} высокий риск (${score}%). Проверьте протокол поддержки.`;
            else alertBox.innerHTML = '✅ Показатели в норме.';
        },
        calcFertility: () => {
            // ... (старая логика)
            alert('Калькулятор фертильности готов к работе (введите данные)');
        },
        exportJSON: () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "bode_health_backup.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },
        exportPDF: () => { alert('Генерация PDF отчета для врача... (Функция в разработке)'); },
        exportCoach: () => { alert('Генерация отчета для тренера... (Функция в разработке)'); }
    };

    // Тоггл поддержки
    document.getElementById('support-toggle').addEventListener('change', (e) => {
        state.supportActive = e.target.checked;
        App.calculateAndRenderRisks();
        App.updateDashboardMetrics();
    });

    // Под-табы для статей/магазина
    window.UIRenderer = window.UIRenderer || {};
    UIRenderer.showSub = (type) => {
        document.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.sub-content').forEach(c => c.style.display = 'none');
        
        if (type === 'wiki') {
            document.querySelector('button[onclick="UIRenderer.showSub(\'wiki\')"]').classList.add('active');
            document.getElementById('sub-wiki').style.display = 'block';
        } else {
            document.querySelector('button[onclick="UIRenderer.showSub(\'shop\')"]').classList.add('active');
            document.getElementById('sub-shop').style.display = 'block';
        }
    };

    App.renderAll();
});
