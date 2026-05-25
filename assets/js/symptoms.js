window.appStorage = window.appStorage || {};

(function () {
  window.appStorage.selectedSymptoms = window.appStorage.selectedSymptoms || new Set();

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.symptom-card').forEach(card => {
      card.addEventListener('click', () => {
        const key = card.dataset.sym;
        if (!key) return;
        if (window.appStorage.selectedSymptoms.has(key)) window.appStorage.selectedSymptoms.delete(key);
        else window.appStorage.selectedSymptoms.add(key);
        card.classList.toggle('selected');
      });
    });
  });
})();