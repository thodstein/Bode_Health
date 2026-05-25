# Architecture

## Layers
- Core: state, storage, calculations, rules, api.
- Modules: profile, nutrition, training, sleepStress, supplements, pharmaPeptides, dosage, correlation, alertsRisk, aiInterpretation, persistence, labs, joint, editor.
- Data: drugs, esters, supps, labs, rules.
- UI: index.html and lightweight event wiring.

## Principles
- One domain per module.
- All coefficients live in data files.
- Calculations are pure where possible.
- UI reads state and renders results.