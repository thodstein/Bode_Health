window.appStorage = window.appStorage || {};

(function () {
  window.appStorage.saveProfile = function () {
    localStorage.setItem('profile-state', JSON.stringify(window.appStorage.readState()));
  };

  window.appStorage.loadProfile = function () {
    const data = JSON.parse(localStorage.getItem('profile-state') || '{}');
    window.appStorage.writeState(data);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const save = document.getElementById('btn-save');
    const load = document.getElementById('btn-load');
    if (save) save.addEventListener('click', window.appStorage.saveProfile);
    if (load) load.addEventListener('click', window.appStorage.loadProfile);
  });
})();