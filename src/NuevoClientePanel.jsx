import React from "react";

export default function NuevoClientePanel({ children, title = "Nuevo cliente" }) {
  return (
    <section className="glass grad-nuevo" style={{ padding: 18 }}>
      <header
        className="row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          color: "#fff",
        }}
      >
        <div className="row" style={{ gap: 8 }}>
          <span style={{ fontSize: "1.3rem" }}>👤➕</span>
          <strong>{title}</strong>
        </div>
      </header>

      {/* Aquí se insertará el contenido del formulario */}
      {children}
    </section>
  );
}