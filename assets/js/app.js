import { DB } from './core/database.js';
import { generateCoursePlan, getRiskColor } from './core/engine.js';

const App = {
  state: {
    stack: [],
    plan: [],
    currentWeekIdx: 0,
    xp: 0,
    chartVisibility: { liver: true, cardio: true, hemato: true, kidney: false, neuro: false, endo: false, repro: false }
  },

  init() {
    console.log('Bode Health App Initializing...');
    this.populateSubstanceSelect();
    this.renderSupportProtocol();
    this.renderArticles();
    this.renderShop();
    this.renderGlossary();
    this.renderChartControls();
    console.log('App Ready.');
  },

  populateSubstanceSelect() {
    const select = document.getElementById('substance-select');
    if (!select) return;
    select.innerHTML = '';
    DB.substances.forEach(sub => {
      const option = document.createElement('option');
      option.value = sub.id;
      option.textContent = sub.name;
      select.appendChild(option);
    });
  },

  handleSubstanceChange() {
    const subId = document.getElementById('substance-select').value;
    const esterSelect = document.getElementById('ester-select');
    esterSelect.innerHTML = '';
    
    const esters = DB.esters[subId];
    if (esters && esters.length > 0) {
      esterSelect.disabled = false;
      esters.forEach(est => {
        const option = document.createElement('option');
        option.value = est.id;
        option.textContent = `${est.name} (T1/2: ${est.hl} дн.)`;
        esterSelect.appendChild(option);
      });
    } else {
      esterSelect.disabled = true;
      const option = document.createElement('option');
      option.textContent = 'Без эфира';
      esterSelect.appendChild(option);
    }
  },

  addDrugToStack() {
    const subId = document.getElementById('substance-select').value;
    const esterId = document.getElementById('ester-select').value;
    const dose = parseFloat(document.getElementById('drug-dose').value);
    const start = parseInt(document.getElementById('drug-start').value);
    const end = parseInt(document.getElementById('drug-end').value);

    if (!dose || start >= end) {
      alert('Ошибка: Проверьте дозировку и недели (Финиш должен быть больше Старта).');
      return;
    }

    this.state.stack.push({
      substanceId: subId,
      esterId: esterId,
      dose: dose,
      startWeek: start,
      endWeek: end
    });

    this.renderStackList();
    document.getElementById('drug-dose').value = '';
  },

  renderStackList() {
    const listEl = document.getElementById('stack-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    this.state.stack.forEach((item, index) => {
      const sub = DB.substances.find(s => s.id === item.substanceId);
      const est = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
      const name = est ? `${sub.name} (${est.name})` : sub.name;

      const div = document.createElement('div');
      div.className = 'stack-item';
      div.innerHTML = `
        <div>
          <strong>${name}</strong><br>
          <small>${item.dose} мг/нед | Недели ${item.startWeek}–${item.endWeek}</small>
        </div>
        <button class="btn-delete" onclick="App.removeDrug(${index})">✕</button>
      `;
      listEl.appendChild(div);
    });
  },

  removeDrug(index) {
    this.state.stack.splice(index, 1);
    this.renderStackList();
  },

  calculateAndRenderPlan() {
    if (this.state.stack.length === 0) {
      alert('Добавьте хотя бы один препарат в стек.');
      return;
    }

    this.state.plan = generateCoursePlan(this.state.stack);
    this.state.currentWeekIdx = 0;
    
    this.renderHeatmap();
    this.renderRiskChart();
    
    const msgEl = document.getElementById('plan-message');
    if (msgEl) msgEl.textContent = `Курс рассчитан на ${this.state.plan.length} недель.`;
    
    // Update Dashboard
    const firstWeekRisks = this.state.plan[0].risks;
    let totalRisk = 0;
    let count = 0;
    for (let sys in firstWeekRisks) {
      for (let m in firstWeekRisks[sys]) {
        totalRisk += firstWeekRisks[sys][m];
        count++;
      }
    }
    const avgRisk = count > 0 ? Math.round(totalRisk / count) : 0;
    
    document.getElementById('dash-risk').textContent = `${avgRisk}%`;
    document.getElementById('dash-readiness').textContent = `${Math.max(10, 100 - avgRisk)}`;
    
    this.state.xp += 50;
    document.getElementById('xp-display').textContent = `XP: ${this.state.xp}`;
  },

  changeWeek(direction) {
    if (!this.state.plan.length) return;
    this.state.currentWeekIdx += direction;
    if (this.state.currentWeekIdx < 0) this.state.currentWeekIdx = 0;
    if (this.state.currentWeekIdx >= this.state.plan.length) this.state.currentWeekIdx = this.state.plan.length - 1;
    this.renderHeatmap();
  },

  renderHeatmap() {
    const container = document.getElementById('heatmap-container');
    if (!container || !this.state.plan.length) return;

    const weekData = this.state.plan[this.state.currentWeekIdx];
    document.getElementById('week-label').textContent = `Неделя ${weekData.week}`;
    container.innerHTML = '';

    for (let sys in DB.riskMatrix) {
      const header = document.createElement('div');
      header.className = 'heatmap-system-header';
      header.textContent = sys.toUpperCase();
      container.appendChild(header);

      DB.riskMatrix[sys].forEach(mech => {
        const val = weekData.risks[sys][mech.id] || 0;
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.style.backgroundColor = getRiskColor(val);
        cell.style.color = val > 50 ? '#000' : '#fff';
        cell.innerHTML = `<span>${mech.n}</span><strong>${val}%</strong>`;
        container.appendChild(cell);
      });
    }
  },

  renderRiskChart() {
    const ctx = document.getElementById('risk-chart');
    if (!ctx || !this.state.plan.length) return;
    
    if (window.riskChartInstance) {
      window.riskChartInstance.destroy();
    }

    const labels = this.state.plan.map(p => `W${p.week}`);
    const datasets = [];
    const colors = { liver: '#ff6384', cardio: '#36a2eb', hemato: '#ff9f40', kidney: '#4bc0c0', neuro: '#9966ff', endo: '#c9cbcf', repro: '#e7e9ed' };

    Object.keys(this.state.chartVisibility).forEach(sys => {
      if (this.state.chartVisibility[sys]) {
        const data = this.state.plan.map(week => {
          let sum = 0;
          let count = 0;
          for (let m in week.risks[sys]) {
            sum += week.risks[sys][m];
            count++;
          }
          return count > 0 ? Math.round(sum / count) : 0;
        });

        datasets.push({
          label: sys.toUpperCase(),
          data: data,
          borderColor: colors[sys],
          borderWidth: 2,
          fill: false,
          tension: 0.4
        });
      }
    });

    window.riskChartInstance = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { labels: { color: '#aaa' } } },
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { color: '#aaa' }, grid: { color: '#333' } },
          x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
        }
      }
    });
  },

  toggleChartSystem(sys) {
    this.state.chartVisibility[sys] = !this.state.chartVisibility[sys];
    this.renderRiskChart();
  },

  renderChartControls() {
    const container = document.getElementById('chart-controls');
    if (!container) return;
    const names = { liver: 'Печень', cardio: 'Сердце', hemato: 'Кровь', kidney: 'Почки', neuro: 'Невро', endo: 'Эндо', repro: 'Репро' };
    
    container.innerHTML = '';
    Object.keys(names).forEach(key => {
      const label = document.createElement('label');
      label.style.marginRight = '10px';
      label.style.color = '#fff';
      label.innerHTML = `
        <input type="checkbox" ${this.state.chartVisibility[key] ? 'checked' : ''} onchange="App.toggleChartSystem('${key}')">
        ${names[key]}
      `;
      container.appendChild(label);
    });
  },

  renderSupportProtocol() {
    const container = document.getElementById('support-list');
    if (!container) return;
    
    DB.supportProtocol.forEach(block => {
      const blockDiv = document.createElement('div');
      blockDiv.className = 'support-block';
      blockDiv.innerHTML = `<h3>${block.t}</h3>`;
      
      block.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'support-item';
        itemDiv.innerHTML = `<strong>${item.n}</strong> <small>${item.d}</small><br><span class="mechanism">${item.m}</span>`;
        blockDiv.appendChild(itemDiv);
      });
      
      container.appendChild(blockDiv);
    });
  },

  renderArticles() {
    const container = document.getElementById('articles-list');
    if (!container) return;
    DB.articles.forEach(art => {
      const div = document.createElement('div');
      div.className = 'article-card';
      div.innerHTML = `<h4>${art.title}</h4><small>${art.category} • 👁 ${art.views}</small>`;
      container.appendChild(div);
    });
  },

  renderShop() {
    const container = document.getElementById('shop-list');
    if (!container) return;
    for (const [key, items] of Object.entries(DB.shopItems)) {
      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `<strong>${key.toUpperCase()}</strong> <span>${item.platform}: ${item.price}</span>`;
        container.appendChild(div);
      });
    }
  },

  renderGlossary() {
    const container = document.getElementById('glossary-list');
    if (!container) return;
    for (const [term, def] of Object.entries(DB.glossary)) {
      const div = document.createElement('div');
      div.className = 'glossary-item';
      div.innerHTML = `<strong>${term}</strong>: ${def}`;
      container.appendChild(div);
    }
  },

  calculateFertility() {
    const v = parseFloat(document.getElementById('fert-vol').value) || 0;
    const c = parseFloat(document.getElementById('fert-conc').value) || 0;
    // Упрощенная формула WHO
    const score = Math.round(((v / 1.5) * 20) + ((c / 16) * 30));
    const resEl = document.getElementById('fertility-result');
    if (resEl) {
      resEl.textContent = `Индекс фертильности: ${score}/100`;
      resEl.style.color = score > 60 ? '#03dac6' : '#cf6679';
    }
  }
};

// Экспорт функций для глобального доступа из HTML onclick
window.App = App;

// Автозапуск при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
