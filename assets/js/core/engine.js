const Engine = {
    // Формула концентрации: учет периода полувыведения и времени приема
    calcConc: function(hl, start, end, week) {
        if (week < start) return 0;
        if (week <= end) {
            // Плавный вход на плато
            return Math.min(1, (week - start) / (hl / 7 + 1));
        } else {
            // Спад после отмены (экспоненциальный)
            return Math.max(0, Math.exp(-0.693 * (week - end) / (hl / 7)));
        }
    },
    
    // Генерация плана по неделям
    generatePlan: function(stack) {
        let maxW = 12;
        stack.forEach(i => { if(i.end > maxW) maxW = i.end; });
        const total = maxW + 8; // + время на полный вывод
        const plan = [];
        
        for(let w = 1; w <= total; w++) {
            let r = {};
            // Инициализация всех рисков нулями
            for(let sys in DB.risks) { 
                r[sys] = {}; 
                DB.risks[sys].forEach(m => r[sys][m.id] = 0); 
            }
            
            // Суммирование рисков от всех препаратов
            stack.forEach(it => {
                const esterList = DB.esters[it.sub];
                const ester = esterList ? esterList.find(x => x.id === it.est) : null;
                const hl = ester ? ester.hl : 1;
                
                const conc = this.calcConc(hl, it.start, it.end, w);
                
                if(conc > 0.01) {
                    const sub = DB.substances.find(x => x.id === it.sub);
                    if(!sub) return;
                    const t = sub.tox;
                    const load = conc * (it.dose / 100); // Нормализация дозы
                    
                    // Распределение токсичности по механизмам
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
            });
            
            // Ограничение 100%
            for(let sys in r) {
                for(let k in r[sys]) {
                    r[sys][k] = Math.min(100, Math.round(r[sys][k]));
                }
            }
            plan.push({w, r});
        }
        return plan;
    },
    
    getColor: function(v) {
        if(v < 20) return '#4caf50'; 
        if(v < 40) return '#8bc34a'; 
        if(v < 60) return '#ffeb3b'; 
        if(v < 80) return '#ff9800'; 
        return '#f44336';
    }
};
