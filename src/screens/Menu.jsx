// src/screens/Menu.jsx
import React from "react";
import Panel from "../ui/Panel.jsx";

const items = [
  { key:"nuevo",    label:"Nuevo cliente",                icon:"👤➕", tone:"grad-nuevo" },
  { key:"prestamo", label:"Asignar préstamo",             icon:"💲",   tone:"grad-abono" },
  { key:"clientes", label:"Clientes",                     icon:"🗂️",   tone:"grad-clientes" },
  { key:"cobranza", label:"Cobranza",                     icon:"🧾",   tone:"grad-cobranza" },
  { key:"abono",    label:"Registrar abono",              icon:"➕💵", tone:"grad-abono" },
  { key:"edo-cli",  label:"Estado de cuenta por cliente", icon:"📄",   tone:"grad-edo" },
  { key:"edo-gen",  label:"Estado de cuenta general",     icon:"📊",   tone:"grad-edo" },
  { key:"vencidos", label:"Clientes con saldo vencido",   icon:"⚠️",   tone:"grad-cobranza" },
  { key:"buscar",   label:"Buscar cliente",               icon:"🔍",   tone:"grad-buscar" },
  { key:"pass",     label:"Cambiar contraseña",           icon:"🔒",   tone:"grad-clientes" },
];

export default function Menu({ onOpen }){
  return (
    <Panel title="Menú principal" tone="grad-clientes">
      <div className="menu-grid">
        {items.map(it => (
          <div key={it.key} className="menu-tile" onClick={()=>onOpen?.(it)}>
            <div className="menu-icon">{it.icon}</div>
            <div className="menu-label">{it.label}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
