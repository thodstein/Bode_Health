const Engine = {
    // Расчет сырых рисков (Raw Risk) на основе стека
    calculateRawRisks(stack) {
        let risks = JSON.parse(JSON.stringify(DB.riskMatrix));
        
        stack.forEach(item => {
            const drug = DB.drugs.find(d => d.id === item.id);
            if (!drug) return;

            // Упрощенная логика влияния (в полной версии - формулы из ТЗ 13.1)
            if (drug.hepatotoxicity >= 4) risks.liver.cholestasis += 20;
            if (drug.lipidImpact >= 4) risks.cardio.lipids += 15;
            if (drug.erythrocytosisRisk >= 4) risks.hemato.erythrocytosis += 20;
            if (drug.neuroToxic) risks.neuro.dopamine += 25;
            if (drug.type === 'oral') risks.liver.cytolysis += 15;
            
            // ГР и Инсулин
            if (drug.id === 'gh' || drug.id === 'insulin') risks.endo.insulin_resist += 20;
        });

        // Нормализация до 100%
        for (let system in risks) {
            for (let mech in risks[system]) {
                risks[system][mech] = Math.min(100, risks[system][mech]);
            }
        }
        return risks;
    },

    // Расчет чистых рисков (Net Risk) с учетом поддержки
    calculateNetRisks(rawRisks, supportActive) {
        let netRisks = JSON.parse(JSON.stringify(rawRisks));
        
        // Логика снижения рисков от препаратов поддержки (ТЗ 13.2)
        if (supportActive) {
            // Печень: УДХК снижает холестаз на ~60%
            netRisks.liver.cholestasis = Math.floor(rawRisks.liver.cholestasis * 0.4);
            // Кардио: Телмисартан + Небилет снижают АГ на ~70%
            netRisks.cardio.htn = Math.floor(rawRisks.cardio.htn * 0.3);
            // Гемато: Пентоксифиллин снижает вязкость
            netRisks.hemato.rheology = Math.floor(rawRisks.hemato.rheology * 0.5);
            // Эндокринка: Берберин + ИА/ИП
            netRisks.endo.insulin_resist = Math.floor(rawRisks.endo.insulin_resist * 0.4);
            netRisks.endo.estrogen = Math.floor(rawRisks.endo.estrogen * 0.3);
        }
        return netRisks;
    },

    // Расчет индекса фертильности (ТЗ 18.2)
    calculateFertilityIndex(semenData) {
        const { volume, concentration, total, pr, morphology } = semenData;
        if (!volume || !concentration) return 0;
        
        let score = 0;
        score += Math.min(1, volume / 1.5) * 15;
        score += Math.min(1, concentration / 16) * 20;
        score += Math.min(1, total / 39) * 10;
        score += Math.min(1, pr / 30) * 25;
        score += Math.min(1, morphology / 4) * 20;
        
        // Штрафы (вязкость, MAR и т.д.) можно добавить позже
        return Math.round(score);
    }
};
