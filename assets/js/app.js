document.addEventListener('DOMContentLoaded', () => {
    let drugs = [];
    let chartInstance = null;

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
    ['CV', 'Hep', 'Neuro', 'Lipid', 'Nephro', 'Hemo'].forEach(k => {
        const inp = document.getElementById(`r${k}`);
        const out = document.getElementById(`v${k}`);
        if(inp && out) inp.addEventListener('input', () => out.textContent = inp.value);
    });

    // Добавление
    document.getElementById('drugForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const drug = {
            id: Date.now(),
            name: document.getElementById('dName').value,
            dose: document.getElementById('dDose').value,
            route: document.getElementById('dRoute').value,
            period: document.getElementById('dPeriod').value,
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
        ['CV','Hep','Neuro','Lipid','Nephro','Hemo'].forEach(k => document.getElementById(`v${k}`).textContent='0');
        alert('Препарат добавлен!');
    });

    function renderStack() {
        const list = document.getElementById('stackList');
        list.innerHTML = '';
        if(!drugs.length) { list.innerHTML = '<div class="no-data">Стек пуст</div>'; return; }
        
        drugs.forEach(d => {
            const rText = d.route === 'oral' ? '💊' : (d.route === 'inject' ? '💉' : '🧴');
            const div = document.createElement('div');
            div.className = 'drug-item';
            div.innerHTML = `
                <div class="drug-info">
                    <h4>${d.name} <small>(${d.dose})</small></h4>
                    <p>${rText} ${d.period} | Риски: CV:${d.risks.CV} Hep:${d.risks.Hep}</p>
                </div>
                <button class="btn-del" onclick="removeDrug(${d.id})">X</button>
            `;
            list.appendChild(div);
        });
    }

    window.removeDrug = (id) => {
        drugs = drugs.filter(d => d.id !== id);
        renderStack();
        document.getElementById('riskOutput').style.display = 'none';
        document.getElementById('noData').style.display = 'block';
    };

    document.getElementById('clearBtn').addEventListener('click', () => {
        if(confirm('Удалить всё?')) { drugs = []; renderStack(); location.reload(); }
    });

    // Расчет
    document.getElementById('calcBtn').addEventListener('click', () => {
        if(!drugs.length) return alert('Добавьте препараты!');
        
        const sums = { CV:0, Hep:0, Neuro:0, Lipid:0, Nephro:0, Hemo:0 };
        let oralCnt = 0;
        
        drugs.forEach(d => {
            Object.keys(sums).forEach(k => sums[k] += d.risks[k]);
            if(d.route === 'oral') oralCnt++;
        });

        const penalty = oralCnt > 1 ? (oralCnt-1)*2 : 0;
        const maxVal = Math.max(...Object.values(sums)) + penalty;
        
        // График
        const ctx = document.getElementById('radarChart').getContext('2d');
        if(chartInstance) chartInstance.destroy();
        
        chartInstance = new Chart(ctx, {
            type: 'radar',
             {
                labels: ['Сердце', 'Печень', 'Нервы', 'Липиды', 'Почки', 'Кровь'],
                datasets: [{
                    label: 'Токсичность',
                     [sums.CV, sums.Hep, sums.Neuro, sums.Lipid, sums.Nephro, sums.Hemo],
                    backgroundColor: 'rgba(79, 209, 197, 0.4)',
                    borderColor: '#4fd1c5',
                    borderWidth: 2,
                    pointBackgroundColor: '#fff'
                }]
            },
            options: {
                scales: { r: { beginAtZero: true, max: Math.max(50, maxVal+10), grid: { color: '#4a5568' }, ticks: { color: '#a0aec0' } } },
                plugins: { legend: { labels: { color: '#fff' } } }
            }
        });

        // Вывод
        const out = document.getElementById('riskOutput');
        const noData = document.getElementById('noData');
        const scoreBox = document.getElementById('scoreBox');
        const detailList = document.getElementById('detailList');

        out.style.display = 'block';
        noData.style.display = 'none';

        let msg = `Индекс нагрузки: ${maxVal}`;
        if(penalty) msg += ` (+${penalty} штраф за оральные)`;
        scoreBox.textContent = msg;
        scoreBox.className = 'score-box ' + (maxVal < 20 ? 'score-low' : (maxVal < 40 ? 'score-med' : 'score-high'));

        detailList.innerHTML = Object.entries(sums).map(([k,v]) => `<li><b>${k}:</b> ${v}</li>`).join('');
        
        // Переключение на вкладку результатов
        setTimeout(() => {
            document.querySelector('[data-tab="risks"]').click();
        }, 500);
    });

    renderStack();
});
