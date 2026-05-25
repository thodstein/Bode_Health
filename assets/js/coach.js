window.appStorage = window.appStorage || {};

(function () {
  window.appStorage.runCoachRecommendations = function () {
    const goal = document.getElementById('goal')?.value || 'maintain';
    const fatigue = Number(document.getElementById('fatigue')?.value || 5);
    const days = Number(document.getElementById('trainDays')?.value || 4);
    const intensity = document.getElementById('intensity')?.value || 'mid';
    const out = document.getElementById('coachOutput');
    if (!out) return;

    const recovery = fatigue >= 8 ? 'Снизить объем на 20–30% и убрать отказ.' : fatigue >= 5 ? 'Держать объем умеренным, 1–2 тяжелых базовых движения.' : 'Можно повышать нагрузку постепенно.';
    const split = days <= 3 ? 'Full body 3 раза в неделю' : days <= 5 ? 'Upper/Lower или Push/Pull/Legs' : 'Сплит по группам мышц';
    const focus = goal === 'bulk' ? 'Приоритет: базовые движения и прогрессия веса.' : goal === 'cut' ? 'Приоритет: сохранение силы и контроль объема.' : 'Приоритет: стабильный объем и восстановление.';

    out.innerHTML = `
      <div class="notice">${split}</div>
      <div class="notice" style="margin-top:8px">${focus}</div>
      <div class="notice" style="margin-top:8px">Интенсивность: ${intensity}</div>
      <div class="notice" style="margin-top:8px">${recovery}</div>
    `;
  };

  window.runCoachRecommendations = window.appStorage.runCoachRecommendations;
})();