document.addEventListener('DOMContentLoaded', async () => {
  // Инициализация табов
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  // Заполнение селекта препаратами
  const select = document.getElementById('drugSelect');
  if(select) {
    DB.drugs.sort((a,b) => a.name.localeCompare(b.name)).forEach(drug => {
      const opt = document.createElement('option');
      opt.value = drug.id;
      opt.textContent = drug.name;
      select.appendChild(opt);
    });
  }

  // Инициализация модулей
  await DrugsModule.init();
  SupportModule.render();
  
  console.log('Bode Health v11.0 Loaded');
});
