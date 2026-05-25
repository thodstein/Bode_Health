window.appStorage = window.appStorage || {};

(function () {
  const q = (sel) => document.querySelector(sel);
  const qa = (sel) => Array.from(document.querySelectorAll(sel));

  window.appStorage.toggleCard = function (bodyId, btnEl) {
    const body = document.getElementById(bodyId);
    if (!body) return;
    body.classList.toggle('collapsed');
    if (btnEl) btnEl.textContent = body.classList.contains('collapsed') ? '+' : '−';
  };

  window.appStorage.saveJSON = function (key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  };

  window.appStorage.loadJSON = function (key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  window.appStorage.getFormValue = function (id) {
    const el = document.getElementById(id);
    if (!el) return null;
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'number') return el.value === '' ? null : Number(el.value);
    return el.value;
  };

  window.appStorage.setFormValue = function (id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = !!value;
    else el.value = value ?? '';
  };

  window.appStorage.readState = function () {
    const ids = [
      'phase','sex','age','weight','height','bf','smoke','alcohol','sleep','stress',
      'cardioDays','cardioMin','calories','protein','fat','carbs','water','dietType',
      'trainDays','trainMin','intensity','trainType','goal','fatigue',
      'lab-phase','lab-frequency','pct-last-week','pct-half-life',
      'dash-age','dash-stress','dash-sleep','ldl','hdl','alt','ast','hct',
      'glucose','insulin','vitd','bpSys','crp','oralShare'
    ];
    const state = {};
    ids.forEach(id => state[id] = window.appStorage.getFormValue(id));
    return state;
  };

  window.appStorage.writeState = function (state) {
    Object.entries(state || {}).forEach(([k, v]) => window.appStorage.setFormValue(k, v));
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-collapse-target]');
    if (!btn) return;
    window.appStorage.toggleCard(btn.dataset.collapseTarget, btn);
  });

  window.appStorage.initDashboardModule = function () {
    const btn = document.getElementById('dashboard-recalc');
    if (btn) btn.addEventListener('click', () => window.appStorage.recalcDashboard?.());
  };

  window.appStorage.initPCTModule = function () {
    const btn = document.getElementById('pct-save');
    const loadBtn = document.getElementById('pct-load');
    if (btn) btn.addEventListener('click', () => window.appStorage.calculatePCT?.());
    if (loadBtn) loadBtn.addEventListener('click', () => {
      const data = window.appStorage.loadJSON('pct-state');
      if (data) window.appStorage.writeState(data);
      window.appStorage.calculatePCT?.();
    });
  };
})();