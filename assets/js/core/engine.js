const Engine = {
    // 2.1 PK/PD MODEL (Упрощенная 1-компартментная для JS, в проде Web Worker с RK4)
    calculateConcentration(drug, dose, timeHours, prevConc = 0) {
        const ka = 0.5; 
        const ke = Math.log(2) / (drug.halfLife * 24); 
        const vd = 50; 
        if (timeHours <= 0) return 0;
        const conc = (dose / vd) * (ka / (ka - ke)) * (Math.exp(-ke * timeHours) - Math.exp(-ka * timeHours));
        return Math.max(0, conc + prevConc * Math.exp(-ke * 1));
    },

    // 2.2 RAW RISK CALCULATION
    calculateRawRisks(stack) {
        let risks = {};
        for (let sys in DB.riskMatrixDefinition) {
            risks[sys] = {};
            DB.riskMatrixDefinition[sys].mechanisms.forEach(m => risks[sys][m] = 0);
        }

        stack.forEach(item => {
            const drug = DB.drugs.find(d => d.id === item.id);
            if (!drug) return;
            const doseFactor = (item.dose || 100) / 100; 

            if (drug.hepatotoxicity >= 4) { risks.liver.cholestasis += 20 * doseFactor; risks.liver.cytolysis += 15 * doseFactor; }
            if (drug.lipidImpact >= 4) { risks.cardio.dyslipidemia += 20 * doseFactor; risks.cardio.thrombosis += 10 * doseFactor; }
            if (drug.erythrocytosisRisk >= 4) { risks.hemato.erythrocytosis += 25 * doseFactor; risks.hemato.viscosity_high += 15 * doseFactor; }
            if (drug.neuroToxic) { risks.neuro.dopamine_imbalance += 20 * doseFactor; risks.neuro.glutamate_excitotoxicity += 10 * doseFactor; }
            if (drug.type === 'oral') { risks.liver.mitochondrial_dysfunction += 10 * doseFactor; }
            if (['gh', 'insulin', 'semaglutide'].includes(drug.id)) { risks.endo.insulin_resistance += 15 * doseFactor; }
            if (drug.progestinActivity >= 0.9) { risks.endo.prolactin_elevation += 10 * doseFactor; risks.repro.libido_crash += 5 * doseFactor; }
            if (drug.conversionE2 >= 0.3) { risks.endo.estrogen_dominance += 15 * doseFactor; risks.repro.gynecomastia += 10 * doseFactor; }
        });

        for (let sys in risks) {
            for (let m in risks[sys]) { risks[sys][m] = Math.min(100, Math.round(risks[sys][m])); }
        }
        return risks;
    },

    // 2.3 NET RISK CALCULATION
    calculateNetRisks(rawRisks, isSupportActive) {
        if (!isSupportActive) return rawRisks;
        let netRisks = JSON.parse(JSON.stringify(rawRisks));

        netRisks.liver.cholestasis = Math.floor(rawRisks.liver.cholestasis * 0.35);
        netRisks.liver.cytolysis = Math.floor(rawRisks.liver.cytolysis * 0.4);
        netRisks.cardio.hypertension = Math.floor(rawRisks.cardio.hypertension * 0.3);
        netRisks.cardio.tachycardia = Math.floor(rawRisks.cardio.tachycardia * 0.2);
        netRisks.cardio.dyslipidemia = Math.floor(rawRisks.cardio.dyslipidemia * 0.5);
        netRisks.hemato.viscosity_high = Math.floor(rawRisks.hemato.viscosity_high * 0.5);
        netRisks.hemato.erythrocytosis = Math.floor(rawRisks.hemato.erythrocytosis * 0.6);
        netRisks.neuro.dopamine_imbalance = Math.floor(rawRisks.neuro.dopamine_imbalance * 0.4);
        netRisks.neuro.glutamate_excitotoxicity = Math.floor(rawRisks.neuro.glutamate_excitotoxicity * 0.4);
        netRisks.endo.estrogen_dominance = Math.floor(rawRisks.endo.estrogen_dominance * 0.3);
        netRisks.endo.prolactin_elevation = Math.floor(rawRisks.endo.prolactin_elevation * 0.3);
        netRisks.endo.insulin_resistance = Math.floor(rawRisks.endo.insulin_resistance * 0.4);
        netRisks.repro.testicular_atrophy = Math.floor(rawRisks.repro.testicular_atrophy * 0.3);

        return netRisks;
    },

    // 2.4 FERTILITY INDEX (WHO 2021)
    calculateFertilityIndex(data) {
        const { volume, concentration, total, pr, morphology } = data;
        if (!volume || !concentration) return 0;
        let score = 0;
        score += Math.min(1, volume / 1.5) * 15;
        score += Math.min(1, concentration / 16) * 20;
        score += Math.min(1, (total || 0) / 39) * 10;
        score += Math.min(1, (pr || 0) / 30) * 25;
        score += Math.min(1, (morphology || 0) / 4) * 20;
        return Math.round(score);
    },

    // 2.5 INTEGRATED SCORE
    calculateIntegratedScore(netRisks) {
        let sum = 0, count = 0;
        for (let sys in netRisks) {
            for (let m in netRisks[sys]) { sum += netRisks[sys][m]; count++; }
        }
        return count === 0 ? 0 : Math.round(sum / count);
    }
};
