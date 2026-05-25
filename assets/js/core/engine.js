const Engine = {
    calculateConcentration: function(hl, start, end, current) {
        if (current < start) return 0;
        const weeksOn = current - start;
        if (current <= end) {
            // Фаза набора (выход на плато)
            return Math.min(1, weeksOn / (hl / 7 + 1));
        } else {
            // Фаза выведения
            const weeksOff = current - end;
            return Math.max(0, 1 - (weeksOff * 0.2)); // Грубая линейная аппроксимация спада
        }
    },

    generatePlan: function(stack) {
        let maxWeek = 12;
        stack.forEach(s => { if (s.end > maxWeek) maxWeek = s.end; });
        const totalWeeks = maxWeek + 6; // Курс + 6 недель на вывод
        const plan = [];

        for (let w = 1; w <= totalWeeks; w++) {
            let r = {};
            // Инициализация нулями
            for (let sys in DB.risks) {
                r[sys] = {};
                DB.risks[sys].forEach(m => r[sys][m.id] = 0);
            }

            stack.forEach(item => {
                const ester = DB.esters[item.sub]?.find(e => e.id === item.est);
                const hl = ester ? ester.hl : 1;
                const conc = this.calculateConcentration(hl, item.start, item.end, w);

                if (conc > 0.05) {
                    const sub = DB.substances.find(s => s.id === item.sub);
                    if (!sub) return;
                    const t = sub.tox;
                    const load = conc * (item.dose / 100);

                    // Распределение токсичности по механизмам
                    r.liver.chol += t.liver * 3 * load; r.liver.cyt += t.liver * 2 * load;
                    r.cardio.lip += t.lipid * 3 * load; r.cardio.htn += t.lipid * 1.5 * load;
                    r.hemato.ery += t.hct * 4 * load; r.hemato.visc += t.hct * 3 * load;
                    r.neuro.dop += t.neuro * 5 * load;
                    r.kidney.hyper += t.kid * 3 * load;
                    r.endo.ins += t.endo * 3 * load; r.endo.est += t.endo * 2 * load;
                    r.repro.sup += t.repro * 5 * load; r.repro.atr += t.repro * 4 * load;
                }
            });

            // Нормализация до 100%
            for (let sys in r) {
                for (let k in r[sys]) {
                    r[sys][k] = Math.min(100, Math.round(r[sys][k]));
                }
            }
            plan.push({ w, r });
        }
        return plan;
    },

    getRiskColor: function(v) {
        if (v < 20) return '#4caf50';
        if (v < 40) return '#8bc34a';
        if (v < 60) return '#ffeb3b';
        if (v < 80) return '#ff9800';
        return '#f44336';
    }
};
