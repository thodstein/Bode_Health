window.appStorage = window.appStorage || {};

(function () {
  const markerSets = {
    hep: ['ALT', 'AST', 'GGT', 'ALP', 'Bilirubin', 'Albumin'],
    nephro: ['Creatinine', 'Urea', 'eGFR', 'Sodium', 'Potassium'],
    lipid: ['LDL', 'HDL', 'TG', 'ApoB', 'Total Chol'],
    cardio: ['SBP', 'DBP', 'hs-CRP', 'Pulse'],
    hem: ['Hct', 'Hb', 'RBC', 'Ferritin'],
    end: ['Testosterone', 'Estradiol', 'Prolactin', 'SHBG', 'LH', 'FSH']
  };

  const history = [
    'Baseline', 'Cycle week 4', 'Cycle week 8', 'Bridge', 'PCT mid', 'Post-PCT'
  ];

  function renderChips(containerId, items) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = items.map(x => `<span class="chip">${x}</span>`).join('');
  }

  function renderLabs() {
    const labs = document.getElementById('lab-markers');
    if (!labs) return;
    labs.innerHTML = Object.entries(markerSets)
      .map(([k, vals]) => `
        <div class="lab-block">
          <div class="lab-header" data-lab-toggle="${k}">
            <h4>${k.toUpperCase()}</h4>
            <span class="muted">toggle</span>
          </div>
          <div class="lab-content">
            ${vals.map(v => `<label class="checkbox-inline"><input type="checkbox"> ${v}</label>`).join('')}
          </div>
        </div>
      `).join('');

    document.querySelectorAll('.lab-header').forEach(h => {
      h.addEventListener('click', () => h.nextElementSibling.classList.toggle('open'));
    });

    renderChips('lab-history', history);
  }

  window.appStorage.initLabsModule = renderLabs;
  document.addEventListener('DOMContentLoaded', renderLabs);
})();