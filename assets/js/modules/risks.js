import { Storage } from '../core/storage.js';

export const RiskEngine = {
    calculate: () => {
        const drugs = Storage.getDrugs();
        let rawRisk = 20; // Базовый риск
        let netRisk = 10;

        // Простая логика расчета для демонстрации
        if(drugs.length > 0) rawRisk += drugs.length * 15;
        if(drugs.some(d => d.type === 'oral')) rawRisk += 20;
        
        // Снижение риска за счет поддержки (имитация)
        netRisk = Math.max(5, rawRisk * 0.4);

        // Обновление UI
        const dashRisk = document.getElementById('dashRisk');
        if(dashRisk) {
            dashRisk.textContent = `${Math.round(netRisk)}%`;
            dashRisk.className = `stat-value ${netRisk > 30 ? 'risk-high' : (netRisk > 15 ? 'risk-med' : 'risk-low')}`;
        }
        
        return { raw: rawRisk, net: netRisk };
    },
    
    renderChart: () => {
        const ctx = document.getElementById('riskChart');
        if(!ctx) return;
        
        // Уничтожаем старый график если есть
        const oldChart = Chart.getChart(ctx);
        if(oldChart) oldChart.destroy();

        const risks = RiskEngine.calculate();
        
        new Chart(ctx, {
            type: 'bar',
             {
                labels: ['Raw Risk', 'Net Risk'],
                datasets: [{
                    label: 'Уровень риска (%)',
                     [risks.raw, risks.net],
                    backgroundColor: ['#ef4444', '#10b981']
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        });
    }
};
