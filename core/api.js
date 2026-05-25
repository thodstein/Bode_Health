export async function postJSON(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export const api = {
  profilecalculate: (payload) => postJSON("/api/profilecalculate", payload),
  nutritioncalculate: (payload) => postJSON("/api/nutritioncalculate", payload),
  trainingcalculate: (payload) => postJSON("/api/trainingcalculate", payload),
  supplementscalculate: (payload) => postJSON("/api/supplementscalculate", payload),
  dosagecalculate: (payload) => postJSON("/api/dosagecalculate", payload),
  correlationsevaluate: (payload) => postJSON("/api/correlationsevaluate", payload),
  aiinterpret: (payload) => postJSON("/api/aiinterpret", payload),
  labscalculate: (payload) => postJSON("/api/labscalculate", payload)
};