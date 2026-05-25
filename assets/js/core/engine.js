const Engine = {
    calculateConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        const weeksOnDrug = currentWeek - startWeek;
        if (currentWeek <= endWeek) {
            return Math.min(1, weeksOnDrug / (halfLife / 7));
        } else {
            const weeksOff = currentWeek - endWeek;
            return Math.max(0, Math.exp(-0.693 * weeksOff / (halfLife / 7)));
        }
    },
    generateWeeklyPlan(stack, totalWeeksForecast) {
        const weeks = [];
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
            for (let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].mechanisms.forEach(m => risks[sys][m.id] = 0);
            }
            stack.forEach(item => {
                const conc = this.calculateConcentration(
                    (DB.esters[item.substanceId]?.find(e => e.id === item.esterId)?.halfLife) || 1,
                    item.startWeek, item.endWeek, w
                );
                if (conc > 0.01) {
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    if (!sub) return;
                    const tox = sub.baseTox;
                    const load = conc * (item.dose / 100);
                    risks.liver.cholestasis += (tox.liver * 3) * load;
                    risks.liver.cytolysis += (tox.liver * 2) * load;
                    risks.cardio.lipids += (tox.lipid * 3) * load;
                    risks.cardio.htn += (tox.lipid * 1.5) * load;
                    risks.hemato.erythrocytosis += (tox.hct * 4) * load;
                    risks.neuro.dopamine += (tox.neuro * 5) * load;
                    risks.kidney.hyperfiltration += (tox.kidney * 3) * load;
                    risks.endo.insulin_res += (tox.endo * 3) * load;
                    risks.repro.suppression += (tox.repro * 5) * load;
                }
            });
            for (let sys in risks) for (let m in risks[sys]) risks[sys][m] = Math.min(100, Math.round(risks[sys][m]));
            weeks.push({ week: w, risks });
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
