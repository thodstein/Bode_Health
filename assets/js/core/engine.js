const Engine = {
    // Безопасный расчет концентрации
    getConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        if (halfLife <= 0) halfLife = 1; // Защита от деления на ноль

        const weeksOn = currentWeek - startWeek;
        const duration = endWeek - startWeek;
        
        // Фаза приема (накопление)
        if (currentWeek <= endWeek) {
            // Плавный выход на плато за 3-4 периода полувыведения
            const factor = 1 - Math.exp(-0.693 * weeksOn / (halfLife / 7));
            return Math.min(1, factor);
        } 
        // Фаза выведения (спад)
        else {
            const weeksOff = currentWeek - endWeek;
            return Math.max(0, Math.exp(-0.693 * weeksOff / (halfLife / 7)));
        }
    },

    generatePlan(stack, forecastWeeks) {
        if (!stack || stack.length === 0) return [];
        
        // Определяем длительность прогноза
        let maxEnd = 0;
        let longestHL = 1;
        stack.forEach(s => {
            if (s.endWeek > maxEnd) maxEnd = s.endWeek;
            const ester = DB.esters[s.substanceId]?.find(e => e.id === s.esterId);
            const hl = ester ? ester.hl : 1;
            if (hl > longestHL) longestHL = hl;
        });
        
        const totalWeeks = Math.max(forecastWeeks || 12, Math.ceil(maxEnd + (longestHL / 7) * 5));
        const plan = [];

        for (let w = 1; w <= totalWeeks; w++) {
            // Инициализация нулями
            let risks = {};
            for (let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].forEach(m => risks[sys][m.id] = 0);
            }

            let activeCount = 0;
            stack.forEach(item => {
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const hl = ester ? ester.hl : 1;
                const sub = DB.substances.find(s => s.id === item.substanceId);
                
                const conc = this.getConcentration(hl, item.startWeek, item.endWeek, w);
                
                if (conc > 0.05) {
                    activeCount++;
                    const tox = sub.tox;
                    const load = conc * (item.dose / 100); // Нормализация к 100мг

                    // Распределение токсичности по механизмам (упрощенная модель)
                    // Liver
                    risks.liver.cholestasis += tox.liver * 3 * load;
                    risks.liver.cytolysis += tox.liver * 2 * load;
                    // Cardio
                    risks.cardio.lipids += tox.cardio * 3 * load;
                    risks.cardio.htn += tox.cardio * 1.5 * load;
                    risks.cardio.thrombo += tox.cardio * load;
                    // Hemato
                    risks.hemato.erythrocytosis += tox.hemato * 4 * load;
                    risks.hemato.viscosity += tox.hemato * 3 * load;
                    // Neuro
                    risks.neuro.dopamine += tox.neuro * 5 * load;
                    // Kidney
                    risks.kidney.hyperfiltration += tox.kidney * 3 * load;
                    // Endo
                    risks.endo.insulin_res += tox.endo * 3 * load;
                    risks.endo.estrogen += tox.endo * 2 * load;
                    // Repro
                    risks.repro.suppression += tox.repro * 5 * load;
                    risks.repro.atrophy += tox.repro * 4 * load;
                }
            });

            // Нормализация и ограничение 0-100
            for (let sys in risks) {
                for (let m in risks[sys]) {
                    risks[sys][m] = Math.min(100, Math.round(risks[sys][m]));
                }
            }

            plan.push({ week: w, risks, activeCount });
        }
        return plan;
    },

    getRiskColor(val) {
        if (val < 20) return '#2e7d32'; // Green
        if (val < 40) return '#fdd835'; // Yellow
        if (val < 60) return '#fb8c00'; // Orange
        return '#c62828'; // Red
    }
};
