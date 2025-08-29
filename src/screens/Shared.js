// src/screens/Shared.js
import dayjs from "dayjs";

export function firstPaymentDate(fechaInicioISO, frecuencia){
  const base = dayjs(fechaInicioISO);
  const f = (frecuencia || "").toLowerCase();
  if (f.includes("diar")) return base.add(1, "day").toISOString();
  if (f.includes("seman")) return base.add(1, "week").toISOString();
  if (f.includes("quinc")) return base.add(15, "day").toISOString();
  return base.add(1, "month").toISOString(); // mensual
}
