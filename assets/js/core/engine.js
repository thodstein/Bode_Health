const Engine = {
    calcConc: function(hl, start, end, week) {
        if (week < start) {
            return 0;
        }
        if (week <= end) {
            var weeksOn = week - start;
            var riseSpeed = hl / 7 + 1;
            return Math.min(1, weeksOn / riseSpeed);
        } else {
            var weeksOff = week - end;
            return Math.max(0, 1 - (weeksOff * 0.2));
        }
    },

    generatePlan: function(stack) {
        var maxW = 12;
        for (var i = 0; i < stack.length; i++) {
            if (stack[i].end > maxW) {
                maxW = stack[i].end;
            }
        }
        var total = maxW + 6;
        var plan = [];

        for (var w = 1; w <= total; w++) {
            var r = {};
            
            for (var sys in DB.risks) {
                r[sys] = {};
                var mechanisms = DB.risks[sys];
                for (var m = 0; m < mechanisms.length; m++) {
                    r[sys][mechanisms[m].id] = 0;
                }
            }

            for (var i = 0; i < stack.length; i++) {
                var it = stack[i];
                var esterList = DB.esters[it.sub];
                var ester = null;
                if (esterList) {
                    for (var e = 0; e < esterList.length; e++) {
                        if (esterList[e].id === it.est) {
                            ester = esterList[e];
                            break;
                        }
                    }
                }
                
                var hl = ester ? ester.hl : 1;
                var conc = this.calcConc(hl, it.start, it.end, w);

                if (conc > 0.05) {
                    var sub = null;
                    for (var s = 0; s < DB.substances.length; s++) {
                        if (DB.substances[s].id === it.sub) {
                            sub = DB.substances[s];
                            break;
                        }
                    }
                    
                    if (sub) {
                        var t = sub.tox;
                        var load = conc * (it.dose / 100);

                        r.liver.chol += t.liver * 3 * load;
                        r.liver.cyt += t.liver * 2 * load;
                        
                        r.cardio.lip += t.lipid * 3 * load;
                        r.cardio.htn += t.lipid * 1.5 * load;
                        
                        r.hemato.ery += t.hct * 4 * load;
                        r.hemato.visc += t.hct * 3 * load;
                        
                        r.neuro.dop += t.neuro * 5 * load;
                        
                        r.kidney.hyper += t.kid * 3 * load;
                        
                        r.endo.ins += t.endo * 3 * load;
                        r.endo.est += t.endo * 2 * load;
                        
                        r.repro.sup += t.repro * 5 * load;
                        r.repro.atr += t.repro * 4 * load;
                    }
                }
            }

            for (var sys in r) {
                for (var k in r[sys]) {
                    r[sys][k] = Math.min(100, Math.round(r[sys][k]));
                }
            }
            plan.push({w: w, r: r});
        }
        return plan;
    },

    getColor: function(v) {
        if (v < 20) return '#4caf50';
        if (v < 40) return '#8bc34a';
        if (v < 60) return '#ffeb3b';
        if (v < 80) return '#ff9800';
        return '#f44336';
    }
};
