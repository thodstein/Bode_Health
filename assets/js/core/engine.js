const Engine = {
    // Расчет концентрации с учетом фаз: Рост -> Плато -> Спад
    calculateConcentration(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        
        const weeksOnDrug = currentWeek - startWeek;
        const timeToSteady = (halfLife / 7) * 4; // 4 периода полувыведения для выхода на плато
        
        // Фаза приема
        if (currentWeek <= endWeek) {
            if (weeksOnDrug < timeToSteady) {
                // Фаза накопления (линейная аппроксимация для простоты)
                return weeksOnDrug / timeToSteady;
            } else {
                // Плато
                return 1.0;
            }
        } 
        // Фаза выведения (после курса)
        else {
            const weeksOff = currentWeek - endWeek;
            // Экспоненциальный спад
            return Math.max(0, Math.exp(-0.693 * weeksOff / (halfLife / 7)));
        }
    },

    generateWeeklyPlan(stack, totalWeeksForecast) {
        if (!stack || stack.length === 0) return [];
        
        let maxEnd = 0;
        let maxHalfLife = 1;
        
        stack.forEach(s => { 
            if (s.endWeek > maxEnd) maxEnd = s.endWeek; 
            const ester = DB.esters[s.substanceId]?.find(e => e.id === s.esterId);
            const hl = ester ? ester.halfLife : 1;
            if (hl > maxHalfLife) maxHalfLife = hl;
        });
        
        // Прогноз: конец последнего курса + 5 периодов полувыведения самого долгого эфира
        const forecastEnd = Math.ceil(maxEnd + (maxHalfLife / 7) * 5);
        const finalDuration = Math.max(totalWeeksForecast || 12, forecastEnd);

        const weeks = [];
        for (let w = 1; w <= finalDuration; w++) {
            let risks = {};
            // Инициализация нулями
            for (let sys in DB.riskMatrix) {
                risks[sys] = {};
                DB.riskMatrix[sys].mechanisms.forEach(m => risks[sys][m.id] = 0);
            }

            let activeCount = 0;
            stack.forEach(item => {
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const halfLife = ester ? ester.halfLife : 1;
                
                const conc = this.calculateConcentration(halfLife, item.startWeek, item.endWeek, w);
                
                if (conc > 0.01) {
                    activeCount++;
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    if (!sub) return;

                    const tox = sub.baseTox;
                    const load = conc * (item.dose / 100); // Нормализация к 100мг

                    // Маппинг общей токсичности на конкретные механизмы
                    // Печень
                    risks.liver.cholestasis += (tox.liver * 3) * load;
                    risks.liver.cytolysis += (tox.liver * 2.5) * load;
                    risks.liver.mito += (tox.liver * 2) * load;
                    
                    // Кардио
                    risks.cardio.lipids += (tox.lipid * 3) * load;
                    risks.cardio.htn += (tox.lipid * 1.5) * load;
                    risks.cardio.thrombo += (tox.lipid * 1) * load;
                    
                    // Кровь
                    risks.hemato.erythrocytosis += (tox.hct * 4) * load;
                    risks.hemato.viscosity += (tox.hct * 3) * load;
                    
                    // Нейро
                    risks.neuro.dopamine += (tox.neuro * 5) * load;
                    risks.neuro.gaba += (tox.neuro * 2) * load;
                    
                    // Почки
                    risks.kidney.hyperfiltration += (tox.kidney * 3) * load;
                    
                    // Эндо
                    risks.endo.insulin_res += (tox.endo * 3) * load;
                    risks.endo.estrogen += (tox.endo * 2) * load; 
                    risks.endo.prolactin += (tox.endo * 1.5) * load;
                    
                    // Репро
                    risks.repro.suppression += (tox.repro * 5) * load;
                    risks.repro.atrophy += (tox.repro * 4) * load;
                }
            });

            // Нормализация до 100%
            for (let sys in risks) {
                for (let m in risks[sys]) {
                    risks[sys][m] = Math.min(100, Math.round(risks[sys][m]));
                }
            }

            weeks.push({ week: w, risks, activeCount });
        }
        return weeks;
    },

    getRiskColor(value) {
        if (value < 20) return '#2e7d32'; // Dark Green
        if (value < 40) return '#66bb6a'; // Light Green
        if (value < 60) return '#fdd835'; // Yellow
        if (value < 80) return '#fb8c00'; // Orange
        return '#c62828'; // Dark Red
    }
};
