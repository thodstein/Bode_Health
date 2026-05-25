window.appStorage = window.appStorage || {};

(function () {
  window.appStorage.recipeIngredients = window.appStorage.recipeIngredients || [];

  function renderIngredients() {
    const list = document.getElementById('ingredientsList');
    if (!list) return;

    list.innerHTML = window.appStorage.recipeIngredients.map((x, i) => `
      <div class="ingredient-item">
        <input type="text" value="${x.name}" readonly>
        <input type="number" value="${x.grams}" readonly>
        <button class="btn btn-secondary del-btn" data-i="${i}">×</button>
      </div>
    `).join('');

    list.querySelectorAll('[data-i]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.appStorage.recipeIngredients.splice(Number(btn.dataset.i), 1);
        renderIngredients();
      });
    });
  }

  window.appStorage.addIngredient = function () {
    const name = document.getElementById('newIngredientName')?.value?.trim();
    const grams = Number(document.getElementById('newIngredientGrams')?.value || 0);
    if (!name) return;
    window.appStorage.recipeIngredients.push({ name, grams });
    renderIngredients();
  };

  window.appStorage.updateNutritionSettings = function () {
    const servings = Number(document.getElementById('nutritionServingsInput')?.value || 1);
    const mode = document.getElementById('nutritionPortionMode')?.value || 'perServing';
    const includeMissing = document.getElementById('nutritionIncludeMissing')?.value === 'true';
    const accuracy = document.getElementById('nutritionAccuracyMode')?.value || 'approximate';

    const notice = document.getElementById('nutritionSummaryNotice');
    if (notice) {
      notice.textContent = `Порций: ${servings}, режим: ${mode}, missing: ${includeMissing ? 'да' : 'нет'}, точность: ${accuracy}`;
    }
  };

  document.addEventListener('DOMContentLoaded', renderIngredients);
})();