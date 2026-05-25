const DrugsModule = {
    init() {
        const select = document.getElementById('drugSelect');
        DRUGS_DB.forEach(drug => {
            const opt = document.createElement('option');
            opt.value = drug.id;
            opt.textContent = `${drug.name} (${drug.type})`;
            select.appendChild(opt);
        });

        document.getElementById('drugForm').addEventListener('submit', e => {
            e.preventDefault();
            const id = document.getElementById('drugSelect').value;
            const dose = document.getElementById('drugDose').value;
            const weeks = parseInt(document.getElementById('drugWeeks').value);
            if(!id) return;
            
            const drug = DRUGS_DB.find(d => d.id === id);
            const stack = Storage.get('stack');
            stack.push({ ...drug, userDose: dose, weeks, addedAt: Date.now() });
            Storage.set('stack', stack);
            this.render();
            e.target.reset();
            alert(`${drug.name} добавлен!`);
        });

        document.getElementById('clearStackBtn').addEventListener('click', () => {
            if(confirm('Очистить весь стек?')) {
                Storage.clear('stack');
                this.render();
                RisksModule.clear();
            }
        });

        document.getElementById('calcRiskBtn').addEventListener('click', () => {
            RisksModule.calculate();
        });

        this.render();
    },
    render() {
        const stack = Storage.get('stack');
        const list = document.getElementById('stackList');
        list.innerHTML = '';
        if(stack.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:#64748b">Стек пуст. Добавьте препараты.</p>';
            return;
        }
        stack.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'drug-card';
            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.userDose} | ${item.weeks} нед.</small>
                </div>
                <button class="btn-danger" style="padding:5px 10px; font-size:12px" onclick="DrugsModule.remove(${idx})">✕</button>
            `;
            list.appendChild(div);
        });
    },
    remove(idx) {
        const stack = Storage.get('stack');
        stack.splice(idx, 1);
        Storage.set('stack', stack);
        this.render();
        RisksModule.clear();
    }
};
