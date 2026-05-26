const Eng = {
    calc: function(hl, start, end, w) {
        if(w<start) return 0;
        if(w<=end) return Math.min(1, (w-start)/(hl/7+1));
        return Math.max(0, 1-(w-end)*0.2);
    },
    plan: function(stack) {
        let max=12; stack.forEach(i=>{if(i.end>max)max=i.end;});
        let res=[];
        for(let w=1; w<=max+6; w++) {
            let r={};
            for(let s in DB.risks) { r[s]={}; DB.risks[s].forEach(m=>r[s][m.id]=0); }
            stack.forEach(it=>{
                let e=DB.esters[it.sub]?.find(x=>x.id===it.est);
                let hl=e?e.hl:1;
                let c=this.calc(hl,it.start,it.end,w);
                if(c>0.05){
                    let t=DB.substances.find(x=>x.id===it.sub).tox;
                    let L=c*(it.dose/100);
                    r.liver.chol+=t.liver*3*L; r.cardio.lip+=t.lipid*3*L;
                    r.hemato.ery+=t.hct*4*L; r.neuro.dop+=t.neuro*5*L;
                    r.kidney.hyper+=t.kid*3*L; r.endo.ins+=t.endo*3*L;
                    r.repro.sup+=t.repro*5*L;
                }
            });
            for(let s in r) for(let k in r[s]) r[s][k]=Math.min(100,Math.round(r[s][k]));
            res.push({w,r});
        }
        return res;
    },
    col: function(v){ return v<20?'#4caf50':v<40?'#8bc34a':v<60?'#ffeb3b':v<80?'#ff9800':'#f44336'; }
};
console.log("ENGINE LOADED v99");
