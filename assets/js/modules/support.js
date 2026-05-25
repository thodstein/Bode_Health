const SupportModule = {
  render: () => {
    const container = document.getElementById('supportList');
    if(!container) return;
    
    const protocol = DB.supportProtocols.heavyCycle;
    const timeLabels = { morning_fast: '🌅 Натощак', morning_food: '☀️ Завтрак', lunch: '🍽 Обед', pre_workout: '💪 Предтреник', intra_workout: '🔄 Во время тренировки', evening: '🌙 Вечер', extra: '💉 Дополнительно' };
    
    let html = '';
    protocol.forEach(slot => {
      html += `<div class="card"><h3>${timeLabels[slot.time]}</h3>`;
      slot.items.forEach(itemId => {
        // Поиск препарата в базе по ID (упрощенно)
        const item = DB.drugs.find(d => d.id === itemId) || { name: itemId, type: 'unknown' };
        html += `
          <div class="support-item">
            <div>
              <strong>${item.name}</strong>
              <span class="badge">${item.type}</span>
            </div>
            <button class="btn btn-success btn-sm">Купить</button>
          </div>
        `;
      });
      html += '</div>';
    });
    container.innerHTML = html;
  }
};
