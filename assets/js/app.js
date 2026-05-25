import { DRUGS_DB, SUPPORT_DB, SYNERGY_DB } from './core/constants.js';
import { Storage } from './core/storage.js';
import { RiskEngine } from './modules/risks.js';
import { SupportEngine } from './modules/support.js';

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bode Health v11.0 Loaded');
    
    // Табы
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(e.target.dataset.tab).classList.add('active');
            
            if(e.target.dataset.tab === 'risks') RiskEngine.renderChart();
            if(e.target.dataset.tab === 'support') SupportEngine.renderSchedule();
        });
    });

    // Форма добавления препарата
    document.getElementById('drugForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const drug = {
            id: Date.now(),
            name: document.getElementById('drugName').value,
            dose: document.getElementById('drugDose').value,
            type: document.getElementById('drugType').value
        };
        Storage.addDrug(drug);
        renderStack();
        e.target.reset();
        alert('Препарат добавлен в стек!');
    });

    function renderStack() {
        const list = document.getElementById('stackList');
        const drugs = Storage.getDrugs();
        list.innerHTML = drugs.map(d => `
            <div class="item-card">
                <div>
                    <div class="drug-name">${d.name}</div>
                    <div class="drug-dose">${d.dose}</div>
                </div>
                <button onclick="window.removeDrug(${d.id})" style="background:none;border:none;color:#ef4444;cursor:pointer;">✕</button>
            </div>
        `).join('');
        
        // Пересчет рисков при изменении стека
        RiskEngine.calculate();
        SupportEngine.renderSchedule();
    }

    window.removeDrug = (id) => {
        Storage.removeDrug(id);
        renderStack();
    };

    // Первичная отрисовка
    renderStack();
    RiskEngine.calculate();
    SupportEngine.renderSchedule();
});
