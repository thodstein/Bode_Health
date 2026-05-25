const mount = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

mount('module-profile', `
<h2 class="section-title">👤 Параметры и образ жизни</h2>
<div class="field-grid">
  <div class="field"><label>Фаза</label><select><option>Курс</option><option>ПКТ</option></select></div>
  <div class="field"><label>Пол</label><select><option>Мужской</option><option>Женский</option></select></div>
  <div class="field"><label>Возраст</label><input type="number"></div>
  <div class="field"><label>Вес (кг)</label><input type="number"></div>
</div>
`);

mount('module-nutrition', `
<h2 class="section-title">🍽️ Питание и нутритивная поддержка</h2>
<div class="field-grid">
  <div class="field"><label>Калории (ккал/сут)</label><input type="number"></div>
  <div class="field"><label>Белки (г/кг)</label><input type="number"></div>
  <div class="field"><label>Жиры (г/кг)</label><input type="number"></div>
  <div class="field"><label>Углеводы (г/кг)</label><input type="number"></div>
</div>
`);

mount('module-training', `
<h2 class="section-title">🏋️ Тренировочный модуль + AI‑коуч</h2>
<div class="field-grid">
  <div class="field"><label>Дней тренировок/нед</label><input type="number"></div>
  <div class="field"><label>Длительность (мин)</label><input type="number"></div>
  <div class="field"><label>Интенсивность</label><select><option>Низкая</option><option>Средняя</option><option>Высокая</option></select></div>
  <div class="field"><label>Тип тренировок</label><select><option>Силовые</option><option>Смешанные</option><option>Выносливость</option></select></div>
</div>
`);

mount('module-symptoms', `
<h2 class="section-title">🤒 Симптомы</h2>
<div class="chips"><span class="chip">Отеки</span><span class="chip">Бессонница</span><span class="chip">Агрессия</span><span class="chip">Туман</span><span class="chip">Головные боли</span></div>
`);

mount('module-stack', `
<h2 class="section-title">💉 Стек AAS / пептиды / гормоны</h2>
<p class="muted">Стек пуст</p>
`);

mount('module-pct', `
<h2 class="section-title">🔄 Модуль ПКТ</h2>
<div class="field-grid">
  <div class="field"><label>Последняя неделя инъекции</label><input type="number"></div>
  <div class="field"><label>Период полувыведения (дней)</label><input type="number"></div>
</div>
`);

mount('module-support', `
<h2 class="section-title">💊 Назначение поддержки</h2>
<div class="chips"><span class="chip">Базовый минимум</span><span class="chip">Рабочий середнячок</span><span class="chip">Умный максимум</span></div>
`);

mount('module-dashboard', `
<h2 class="section-title">📊 Дашборд рисков</h2>
<div class="field-grid">
  <div class="field"><label>CV-риск</label><input value="0%" readonly></div>
  <div class="field"><label>Hep-риск</label><input value="0%" readonly></div>
  <div class="field"><label>Кумулятивный индекс</label><input value="0%" readonly></div>
  <div class="field"><label>Яички / Лейдиг</label><input value="100%" readonly></div>
</div>
`);

mount('module-coach', `
<h2 class="section-title">🧠 AI‑коуч: программа тренировок</h2>
<button class="btn btn-primary">🤖 Получить программу</button>
`);

mount('module-joints', `
<h2 class="section-title">🦴 Суставы и связки</h2>
<div class="field-grid">
  <div class="field"><label>Скованность</label><input type="number"></div>
  <div class="field"><label>Боль в локтях</label><input type="number"></div>
</div>
`);

mount('module-recipe', `
<h2 class="section-title">🍲 Рецепт / приём пищи</h2>
<div class="field-grid">
  <div class="field"><label>Название рецепта</label><input type="text"></div>
  <div class="field"><label>Количество порций</label><input type="number"></div>
</div>
`);

document.querySelectorAll('[data-action="save"]').forEach(b => b.onclick = () => window.appStorage && window.appStorage.save());
document.querySelectorAll('[data-action="load"]').forEach(b => b.onclick = () => window.appStorage && window.appStorage.load());
document.querySelectorAll('[data-action="export"]').forEach(b => b.onclick = () => alert('Экспорт подключишь в dashboard/pct/labs'));