const SupportModule = {
    init() {
        this.render();
    },
    render() {
        const container = document.getElementById('supportSchedule');
        container.innerHTML = '';
        const times = { morning: '☀️ Утро', lunch: '🍽 Обед', preworkout: '🏋️ Предтреник', intra: '⚡ Интра', evening: '🌙 Вечер' };
        
        for(const [time, label] of Object.entries(times)) {
            const items = SUPPORT_DB.filter(s => s.time === time);
            if(items.length === 0) continue;
            
            const group = document.createElement('div');
            group.className = 'support-group';
            group.innerHTML = `<h3>${label}</h3>`;
            
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'support-item';
                div.innerHTML = `
                    <span><strong>${item.name}</strong> <small>(${item.group})</small></span>
                    <span style="color:var(--accent)">${item.dose}</span>
                `;
                group.appendChild(div);
            });
            container.appendChild(group);
        }
        
        // Синергия
        const synergyDiv = document.getElementById('synergyBlock');
        synergyDiv.innerHTML = '<h3>🔗 Активные синергии</h3><ul>' + 
            SUPPORT_DB.filter(s => s.synergy.length > 0).map(s => 
                `<li><strong>${s.name}</strong> усиливает: ${s.synergy.join(', ')}</li>`
            ).join('') + '</ul>';
    }
};
