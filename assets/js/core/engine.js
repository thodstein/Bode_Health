const Engine = {
    calcConc: function(hl, start, end, week) {
        if (week < start) return 0;
        if (week <= end) return Math.min(1, (week - start) / (hl/7 + 1));
        return Math.max(0, 1 - (week - end) * 0.2);
    },
    generatePlan: function(stack) {
        let maxW = 12;
        stack.forEach(function(i) { if(i.end > maxW) maxW = i.end; });
        const total = maxW + 6;
        const plan = [];
        for(let w=1; w<=total; w++) {
            let r = {};
            for(let sys in DB.risks) { 
                r[sys]={}; 
                DB.risks[sys].forEach(function(m) { r[sys][m.id]=0; }); 
            }
            stack.forEach(function(it) {
                const esterList = DB.esters[it.sub];
                let ester = null;
                if(esterList) {
                    for(let k=0; k<esterList.length; k++) {
                        if(esterList[k].id === it.est) ester = esterList[k];
                    }
                }
                const hl = ester ? ester.hl : 1;
                const conc = Engine.calcConc(hl, it.start, it.end, w);
                if(conc > 0.05) {
                    let sub = null;
                    for(let k=0; k<DB.substances.length; k++) {
                        if(DB.substances[k].id === it.sub) sub = DB.substances[k];
                    }
                    if(!sub) return;
                    const t = sub.tox;
                    const load = conc * (it.dose/100);
                    r.liver.chol += t.liver*3*load; r.liver.cyt += t.liver*2*load;
                    r.cardio.lip += t.lipid*3*load; r.cardio.htn += t.lipid*1.5*load;
                    r.hemato.ery += t.hct*4*load; r.hemato.visc += t.hct*3*load;
                    r.neuro.dop += t.neuro*5*load;
                    r.kidney.hyper += t.kid*3*load;
                    r.endo.ins += t.endo*3*load; r.endo.est += t.endo*2*load;
                    r.repro.sup += t.repro*5*load; r.repro.atr += t.repro*4*load;
                }
            });
            for(let sys in r) {
                for(let k in r[sys]) {
                    r[sys][k] = Math.min(100, Math.round(r[sys][k]));
                }
            }
            plan.push({w: w, r: r});
        }
        return plan;
    },
    getColor: function(v) {
        if(v<20) return '#4caf50'; 
        if(v<40) return '#8bc34a'; 
        if(v<60) return '#ffeb3b'; 
        if(v<80) return '#ff9800'; 
        return '#f44336';
    }
};
