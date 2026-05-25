const Engine = {
    /**
     * Расчет PK/PD концентраций (Упрощенная 2-компартментная модель для JS)
     * Возвращает среднюю концентрацию за неделю для каждого препарата
     */
    calculateConcentrations(stack) {
        const concentrations = {};
        stack.forEach(item => {
            const drug = DB.drugs.find(d => d.id === item.id);
            if (!drug) return;

            // Парсинг частоты (например "2р/нед" -> 2, "EOD" -> 3.5)
            let freqPerWeek = 1;
            if (item.freq.includes('р/нед')) freqPerWeek = parseFloat(item.freq);
            else if (item.freq.toLowerCase() === 'eod') freqPerWeek = 3.5;
            else if (item.freq.toLowerCase() === 'ed') freqPerWeek = 7;

            const dose = parseFloat(item.dose) || 0;
            const weeklyDose = dose * freqPerWeek;
            
            // Формула средней концентрации: (Dose * F) / (Cl * Tau)
            // Упрощенно: пропорционально дозе и обратно пропорционально периоду полувыведения
            // Чем меньше halfLife, тем быстрее выводится, нужна чаще вводка для стабильного уровня
            const stabilityFactor = Math.min(1, drug.halfLife / 7); 
            concentrations[item.id] = weeklyDose * stabilityFactor * 0.1; // 0.1 - масштабный коэффициент
        });
        return concentrations;
    },

    /**
     * Расчет RAW RISKS (Сырые риски)
     * Формула: Σ (Концентрация * Коэффициент токсичности препарата * Вес механизма)
     */
    calculateRawRisks(stack) {
        const concentrations = this.calculateConcentrations(stack);
        // Клонируем матрицу
        let risks = JSON.parse(JSON.stringify(DB.riskMatrix));

        stack.forEach(item => {
            const drug = DB.drugs.find(d => d.id === item.id);
            if (!drug) return;
            const conc = concentrations[item.id] || 0;

            // Печень
            if (drug.hepatotoxicity > 0) {
                const factor = drug.type === 'oral' ? 1.5 : 1.0; // Оралки токсичнее
                risks.liver.cholestasis += conc * drug.hepatotoxicity * factor * 2;
                risks.liver.cytolysis += conc * drug.hepatotoxicity * factor * 1.5;
                risks.liver氧化ative += conc * drug.hepatotoxicity * 1.0;
            }
            // Кардио
            if (drug.lipidImpact > 0) {
                risks.cardio.lipids += conc * drug.lipidImpact * 3;
                risks.cardio.endothelium += conc * drug.lipidImpact * 1.5;
            }
            if (drug.erythrocytosisRisk > 0) {
                risks.hemato.erythrocytosis += conc * drug.erythrocytosisRisk * 4;
                risks.hemato.rheology += conc * drug.erythrocytosisRisk * 2;
            }
            // Нейро (Тренболон, DHB)
            if (drug.neuroToxic) {
                risks.neuro.dopamine += conc * 5;
                risks.neuro.anxiety += conc * 4;
                risks.neuro.sleep += conc * 3;
            }
            // Пролактин (Нандролон, Тренболон)
            if (drug.prolactinRisk > 0) {
                risks.endo.prolactin += conc * drug.prolactinRisk * 5;
            }
            // Инсулинорезистентность (ГР, Инсулин)
            if (drug.insulinResistRisk > 0) {
                risks.endo.insulin_resist += conc * drug.insulinResistRisk * 6;
            }
            // Репродуктивная (подавление оси)
            if (drug.arAffinity > 100) {
                risks.repro.suppression += conc * 2;
                risks.repro.atrophy += conc * 3;
            }
        });

        // Нормализация до 100% и округление
        for (let sys in risks) {
            for (let mech in risks[sys]) {
                risks[sys][mech] = Math.min(100, Math.round(risks[sys][mech]));
            }
        }
        return risks;
    },

    /**
     * Расчет NET RISKS (Чистые риски)
     * Формула: RawRisk * (1 - Σ (Эффективность препарата поддержки * Флаг активности))
     */
    calculateNetRisks(rawRisks, supportActive) {
        if (!supportActive) return rawRisks;
        
        let netRisks = JSON.parse(JSON.stringify(rawRisks));
        const efficacy = DB.supportEfficacy;

        // Применяем коэффициенты снижения
        // Печень (УДХК)
        netRisks.liver.cholestasis = Math.round(rawRisks.liver.cholestasis * (1 - efficacy.udca.liver_cholestasis));
        netRisks.liver.cytolysis = Math.round(rawRisks.liver.cytolysis * (1 - efficacy.udca.liver_cytolysis));
        
        // Кардио (Телмисартан + Небилет + Таурин)
        let htnReduction = Math.max(efficacy.telmisartan.cardio_htn, efficacy.nebivolol.cardio_htn, efficacy.taurine.cardio_htn);
        netRisks.cardio.htn = Math.round(rawRisks.cardio.htn * (1 - htnReduction));
        
        netRisks.cardio.tachycardia = Math.round(rawRisks.cardio.tachycardia * (1 - efficacy.nebivolol.cardio_tachycardia));
        netRisks.cardio.arrhythmia = Math.round(rawRisks.cardio.arrhythmia * (1 - efficacy.taurine.cardio_arrhythmia));

        // Почки (Телмисартан + Астрагал)
        let kidneyReduction = Math.max(efficacy.telmisartan.kidney_hyperfiltration, efficacy.astragalus.kidney_fibrosis);
        netRisks.kidney.hyperfiltration = Math.round(rawRisks.kidney.hyperfiltration * (1 - kidneyReduction));
        netRisks.kidney.fibrosis = Math.round(rawRisks.kidney.fibrosis * (1 - efficacy.astragalus.kidney_fibrosis));

        // Гемато (Пентоксифиллин)
        netRisks.hemato.rheology = Math.round(rawRisks.hemato.rheology * (1 - efficacy.pentoxifylline.hemato_rheology));

        // Эндокринка (Берберин, Анастрозол, Каберголин)
        netRisks.endo.insulin_resist = Math.round(rawRisks.endo.insulin_resist * (1 - efficacy.berberine.endo_insulin_resist));
        netRisks.endo.estrogen = Math.round(rawRisks.endo.estrogen * (1 - efficacy.anastrozole.endo_estrogen));
        netRisks.endo.prolactin = Math.round(rawRisks.endo.prolactin * (1 - efficacy.cabergoline.endo_prolactin));

        // Репродуктивная (HCG)
        netRisks.repro.atrophy = Math.round(rawRisks.repro.atrophy * (1 - efficacy.hcg.repro_atrophy));

        return netRisks;
    },

    /**
     * Расчет Индекса Фертильности (WHO 2021) - ТЗ 18.2
     */
    calculateFertilityIndex(data) {
        const { volume, concentration, total, pr, morphology, ph, viscosity, mar, leukocytes, agglutination } = data;
        
        let score = 0;
        // Основные параметры (веса из ТЗ)
        if (volume) score += Math.min(1, volume / 1.5) * 15;
        if (concentration) score += Math.min(1, concentration / 16) * 20;
        if (total) score += Math.min(1, total / 39) * 10;
        if (pr) score += Math.min(1, pr / 30) * 25;
        if (morphology) score += Math.min(1, morphology / 4) * 20;
        
        // pH (бинарно)
        if (ph && ph >= 7.2 && ph <= 8.0) score += 10;
        else score += 8;

        // Штрафы
        let multiplier = 1.0;
        if (viscosity && viscosity === 'high') multiplier *= 0.95;
        if (mar && mar > 50) multiplier *= 0.90;
        if (leukocytes && leukocytes > 1) multiplier *= 0.85;
        if (agglutination) multiplier *= 0.80;

        return Math.round(score * multiplier);
    },

    /**
     * Расчет Trust Score (ТЗ 17.3)
     */
    calculateTrustScore(stats) {
        // stats: { diaryFillRate, nutritionAdherence, labConsistency, trainerRating }
        const fill = (stats.diaryFillRate || 0) * 20;
        const nutr = (stats.nutritionAdherence || 0) * 30;
        const lab = (stats.labConsistency || 0) * 30;
        const train = (stats.trainerRating || 0) * 20;
        
        return Math.min(100, Math.round(fill + nutr + lab + train));
    },

    /**
     * Прогноз Readiness (ARIMA mock для демо)
     */
    predictReadiness(history) {
        if (history.length < 3) return 50;
        const avg = history.reduce((a,b)=>a+b,0) / history.length;
        const trend = history[history.length-1] - history[0];
        return Math.min(100, Math.max(0, Math.round(avg + trend * 0.5)));
    }
};
