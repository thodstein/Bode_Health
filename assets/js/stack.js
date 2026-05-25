window.appStorage = window.appStorage || {};

(function () {
  const drugOptions = [
    ['testosterone', 'Testosterone'],
    ['trenbolone', 'Trenbolone'],
    ['boldenone', 'Boldenone'],
    ['nandrolone', 'Nandrolone'],
    ['drostanolone', 'Drostanolone'],
    ['metandienone', 'Metandienone'],
    ['oxandrolone', 'Oxandrolone'],
    ['oxymetholone', 'Oxymetholone'],
    ['stanozolol', 'Stanozolol'],
    ['hgh', 'HGH'],
    ['igf1lr3', 'IGF-1 LR3'],
    ['insulinshort', 'Insulin'],
    ['t3', 'T3']
  ];

  const esterOptions = [
    ['enanthate', 'Enanthate'],
    ['cypionate', 'Cypionate'],
    ['propionate', 'Propionate'],
    ['acetate', 'Acetate'],
    ['decanoate', 'Decanoate'],
    ['oral', 'Oral']
  ];

  window.appStorage.stack = window.appStorage.stack || [];

  function fillSelect(id, items, placeholder) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  }

  function renderStack() {
    const out = document.getElementById('stackList');
    const empty = document.getElementById('emptyStack');
    if (!out) return;
    const stack = window.appStorage.stack;
    out.innerHTML = stack.map(item => `
      <div class="item">
        <div>
          <b>${item.drug}</b> / ${item.ester}
          <div class="small">${item.dose} mg/нед, ${item.start}-${item.end}</div>
        </div>
        <button class="del-btn" data-del="${item.uid}">×</button>
      </div>
    `).join('');
    if (empty) empty.style.display = stack.length ? 'none' : 'block';

    out.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = Number(btn.dataset.del);
        window.appStorage.stack = window.appStorage.stack.filter(x => x.uid !== uid);
        renderStack();
      });
    });
  }

  window.appStorage.addDrugToStack = function () {
    const drug = document.getElementById('drugSelect')?.value || '';
    const ester = document.getElementById('esterSelect')?.value || '';
    const dose = Number(document.getElementById('doseVal')?.value || 0);
    const start = Number(document.getElementById('startWeek')?.value || 1);
    const end = Number(document.getElementById('endWeek')?.value || start);
    window.appStorage.stack.push({ drug, ester, dose, start, end, uid: Date.now() });
    renderStack();
    window.appStorage.updatePCTAutoFields?.();
  };

  window.appStorage.updatePCTAutoFields = function () {
    const stack = window.appStorage.stack;
    const lastWeek = stack.reduce((m, x) => Math.max(m, x.end || 0), 0);
    const maxHL = stack.length ? 8 : 0;
    const lastField = document.getElementById('lastinjweekdisplay');
    const hlField = document.getElementById('maxhalflifedisplay');
    if (lastField) lastField.value = lastWeek || '';
    if (hlField) hlField.value = maxHL || '';
  };

  window.addDrugToStack = window.appStorage.addDrugToStack;
  document.addEventListener('DOMContentLoaded', () => {
    fillSelect('drugSelect', drugOptions);
    fillSelect('esterSelect', esterOptions);
    renderStack();
  });
})();