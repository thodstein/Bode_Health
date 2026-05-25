window.appStorage = window.appStorage || {};

(function () {
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const pct = (n) => `${clamp(Math.round(n), 0, 100)}%`;

  window.appStorage.recalcDashboard = function () {
    const age = Number(document.getElementById('dash-age')?.value || 30);
    const stress = Number(document.getElementById('dash-stress')?.value || 5);
    const sleep = Number(document.getElementById('dash-sleep')?.value || 7);
    const ldl = Number(document.getElementById('ldl')?.value || 3);
    const hdl = Number(document.getElementById('hdl')?.value || 1.2);
    const alt = Number(document.getElementById('alt')?.value || 25);
    const ast = Number(document.getElementById('ast')?.value || 25);
    const hct = Number(document.getElementById('hct')?.value || 45);
    const glucose = Number(document.getElementById('glucose')?.value || 5);
    const insulin = Number(document.getElementById('insulin')?.value || 10);
    const vitd = Number(document.getElementById('vitd')?.value || 30);
    const bpSys = Number(document.getElementById('bpSys')?.value || 120);
    const crp = Number(document.getElementById('crp')?.value || 1);
    const oralShare = Number(document.getElementById('oralShare')?.value || 0);

    const cv = (ldl / Math.max(hdl, 0.1)) * 9 + age * 0.6 + bpSys / 12 + stress * 2;
    const hep = (alt + ast) / 2 + oralShare * 18 + age * 0.25 + crp * 4;
    const neuro = stress * 8 + (10 - sleep) * 7;
    const blood = Math.max(0, (hct - 45) * 2.5);
    const cardio = bpSys / 2 + cv * 0.35;
    const kidney = glucose * 3 + insulin * 1.4;
    const lipids = ldl * 12 - hdl * 3;
    const testis = clamp(100 - age * 0.6 - oralShare * 8, 0, 100);
    const gi = oralShare * 10 + crp * 3;
    const pancreas = glucose * 5 + insulin * 2;
    const thyroid = clamp(100 - vitd * 1.2, 0, 100);
    const bones = clamp(100 - vitd * 1.1 - age * 0.2, 0, 100);
    const eyes = stress * 3 + age * 0.4;
    const immunity = clamp(100 - crp * 8 - stress * 2, 0, 100);

    const cumulative = (cv + hep + neuro + blood + cardio + kidney + lipids + (100 - testis) + gi + pancreas + (100 - thyroid) + (100 - bones) + eyes + (100 - immunity)) / 14;

    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = pct(value);
    };

    set('dash-cumulative', cumulative);
    set('dash-cv', cv);
    set('dash-hep', hep);
    set('dash-neuro', neuro);
    set('dash-blood', blood);
    set('dash-cardio', cardio);
    set('dash-kidney', kidney);
    set('dash-lipids', lipids);
    set('dash-testis', testis);
    set('dash-gi', gi);
    set('dash-pancreas', pancreas);
    set('dash-thyroid', thyroid);
    set('dash-bones', bones);
    set('dash-eyes', eyes);
    set('dash-immunity', immunity);
  };
})();