const RisksModule = {
  calculate: (drugs) => {
    let risks = { liver: 0, cardio: 0, neuro: 0, lipids: 0, kidneys: 0, hemo: 0, endo: 0 };
    let maxPotential = { liver: 100, cardio: 100, neuro: 100, lipids: 100, kidneys: 100, hemo: 100, endo: 100 };
    
    drugs.forEach(d => {
      // Упрощенная логика расчета на основе параметров из БД
      const factor = d.userDose / 100; 
      risks.liver += (d.hepatotoxicity || 0) * factor * 10;
      risks.cardio += (d.cvRisk || 0) * factor * 10;
      risks.neuro += (d.neuroRisk || 0) * factor * 10;
      risks.lipids += (Math.abs(d.lipidImpact || 0)) * factor * 5;
      risks.kidneys += (d.erythrocytosis === 'extreme' ? 20 : 0) * factor;
      risks.hemo += (d.erythrocytosis === 'high' || d.erythrocytosis === 'extreme' ? 15 : 0) * factor;
      risks.endo += (d.progestin ? 10 : 0) * factor + (d.insulinResist ? 20 : 0) * factor;
    });

    // Нормализация и применение "поддержки" (заглушка, пока без детального расчета поддержки)
    // В полной версии здесь будет вычет эффективности SupportModule
    const netRisks = {};
    Object.keys(risks).forEach(k => {
      const raw = Math.min(100, Math.round(risks[k]));
      netRisks[k] = Math.max(0, raw - 15); // Пример снижения за счет базовой поддержки
    });

    RisksModule.render(risks, netRisks);
  },
  render: (raw, net) => {
    const container = document.getElementById('riskGrid');
    if(!container) return;
    const labels = { liver: 'Печень', cardio: 'Сердце', neuro: 'Невро', lipids: 'Липиды', kidneys: 'Почки', hemo: 'Кровь', endo: 'Эндокрин' };
    
    let html = '<div class="risk-grid">';
    Object.keys(raw).forEach(key => {
      const rVal = raw[key];
      const nVal = net[key];
      let levelClass = rVal > 50 ? 'high' : (rVal > 25 ? 'med' : 'low');
      html += `
        <div class="risk-card ${levelClass}">
          <div>${labels[key]}</div>
          <div class="risk-val">${rVal}% <span style="font-size:0.8rem; color:#777;">→ ${nVal}%</span></div>
          <small>Raw → Net</small>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  }
};
