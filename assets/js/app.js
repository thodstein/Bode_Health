document.addEventListener('DOMContentLoaded', () => {
    // Данные
    let drugs = [];
    let riskChart = null;

    // Табы
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

    // Добавление препарата
    document.getElementById('add-drug-btn').addEventListener('click', () => {
        const name = document.getElementById('drug-name').value;
        const dose = document.getElementById('drug-dose').value;
        const route = document.getElementById('drug-route').value;
        const duration = parseInt(document.getElementById('drug-duration').value) || 0;

        if (!name || !dose) {
            alert('Введите название и дозировку');
            return;
        }

        drugs.push({ id: Date.now(), name, dose, route, duration });
        renderStack();
        updateDashboard();
        
        // Очистка полей
        document.getElementById('drug-name').value = '';
        document.getElementById('drug-dose').value = '';
        document.getElementById('drug-duration').value = '';
    });

    // Отрисовка стека
    function renderStack() {
        const list = document.getElementById('stack-list');
        list.innerHTML = '';

        drugs.forEach(drug => {
            const item = document.createElement('div');
            item.className = 'drug-item';
            item.innerHTML = `
                <div class="drug-info">
                    <strong>${drug.name}</strong>
                    <span>${drug.dose} мг</span>
                    <span class="badge">${drug.route === 'oral' ? 'Перорально' : drug.route === 'inject' ? 'Инъекционно' : 'Местно'}</span>
                    <span>Курс: ${drug.duration} дн.</span>
                </div>
                <button class="btn-remove" onclick="removeDrug(${drug.id})">×</button>
            `;
            list.appendChild(item);
        });
    }

    window.removeDrug = (id) => {
        drugs = drugs.filter(d => d.id !== id);
        renderStack();
        updateDashboard();
        document.getElementById('risk-results').classList.add('hidden');
    };

    // Расчет рисков
    document.getElementById('calc-risks-btn').addEventListener('click', calculateRisks);

    function calculateRisks() {
        if (drugs.length === 0) {
            alert('Добавьте препараты в стек');
            return;
        }

        // Имитация расчета (база + рандом для демонстрации)
        let baseRisk = drugs.length * 5;
        let oralPenalty = drugs.filter(d => d.route === 'oral').length * 10;
        
        let cv = Math.min(100, baseRisk + Math.random() * 20);
        let hep = Math.min(100, baseRisk + oralPenalty + Math.random() * 15);
        let neuro = Math.min(100, baseRisk * 0.8 + Math.random() * 10);
        let lipid = Math.min(100, baseRisk * 0.5 + Math.random() * 25);
        let nephro = Math.min(100, baseRisk * 0.7 + Math.random() * 15);
        let hemo = Math.min(100, baseRisk * 0.6 + Math.random() * 20);

        // Обновление UI
        document.getElementById('risk-cv').innerText = cv.toFixed(1) + '%';
        document.getElementById('risk-hep').innerText = hep.toFixed(1) + '%';
        document.getElementById('risk-neuro').innerText = neuro.toFixed(1) + '%';
        document.getElementById('risk-lipid').innerText = lipid.toFixed(1) + '%';
        document.getElementById('risk-nephro').innerText = nephro.toFixed(1) + '%';
        document.getElementById('risk-hemo').innerText = hemo.toFixed(1) + '%';

        // Кумулятивный индекс
        let totalToxicity = (cv + hep + neuro + lipid + nephro + hemo) / 6;
        document.getElementById('cumulative-toxicity').innerText = totalToxicity.toFixed(1);
        
        const fill = document.getElementById('toxicity-fill');
        fill.style.width = totalToxicity + '%';
        fill.style.backgroundColor = totalToxicity > 50 ? '#ef4444' : totalToxicity > 25 ? '#f59e0b' : '#10b981';

        document.getElementById('risk-results').classList.remove('hidden');
        updateChart([cv, hep, neuro, lipid, nephro, hemo]);
        updateDashboard(totalToxicity);
    }

    function updateDashboard(toxicity = 0) {
        document.getElementById('total-drugs').innerText = drugs.length;
        const totalRiskEl = document.getElementById('total-risk');
        
        if (toxicity > 0) {
            totalRiskEl.innerText = toxicity.toFixed(1) + '%';
            totalRiskEl.className = toxicity > 50 ? 'risk-high' : toxicity > 25 ? 'risk-med' : 'risk-low';
        } else {
            totalRiskEl.innerText = '0%';
            totalRiskEl.className = '';
        }
        
        document.getElementById('toxicity-index').innerText = toxicity.toFixed(1);
    }

    function updateChart(data) {
        const ctx = document.getElementById('riskChart').getContext('2d');
        
        if (riskChart) riskChart.destroy();

        riskChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['CV', 'Hep', 'Neuro', 'Lipid', 'Nephro', 'Hemo'],
                datasets: [{
                    label: 'Профиль риска',
                    data: data,
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { display: false },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
});
