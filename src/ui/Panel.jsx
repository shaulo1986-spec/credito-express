// src/ui/Panel.jsx
import React from "react";

export default function Panel({ title, tone="grad-nuevo", onBack, actions, children }) {
  return (
    <div className={`page-wrap ${tone}`}>
      <div className="watermark" aria-hidden="true" />
      <header className="panel-header">
        <div className="brand">
          <img src="/logo.png" alt="Crédito Express" className="brand-logo" />
          <h1 className="brand-title">Crédito Express</h1>
        </div>
        <div className="header-actions">
          {onBack ? (<button className="btn btn-ghost" onClick={onBack}>← Volver</button>) : null}
          {actions}
        </div>
      </header>
      <main className="panel">
        {title ? <h2 className="panel-title">{title}</h2> : null}
        {children}
      </main>
    </div>
  );
}
