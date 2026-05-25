const Engine = {
    calculateConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        
        const duration = endWeek - startWeek;
        const weeksOnDrug = currentWeek - startWeek;
        
        // Фаза приема
        if (currentWeek <= endWeek) {
            const riseFactor = Math.min(1, weeksOnDrug / (halfLife / 7)); // Плавный вход
            return riseFactor;
        } 
        // Фаза выведения (после курса)
        else {
            const weeksOff = currentWeek - endWeek;
            const decay = Math.exp(-0.693 * weeksOff / (halfLife / 7));
            return Math.max(0, decay);
        }
    },

    generateWeeklyPlan(stack, totalWeeksForecast) {
        const weeks = [];
        // Прогноз длится до конца самого длинного курса + 5 периодов полувыведения самого длинного эфира
        let maxEnd = 0;
        stack.forEach(s => { if (s.endWeek > maxEnd) maxEnd = s.endWeek; });
        const longestHalfLife = Math.max(...stack.map(s => {
            const ester = DB.esters[s.substanceId]?.find(e => e.id === s.esterId);
            return ester ? ester.halfLife : 1;
        }), 1);
        const forecastEnd = Math.ceil(maxEnd + (longestHalfLife / 7) * 5);
        const finalDuration = Math.max(totalWeeksForecast || 12, forecastEnd);

        for (let w = 1; w <= finalDuration; w++) {
            let risks = {};
            // Инициализация всех 49 механизмов нулями
            for (let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].mechanisms.forEach(m => risks[sys][m.id] = 0);
            }

            let activeDrugs = [];
            stack.forEach(item => {
                const conc = this.calculateConcentration(
                    (DB.esters[item.substanceId]?.find(e => e.id === item.esterId)?.halfLife) || 1,
                    item.startWeek,
                    item.endWeek,
                    w
                );

                if (conc > 0.01) {
                    activeDrugs.push({ ...item, conc });
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    if (!sub) return;

                    const tox = sub.baseTox;
                    const load = conc * (item.dose / 100);

                    // Распределение базовой токсичности по механизмам (упрощенно)
                    // В полной версии тут нужна карта влияния substance -> mechanism
                    risks.liver.cholestasis += (tox.liver * 3) * load;
                    risks.liver.cytolysis += (tox.liver * 2) * load;
                    
                    risks.cardio.lipids += (tox.lipid * 3) * load;
                    risks.cardio.htn += (tox.lipid * 1.5) * load;
                    risks.cardio.thrombo += (tox.lipid * 1) * load;

                    risks.hemato.erythrocytosis += (tox.hct * 4) * load;
                    risks.hemato.viscosity += (tox.hct * 3) * load;

                    risks.neuro.dopamine += (tox.neuro * 5) * load;
                    
                    risks.kidney.hyperfiltration += (tox.kidney * 3) * load;
                    
                    risks.endo.insulin_res += (tox.endo * 3) * load;
                    risks.endo.estrogen += (tox.endo * 2) * load; // Условно
                    
                    risks.repro.suppression += (tox.repro * 5) * load;
                    risks.repro.atrophy += (tox.repro * 4) * load;
                }
            });

            // Нормализация до 100%
            for (let sys in risks) {
                for (let m in risks[sys]) {
                    risks[sys][m] = Math.min(100, Math.round(risks[sys][m]));
                }
            }

            weeks.push({ week: w, risks, activeDrugsCount: activeDrugs.length });
        }
        return weeks;
    },

    getRiskColor(value) {
        if (value < 20) return '#4caf50'; // Green
        if (value < 40) return '#8bc34a'; // Light Green
        if (value < 60) return '#ffeb3b'; // Yellow
        if (value < 80) return '#ff9800'; // Orange
        return '#f44336'; // Red
    }
};
