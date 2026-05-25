const EngineCore = {
  calcConc: function(hl, start, end, cur) {
    if(cur < start) return 0;
    if(cur <= end) return Math.min(1, (cur-start)/(hl/7+1));
    return Math.max(0, 1 - ((cur-end)*0.2));
  },
  genPlan: function(stack) {
    let maxW = 12;
    stack.forEach(s => { if(s.end > maxW) maxW = s.end; });
    const total = maxW + 6;
    const plan = [];
    for(let w=1; w<=total; w++) {
      let r = {};
      for(let sys in DB_DATA.risks) {
        r[sys] = {};
        DB_DATA.risks[sys].forEach(m => r[sys][m.id] = 0);
      }
      stack.forEach(it => {
        const estList = DB_DATA.esters[it.sub];
        const est = estList ? estList.find(e=>e.id===it.est) : null;
        const hl = est ? est.h : 1;
        const conc = this.calcConc(hl, it.start, it.end, w);
        if(conc > 0.05) {
          const sub = DB_DATA.substances.find(s=>s.id===it.sub);
          if(!sub) return;
          const load = conc * (it.dose/100);
          const t = sub.tox;
          r.liver.chol += t.liv*3*load; r.liver.cyt += t.liv*2*load;
          r.cardio.lip += t.lip*3*load; r.cardio.htn += t.lip*1.5*load;
          r.hemato.ery += t.hct*4*load; r.hemato.vis += t.hct*3*load;
          r.neuro.dop += t.neu*5*load;
          r.kidney.hf += t.kid*3*load;
          r.endo.insr += t.end*3*load; r.endo.est += t.end*2*load;
          r.repro.atr += t.rep*5*load; r.repro.sup += t.rep*4*load;
        }
      });
      for(let sys in r) for(let k in r[sys]) r[sys][k] = Math.min(100, Math.round(r[sys][k]));
      plan.push({w:w, r:r});
    }
    return plan;
  },
  getColor: function(v) { return v<20?'#4caf50':v<40?'#8bc34a':v<60?'#ffeb3b':v<80?'#ff9800':'#f44336'; }
};
