export const state = {
  profile: {},
  nutrition: {},
  training: {},
  sleepStress: {},
  supplements: {},
  pharmaPeptides: {},
  dosage: {},
  correlation: {},
  alertsRisk: {},
  aiInterpretation: {},
  persistence: {},
  labs: {},
  joint: {},
  editor: {},
  stack: [],
  activeSupplements: [],
  selectedSymptoms: [],
  weeklyData: null,
  nutritionSettings: {
    servings: 1,
    portionMode: "perServing",
    includeMissing: false,
    accuracyMode: "approximate"
  },
  supportStrategy: "mid",
  ruleVersion: "v1"
};

export function setStatePatch(patch) {
  Object.assign(state, patch);
  return state;
}