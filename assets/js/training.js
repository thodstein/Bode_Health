window.appStorage = window.appStorage || {};

(function () {
  window.appStorage.calculateMRR = function () {
    const days = Number(document.getElementById('trainDays')?.value || 4);
    const min = Number(document.getElementById('trainMin')?.value || 60);
    const fat = Number(document.getElementById('fatigue')?.value || 5);
    const stress = Number(document.getElementById('stress')?.value || 5);
    const sleep = Number(document.getElementById('sleep')?.value || 7);
    const score = Math.max(0, days * 12 + min * 0.5 + fat * 8 + stress * 5 - sleep * 6);
    const out = document.getElementById('mrrOutput');
    if (out) out.innerHTML = `<div class="notice">MRR: <b>${Math.round(score)}</b></div>`;
  };
})();