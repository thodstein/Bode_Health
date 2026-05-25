# Dosage Engine

## Entities
- Substance: id, name, type, form, concentration, vial volume, conversion.
- DoseRequest: substance, target dose, mode, bodyweight, syringe type, rounding.
- DoseResponse: absolute dose, volume, divisions, doses per vial, flags.

## Behavior
- Support mg, IU, mg/kg, IU/kg.
- Detect invalid input and syringe overflow.
- Round to syringe step.
- Return technical flags for edge cases.