const DrugsModule = {
  init: () => {
    const form = document.getElementById('drugForm');
    if(!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const drugId = document.getElementById('drugSelect').value;
      const dose = parseFloat(document.getElementById('doseInput').value);
      const freq = document.getElementById('freqInput').value;
      if(!drugId || !dose) return alert('Заполните поля');
      
      const drugData = DB.drugs.find(d => d.id === drugId);
      const newItem = {
        id: Utils.generateId(),
        ...drugData,
        userDose: dose,
        frequency: freq,
        addedAt: new Date()
      };
      await Storage.db.add('drugs', newItem);
      DrugsModule.render();
      form.reset();
      alert(`${drugData.name} добавлен!`);
    });
    DrugsModule.render();
  },
  render: async () => {
    const list = document.getElementById('stackList');
    if(!list) return;
    const drugs = await Storage.db.getAll('drugs');
    list.innerHTML = '';
    if(drugs.length === 0) {
      list.innerHTML = '<p style="text-align:center; color:#777;">Стек пуст</p>';
      return;
    }
    drugs.forEach(drug => {
      const div = document.createElement('div');
      div.className = 'support-item';
      div.innerHTML = `
        <div>
          <strong>${drug.name}</strong> <span class="badge">${drug.type}</span><br>
          <small>${drug.userDose} ${drug.frequency}</small>
        </div>
        <button class="btn btn-danger" onclick="DrugsModule.remove('${drug.id}')">✕</button>
      `;
      list.appendChild(div);
    });
    RisksModule.calculate(drugs);
  },
  remove: async (id) => {
    await Storage.db.delete('drugs', id);
    DrugsModule.render();
  }
};
