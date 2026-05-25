import { DB } from './database.js';

// ТЗ §3.1: Расчет концентрации вещества
export function calculateConcentration(halfLife, startWeek, endWeek, currentWeek) {
  if (currentWeek < startWeek) return 0;
  
  // Фаза набора (накопление до steady state)
  if (currentWeek <= endWeek) {
    const weeksOnDrug = currentWeek - startWeek;
    // Упрощенная модель: линейный рост до насыщения за 4-5 периодов полувыведения
    const timeToSteady = (halfLife / 7) * 4; 
    return Math.min(1, weeksOnDrug / (timeToSteady + 1));
  } 
  
  // Фаза выведения (спад)
  const weeksOff = currentWeek - endWeek;
  // Экспоненциальный спад: C = C0 * e^(-kt), упрощенно линейно для наглядности в UI
  return Math.max(0, 1 - (weeksOff * 0.2)); 
}

// ТЗ §3.2: Генерация полного плана курса
export function generateCoursePlan(stack) {
  if (!stack || stack.length === 0) return [];

  // Определяем длительность прогноза (макс конец курса + 6 недель на вывод)
  let maxEndWeek = 0;
  stack.forEach(item => {
    if (item.endWeek > maxEndWeek) maxEndWeek = item.endWeek;
  });
  const totalWeeks = maxEndWeek + 6;

  const plan = [];

  for (let w = 1; w <= totalWeeks; w++) {
    // Инициализация матрицы рисков нулями
    let weekRisks = {};
    for (let sys in DB.riskMatrix) {
      weekRisks[sys] = {};
      DB.riskMatrix[sys].forEach(m => weekRisks[sys][m.id] = 0);
    }

    // Суммирование рисков от всех активных веществ
    stack.forEach(item => {
      const substance = DB.substances.find(s => s.id === item.substanceId);
      if (!substance) return;

      const esterList = DB.esters[item.substanceId];
      const ester = esterList ? esterList.find(e => e.id === item.esterId) : null;
      const halfLife = ester ? ester.hl : 1; // Дефолт 1 день если нет эфира

      const concentration = calculateConcentration(halfLife, item.startWeek, item.endWeek, w);

      if (concentration > 0.05) { // Порог значимости 5%
        const tox = substance.tox;
        const loadFactor = concentration * (item.dose / 100); // Нормализация дозы

        // Распределение базовой токсичности по конкретным механизмам
        // Логика: чем выше базовый индекс токсичности органа, тем сильнее удар по его механизмам
        weekRisks.liver.chol += tox.liver * 3 * loadFactor;
        weekRisks.liver.cyt += tox.liver * 2 * loadFactor;
        
        weekRisks.cardio.lip += tox.lipid * 3 * loadFactor;
        weekRisks.cardio.htn += tox.lipid * 1.5 * loadFactor;
        
        weekRisks.hemato.ery += tox.hct * 4 * loadFactor;
        weekRisks.hemato.visc += tox.hct * 3 * loadFactor;
        
        weekRisks.neuro.dop += tox.neuro * 5 * loadFactor;
        
        weekRisks.kidney.hyper += tox.kid * 3 * loadFactor;
        
        weekRisks.endo.ins += tox.endo * 3 * loadFactor;
        weekRisks.endo.est += tox.endo * 2 * loadFactor;
        
        weekRisks.repro.sup += tox.repro * 5 * loadFactor;
        weekRisks.repro.atr += tox.repro * 4 * loadFactor;
      }
    });

    // Нормализация значений (cap at 100%)
    for (let sys in weekRisks) {
      for (let mech in weekRisks[sys]) {
        weekRisks[sys][mech] = Math.min(100, Math.round(weekRisks[sys][mech]));
      }
    }

    plan.push({
      week: w,
      risks: weekRisks,
      activeSubstances: stack.filter(i => calculateConcentration(DB.esters[i.substanceId]?.find(e=>e.id===i.esterId)?.hl || 1, i.startWeek, i.endWeek, w) > 0.05)
    });
  }

  return plan;
}

// ТЗ §3.3: Утилита для цвета риска
export function getRiskColor(value) {
  if (value < 20) return '#4caf50'; // Green
  if (value < 40) return '#8bc34a'; // Light Green
  if (value < 60) return '#ffeb3b'; // Yellow
  if (value < 80) return '#ff9800'; // Orange
  return '#f44336'; // Red
}
