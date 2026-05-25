const Engine = {
    calculateConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        if (currentWeek <= endWeek) {
            // Ramp up
            const progress = (currentWeek - startWeek + 1) / (halfLife / 7);
            return Math.min(1, progress);
        } else {
            // Decay
            const weeksOff = currentWeek - endWeek;
            return Math.max(0, Math.exp(-0.693 * weeksOff / (halfLife / 7)));
        }
    },

    generateWeeklyPlan(stack) {
        if (!stack.length) return [];
        let maxWeek = 0;
        stack.forEach(s => { if (s.endWeek > maxWeek) maxWeek = s.endWeek; });
        // Add clearance time
        const totalWeeks = maxWeek + 6; 
        
        const plan = [];
        for (let w = 1; w <= totalWeeks; w++) {
            let risks = {};
            // Init 0
            for (let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].mechanisms.forEach(m => risks[sys][m.id] = 0);
            }

            stack.forEach(item => {
                const esterList = DB.esters[item.substanceId];
                const ester = esterList ? esterList.find(e => e.id === item.esterId) : null;
                const halfLife = ester ? ester.halfLife : 1;
                const conc = this.calculateConcentration(halfLife, item.startWeek, item.endWeek, w);
                
                if (conc > 0.05) {
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    if (!sub) return;
                    const factor = conc * (item.dose / 100);
                    const t = sub.baseTox;

                    // Map toxicity to specific mechanisms
                    risks.liver.cholestasis += t.liver * 4 * factor;
                    risks.liver.cytolysis += t.liver * 3 * factor;
                    
                    risks.cardio.lipids += t.lipid * 4 * factor;
                    risks.cardio.htn += t.lipid * 2 * factor;
                    risks.cardio.thrombo += t.lipid * 1.5 * factor;

                    risks.hemato.erythrocytosis += t.hct * 5 * factor;
                    risks.hemato.viscosity += t.hct * 4 * factor;

                    risks.neuro.dopamine += t.neuro * 5 * factor;
                    risks.neuro.gaba += t.neuro * 2 * factor;

                    risks.kidney.hyperfiltration += t.kidney * 3 * factor;

                    risks.endo.insulin_res += t.endo * 3 * factor;
                    risks.endo.estrogen += t.endo * 2 * factor;

                    risks.repro.suppression += t.repro * 5 * factor;
                    risks.repro.atrophy += t.repro * 4 * factor;
                }
            });

            // Cap at 100
            for (let sys in risks) {
                for (let m in risks[sys]) risks[sys][m] = Math.min(100, Math.round(risks[sys][m]));
            }
            plan.push({ week: w, risks });
        }
        return plan;
    },

    getRiskColor(val) {
        if (val < 20) return '#2e7d32';
        if (val < 40) return '#f9a825';
        if (val < 60) return '#ef6c00';
        return '#c62828';
    }
};
