const Engine = {
    calculateConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek || halfLife <= 0) return 0;
        
        const weeksOnDrug = currentWeek - startWeek;
        const duration = endWeek - startWeek;
        
        // Фаза приема
        if (currentWeek <= endWeek) {
            // Плавный вход к steady state (примерно 4-5 периодов)
            const periods = (halfLife / 7); 
            const factor = 1 - Math.exp(-0.693 * (weeksOnDrug + 1) / Math.max(1, periods));
            return Math.min(1, factor);
        } 
        // Фаза выведения
        else {
            const weeksOff = currentWeek - endWeek;
            const decay = Math.exp(-0.693 * weeksOff / Math.max(1, halfLife / 7));
            return Math.max(0, decay);
        }
    },

    generateWeeklyPlan(stack, totalWeeksForecast) {
        if (!stack || stack.length === 0) return [];
        
        let maxEnd = 0;
        let maxHalfLife = 1;
        
        stack.forEach(s => { 
            if (s.endWeek > maxEnd) maxEnd = s.endWeek; 
            const ester = DB.esters[s.substanceId]?.find(e => e.id === s.esterId);
            if (ester && ester.halfLife > maxHalfLife) maxHalfLife = ester.halfLife;
        });

        const forecastEnd = Math.ceil(maxEnd + (maxHalfLife / 7) * 6); // +6 периодов для полного вывода
        const finalDuration = Math.max(totalWeeksForecast || 12, forecastEnd);

        const weeks = [];
        for (let w = 1; w <= finalDuration; w++) {
            let risks = {};
            // Init 49 mechanisms
            for (let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].mechanisms.forEach(m => risks[sys][m.id] = 0);
            }

            let activeCount = 0;
            stack.forEach(item => {
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const halfLife = ester ? ester.halfLife : 1;
                const conc = this.calculateConcentration(halfLife, item.startWeek, item.endWeek, w);

                if (conc > 0.05) {
                    activeCount++;
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    if (!sub) return;

                    const tox = sub.baseTox;
                    const load = conc * (item.dose / 100); // Normalized dose factor

                    // Map base toxicity to specific mechanisms (Weighted distribution)
                    // Liver
                    risks.liver.cholestasis += (tox.liver * 4) * load;
                    risks.liver.cytolysis += (tox.liver * 3) * load;
                    risks.liver.methylation += (tox.liver * 2) * load;
                    
                    // Cardio (Lipids drive most cardio risks here)
                    risks.cardio.lipids += (tox.lipid * 5) * load;
                    risks.cardio.htn += (tox.lipid * 2) * load;
                    risks.cardio.thrombo += (tox.lipid * 1.5) * load;
                    risks.cardio.lvh += (tox.lipid * 1) * load;

                    // Hemato (HCT drives erythrocytosis)
                    risks.hemato.erythrocytosis += (tox.hct * 6) * load;
                    risks.hemato.viscosity += (tox.hct * 4) * load;

                    // Neuro
                    risks.neuro.dopamine += (tox.neuro * 5) * load;
                    risks.neuro.gaba += (tox.neuro * 2) * load;

                    // Kidney
                    risks.kidney.hyperfiltration += (tox.kidney * 3) * load;
                    risks.kidney.electrolytes += (tox.kidney * 2) * load;

                    // Endo
                    risks.endo.insulin_res += (tox.endo * 4) * load;
                    risks.endo.estrogen += (tox.endo * 2) * load; // Simplified
                    risks.endo.prolactin += (tox.endo * 1.5) * load;

                    // Repro
                    risks.repro.suppression += (tox.repro * 6) * load;
                    risks.repro.atrophy += (tox.repro * 5) * load;
                    risks.repro.sperm += (tox.repro * 4) * load;
                }
            });

            // Normalize & Cap at 100
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
        if (value < 20) return '#2e7d32'; // Dark Green
        if (value < 40) return '#66bb6a'; // Light Green
        if (value < 60) return '#fdd835'; // Yellow
        if (value < 80) return '#fb8c00'; // Orange
        return '#d32f2f'; // Red
    }
};
