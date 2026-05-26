const Engine = {
    calcConc: function(hl, start, end, week) {
        if (week < start) return 0;
        if (week <= end) return Math.min(1, (week - start) / (hl/7 + 1));
        return Math.max(0, 1 - (week - end) * 0.2);
    },
    generatePlan: function(stack) {
        let maxW = 12;
        stack.forEach(function(i) { if(i.end > maxW) maxW = i.end; });
        var total = maxW + 6;
        var plan = [];
        for(var w=1; w<=total; w++) {
            var r = {};
            for(var sys in DB.risks) { 
                r[sys]={}; 
                for(var i=0; i<DB.risks[sys].length; i++) r[sys][DB.risks[sys][i].id]=0; 
            }
            for(var k=0; k<stack.length; k++) {
                var it = stack[k];
                var esterList = DB.esters[it.sub];
                var hl = 1;
                if(esterList) {
                    for(var e=0; e<esterList.length; e++) {
                        if(esterList[e].id == it.est) hl = esterList[e].hl;
                    }
                }
                var conc = this.calcConc(hl, it.start, it.end, w);
                if(conc > 0.05) {
                    var subList = DB.substances;
                    var t = null;
                    for(var s=0; s<subList.length; s++) if(subList[s].id == it.sub) t = subList[s].tox;
                    if(!t) continue;
                    var load = conc * (it.dose/100);
                    r.liver.chol += t.liver*3*load; r.liver.cyt += t.liver*2*load;
                    r.cardio.lip += t.lipid*3*load; r.cardio.htn += t.lipid*1.5*load;
                    r.hemato.ery += t.hct*4*load; r.hemato.visc += t.hct*3*load;
                    r.neuro.dop += t.neuro*5*load;
                    r.kidney.hyper += t.kid*3*load;
                    r.endo.ins += t.endo*3*load; r.endo.est += t.endo*2*load;
                    r.repro.sup += t.repro*5*load; r.repro.atr += t.repro*4*load;
                }
            }
            for(var sys in r) {
                for(var key in r[sys]) {
                    r[sys][key] = Math.min(100, Math.round(r[sys][key]));
                }
            }
            plan.push({w:w, r:r});
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
console.log("Engine Loaded");
