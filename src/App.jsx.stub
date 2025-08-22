// ---- STUBS TEMPORALES PARA PDF (no generan archivos) ----
class jsPDF {
  constructor() {
    this.lastAutoTable = { finalY: 0 };
  }
  text() {}
  save() {}
}
const autoTable = (doc, opts) => {
  try {
    if (doc && doc.lastAutoTable) {
      const startY = (opts && opts.startY) ? opts.startY : 30;
      doc.lastAutoTable.finalY = startY + 20;
    }
  } catch {}
};
// ----------------------------------------------------------

// export default React component
export default function App() {
  return (
    <main style={{ padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <h1>Crédito Express</h1>
      <p style={{ marginTop: 8 }}>
        Compilación lista. Exportación a PDF <strong>deshabilitada temporalmente</strong> (stubs activos).
      </p>

      <section style={{ marginTop: 24, padding: 12, border: "1px solid #e5e7eb", borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Notas</h2>
        <ol style={{ margin: 0, paddingLeft: 18 }}>
          <li>
            Cuando quieras reactivar PDF, instala versiones seguras:
            <pre style={{ background: "#f8fafc", padding: 8, borderRadius: 8, marginTop: 8 }}>
              {"npm i jspdf@3.0.1 jspdf-autotable@^3.8.4 --save-exact"}
            </pre>
          </li>
          <li style={{ marginTop: 8 }}>
            Luego elimina estos stubs y usa imports reales:
            <pre style={{ background: "#f8fafc", padding: 8, borderRadius: 8 }}>
              {'import { jsPDF } from "jspdf";\nimport autoTable from "jspdf-autotable";'}
            </pre>
          </li>
          <li style={{ marginTop: 8 }}>
            Tus funciones con <code>new jsPDF()</code>, <code>autoTable(...)</code> y <code>doc.save(...)</code> funcionarán de nuevo.
          </li>
        </ol>
      </section>
    </main>
  );
}
