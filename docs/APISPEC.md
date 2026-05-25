# API Spec

## POST /api/profilecalculate
Input: profile payload.
Output: profile metrics.

## POST /api/nutritioncalculate
Input: calories, macros, diet type.
Output: BMR, TDEE, macro targets.

## POST /api/trainingcalculate
Input: training goal, load, recovery.
Output: split, volume, MRR.

## POST /api/supplementscalculate
Input: current stack, support strategy.
Output: suggested supplements and rationale.

## POST /api/dosagecalculate
Input: DoseRequest.
Output: DoseResponse.

## POST /api/correlationsevaluate
Input: health, nutrition, training, labs.
Output: correlation signals.

## POST /api/aiinterpret
Input: summarized state.
Output: explanation and next actions.

## POST /api/labscalculate
Input: labs, phase, baseline history.
Output: flags, trends, priorities.