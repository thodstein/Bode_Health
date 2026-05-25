const Engine = {
    generateWeeklyPlan(stack) {
        if (stack.length === 0) return [];

        // Находим самую позднюю неделю окончания + период выведения (5 периодов п/в макс эфира)
        let maxWeekEnd = 0;
        let maxHalfLife = 0;
        
        stack.forEach(item => {
            const endWeek = item.startWeek + item.duration - 1;
            if (endWeek > maxWeekEnd) maxWeekEnd = endWeek;
            
            const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
            const hl = ester ? ester.halfLife : (item.substanceId.includes('oral') ? 0.5 : 1);
            if (hl > maxHalfLife) maxHalfLife = hl;
        });

        const washoutWeeks = Math.ceil((maxHalfLife * 5) / 7); // 5 периодов п/в в неделях
        const totalWeeks = maxWeekEnd + washoutWeeks;

        const weeks = [];
        for (let w = 1; w <= totalWeeks; w++) {
            let risks = { liver: 0, cardio: 0, kidney: 0, neuro: 0, hemato: 0, endo: 0, repro: 0 };
            let activeDrugs = [];
            let concentrationFactor = 0;

            stack.forEach(item => {
                const start = item.startWeek;
                const end = item.startWeek + item.duration - 1;
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const hl = ester ? ester.halfLife : 1;
                
                let currentConc = 0;

                if (w >= start && w <= end) {
                    // Активная фаза: накопление
                    const weekInCycle = w - start + 1;
                    // Простая модель накопления до steady state (примерно 4-5 периодов п/в)
                    const accumulation = Math.min(1, weekInCycle / (hl/7 + 2)); 
                    currentConc = accumulation;
                    activeDrugs.push(`${DB.substances.find(s=>s.id===item.substanceId)?.name} (${item.dose}мг)`);
                } else if (w > end) {
                    // Фаза выведения
                    const weeksOff = w - end;
                    // Экспоненциальный спад
                    currentConc = Math.max(0, Math.pow(0.5, (weeksOff * 7) / hl));
                    if (currentConc > 0.05) activeDrugs.push(`(Washout) ${DB.substances.find(s=>s.id===item.substanceId)?.name}`);
                }

                if (currentConc > 0.05) {
                    const tox = DB.substances.find(s => s.id === item.substanceId)?.baseToxicity;
                    if (tox) {
                        const load = (item.dose / 100) * currentConc;
                        risks.liver += (tox.liver || 0) * load;
                        risks.cardio += (tox.lipid || 0) * load;
                        risks.kidney += (tox.kidney || 0) * load;
                        risks.neuro += (tox.neuro || 0) * load;
                        risks.hemato += (tox.hct || 0) * load;
                        risks.endo += (tox.endo || 0) * load;
                        risks.repro += (tox.repro || 0) * load;
                    }
                }
            });

            // Нормализация до 100
            for (let k in risks) risks[k] = Math.min(100, Math.round(risks[k]));
            
            // Детализация механизмов (упрощенно распределяем общий риск системы по механизмам)
            let mechanisms = {};
            DB.riskMatrixDef.liver.forEach(m => mechanisms[`liver_${m}`] = Math.round(risks.liver * (0.1 + Math.random()*0.2))); // Примерная дисперсия
            
            weeks.push({
                week: w,
                risks: risks,
                activeDrugs: [...new Set(activeDrugs)],
                isWashout: w > maxWeekEnd
            });
        }
        return weeks;
    },

    calculateFertilityIndex(data) {
        if (!data.volume || !data.conc) return 0;
        let score = (Math.min(1, data.volume/1.5)*15) + (Math.min(1, data.conc/16)*20) + (Math.min(1, (data.pr||0)/30)*25) + (Math.min(1, (data.morph||0)/4)*20);
        return Math.round(score * 100 / 80);
    }
};
