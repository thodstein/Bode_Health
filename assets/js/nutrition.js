window.appStorage = window.appStorage || {};

(function () {
  window.appStorage.calculateNutrition = function () {
    const calories = Number(document.getElementById('calories')?.value || 0);
    const protein = Number(document.getElementById('protein')?.value || 0);
    const fat = Number(document.getElementById('fat')?.value || 0);
    const carbs = Number(document.getElementById('carbs')?.value || 0);
    const water = Number(document.getElementById('water')?.value || 0);
    const out = document.getElementById('nutritionSummaryNotice');
    if (out) out.textContent = `Ккал: ${calories}, Б: ${protein}, Ж: ${fat}, У: ${carbs}, Вода: ${water}`;
  };

  window.appStorage.updateNutritionSettings = function () {
    window.appStorage.calculateNutrition?.();
  };
})();