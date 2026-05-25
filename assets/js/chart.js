window.appStorage = window.appStorage || {};

(function () {
  let chart1 = null;
  let chart2 = null;

  function getCtx(id) {
    const el = document.getElementById(id);
    return el ? el.getContext('2d') : null;
  }

  window.appStorage.updateChart = function () {
    if (!window.Chart) return;
    const ctx = getCtx('weeklyChartNew');
    if (!ctx) return;
    if (chart1) chart1.destroy();

    chart1 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
        datasets: [
          { label: 'Support', data: [10, 15, 18, 22, 25, 28, 30, 34], borderColor: '#10b981', tension: 0.3 },
          { label: 'Dry', data: [12, 18, 24, 30, 35, 41, 47, 52], borderColor: '#ef4444', tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#f8fafc' } } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' }, min: 0, max: 100 }
        }
      }
    });
  };

  window.appStorage.updateOriginalChart = function () {
    if (!window.Chart) return;
    const ctx = getCtx('weeklyChart');
    if (!ctx) return;
    if (chart2) chart2.destroy();

    chart2 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
        datasets: [
          { label: 'Total', data: [10, 17, 22, 26, 32, 39, 45, 50], borderColor: '#3b82f6', tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#f8fafc' } } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' }, min: 0, max: 100 }
        }
      }
    });
  };

  window.appStorage.exportChart = function () {
    const c = document.getElementById('weeklyChartNew') || document.getElementById('weeklyChart');
    if (!c) return;
    const a = document.createElement('a');
    a.download = 'neurocalculator-risk-chart.png';
    a.href = c.toDataURL('image/png');
    a.click();
  };

  window.appStorage.calculateMacrocycle = function () {
    const out = document.getElementById('segmentsOutput');
    if (out) out.innerHTML = `<div class="notice">Макроцикл рассчитан: базовый блок + нагрузка + восстановление.</div>`;
  };
})();