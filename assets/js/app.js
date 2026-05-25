document.addEventListener('DOMContentLoaded', () => {
    let drugs = [];
    let riskChart = null;

    // Табы
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Слайдеры
    ['CV', 'Hep', 'Neuro', 'Lipid', 'Nephro', 'Hemo'].forEach(t => {
        const inp = document.getElementById(`r${t}`);
        const span = inp.nextElementSibling;
        inp.addEventListener('input', () => span.textContent = inp.value);
    });

    // Добавление препарата
    document.getElementById('drugForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const drug = {
            id: Date.now(),
            name: document.getElementById('drugName').value,
            dose: document.getElementById('drugDose').value,
            route: document.getElementById('drugRoute').value,
            period: document.getElementById('drugPeriod').value,
            risks: {
                CV: +document.getElementById('rCV').value,
                Hep: +document.getElementById('rHep').value,
                Neuro: +document.getElementById('rNeuro').value,
                Lipid: +document.getElementById('rLipid').value,
                Nephro: +document.getElementById('rNephro').value,
                Hemo: +document.getElementById('rHemo').value
            }
        };
        drugs.push(drug);
        renderStack();
        e.target.reset();
        document.querySelectorAll('.risk-sliders .val').forEach(s => s.textContent = '0');
        alert('Препарат добавлен!');
    });

    function renderStack() {
        const list = document.getElementById('stackList');
        list.innerHTML = '';
        if(!drugs.length) { list.innerHTML = '<p style="text-align:center; opacity:0.6;">Стек пуст</p>'; return; }
        
        drugs.forEach(d => {
            const div = document.createElement('div');
            div.className = 'drug-card';
            const rText = d.route === 'oral' ? '💊' : (d.route === 'inject' ? '💉' : '🧴');
            div.innerHTML = `
                <div class="drug-info">
                    <h4>${d.name} <small>(${d.dose})</small></h4>
                    <p>${rText} ${d.period} | Риски: ❤️${d.risks.CV} 🛡️${d.risks.Hep}</p>
                </div>
                <button class="delete-btn" onclick="window.delDrug(${d.id})">✕</button>
            `;
            list.appendChild(div);
        });
    }

    window.delDrug = (id) => {
        drugs = drugs.filter(x => x.id !== id);
        renderStack();
        document.getElementById('riskSummary').innerHTML = '';
        if(riskChart) { riskChart.destroy(); riskChart = null; }
    };

    document.getElementById('clearStackBtn').onclick = () => {
        if(confirm('Удалить всё?')) { drugs = []; renderStack(); location.reload(); }
    };

    // Расчет рисков
    document.getElementById('calcRiskBtn').onclick = () => {
        if(!drugs.length) return alert('Добавь препараты!');
        
        const sums = {CV:0, Hep:0, Neuro:0, Lipid:0, Nephro:0, Hemo:0};
        let oral = 0;
        drugs.forEach(d => {
            Object.keys(sums).forEach(k => sums[k] += d.risks[k]);
            if(d.route === 'oral') oral++;
        });
        
        const penalty = oral > 1 ? (oral-1)*2 : 0;
        const total = Object.values(sums).reduce((a,b)=>a+b, 0) + penalty;
        
        // График
        const ctx = document.getElementById('riskChart').getContext('2d');
        if(riskChart) riskChart.destroy();
        
        riskChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Сердце', 'Печень', 'Нервы', 'Липиды', 'Почки', 'Кровь'],
                datasets: [{
                    label: 'Уровень риска',
                    data: [sums.CV, sums.Hep, sums.Neuro, sums.Lipid, sums.Nephro, sums.Hemo],
                    backgroundColor: 'rgba(79, 209, 197, 0.4)',
                    borderColor: '#4fd1c5',
                    borderWidth: 2
                }]
            },
            options: {
                scales: { r: { beginAtZero: true, max: 60, grid: { color: '#4a5568' }, ticks: { color: '#fff' } } },
                plugins: { legend: { labels: { color: '#fff' } } }
            }
        });

        const sumDiv = document.getElementById('riskSummary');
        let color = total < 20 ? '#68d391' : (total < 40 ? '#ecc94b' : '#fc8181');
        sumDiv.innerHTML = `<span style="color:${color}; font-weight:bold; font-size:1.2em;">Общий индекс токсичности: ${total}</span><br><small>${penalty > 0 ? '(Штраф за пероральные: +' + penalty + ')' : ''}</small>`;
        
        // Переключаем на вкладку рисков
        document.querySelector('[data-tab="risks"]').click();
    };
    
    renderStack();
});

// Макросы
function calcMacros() {
    const w = +document.getElementById('weight').value;
    const g = document.getElementById('goal').value;
    let cal = w * 30;
    if(g === 'cut') cal -= 500;
    if(g === 'bulk') cal += 500;
    
    const p = Math.round(w * 2.2);
    const f = Math.round(w * 1);
    const c = Math.round((cal - (p*4 + f*9)) / 4);
    
    const box = document.getElementById('macroResult');
    box.style.display = 'block';
    box.innerHTML = `
        <h3>Твоя норма:</h3>
        <div style="display:flex; justify-content:space-around; text-align:center;">
            <div><b>${cal}</b><br>Ккал</div>
            <div><b>${p}г</b><br>Белки</div>
            <div><b>${c}г</b><br>Углы</div>
            <div><b>${f}г</b><br>Жиры</div>
        </div>
    `;
}
