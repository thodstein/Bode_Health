const Engine = {
    calculateConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (!halfLife || halfLife <= 0) halfLife = 1; // Защита от деления на 0
        if (currentWeek < startWeek) return 0;
        
        const weeksOnDrug = currentWeek - startWeek;
        
        // Фаза приема
        if (currentWeek <= endWeek) {
            // Плавный вход к steady state (примерно 4-5 периодов)
            const riseFactor = Math.min(1, weeksOnDrug / (halfLife / 7)); 
            return riseFactor;
        } 
        // Фаза выведения
        else {
            const weeksOff = currentWeek - endWeek;
            const decay = Math.exp(-0.693 * weeksOff / (halfLife / 7));
            return Math.max(0, decay);
        }
    },

    generateWeeklyPlan(stack, totalWeeksForecast) {
        if (!stack || stack.length === 0) return [];

        let maxEnd = 0;
        stack.forEach(s => { if (s.endWeek > maxEnd) maxEnd = s.endWeek; });
        
        const longestHalfLife = Math.max(...stack.map(s => {
            const ester = DB.esters[s.substanceId] ? DB.esters[s.substanceId].find(e => e.id === s.esterId) : null;
            return ester ? ester.halfLife : 1;
        }), 1);
        
        const forecastEnd = Math.ceil(maxEnd + (longestHalfLife / 7) * 5);
        const finalDuration = Math.max(totalWeeksForecast || 12, forecastEnd);

        const weeks = [];
        for (let w = 1; w <= finalDuration; w++) {
            let risks = {};
            // Init all 49 mechanisms to 0
            for (let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].mechanisms.forEach(m => risks[sys][m.id] = 0);
            }

            let activeCount = 0;
            stack.forEach(item => {
                const esterList = DB.esters[item.substanceId];
                const ester = esterList ? esterList.find(e => e.id === item.esterId) : null;
                const halfLife = ester ? ester.halfLife : 1;
                
                const conc = this.calculateConcentration(halfLife, item.startWeek, item.endWeek, w);

                if (conc > 0.01) {
                    activeCount++;
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    if (!sub) return;

                    const tox = sub.baseTox;
                    const load = conc * (item.dose / 100);

                    // Mapping base toxicity to specific mechanisms
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
                    risks.endo.estrogen += (tox.endo * 2) * load;
                    
                    risks.repro.suppression += (tox.repro * 5) * load;
                    risks.repro.atrophy += (tox.repro * 4) * load;
                }
            });

            // Normalize to 100%
            for (let sys in risks) {
                for (let m in risks[sys]) {
                    risks[sys][m] = Math.min(100, Math.round(risks[sys][m]));
                }
            }

            weeks.push({ week: w, risks, activeCount });
        }
        return weeks;
    },

    getRiskColor(value) {
        if (value < 20) return '#4caf50';
        if (value < 40) return '#8bc34a';
        if (value < 60) return '#ffeb3b';
        if (value < 80) return '#ff9800';
        return '#f44336';
    }
};
