export const Storage = {
    getDrugs: () => JSON.parse(localStorage.getItem('bh_drugs') || '[]'),
    addDrug: (drug) => {
        const drugs = Storage.getDrugs();
        drugs.push(drug);
        localStorage.setItem('bh_drugs', JSON.stringify(drugs));
    },
    removeDrug: (id) => {
        const drugs = Storage.getDrugs().filter(d => d.id !== id);
        localStorage.setItem('bh_drugs', JSON.stringify(drugs));
    },
    getSupport: () => JSON.parse(localStorage.getItem('bh_support') || '[]')
};
