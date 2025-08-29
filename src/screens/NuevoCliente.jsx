// src/screens/NuevoCliente.jsx
import React, { useState } from "react";
import Panel from "../ui/Panel.jsx";
import { firstPaymentDate } from "./Shared.js";

export default function NuevoCliente({ onBack, onSave }){
  const [form, setForm] = useState({
    nombre:"", direccion:"", telefono:"",
    monto:"", tasa:"", plazo:"",
    frecuencia:"semanal", fechaInicio: new Date().toISOString().slice(0,10)
  });

  function upd(k, v){ setForm({...form, [k]:v}); }

  function submit(e){
    e.preventDefault();
    const fp = firstPaymentDate(form.fechaInicio, form.frecuencia);
    onSave?.({ ...form, primerPagoISO: fp });
  }

  return (
    <Panel title="Nuevo cliente" tone="grad-nuevo" onBack={onBack}>
      <form onSubmit={submit} style={{display:"grid", gap:12}}>
        <div className="row">
          <input className="input" placeholder="Nombre completo" value={form.nombre} onChange={e=>upd('nombre', e.target.value)} required />
          <input className="input" placeholder="Dirección" value={form.direccion} onChange={e=>upd('direccion', e.target.value)} />
        </div>
        <div className="row">
          <input className="input" placeholder="Teléfono" value={form.telefono} onChange={e=>upd('telefono', e.target.value)} />
          <input className="input" placeholder="Monto del crédito" type="number" min="0" value={form.monto} onChange={e=>upd('monto', e.target.value)} required/>
        </div>
        <div className="row">
          <input className="input" placeholder="Tasa anual %" type="number" min="0" step="0.01" value={form.tasa} onChange={e=>upd('tasa', e.target.value)} />
          <input className="input" placeholder="Plazo (número de pagos)" type="number" min="1" value={form.plazo} onChange={e=>upd('plazo', e.target.value)} />
        </div>
        <div className="row">
          <select className="select" value={form.frecuencia} onChange={e=>upd('frecuencia', e.target.value)}>
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="quincenal">Quincenal</option>
            <option value="mensual">Mensual</option>
          </select>
          <input className="date" type="date" value={form.fechaInicio} onChange={e=>upd('fechaInicio', e.target.value)} />
        </div>
        <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
          <button type="button" className="btn-ghost" onClick={onBack}>Cancelar</button>
          <button type="submit" className="btn">Guardar cliente</button>
        </div>
        <div className="helper">* Primer pago se calculará automáticamente según la frecuencia, a partir de la fecha de inicio.</div>
      </form>
    </Panel>
  );
}
