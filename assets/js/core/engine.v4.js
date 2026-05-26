const Engine = {
    calcConc: function(hl, start, end, week) {
        if (week < start) return 0;
        // Фаза набора (накопление)
        if (week <= end) {
            // Упрощенная модель: линейный рост до стабильного состояния за 4-5 периодов T1/2
            // Для длинных эфиров рост медленный, для коротких быстрый
            const weeksToSteady = Math.max(1, (hl * 1.5) / 7); 
            const progress = (week - start + 1) / weeksToSteady;
            return Math.min(1, progress);
        }
        // Фаза выведения (спад)
        else {
            const weeksOff = week - end;
            // Экспоненциальный спад
            return Math.max(0, Math.exp(-0.693 * weeksOff / (hl/7)));
        }
    },
    
    generatePlan: function(stack) {
        if (!stack || stack.length === 0) return [];
        
        let maxW = 12;
        stack.forEach(i => { if(i.end > maxW) maxW = i.end; });
        // Прогноз: конец курса + 5 периодов полувыведения самого длинного эфира
        let longestHl = 0;
        stack.forEach(i => {
            const ester = DB.esters[i.sub]?.find(e => e.id === i.est);
            if (ester && ester.hl > longestHl) longestHl = ester.hl;
        });
        const total = Math.ceil(maxW + (longestHl / 7) * 5);
        
        const plan = [];
        for(let w = 1; w <= total; w++) {
            let r = {};
            // Init 7x7 matrix with 0
            for(let sys in DB.risks) { 
                r[sys] = {}; 
                DB.risks[sys].forEach(m => r[sys][m.id] = 0); 
            }
            
            stack.forEach(it => {
                const ester = DB.esters[it.sub]?.find(x => x.id === it.est);
                const hl = ester ? ester.hl : 1; // Default 1 day for orals/peptides
                const conc = this.calcConc(hl, it.start, it.end, w);
                
                if(conc > 0.05) { // Threshold
                    const sub = DB.substances.find(x => x.id === it.sub);
                    if(!sub) return;
                    
                    const t = sub.tox;
                    const load = conc * (it.dose / 100); // Normalized to 100mg
                    
                    // Mapping toxicity to specific mechanisms (Simplified logic for demo, expandable)
                    // Liver
                    if(t.liver > 0) { r.liver.chol += t.liver * 3 * load; r.liver.cyt += t.liver * 2 * load; r.liver.mito += t.liver * load; }
                    // Cardio (Lipids -> Thrombo/Lipids)
                    if(t.lipid > 0) { r.cardio.lip += t.lipid * 3 * load; r.cardio.thr += t.lipid * 1.5 * load; r.cardio.htn += t.lipid * load; }
                    // Hemato (HCT -> Erythrocytosis/Viscosity)
                    if(t.hct > 0) { r.hemato.ery += t.hct * 4 * load; r.hemato.visc += t.hct * 3 * load; }
                    // Neuro
                    if(t.neuro > 0) { r.neuro.dop += t.neuro * 5 * load; r.neuro.inf += t.neuro * 2 * load; }
                    // Kidney
                    if(t.kid > 0) { r.kidney.hyper += t.kid * 3 * load; r.kidney.elec += t.kid * load; }
                    // Endo
                    if(t.endo > 0) { r.endo.ins += t.endo * 3 * load; r.endo.est += t.endo * 2 * load; r.endo.prl += t.endo * load; }
                    // Repro
                    if(t.repro > 0) { r.repro.sup += t.repro * 5 * load; r.repro.atr += t.repro * 4 * load; r.repro.sp += t.repro * 3 * load; }
                }
            });
            
            // Normalize to 100% cap
            for(let sys in r) {
                for(let k in r[sys]) {
                    r[sys][k] = Math.min(100, Math.round(r[sys][k]));
                }
            }
            plan.push({ w, r });
        }
        return plan;
    },
    
    getColor: function(v) {
        if(v === 0) return '#2d2d35'; // No risk
        if(v < 20) return '#10b981'; // Green
        if(v < 40) return '#8bc34a'; // Light Green
        if(v < 60) return '#fbbf24'; // Yellow
        if(v < 80) return '#f97316'; // Orange
        return '#ef4444'; // Red
    }
};
