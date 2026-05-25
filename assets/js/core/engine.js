const Engine = {
    // Расчет риска на конкретную неделю с учетом накопления и выведения
    calculateWeeklyRisks(stack, weekIndex) {
        let risks = { liver: 0, cardio: 0, kidney: 0, neuro: 0, hemato: 0, endo: 0, repro: 0 };
        
        stack.forEach(item => {
            const startWeek = parseInt(item.startWeek);
            const endWeek = parseInt(item.endWeek);
            
            // Проверка: активен ли препарат на этой неделе?
            if (weekIndex < startWeek || weekIndex > endWeek) return;

            const substance = DB.substances.find(s => s.id === item.substanceId);
            if (!substance) return;

            const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
            const halfLife = ester ? ester.halfLife : 1;
            
            // Коэффициент накопления (выход на плато)
            // Неделя 1: мало, Неделя 3-4: плато для длинных эфиров
            const weeksActive = weekIndex - startWeek + 1;
            const accumulation = Math.min(1.2, 1 - Math.exp(-0.693 * weeksActive / (halfLife / 7)));
            
            // Коэффициент выведения (после endWeek) - хотя проверка выше отсекает, 
            // но если мы считаем "хвост" влияния, можно добавить. Пока считаем только активные недели.
            
            const doseFactor = (item.dose || 100) / 100;
            const tox = substance.baseToxicity;

            // Начисление по всем 7 системам
            risks.liver += (tox.liver || 0) * doseFactor * accumulation;
            risks.cardio += ((tox.cardio_lipid || 0) + (tox.cardio_htn || 0)) * 0.5 * doseFactor * accumulation;
            risks.kidney += (tox.kidney || 0) * doseFactor * accumulation;
            risks.neuro += (tox.neuro || 0) * doseFactor * accumulation;
            risks.hemato += (tox.hct || 0) * doseFactor * accumulation;
            risks.endo += ((tox.endo_e2 || 0) + (tox.endo_prl || 0) + (tox.endo_insulin || 0)) * doseFactor * accumulation;
            risks.repro += (tox.repro || 0) * doseFactor * accumulation;
        });

        // Нормализация до 100%
        for (let k in risks) risks[k] = Math.min(100, Math.round(risks[k]));
        return risks;
    },

    // Генерация полного плана курса
    generateCoursePlan(stack) {
        if (stack.length === 0) return [];
        
        // Находим общую длительность: max(endWeek) + период выведения самого длинного эфира (2 недели запас)
        const maxEnd = Math.max(...stack.map(s => parseInt(s.endWeek)));
        const totalWeeks = maxEnd + 4; // +4 недели на полный вывод и пост-курс мониторинг

        const plan = [];
        for (let w = 1; w <= totalWeeks; w++) {
            const risks = this.calculateWeeklyRisks(stack, w);
            const activeDrugs = stack.filter(s => w >= parseInt(s.startWeek) && w <= parseInt(s.endWeek));
            
            plan.push({
                week: w,
                risks: risks,
                activeDrugs: activeDrugs,
                isPostCycle: w > maxEnd
            });
        }
        return plan;
    },

    // Детализация рисков по механизмам (для матрицы 7x7)
    getMechanismBreakdown(stack, weekIndex) {
        const breakdown = {};
        DB.riskMatrix.liver.forEach(m => breakdown[`liver_${m}`] = 0);
        DB.riskMatrix.cardio.forEach(m => breakdown[`cardio_${m}`] = 0);
        // ... и так далее для всех систем (упрощенно вернем основные)
        
        // Для визуализации просто распределим общий риск системы по механизмам пропорционально весу (заглушка для демо)
        const sysRisks = this.calculateWeeklyRisks(stack, weekIndex);
        const result = {
            liver: DB.riskMatrix.liver.map(m => ({ name: m, value: Math.round(sysRisks.liver / 7) })),
            cardio: DB.riskMatrix.cardio.map(m => ({ name: m, value: Math.round(sysRisks.cardio / 7) })),
            kidney: DB.riskMatrix.kidney.map(m => ({ name: m, value: Math.round(sysRisks.kidney / 7) })),
            neuro: DB.riskMatrix.neuro.map(m => ({ name: m, value: Math.round(sysRisks.neuro / 7) })),
            hemato: DB.riskMatrix.hemato.map(m => ({ name: m, value: Math.round(sysRisks.hemato / 7) })),
            endo: DB.riskMatrix.endo.map(m => ({ name: m, value: Math.round(sysRisks.endo / 7) })),
            repro: DB.riskMatrix.repro.map(m => ({ name: m, value: Math.round(sysRisks.repro / 7) }))
        };
        return result;
    },

    calculateFertilityIndex(data) {
        if (!data.volume || !data.conc) return 0;
        let score = (Math.min(1, data.volume/1.5)*15) + (Math.min(1, data.conc/16)*20) + (Math.min(1, (data.pr||0)/30)*25) + (Math.min(1, (data.morph||0)/4)*20);
        return Math.round(score * 100 / 80);
    }
};
