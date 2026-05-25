const Engine = {
    calculateConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        const weeksOn = currentWeek - startWeek;
        if (currentWeek <= endWeek) {
            return Math.min(1, weeksOn / (halfLife/7 + 1));
        } else {
            const weeksOff = currentWeek - endWeek;
            return Math.max(0, 1 - (weeksOff * 0.2)); 
        }
    },
    generateWeeklyPlan(stack) {
        let maxWeek = 12;
        stack.forEach(s => { if(s.endWeek > maxWeek) maxWeek = s.endWeek; });
        const totalWeeks = maxWeek + 6;
        const plan = [];
        for(let w=1; w<=totalWeeks; w++) {
            let risks = {};
            for(let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].mechanisms.forEach(m => risks[sys][m.id] = 0);
            }
            stack.forEach(item => {
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const hl = ester ? ester.halfLife : 1;
                const conc = this.calculateConcentration(hl, item.startWeek, item.endWeek, w);
                if(conc > 0.05) {
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    if(!sub) return;
                    const load = conc * (item.dose/100);
                    const t = sub.baseTox;
                    risks.liver.cholestasis += t.liver*3*load; risks.liver.cytolysis += t.liver*2*load;
                    risks.cardio.lipids += t.lipid*3*load; risks.cardio.htn += t.lipid*1.5*load;
                    risks.hemato.erythrocytosis += t.hct*4*load; risks.hemato.viscosity += t.hct*3*load;
                    risks.neuro.dopamine += t.neuro*5*load;
                    risks.kidney.hyperfiltration += t.kidney*3*load;
                    risks.endo.insulin_res += t.endo*3*load; risks.endo.estrogen += t.endo*2*load;
                    risks.repro.suppression += t.repro*5*load; risks.repro.atrophy += t.repro*4*load;
                }
            });
            for(let sys in risks) for(let m in risks[sys]) risks[sys][m] = Math.min(100, Math.round(risks[sys][m]));
            plan.push({week:w, risks});
        }
        return plan;
    },
    getRiskColor(v) { return v<20?'#4caf50':v<40?'#8bc34a':v<60?'#ffeb3b':v<80?'#ff9800':'#f44336'; }
};
