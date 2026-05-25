const Engine = {
    // Расчет полной длительности: Курс + 5 периодов полувыведения (для полного выведения)
    calculateTotalDuration(stack) {
        let maxWeeks = 0;
        stack.forEach(item => {
            const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
            const halfLifeDays = ester ? ester.halfLife : (item.substanceId.includes('oral') ? 1 : 7); 
            // Длительность курса + 5 * T1/2 (в неделях) для пост-курсового хвоста
            const washoutWeeks = (5 * halfLifeDays) / 7;
            const total = item.duration + washoutWeeks;
            if (total > maxWeeks) maxWeeks = total;
        });
        return Math.ceil(maxWeeks);
    },

    // Генерация понедельного плана с динамической длиной
    generateWeeklyPlan(stack) {
        if (stack.length === 0) return [];
        
        const totalWeeks = this.calculateTotalDuration(stack);
        const weeks = [];

        for (let w = 1; w <= totalWeeks; w++) {
            // Инициализация матрицы рисков нулями
            let weekRisks = {
                liver: { cholestasis: 0, oxidative: 0, cytolysis: 0, fibrosis: 0, mitochondrial: 0, methylation: 0, apoptosis: 0 },
                cardio: { htn: 0, tachycardia: 0, lipids: 0, thrombo: 0, hypertrophy: 0, endothelial: 0, arrhythmia: 0 },
                kidney: { hyperfiltration: 0, fibrosis: 0, electrolytes: 0, proteinuria: 0, stones: 0, gfr_drop: 0, tubular: 0 },
                neuro: { dopamine: 0, glutamate: 0, gaba: 0, serotonin: 0, neuroinflammation: 0, cognitive: 0, addiction: 0 },
                hemato: { erythrocytosis: 0, viscosity: 0, coagulation: 0, anemia: 0, leukocytosis: 0, thrombocytopenia: 0, hemolysis: 0 },
                endo: { insulin_resist: 0, estrogen: 0, prolactin: 0, thyroid: 0, cortisol: 0, gh_axis: 0, adrenal: 0 },
                repro: { atrophy: 0, suppression: 0, sperm_quality: 0, libido: 0, ed: 0, gyno: 0, infertility: 0 }
            };

            let activeDrugs = [];

            stack.forEach(item => {
                // Препарат активен, если неделя <= длительности курса
                // Но его влияние (риск) может сохраняться в фазе выведения
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const halfLifeDays = ester ? ester.halfLife : 7;
                
                // Фактор концентрации (накопление и спад)
                let concentrationFactor = 0;
                
                if (w <= item.duration) {
                    // Фаза курса: накопление к steady state
                    // Steady state достигается за ~4-5 T1/2
                    const weeksToSteady = (halfLifeDays * 5) / 7;
                    concentrationFactor = Math.min(1.0, w / weeksToSteady);
                    activeDrugs.push(item);
                } else if (w > item.duration) {
                    // Фаза выведения: экспоненциальный спад
                    const weeksOff = w - item.duration;
                    concentrationFactor = Math.pow(0.5, weeksOff / (halfLifeDays / 7));
                }

                if (concentrationFactor < 0.05) concentrationFactor = 0; // Отсечка

                if (concentrationFactor > 0) {
                    const sub = DB.substances.find(s => s.id === item.substanceId);
                    const doseFactor = item.dose / 100; // Нормализация к 100мг
                    const toxicity = sub.baseToxicity;

                    // Распределение рисков по механизмам (упрощенная карта из ТЗ)
                    // Печень
                    if (toxicity.liver) {
                        weekRisks.liver.cholestasis += toxicity.liver * 15 * doseFactor * concentrationFactor;
                        weekRisks.liver.cytolysis += toxicity.liver * 10 * doseFactor * concentrationFactor;
                        weekRisks.liver.mitochondrial += toxicity.liver * 5 * doseFactor * concentrationFactor;
                    }
                    // Кардио (Липиды, Тромбы, Давление)
                    if (toxicity.lipid) {
                        weekRisks.cardio.lipids += toxicity.lipid * 20 * doseFactor * concentrationFactor;
                        weekRisks.cardio.thrombo += toxicity.lipid * 10 * doseFactor * concentrationFactor;
                        weekRisks.cardio.endothelial += toxicity.lipid * 10 * doseFactor * concentrationFactor;
                    }
                    // Гемато (Гематокрит)
                    if (toxicity.hct) {
                        weekRisks.hemato.erythrocytosis += toxicity.hct * 25 * doseFactor * concentrationFactor;
                        weekRisks.hemato.viscosity += toxicity.hct * 20 * doseFactor * concentrationFactor;
                    }
                    // Нейро
                    if (toxicity.neuro) {
                        weekRisks.neuro.dopamine += toxicity.neuro * 20 * doseFactor * concentrationFactor;
                        weekRisks.neuro.glutamate += toxicity.neuro * 10 * doseFactor * concentrationFactor;
                    }
                    // Инсулин (Эндокринка)
                    if (toxicity.insulin) {
                        weekRisks.endo.insulin_resist += toxicity.insulin * 25 * doseFactor * concentrationFactor;
                    }
                    // Прогестины (Репродуктивная)
                    if (sub.id.includes('nandrolone') || sub.id.includes('trenbolone')) {
                        weekRisks.repro.suppression += 15 * doseFactor * concentrationFactor;
                        weekRisks.endo.prolactin += 10 * doseFactor * concentrationFactor;
                    }
                    // Эстрогены (если тестостерон)
                    if (sub.id === 'test') {
                        weekRisks.endo.estrogen += 15 * doseFactor * concentrationFactor;
                        weekRisks.repro.gyno += 10 * doseFactor * concentrationFactor;
                    }
                }
            });

            // Нормализация до 100% и округление
            const normalize = (obj) => {
                for (let k in obj) obj[k] = Math.min(100, Math.round(obj[k]));
            };
            Object.values(weekRisks).forEach(normalize);

            weeks.push({
                week: w,
                risks: weekRisks,
                activeDrugs: activeDrugs,
                isOnCycle: w <= Math.max(...stack.map(s => s.duration))
            });
        }
        return weeks;
    },

    // Расчет Net рисков (применение поддержки)
    calculateNetRisks(rawRisks) {
        // Глубокое копирование
        const net = JSON.parse(JSON.stringify(rawRisks));
        
        // Коэффициенты снижения от поддержки (из ТЗ)
        const reduction = {
            liver: 0.4,   // УДХК снижает риск на 60%
            cardio: 0.4,  // Телмисартан+статины снижают на 60%
            hemato: 0.5,  // Пентоксифиллин снижает вязкость на 50%
            neuro: 0.4,   // Ноотропы+Магний
            endo: 0.4,    // ИА/ИП+Берберин
            repro: 0.3,   // HCG
            kidney: 0.4   // Телмисартан+Астрагал
        };

        for (let sys in net) {
            for (let mech in net[sys]) {
                net[sys][mech] = Math.round(net[sys][mech] * reduction[sys]);
            }
        }
        return net;
    },

    calculateFertilityIndex(data) {
        if (!data.volume || !data.conc) return 0;
        let score = (Math.min(1, data.volume/1.5)*15) + (Math.min(1, data.conc/16)*20) + (Math.min(1, (data.pr||0)/30)*25) + (Math.min(1, (data.morph||0)/4)*20);
        return Math.round(score * 100 / 80);
    }
};
