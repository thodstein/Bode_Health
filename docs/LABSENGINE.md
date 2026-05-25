# Labs Engine

## Phases
- Baseline.
- On-cycle.
- PCT.

## Marker model
- id, name, unit, phase, systems, priority, frequencyWeeks, source.
- currentValue, baselineValue, delta, trend, riskScore.

## Logic
- Compare current against baseline where available.
- Increase frequency when phase or symptoms demand it.
- Prioritize liver, lipids, hematology, renal, endocrine, inflammation markers.
- Allow API mapping between external test codes and internal analyte codes.