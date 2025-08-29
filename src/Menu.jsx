import React from "react";

const items = [
  { key:"nuevo",       label:"Nuevo cliente",             icon:"👤➕",    grad:"grad-nuevo" },
  { key:"asignar",     label:"Asignar préstamo",          icon:"💲",      grad:"grad-asignar" },
  { key:"clientes",    label:"Clientes",                  icon:"📂",      grad:"grad-clientes" },
  { key:"cobranza",    label:"Cobranza",                  icon:"💰⏰",    grad:"grad-cobranza" },
  { key:"abono",       label:"Registrar abono",           icon:"➕💳",    grad:"grad-nuevo" },
  { key:"edoCliente",  label:"Estado de cuenta (cliente)",icon:"📄👤",    grad:"grad-asignar" },
  { key:"edoGral",     label:"Estado de cuenta general",  icon:"📊",      grad:"grad-clientes" },
  { key:"vencidos",    label:"Clientes con saldo vencido",icon:"⚠️",      grad:"grad-cobranza" },
  { key:"buscar",      label:"Buscar cliente",            icon:"🔎",      grad:"grad-nuevo" },
  { key:"pass",        label:"Cambiar contraseña",        icon:"🔐",      grad:"grad-clientes" },
];

export default function Menu({ onSelect }) {
  return (
    <div style={{padding:"12px 18px 26px"}}>
      <div className="menu-grid">
        {items.map(it=>(
          <div key={it.key} className={`menu-card ${it.grad}`} onClick={()=>onSelect?.(it.key)}>
            <div className="menu-icon">{it.icon}</div>
            <div style={{fontWeight:700}}>{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
