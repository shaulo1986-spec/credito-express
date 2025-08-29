// src/utils/safeDoc.js
// Quita undefined, convierte strings numéricos a número, y deja null si viene vacío.
export function cleanDoc(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj ?? {})) {
    if (v === undefined) continue;                 // Firestore rechaza undefined
    if (v === "") { out[k] = null; continue; }     // mejor null que string vacío
    if (typeof v === "string" && /^[0-9]+(\.[0-9]+)?$/.test(v)) {
      out[k] = Number(v);                          // "2500" -> 2500
      continue;
    }
    out[k] = v;
  }
  return out;
}