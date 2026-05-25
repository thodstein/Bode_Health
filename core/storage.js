const KEY = "neurocalculatorprogramv611";

export function saveState(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadState() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearState() {
  localStorage.removeItem(KEY);
}