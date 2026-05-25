// Инициализация Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
}

document.addEventListener('DOMContentLoaded', () => {
    let currentStack = JSON.parse(localStorage.getItem('bh_stack')) || [];
    let riskChartInstance = null;

    // --- ТАБЫ ---
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

    // --- ЗАПОЛНЕНИЕ СПИСКА ПРЕПАРАТОВ ---
    const dataList = document.getElementById('drug-list');
    DRUGS_DB.forEach(drug => {
        const opt = document.createElement('option');
        opt.value = drug.name;
        dataList.appendChild(opt);
    });

    // --- ДОБАВЛЕНИЕ В СТЕК ---
    document.getElementById('add-drug-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('drug-search').value;
        const dose = document.getElementById('drug-dose').value;
        const route = document.getElementById('drug-route').value;
        
        if (!name) return alert('Выберите препарат');
        
        const dbDrug = DRUGS_DB.find(d => d.name === name) || { name: name, risks: { liver: 10, cardio: 10, hemo: 10, neuro: 10, kidney: 10, endo: 10 } };
        
        currentStack.push({ ...dbDrug, userDose: dose, userRoute: route, id: Date.now() });
        saveStack();
        renderStack();
        e.target.reset();
    });

    function saveStack() {
        localStorage.setItem('bh_stack', JSON.stringify(currentStack));
    }

    function renderStack() {
        const container = document.getElementById('active-stack');
        container.innerHTML = '';
        if (currentStack.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#666;">Стек пуст</p>';
            return;
        }
        currentStack.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'drug-item';
            div.innerHTML = `
                <div class="drug-info">
                    <h4>${item.name}</h4>
                    <p>${item.userDose} | ${item.userRoute.toUpperCase()}</p>
                </div>
                <button class="delete-btn" onclick="removeDrug(${index})">×</button>
            `;
            container.appendChild(div);
        });
        window.removeDrug = (idx) => {
            currentStack.splice(idx, 1);
            saveStack();
            renderStack();
        };
    }
    renderStack();

    // --- ОЧИСТКА ---
    document.getElementById('clear-stack-btn').addEventListener('click', () => {
        if(confirm('Удалить весь стек?')) {
            currentStack = [];
            saveStack();
            renderStack();
            document.getElementById('support-plan').innerHTML = '';
            document.getElementById('risk-matrix').innerHTML = '';
        }
    });

    // --- РАСЧЕТ РИСКОВ И ПОДДЕРЖКИ ---
    document.getElementById('calc-risks-btn').addEventListener('click', () => {
        if (currentStack.length === 0) return alert('Стек пуст!');

        // 1. Считаем RAW риски (сумма)
        let totalRisks = { liver: 0, cardio: 0, hemo: 0, neuro: 0, kidney: 0, endo: 0, repro: 0 };
        let oralCount = 0;

        currentStack.forEach(drug => {
            if (drug.type === 'oral') oralCount++;
            Object.keys(totalRisks).forEach(key => {
                if (drug.risks[key]) totalRisks[key] += drug.risks[key];
            });
        });

        // Штраф за оральные
        if (oralCount > 1) totalRisks.liver += (oralCount - 1) * 15;

        // 2. Подбираем поддержку
        const supportPlan = { morning: [], lunch: [], evening: [], pre: [] };
        const coveredRisks = { ...totalRisks };

        SUPPORT_DB.forEach(supp => {
            supp.targets.forEach(target => {
                if (coveredRisks[target] > 30) {
                    // Добавляем поддержку если риск высок
                    const timeKey = supp.time === 'morning' ? 'morning' : (supp.time === 'lunch' ? 'lunch' : 'evening');
                    if (!supportPlan[timeKey].find(s => s.id === supp.id)) {
                        supportPlan[timeKey].push(supp);
                        coveredRisks[target] -= 20; // Снижаем риск
                    }
                }
            });
        });

        // 3. Отрисовка поддержки
        const planDiv = document.getElementById('support-plan');
        planDiv.innerHTML = '';
        const times = { morning: '☀️ Утро', lunch: '🍽️ Обед', evening: '🌙 Вечер', pre: '⚡ Предтреник' };
        
        Object.keys(times).forEach(time => {
            if (supportPlan[time].length > 0) {
                const group = document.createElement('div');
                group.className = 'support-group card';
                group.innerHTML = `<h3>${times[time]}</h3>`;
                supportPlan[time].forEach(item => {
                    group.innerHTML += `<div class="support-item"><strong>${item.name}</strong> ${item.dose}<br><small>Цель: ${item.targets.join(', ')}</small></div>`;
                });
                planDiv.appendChild(group);
            }
        });

        // Синергия
        const synDiv = document.getElementById('synergy-block');
        synDiv.innerHTML = '<h3>💡 Синергетические связки:</h3>';
        let foundSyn = false;
        for (let key in SYNERGY_RULES) {
            const [s1, s2] = key.split('_');
            const hasS1 = supportPlan.morning.concat(supportPlan.lunch, supportPlan.evening).some(i => i.id.includes(s1));
            const hasS2 = supportPlan.morning.concat(supportPlan.lunch, supportPlan.evening).some(i => i.id.includes(s2));
            if (hasS1 && hasS2) {
                synDiv.innerHTML += `<p>✅ ${SYNERGY_RULES[key]}</p>`;
                foundSyn = true;
            }
        }
        if (!foundSyn) synDiv.innerHTML += '<p>Нет активных связок</p>';
        synDiv.style.display = 'block';

        // 4. Отрисовка рисков (График + Матрица)
        const ctx = document.getElementById('risk-chart').getContext('2d');
        if (riskChartInstance) riskChartInstance.destroy();

        const labels = ['Печень', 'Сердце', 'Кровь', 'Невро', 'Почки', 'Эндо'];
        const dataRaw = [totalRisks.liver, totalRisks.cardio, totalRisks.hemo, totalRisks.neuro, totalRisks.kidney, totalRisks.endo];
        const dataNet = [coveredRisks.liver, coveredRisks.cardio, coveredRisks.hemo, coveredRisks.neuro, coveredRisks.kidney, coveredRisks.endo];

        riskChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'RAW (Без защиты)', data: dataRaw, borderColor: '#cf6679', backgroundColor: 'rgba(207, 102, 121, 0.2)' },
                    { label: 'NET (С защитой)', data: dataNet, borderColor: '#03dac6', backgroundColor: 'rgba(3, 218, 198, 0.2)' }
                ]
            },
            options: { scales: { r: { min: 0, max: 100 } }, responsive: true }
        });

        // Матрица цифрами
        const matrixDiv = document.getElementById('risk-matrix');
        matrixDiv.innerHTML = '';
        const names = { liver: 'Печень', cardio: 'Сердце', hemo: 'Кровь', neuro: 'Невро', kidney: 'Почки', endo: 'Гормоны' };
        Object.keys(totalRisks).forEach(key => {
            if (key === 'repro') return;
            const raw = totalRisks[key];
            const net = coveredRisks[key];
            const colorClass = net > 50 ? 'risk-high' : (net > 25 ? 'risk-med' : 'risk-low');
            
            matrixDiv.innerHTML += `
                <div class="risk-card">
                    <div style="font-size:12px; color:#aaa">${names[key]}</div>
                    <div class="risk-val ${colorClass}">${net}%</div>
                    <div style="font-size:10px">Было: ${raw}%</div>
                </div>
            `;
        });

        // Переключаем вкладку на риски
        setTimeout(() => {
            document.querySelector('[data-tab="risks"]').click();
        }, 500);
    });

    // --- ГОЛОСОВОЙ ВВОД (ПИТАНИЕ) ---
    const voiceBtn = document.getElementById('voice-btn');
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            document.getElementById('food-input').value = text;
            addFood(text);
        };
        voiceBtn.addEventListener('click', () => recognition.start());
    } else {
        voiceBtn.style.display = 'none';
    }

    document.getElementById('food-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addFood(e.target.value);
    });

    function addFood(text) {
        const log = document.getElementById('food-log');
        const item = document.createElement('div');
        item.className = 'support-item'; // Используем стиль элемента
        item.innerHTML = `🍽️ <strong>Сейчас:</strong> ${text}`;
        log.prepend(item);
        document.getElementById('food-input').value = '';
    }

    // --- ФЕРТИЛЬНОСТЬ ---
    document.getElementById('calc-fertility').addEventListener('click', () => {
        const count = parseFloat(document.getElementById('sperm-count').value);
        const mot = parseFloat(document.getElementById('sperm-motility').value);
        if (!count || !mot) return alert('Введите данные');
        
        // Упрощенная формула WHO
        const index = Math.min(100, ((count / 16) * 50) + ((mot / 30) * 50));
        const resDiv = document.getElementById('fertility-result');
        const color = index > 60 ? '#4caf50' : (index > 30 ? '#ff9800' : '#f44336');
        resDiv.innerHTML = `<h3 style="color:${color}">Индекс фертильности: ${Math.round(index)}%</h3>`;
    });
});
