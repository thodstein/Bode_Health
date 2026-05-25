export const RULES = {
  v1: {
    pctDelayFactor: 5,
    cvPenaltyCap: 100,
    hepPenaltyCap: 100,
    defaultSupportLevel: "mid"
  }
};

export function getRules(version = "v1") {
  return RULES[version] || RULES.v1;
}