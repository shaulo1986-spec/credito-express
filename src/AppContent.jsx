// src/AppContent.jsx
import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export default function AppContent() {
  // --- formulario nuevo cliente ---
 import React from "react";
import NuevoClientePanel from "./NuevoClientePanel.jsx";

export default function AppContent({ page }) {
  if (page === "nuevo") {
    return (
      <NuevoClientePanel title="Nuevo cliente">
        {/* Aquí pega todos los inputs del formulario */}
        <form>
          <div>
            <label>Nombre completo</label>
            <input type="text" className="input" placeholder="Nombre del cliente" />
          </div>

          <div>
            <label>Dirección</label>
            <input type="text" className="input" placeholder="Dirección" />
          </div>

          <div>
            <label>Teléfono</label>
            <input type="text" className="input" placeholder="Teléfono" />
          </div>

          <div>
            <label>Monto del crédito</label>
            <input type="number" className="input" placeholder="Monto" />
          </div>

          <div>
            <label>Tasa anual (%)</label>
            <input type="number" className="input" placeholder="Interés" />
          </div>

          <div>
            <label>Plazo (número de pagos)</label>
            <input type="number" className="input" placeholder="Plazo" />
          </div>

          <div>
            <label>Frecuencia de pago</label>
            <select className="input">
              <option value="diaria">Diaria</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>

          <div>
            <label>Fecha de inicio</label>
            <input type="date" className="input" />
          </div>

          <button className="btn btn-primary" style={{ marginTop: 12 }}>
            Guardar cliente
          </button>
        </form>
      </NuevoClientePanel>
    );
  }

  return <div>Selecciona una opción en el menú</div>;
}

  // --- listado ---
  const [clientes, setClientes] = useState([]);
  const uid = auth.currentUser?.uid || null;

  // Suscripción en vivo a los clientes del usuario
  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, "clientes"),
      where("owner", "==", uid),
      orderBy("createdAt", "desc")
    );
    const off = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setClientes(rows);
    });
    return off;
  }, [uid]);

  // Totales simples de la cabecera
  const totales = useMemo(() => {
    const prestado = clientes.reduce((acc, c) => acc + (Number(c.monto) || 0), 0);
    const saldo = clientes.reduce((acc, c) => acc + (Number(c.saldo) || 0), 0);
    return { prestado, saldo, pagado: Math.max(0, prestado - saldo) };
  }, [clientes]);

  async function handleAddCliente(e) {
    e.preventDefault();
    if (!auth.currentUser) return alert("Inicia sesión para continuar");
    if (!nombre.trim()) return alert("Escribe el nombre");

    try {
      setSaving(true);
      const nMonto = Number(monto) || 0;
      await addDoc(collection(db, "clientes"), {
        owner: auth.currentUser.uid,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        monto: nMonto,
        saldo: nMonto, // saldo inicial = monto inicial
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      // limpiar
      setNombre("");
      setTelefono("");
      setDireccion("");
      setMonto("");
    } catch (err) {
      console.error("Error al guardar cliente:", err);
      alert("No se pudo guardar: " + (err?.message || err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este cliente?")) return;
    try {
      await deleteDoc(doc(db, "clientes", id));
    } catch (err) {
      console.error("Eliminar cliente:", err);
      alert("No se pudo eliminar: " + (err?.message || err));
    }
  }

  async function handleInlineEdit(id, campo, valorActual) {
    const nuevo = prompt(`Nuevo ${campo}:`, valorActual ?? "");
    if (nuevo == null) return;
    try {
      await updateDoc(doc(db, "clientes", id), {
        [campo]: campo === "monto" || campo === "saldo" ? Number(nuevo) || 0 : nuevo,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Editar cliente:", err);
      alert("No se pudo editar: " + (err?.message || err));
    }
  }

  return (
    <div style={styles.wrap}>
      {/* CABECERA SIMPLE */}
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>Crédito Express</h1>
          <small>Rápido, fácil y seguro.</small>
        </div>
        <div style={styles.kpis}>
          <KPI label="Capital prestado" value={totales.prestado} />
          <KPI label="Pagado" value={totales.pagado} />
          <KPI label="Saldo" value={totales.saldo} />
        </div>
        <button onClick={() => auth.signOut()} style={styles.outBtn}>
          Cerrar sesión
        </button>
      </header>

      {/* NUEVO CLIENTE */}
      <section style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Nuevo cliente</h3>
        <form onSubmit={handleAddCliente} style={styles.formGrid}>
          <input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <input
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Monto inicial (opcional)"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Agregar"}
          </button>
        </form>
      </section>

      {/* LISTADO DE CLIENTES */}
      <section style={styles.card}>
        <div style={styles.listHeader}>
          <h3 style={{ margin: 0 }}>Clientes</h3>
          <small>{clientes.length} registro(s)</small>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Monto</th>
                <th>Saldo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>
                    Sin clientes. Agrega el primero arriba.
                  </td>
                </tr>
              ) : (
                clientes.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td>
                    <td>{c.telefono}</td>
                    <td>{c.direccion}</td>
                    <td>${Number(c.monto || 0).toFixed(2)}</td>
                    <td>${Number(c.saldo || 0).toFixed(2)}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        style={styles.smallBtn}
                        onClick={() => handleInlineEdit(c.id, "nombre", c.nombre)}
                      >
                        Editar nombre
                      </button>
                      <button
                        style={styles.smallBtn}
                        onClick={() => handleInlineEdit(c.id, "telefono", c.telefono)}
                      >
                        Editar teléfono
                      </button>
                      <button
                        style={{ ...styles.smallBtn, background: "#ffeaea", borderColor: "#f3b5b5" }}
                        onClick={() => handleDelete(c.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ---------- UI helpers ---------- */
function KPI({ label, value }) {
  return (
    <div style={styles.kpi}>
      <div style={{ fontSize: 12, color: "#667" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>${(Number(value) || 0).toFixed(2)}</div>
    </div>
  );
}

/* ---------- estilos inline simples ---------- */
const styles = {
  wrap: { maxWidth: 1100, margin: "18px auto", padding: "0 12px", fontFamily: "system-ui, Arial" },
  header: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  kpis: { display: "flex", gap: 10, alignItems: "stretch" },
  kpi: { border: "1px solid #e5e7eb", padding: 10, borderRadius: 8, minWidth: 160, background: "#fafafa" },
  outBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },
  card: { border: "1px solid #e5e7eb", padding: 12, borderRadius: 10, marginBottom: 16, background: "#fff" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 8,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  smallBtn: {
    padding: "6px 8px",
    border: "1px solid #ddd",
    borderRadius: 6,
    background: "#fff",
    cursor: "pointer",
    marginRight: 6,
  },
  listHeader: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 },
};
