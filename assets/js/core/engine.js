const Engine = {
    // Расчет концентрации с учетом эфира
    calculateConcentration(esterHalfLife, doseMgPerWeek, weekIndex, totalWeeks) {
        const ke = Math.log(2) / (esterHalfLife * 24); // часов -> дни
        // Упрощенная модель накопления к steady state
        // Steady state достигается примерно за 4-5 периодов полувыведения
        const weeksToSteady = (esterHalfLife * 7) / 7; 
        
        let accumulationFactor = 1 - Math.exp(-0.693 * (weekIndex + 1) / (esterHalfLife / 7));
        if (weekIndex >= totalWeeks) {
             // ПКТ / спад
             const weeksOff = weekIndex - totalWeeks;
             accumulationFactor = Math.max(0, 1 - (weeksOff * 0.2)); // Грубый спад
        }
        
        return doseMgPerWeek * accumulationFactor;
    },

    // Генерация понедельного плана
    generateWeeklyPlan(stack) {
        const weeks = [];
        const maxWeeks = Math.max(...stack.map(s => s.duration), 12);
        
        for (let w = 1; w <= maxWeeks; w++) {
            let weekRisks = { liver: 0, cardio: 0, kidney: 0, neuro: 0, hemato: 0, endo: 0, repro: 0 };
            let activeDrugs = [];

            stack.forEach(item => {
                if (w <= item.duration) {
                    activeDrugs.push(item);
                    const substance = DB.substances.find(s => s.id === item.substanceId);
                    if (!substance) return;

                    // Коэффициент накопления (чем дольше эфир, тем плавнее, но к середине курса максимум)
                    const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                    const halfLife = ester ? ester.halfLife : 1;
                    const loadFactor = Math.min(1.2, w / (halfLife/7 + 2)); 

                    // Начисление рисков
                    const tox = substance.baseToxicity;
                    weekRisks.liver += (tox.liver || 0) * (item.dose / 100) * loadFactor;
                    weekRisks.cardio += (tox.lipid || 0) * (item.dose / 100) * loadFactor;
                    weekRisks.hemato += (tox.hct || 0) * (item.dose / 100) * loadFactor;
                    weekRisks.neuro += (tox.neuro || 0) * (item.dose / 100) * loadFactor;
                    
                    if (tox.insulin) weekRisks.endo += tox.insulin * (item.dose / 10) * loadFactor;
                    if (substance.id.includes('nandrolone') || substance.id.includes('trenbolone')) {
                        weekRisks.repro += 10 * loadFactor; // Прогестины
                    }
                }
            });

            // Нормализация и сохранение
            for (let k in weekRisks) weekRisks[k] = Math.min(100, Math.round(weekRisks[k]));
            
            weeks.push({
                week: w,
                risks: weekRisks,
                support: DB.supportProtocol, // Поддержка постоянная, но можно динамически менять
                drugs: activeDrugs.map(d => `${DB.substances.find(s=>s.id===d.substanceId)?.name} (${d.dose}мг)`)
            });
        }
        return weeks;
    },

    // Расчет Trust Score
    calculateTrustScore(userActivity) {
        let score = 0;
        if (userActivity.daysLogged > 7) score += 20;
        if (userActivity.labsUploaded) score += 30;
        if (userActivity.supportCompliance > 0.8) score += 30;
        if (userActivity.reviews > 0) score += 20;
        return Math.min(100, score);
    },

    // Фертильность (WHO 2021)
    calculateFertilityIndex(data) {
        if (!data.volume || !data.conc) return 0;
        let score = (Math.min(1, data.volume/1.5)*15) + (Math.min(1, data.conc/16)*20) + (Math.min(1, (data.pr||0)/30)*25) + (Math.min(1, (data.morph||0)/4)*20);
        return Math.round(score * 100 / 80); // Нормализация к 100
    }
};
