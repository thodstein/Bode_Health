const Engine = {
    // Расчет концентрации вещества на конкретной неделе
    calculateConcentration: function(halfLife, startWeek, endWeek, currentWeek) {
        if (currentWeek < startWeek) return 0;
        
        // Фаза набора (во время курса)
        if (currentWeek <= endWeek) {
            // Время от начала приема
            const weeksOn = currentWeek - startWeek;
            // Коэффициент накопления (упрощенно, достигает 1 за ~5 периодов полувыведения)
            const accumulation = 1 - Math.exp(-0.693 * weeksOn / (halfLife / 7));
            return Math.min(1, accumulation);
        } 
        // Фаза выведения (после курса)
        else {
            const weeksOff = currentWeek - endWeek;
            const decay = Math.exp(-0.693 * weeksOff / (halfLife / 7));
            // Берем концентрацию на момент конца курса (примерно 1) и умножаем на распад
            return Math.max(0, decay);
        }
    },

    // Генерация полного плана курса
    generatePlan: function(stack) {
        if (!stack || stack.length === 0) return [];

        // Определяем длительность прогноза
        let maxEndWeek = 0;
        let maxHalfLife = 1;
        
        stack.forEach(item => {
            if (item.end > maxEndWeek) maxEndWeek = item.end;
            const ester = DB.esters[item.sub]?.find(e => e.id === item.est);
            const hl = ester ? ester.hl : 1;
            if (hl > maxHalfLife) maxHalfLife = hl;
        });

        // Прогнозируем еще +5 периодов полувыведения самого долгого эфира после курса
        const totalWeeks = Math.ceil(maxEndWeek + (maxHalfLife / 7) * 5);
        const plan = [];

        for (let w = 1; w <= totalWeeks; w++) {
            // Инициализация матрицы рисков нулями
            let weekRisks = {};
            for (let sys in DB.risks) {
                weekRisks[sys] = {};
                DB.risks[sys].forEach(m => weekRisks[sys][m.id] = 0);
            }

            // Расчет вклада каждого препарата
            stack.forEach(item => {
                const ester = DB.esters[item.sub]?.find(e => e.id === item.est);
                const halfLife = ester ? ester.hl : 1;
                
                // Текущая концентрация (0..1)
                const concentration = this.calculateConcentration(halfLife, item.start, item.end, w);

                if (concentration > 0.01) {
                    const substance = DB.substances.find(s => s.id === item.sub);
                    if (!substance) return;

                    const tox = substance.tox;
                    // Нагрузка = Концентрация * (Доза / 100мг базового уровня)
                    const load = concentration * (item.dose / 100);

                    // Распределение токсичности по механизмам (весовые коэффициенты из ТЗ)
                    
                    // Печень
                    weekRisks.liver.chol += tox.liver * 3 * load;
                    weekRisks.liver.ox += tox.liver * 2 * load;
                    weekRisks.liver.cyt += tox.liver * 2.5 * load;
                    
                    // Кардио
                    weekRisks.cardio.lip += tox.lipid * 3 * load;
                    weekRisks.cardio.htn += tox.lipid * 1.5 * load;
                    weekRisks.cardio.thr += tox.lipid * 1.2 * load;
                    weekRisks.cardio.lv h += tox.lipid * 1 * load;

                    // Кровь
                    weekRisks.hemato.ery += tox.hct * 4 * load;
                    weekRisks.hemato.visc += tox.hct * 3.5 * load;

                    // Нейро
                    weekRisks.neuro.dop += tox.neuro * 5 * load;
                    weekRisks.neuro.glu += tox.neuro * 2 * load;

                    // Почки
                    weekRisks.kidney.hyper += tox.kid * 3 * load;
                    weekRisks.kidney.fib_k += tox.kid * 2 * load;

                    // Эндо
                    weekRisks.endo.ins += tox.endo * 3 * load;
                    weekRisks.endo.est += tox.endo * 2 * load;

                    // Репро
                    weekRisks.repro.sup += tox.repro * 5 * load;
                    weekRisks.repro.atr += tox.repro * 4.5 * load;
                }
            });

            // Нормализация (обрезаем всё, что выше 100%)
            for (let sys in weekRisks) {
                for (let mech in weekRisks[sys]) {
                    weekRisks[sys][mech] = Math.min(100, Math.round(weekRisks[sys][mech]));
                }
            }

            plan.push({ week: w, risks: weekRisks });
        }

        return plan;
    },

    // Получить цвет для heatmap
    getRiskColor: function(value) {
        if (value < 20) return '#4caf50'; // Зеленый
        if (value < 40) return '#8bc34a'; // Светло-зеленый
        if (value < 60) return '#ffeb3b'; // Желтый
        if (value < 80) return '#ff9800'; // Оранжевый
        return '#f44336'; // Красный
    },

    // Расчет индекса фертильности (WHO 2021 упрощенный)
    calculateFertilityIndex: function(data) {
        if (!data.volume || !data.concentration) return 0;
        let score = 0;
        score += Math.min(1, data.volume / 1.5) * 15;
        score += Math.min(1, data.concentration / 16) * 20;
        score += Math.min(1, (data.total || 0) / 39) * 10;
        score += Math.min(1, (data.pr || 0) / 30) * 25;
        score += Math.min(1, (data.morphology || 0) / 4) * 20;
        return Math.round(score * 100 / 90); // Нормализация к ~100
    }
};
