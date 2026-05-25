window.appStorage = window.appStorage || {};

(function () {
  const presets = {
    basic: ['omega3', 'magnesiumtreonate', 'tudca', 'zinc', 'vitd3'],
    mid: ['omega3', 'magnesiumtreonate', 'tudca', 'coq10', 'berberine', 'nac', 'citicoline', 'zinc', 'vitd3', 'nattokinase'],
    max: ['omega3', 'magnesiumtreonate', 'tudca', 'coq10', 'berberine', 'nac', 'citicoline', 'zinc', 'vitd3', 'nattokinase', 'astragalus', 'telmisartan', 'lionsmane', 'glycine', 'pqq', 'ip6', 'curcumin', 'selenium', 'glutamine']
  };

  const names = {
    omega3: 'Omega-3',
    magnesiumtreonate: 'Magnesium L-Threonate',
    tudca: 'TUDCA',
    zinc: 'Zinc',
    vitd3: 'Vitamin D3',
    coq10: 'CoQ10',
    berberine: 'Berberine',
    nac: 'NAC',
    citicoline: 'Citicoline',
    nattokinase: 'Nattokinase',
    astragalus: 'Astragalus',
    telmisartan: 'Telmisartan',
    lionsmane: 'Lion’s Mane',
    glycine: 'Glycine',
    pqq: 'PQQ',
    ip6: 'IP-6',
    curcumin: 'Curcumin',
    selenium: 'Selenium',
    glutamine: 'L-Glutamine'
  };

  window.appStorage.activeSupplements = window.appStorage.activeSupplements || [];

  window.appStorage.applySupportPreset = function (level) {
    window.appStorage.activeSupplements = presets[level] || [];

    const hidden = document.getElementById('supportstrategy');
    if (hidden) hidden.value = level;

    const out = document.getElementById('activeSupportDisplay');
    if (out) out.innerHTML = `<strong>${level}</strong><br>${window.appStorage.activeSupplements.map(x => names[x] || x).join(', ')}`;
  };

  window.applySupportPreset = window.appStorage.applySupportPreset;
})();