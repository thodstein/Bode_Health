document.addEventListener('DOMContentLoaded', () => {
    let drugs = [];
    let riskChart = null;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
    ['CV', 'Hep', 'Neuro', 'Lipid', 'Nephro', 'Hemo'].forEach(type => {
        const slider = document.getElementById(`risk${type}`);
        const span = document.getElementById(`val${type}`);
        if(slider && span) slider.addEventListener('input', () => span.textContent = slider.value);
    });
    document.getElementById('drugForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newDrug = {
            id: Date.now(),
            name: document.getElementById('drugName').value,
            dose: document.getElementById('drugDose').value,
            route: document.getElementById('drugRoute').value,
            period: document.getElementById('drugPeriod').value,
            risks: {
                CV: parseInt(document.getElementById('riskCV').value),
                Hep: parseInt(document.getElementById('riskHep').value),
                Neuro: parseInt(document.getElementById('riskNeuro').value),
                Lipid: parseInt(document.getElementById('riskLipid').value),
                Nephro: parseInt(document.getElementById('riskNephro').value),
                Hemo: parseInt(document.getElementById('riskHemo').value)
            }
        };
        drugs.push(newDrug);
        renderStack();
        e.target.reset();
        ['CV', 'Hep', 'Neuro', 'Lipid', 'Nephro', 'Hemo'].forEach(t => document.getElementById(`val${t}`).textContent = '0');
        alert('Препарат добавлен! Перейдите во вкладку "Стек".');
    });
    function renderStack() {
        const list = document.getElementById('stackList');
        list.innerHTML = '';
        if (drugs.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:#718096;">Стек пуст. Добавьте препараты.</p>';
            return;
        }
        drugs.forEach(drug => {
            const card = document.createElement('div');
            card.className = 'drug-card';
            const routeText = drug.route === 'oral' ? 'Перорально' : (drug.route === 'inject' ? 'Инъекционно' : 'Местно');
            card.innerHTML = `
                <div class="drug-info">
                    <h4>${drug.name} (${drug.dose})</h4>
                    <p>Путь: ${routeText} | Период: ${drug.period}</p>
                    <p style="font-size:11px; color:#a0aec0;">Риски: CV:${drug.risks.CV} Hep:${drug.risks.Hep} Neuro:${drug.risks.Neuro}</p>
                </div>
                <button class="delete-btn" onclick="window.removeDrug(${drug.id})">Удалить</button>
            `;
            list.appendChild(card);
        });
    }
    window.removeDrug = (id) => {
        drugs = drugs.filter(d => d.id !== id);
        renderStack();
        document.getElementById('riskSummary').style.display = 'none';
    };
    document.getElementById('clearStackBtn').addEventListener('click', () => {
        if(confirm('Очистить весь список?')) {
            drugs = [];
            renderStack();
            document.getElementById('riskSummary').style.display = 'none';
        }
    });
    document.getElementById('calcRiskBtn').addEventListener('click', () => {
        if (drugs.length === 0) return alert('Добавьте препараты сначала!');
        const totals = { CV: 0, Hep: 0, Neuro: 0, Lipid: 0, Nephro: 0, Hemo: 0 };
        let oralCount = 0;
        drugs.forEach(d => {
            Object.keys(totals).forEach(k => totals[k] += d.risks[k]);
            if (d.route === 'oral') oralCount++;
        });
        const oralPenalty = oralCount > 1 ? (oralCount - 1) * 2 : 0;
        const maxScore = Math.max(...Object.values(totals)) + oralPenalty;
        const ctx = document.getElementById('riskChart').getContext('2d');
        if (riskChart) riskChart.destroy();
        riskChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Сердце', 'Печень', 'Невро', 'Липиды', 'Почки', 'Кровь'],
                datasets: [{
                    label: 'Суммарный риск',
                    data: [totals.CV, totals.Hep, totals.Neuro, totals.Lipid, totals.Nephro, totals.Hemo],
                    backgroundColor: 'rgba(49, 130, 206, 0.4)',
                    borderColor: '#3182ce',
                    borderWidth: 2,
                    pointBackgroundColor: '#fff'
                }]
            },
            options: {
                scales: { r: { beginAtZero: true, max: Math.max(50, maxScore + 10) } },
                responsive: true
            }
        });
        const summaryDiv = document.getElementById('riskSummary');
        const scoreDiv = document.getElementById('totalScore');
        summaryDiv.style.display = 'block';
        let msg = `Общая нагрузка: ${maxScore}`;
        if (oralPenalty > 0) msg += ` (вкл. штраф +${oralPenalty} за ${oralCount} пероральных преп.)`;
        scoreDiv.textContent = msg;
        scoreDiv.className = 'total-score ' + (maxScore < 20 ? 'score-low' : (maxScore < 40 ? 'score-med' : 'score-high'));
        setTimeout(() => {
            document.querySelector('[data-tab="results"]').click();
            document.getElementById('reportContent').innerHTML = `<pre>${JSON.stringify(totals, null, 2)}</pre><p>График доступен во вкладке "Стек"</p>`;
        }, 500);
    });
    renderStack();
});
