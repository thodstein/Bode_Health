document.addEventListener('DOMContentLoaded', () => {
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
        const period = document.getElementById('drug-period').value;
        
        const risks = {
            cv: parseFloat(document.getElementById('risk-cv').value) || 0,
            hep: parseFloat(document.getElementById('risk-hep').value) || 0,
            neuro: parseFloat(document.getElementById('risk-neuro').value) || 0,
            lipid: parseFloat(document.getElementById('risk-lipid').value) || 0,
            nephro: parseFloat(document.getElementById('risk-nephro').value) || 0,
            hemo: parseFloat(document.getElementById('risk-hemo').value) || 0
        };

        if (!name || !dose) {
            alert('Введите название и дозировку!');
            return;
        }

        drugs.push({ id: Date.now(), name, dose, route, period, risks });
        renderStack();
        updateDashboard();
        
        // Очистка полей
        document.getElementById('drug-name').value = '';
        document.getElementById('drug-dose').value = '';
        document.getElementById('drug-period').value = '';
        [6,7,8,9,10,11].forEach(i => document.getElementById(`risk-${i}`).value = 0); // Fix IDs later if needed
    });

    function renderStack() {
        const list = document.getElementById('stack-list');
        list.innerHTML = '';
        drugs.forEach(drug => {
            const item = document.createElement('div');
            item.className = 'drug-item';
            item.innerHTML = `
                <div class="drug-header">
                    <strong>${drug.name}</strong> 
                    <span class="badge">${drug.dose}</span>
                    <span class="badge">${drug.route === 'oral' ? 'Per Os' : 'Inj'}</span>
                </div>
                <div class="drug-meta">Период: ${drug.period || 'N/A'} дней</div>
                <button class="btn-sm btn-danger" onclick="removeDrug(${drug.id})">Удалить</button>
            `;
            list.appendChild(item);
        });
    }

    window.removeDrug = (id) => {
        drugs = drugs.filter(d => d.id !== id);
        renderStack();
        updateDashboard();
        document.getElementById('risk-report').style.display = 'none';
    };

    // Расчет рисков
    document.getElementById('calc-risks-btn').addEventListener('click', () => {
        if (drugs.length === 0) {
            alert('Стек пуст!');
            return;
        }

        const totals = { cv: 0, hep: 0, neuro: 0, lipid: 0, nephro: 0, hemo: 0 };
        let oralCount = 0;

        drugs.forEach(d => {
            totals.cv += d.risks.cv;
            totals.hep += d.risks.hep;
            totals.neuro += d.risks.neuro;
            totals.lipid += d.risks.lipid;
            totals.nephro += d.risks.nephro;
            totals.hemo += d.risks.hemo;
            if (d.route === 'oral') oralCount++;
        });

        // Штраф за пероральные
        const penalty = oralCount > 1 ? (oralCount - 1) * 5 : 0;
        const totalScore = Object.values(totals).reduce((a,b)=>a+b, 0) + penalty;
        const maxScore = drugs.length * 60 + 50; // Approx max
        const percentage = Math.min(100, Math.round((totalScore / maxScore) * 100));

        let reportHtml = '<ul>';
        for (const [key, val] of Object.entries(totals)) {
            const level = val > 15 ? 'high' : val > 8 ? 'med' : 'low';
            reportHtml += `<li><b>${key.toUpperCase()}:</b> ${val} <span class="risk-${level}">(${level})</span></li>`;
        }
        reportHtml += '</ul>';
        if (penalty > 0) reportHtml += `<p class="warning">Штраф за множественные Per Os: +${penalty}</p>`;

        document.getElementById('risk-details').innerHTML = reportHtml;
        document.getElementById('toxicity-score').innerText = totalScore;
        document.getElementById('toxicity-bar').style.width = `${percentage}%`;
        
        const bar = document.getElementById('toxicity-bar');
        bar.className = percentage > 70 ? 'bg-danger' : percentage > 40 ? 'bg-warning' : 'bg-success';

        document.getElementById('risk-report').style.display = 'block';
        updateChart(totals);
    });

    document.getElementById('clear-stack-btn').addEventListener('click', () => {
        if(confirm('Очистить весь стек?')) {
            drugs = [];
            renderStack();
            updateDashboard();
            document.getElementById('risk-report').style.display = 'none';
        }
    });

    function updateDashboard() {
        document.getElementById('total-drugs').innerText = drugs.length;
        // Simple total risk calc for dashboard
        const total = drugs.reduce((acc, d) => acc + Object.values(d.risks).reduce((a,b)=>a+b,0), 0);
        const avg = drugs.length ? Math.round(total / (drugs.length * 6) * 100) : 0;
        const riskEl = document.getElementById('total-risk');
        riskEl.innerText = `${avg}%`;
        riskEl.className = avg > 50 ? 'risk-high' : avg > 20 ? 'risk-med' : 'risk-low';
    }

    function updateChart(data) {
        const ctx = document.getElementById('riskChart').getContext('2d');
        if (riskChart) riskChart.destroy();
        
        riskChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['CV', 'Hep', 'Neuro', 'Lipid', 'Nephro', 'Hemo'],
                datasets: [{
                    label: 'Текущий профиль риска',
                    data: Object.values(data),
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    borderColor: '#2563eb',
                    pointBackgroundColor: '#1e40af'
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { display: false },
                        suggestedMin: 0,
                        suggestedMax: 20
                    }
                }
            }
        });
    }

    // Init
    updateDashboard();
});
