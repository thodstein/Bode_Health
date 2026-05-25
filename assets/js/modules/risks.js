const RisksModule = {
    chart: null,
    calculate() {
        const stack = Storage.get('stack');
        if(stack.length === 0) return alert('Добавьте препараты в стек!');
        
        let raw = { cv:0, hep:0, neuro:0, lipid:0, nephro:0, hemo:0, endo:0 };
        
        // Считаем RAW риски от препаратов
        stack.forEach(item => {
            const factor = 1; // Тут можно добавить множитель от дозы
            for(let key in item.risks) {
                raw[key] += item.risks[key] * factor;
            }
        });
        
        // Нормализация (макс 100%)
        for(let key in raw) raw[key] = Math.min(100, raw[key] * 10);
        
        // Расчет NET рисков (снижение за счет поддержки)
        // Если поддержка есть в базе, снижаем риск на 60-80%
        const net = { ...raw };
        const supportIds = SUPPORT_DB.map(s => s.id);
        
        // Упрощенная логика: если есть поддержка группы, режем риск
        if(SUPPORT_DB.some(s => s.group === 'cv')) { net.cv *= 0.3; net.lipid *= 0.4; }
        if(SUPPORT_DB.some(s => s.group === 'hep')) { net.hep *= 0.3; }
        if(SUPPORT_DB.some(s => s.group === 'kidney')) { net.nephro *= 0.4; }
        if(SUPPORT_DB.some(s => s.group === 'blood')) { net.hemo *= 0.4; }
        if(SUPPORT_DB.some(s => s.group === 'neuro')) { net.neuro *= 0.4; }
        
        this.renderChart(raw, net);
        this.renderDetails(raw, net);
        
        // Переключаем на вкладку рисков
        document.querySelector('[data-tab="risks"]').click();
    },
    renderChart(raw, net) {
        const ctx = document.getElementById('riskChart').getContext('2d');
        if(this.chart) this.chart.destroy();
        
        this.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Сердце', 'Печень', 'Невро', 'Липиды', 'Почки', 'Кровь', 'Эндокрин'],
                datasets: [
                    { label: 'RAW (Без защиты)', data: Object.values(raw), borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.2)' },
                    { label: 'NET (С поддержкой)', data: Object.values(net), borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.2)' }
                ]
            },
            options: { scales: { r: { min: 0, max: 100 } } }
        });
    },
    renderDetails(raw, net) {
        const div = document.getElementById('riskDetails');
        div.innerHTML = '<h3>Детализация снижения</h3>';
        const names = { cv:'Сердце', hep:'Печень', neuro:'Нервы', lipid:'Липиды', nephro:'Почки', hemo:'Кровь', endo:'Гормоны' };
        
        for(let key in raw) {
            const r = Math.round(raw[key]);
            const n = Math.round(net[key]);
            const diff = r - n;
            const colorClass = n > 50 ? 'risk-high' : (n > 25 ? 'risk-med' : 'risk-low');
            
            div.innerHTML += `
                <div style="margin-bottom:15px">
                    <div style="display:flex; justify-content:space-between">
                        <span>${names[key]}</span>
                        <span>${r}% → <strong style="color:var(--success)">${n}%</strong> (-${diff}%)</span>
                    </div>
                    <div class="risk-bar"><div class="risk-fill ${colorClass}" style="width:${n}%"></div></div>
                </div>
            `;
        }
    },
    clear() {
        document.getElementById('riskChart').innerHTML = '';
        document.getElementById('riskDetails').innerHTML = '';
        if(this.chart) { this.chart.destroy(); this.chart = null; }
    }
};
