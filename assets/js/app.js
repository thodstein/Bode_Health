document.addEventListener('DOMContentLoaded', () => {
    let drugs = [];
    let logs = { nutrition: [], training: [] };
    let chartInst = null;

    // Табы
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            document.getElementById(b.dataset.tab).classList.add('active');
        });
    });

    // Слайдеры
    ['CV','Hep','Neuro','Lipid','Nephro','Hemo'].forEach(k => {
        const el = document.getElementById('r'+k);
        const span = el.nextElementSibling;
        el.oninput = () => span.textContent = el.value;
    });

    // Добавление препарата
    document.getElementById('drugForm').onsubmit = (e) => {
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
        ['CV','Hep','Neuro','Lipid','Nephro','Hemo'].forEach(k => document.getElementById('r'+k).nextElementSibling.textContent = '0');
    };

    function renderStack() {
        const list = document.getElementById('stackList');
        list.innerHTML = '';
        if(!drugs.length) { list.innerHTML = '<p style="text-align:center;color:#718096">Стек пуст</p>'; return; }
        drugs.forEach(d => {
            const div = document.createElement('div');
            div.className = 'item-card';
            const rTxt = d.route === 'oral' ? '💊' : (d.route === 'inject' ? '💉' : '🧴');
            div.innerHTML = `
                <div class="item-info">
                    <h4>${d.name} <small>(${d.dose})</small></h4>
                    <p>${rTxt} ${d.period} | Риски: CV:${d.risks.CV} Hep:${d.risks.Hep}</p>
                </div>
                <button class="delete-btn" onclick="delDrug(${d.id})">✕</button>
            `;
            list.appendChild(div);
        });
    }
    window.delDrug = (id) => { drugs = drugs.filter(x=>x.id!==id); renderStack(); };

    // Логи (Питание/Тренировки)
    window.addLog = (type) => {
        const prefix = type === 'nutrition' ? 'nutri' : 'train';
        const inp1 = document.getElementById(type==='nutrition'?'calIn':'trainEx');
        const inp2 = document.getElementById(type==='nutrition'?'protIn':'trainSets');
        const inp3 = document.getElementById(type==='nutrition'?'fatIn':'trainWeight');
        
        if(!inp1.value) return alert('Заполните данные');
        
        const item = { id: Date.now(), v1: inp1.value, v2: inp2.value, v3: inp3.value };
        logs[type].push(item);
        
        const ul = document.getElementById(prefix+'List');
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.v1}</span> <span style="color:#a0aec0">${item.v2} ${item.v3?'| '+item.v3:''}</span> <button class="delete-btn" onclick="this.parentElement.remove()">✕</button>`;
        ul.prepend(li);
        
        inp1.value=''; inp2.value=''; if(inp3) inp3.value='';
    };

    // Расчет рисков
    document.getElementById('calcBtn').onclick = () => {
        if(!drugs.length) return alert('Добавьте препараты в стек!');
        
        const sums = {CV:0,Hep:0,Neuro:0,Lipid:0,Nephro:0,Hemo:0};
        let oralCnt = 0;
        drugs.forEach(d => {
            Object.keys(sums).forEach(k => sums[k]+=d.risks[k]);
            if(d.route==='oral') oralCnt++;
        });
        
        const penalty = oralCnt > 1 ? (oralCnt-1)*2 : 0;
        const maxVal = Math.max(...Object.values(sums)) + penalty;
        
        const ctx = document.getElementById('riskChart').getContext('2d');
        if(chartInst) chartInst.destroy();
        
        chartInst = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Сердце','Печень','Невро','Липиды','Почки','Кровь'],
                datasets: [{
                    label: 'Уровень токсичности',
                    data: [sums.CV, sums.Hep, sums.Neuro, sums.Lipid, sums.Nephro, sums.Hemo],
                    backgroundColor: 'rgba(79, 209, 197, 0.4)',
                    borderColor: '#4fd1c5',
                    borderWidth: 2,
                    pointBackgroundColor: '#fff'
                }]
            },
            options: {
                scales: { r: { beginAtZero: true, max: Math.max(50, maxVal+10), grid:{color:'#4a5568'}, ticks:{color:'#cbd5e0'} } },
                plugins: { legend: {labels:{color:'#fff'}} }
            }
        });
        
        const resDiv = document.getElementById('riskResult');
        const txtDiv = document.getElementById('riskText');
        resDiv.style.display = 'block';
        
        let msg = `Максимальная нагрузка: <b>${maxVal}</b>`;
        if(penalty) msg += ` (штраф за пероральные: +${penalty})`;
        txtDiv.innerHTML = msg;
        txtDiv.className = 'risk-text ' + (maxVal > 40 ? 'score-high' : (maxVal > 20 ? 'score-med' : 'score-low'));
        
        // Автопереход на вкладку рисков если мы не там
        if(!document.querySelector('[data-tab="risks"]').classList.contains('active')) {
             document.querySelector('[data-tab="risks"]').click();
        }
    };
    
    renderStack();
});
