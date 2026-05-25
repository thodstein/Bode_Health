const Utils = {
  generateId: () => '_' + Math.random().toString(36).substr(2, 9),
  formatDate: (date) => new Date(date).toLocaleDateString('ru-RU'),
  clamp: (num, min, max) => Math.min(Math.max(num, min), max)
};
