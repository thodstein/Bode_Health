window.appStorage = window.appStorage || {};

(function () {
  window.appStorage.calculatePCT = function () {
    const lastWeek = Number(document.getElementById('pct-last-week')?.value || 0);
    const halfLife = Number(document.getElementById('pct-half-life')?.value || 0);
    const start = lastWeek + Math.ceil(5 * halfLife);
    const out = document.getElementById('pct-result');
    const state = window.appStorage.readState();

    if (out) {
      out.innerHTML = `
        <span class="chip">Последняя неделя: <b>${lastWeek || '—'}</b></span>
        <span class="chip">П/п: <b>${halfLife || '—'}</b></span>
        <span class="chip">Старт ПКТ: <b>${start || '—'}</b></span>
      `;
    }

    window.appStorage.saveJSON('pct-state', state);
    return { lastWeek, halfLife, start };
  };
})();