const Engine = {
    // Расчет концентрации с учетом Start/End недель
    calculateConcentration(esterHalfLife, doseMgPerWeek, currentWeek, startWeek, endWeek) {
        if (currentWeek < startWeek) return 0;
        
        const weeksOnDrug = currentWeek - startWeek + 1;
        const isOnCycle = currentWeek <= endWeek;
        
        // Фактор накопления (Steay State достигается за ~4-5 периодов полувыведения)
        // Для простоты используем экспоненту накопления
        let accumulation = 1 - Math.exp(-0.693 * weeksOnDrug / (esterHalfLife / 7));
        
        if (!isOnCycle) {
            // Фаза выведения (Post Cycle)
            const weeksOff = currentWeek - endWeek;
            const decay = Math.exp(-0.693 * weeksOff / (esterHalfLife / 7));
            // Концентрация падает от пикового значения, которое было на момент отмены
            // Грубая аппроксимация: берем уровень накопления на момент конца курса и умножаем на спад
            const peakAccumulation = 1 - Math.exp(-0.693 * (endWeek - startWeek + 1) / (esterHalfLife / 7));
            return doseMgPerWeek * peakAccumulation * decay;
        }
        
        return doseMgPerWeek * accumulation;
    },

    // Генерация плана с динамической длительностью
    generateWeeklyPlan(stack, supportActive) {
        if (stack.length === 0) return [];

        // Определяем общую длительность графика: Макс(конец курса) + 5 * Макс(период полувыведения)
        let maxEndWeek = 0;
        let maxHalfLife = 0;

        stack.forEach(item => {
            if (item.end > maxEndWeek) maxEndWeek = item.end;
            const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
            if (ester && ester.halfLife > maxHalfLife) maxHalfLife = ester.halfLife;
        });

        const washoutWeeks = Math.ceil((maxHalfLife * 5) / 7); // 5 периодов полувыведения в неделях
        const totalWeeks = maxEndWeek + washoutWeeks;

        const plan = [];
        for (let w = 1; w <= totalWeeks; w++) {
            let weekRisks = { 
                liver: { cholestasis:0, oxidative:0, cytolysis:0, fibrosis:0, mitochondrial:0, methylation:0, apoptosis:0 },
                cardio: { htn:0, tachycardia:0, lipids:0, thrombo:0, hypertrophy:0, endothelial:0, arrhythmia:0 },
                kidney: { hyperfiltration:0, fibrosis:0, electrolytes:0, proteinuria:0, glomerulosclerosis:0, tubular:0, stones:0 },
                neuro: { dopamine:0, glutamate:0, gaba:0, serotonin:0, inflammation:0, cognitive:0, addiction:0 },
                hemato: { erythrocytosis:0, viscosity:0, coagulation:0, anemia:0, leukocytosis:0, thrombocytopenia:0, hemolysis:0 },
                endo: { insulin:0, estrogen:0, prolactin:0, thyroid:0, cortisol:0, gh_axis:0, adrenal:0 },
                repro: { atrophy:0, suppression:0, sperm:0, libido:0, ed:0, gyno:0, infertility:0 }
            };
            
            let activeDrugs = [];

            stack.forEach(item => {
                // Проверка активности препарата на текущей неделе (с учетом выведения)
                const ester = DB.esters[item.substanceId]?.find(e => e.id === item.esterId);
                const halfLife = ester ? ester.halfLife : 1;
                const conc = this.calculateConcentration(halfLife, item.dose, w, item.start, item.end);
                
                if (conc > 0.1) { // Если концентрация значима
                    activeDrugs.push({ ...item, currentConc: conc });
                    const substance = DB.substances.find(s => s.id === item.substanceId);
                    if (!substance) return;

                    const tox = substance.baseToxicity;
                    const loadFactor = conc / item.dose; // Нормализованный фактор нагрузки

                    // Начисление рисков по механизмам (упрощенная карта)
                    // Печень
                    if (tox.liver >= 4) { weekRisks.liver.cholestasis += 20*loadFactor; weekRisks.liver.cytolysis += 15*loadFactor; }
                    if (tox.liver >= 5) { weekRisks.liver.mitochondrial += 20*loadFactor; }
                    
                    // Кардио
                    if (tox.lipid >= 4) { weekRisks.cardio.lipids += 20*loadFactor; weekRisks.cardio.thrombo += 10*loadFactor; }
                    if (substance.id.includes('trenbolone') || substance.id.includes('dhb')) { weekRisks.cardio.htn += 15*loadFactor; }

                    // Гемато
                    if (tox.hct >= 4) { weekRisks.hemato.erythrocytosis += 25*loadFactor; weekRisks.hemato.viscosity += 15*loadFactor; }

                    // Нейро
                    if (tox.neuro >= 4) { weekRisks.neuro.dopamine += 20*loadFactor; weekRisks.neuro.glutamate += 10*loadFactor; }

                    // Эндо
                    if (tox.insulin) { weekRisks.endo.insulin += tox.insulin * 15 * loadFactor; }
                    if (substance.id.includes('test')) { weekRisks.endo.estrogen += 15*loadFactor; }
                    if (substance.id.includes('nandrolone') || substance.id.includes('trenbolone')) { weekRisks.endo.prolactin += 15*loadFactor; weekRisks.repro.libido += 5*loadFactor; }
                    
                    // Репро
                    if (substance.id.includes('test') || substance.id.includes('nandrolone') || substance.id.includes('trenbolone')) {
                        weekRisks.repro.atrophy += 10*loadFactor;
                        weekRisks.repro.suppression += 10*loadFactor;
                    }
                }
            });

            // Применение поддержки (Net Risk)
            if (supportActive) {
                // Коэффициенты снижения (из ТЗ)
                weekRisks.liver.cholestasis *= 0.35;
                weekRisks.cardio.htn *= 0.3;
                weekRisks.hemato.viscosity *= 0.5;
                weekRisks.endo.estrogen *= 0.3;
                // ... и так далее для всех механизмов
            }

            // Нормализация до 100
            const normalize = (obj) => { for(let k in obj) obj[k] = Math.min(100, Math.round(obj[k])); };
            Object.values(weekRisks).forEach(normalize);

            plan.push({
                week: w,
                risks: weekRisks,
                activeDrugs: activeDrugs.map(d => `${DB.substances.find(s=>s.id===d.substanceId)?.name} (${Math.round(d.currentConc)}мг)`),
                isOnCycle: w <= maxEndWeek
            });
        }
        return plan;
    },

    calculateFertilityIndex(data) {
        if (!data.volume || !data.conc) return 0;
        let score = (Math.min(1, data.volume/1.5)*15) + (Math.min(1, data.conc/16)*20) + (Math.min(1, (data.pr||0)/30)*25) + (Math.min(1, (data.morph||0)/4)*20);
        return Math.round(score * 100 / 80);
    }
};
