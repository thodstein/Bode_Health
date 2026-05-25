import { SUPPORT_DB, SYNERGY_DB } from '../core/constants.js';

export const SupportEngine = {
    renderSchedule: () => {
        const times = {
            morning_empty: document.getElementById('supportMorning'),
            morning_food: document.getElementById('supportBreakfast'),
            lunch: document.getElementById('supportLunch'),
            workout: document.getElementById('supportWorkout'),
            intra: document.getElementById('supportWorkout'), // объединим
            evening: document.getElementById('supportEvening')
        };

        // Очистка
        Object.values(times).forEach(el => { if(el) el.innerHTML = ''; });

        // Заполнение
        SUPPORT_DB.forEach(item => {
            const container = times[item.time];
            if(container) {
                const div = document.createElement('div');
                div.className = 'drug-item';
                div.innerHTML = `<span class="drug-name">${item.name}</span><span class="drug-dose">${item.dose}</span>`;
                container.appendChild(div);
            }
        });

        // Синергия
        const synList = document.getElementById('synergyList');
        if(synList) {
            synList.innerHTML = SYNERGY_DB.map(s => `<li>${s}</li>`).join('');
        }
    }
};
