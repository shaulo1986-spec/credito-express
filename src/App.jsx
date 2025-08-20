import React, { useMemo, useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const PASS = "Mraljebros2012";
const STORAGE_KEY = "cexpress_clients_v1";

const MXN = (n) => Number(n||0).toLocaleString("es-MX",{style:"currency",currency:"MXN"});
const fmt = (d) => new Date(d).toLocaleDateString("es-MX",{year:"2-digit",month:"2-digit",day:"2-digit"});
const freqDays = { diario:1, semanal:7, quincenal:14, mensual:30 };

const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]"); } catch { return []; } };
const save = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export default function App(){
  const [ok, setOk] = useState(false);
  const [pwd, setPwd] = useState("");
  const [empresa, setEmpresa] = useState({ nombre:"Crédito Express", leyenda:"Rápido, fácil y seguro." });
  const [items, setItems] = useState(load()); // clientes
  useEffect(()=>save(items),[items]);

  if(!ok){
    return (
      <div className="container">
        <div className="card" style={{maxWidth:380,margin:"60px auto"}}>
          <div style={{textAlign:"center"}}>
            <img src="/logo.png" alt="logo" className="logo" />
            <h2 style={{marginTop:10}}>Crédito Express</h2>
            <p className="muted">Acceso restringido</p>
          </div>
          <div className="row" style={{marginTop:10}}>
            <input className="input" type="password" placeholder="Contraseña" value={pwd} onChange={e=>setPwd(e.target.value)} style={{width:"100%"}}/>
            <button className="btn" onClick={()=> setOk(pwd===PASS ? true : (alert("Contraseña incorrecta"), false))} style={{width:"100%"}}>
              Entrar
            </button>
            <p className="muted" style={{marginTop:6}}>* Predeterminada: Mraljebros2012</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header>
        <div className="bar">
          <img src="/logo.png" className="logo" alt="logo" />
          <div style={{flex:1}}>
            <h1>{empresa.nombre}</h1>
            <div className="muted">{empresa.leyenda}</div>
          </div>
          <a className="btn outline" href="#" onClick={(e)=>{e.preventDefault(); setOk(false);}}>Cerrar sesión</a>
        </div>
      </header>

      <main className="container">
        <Stats items={items} />
        <div className="row" style={{marginTop:12}}>
          <ClientesForm onAdd={(c)=>setItems([c, ...items])} />
          <ClientesTable items={items} onUpdate={(u)=>setItems(items.map(x=>x.id===u.id?u:x))} onDelete={(id)=>setItems(items.filter(x=>x.id!==id))} empresa={empresa} />
        </div>

        <hr style={{borderColor:"#eee",margin:"18px 0"}}/>

        <Prestamo items={items} onSave={(c)=>setItems(items.map(x=>x.id===c.id?c:x))} empresa={empresa} />

        <hr style={{borderColor:"#eee",margin:"18px 0"}}/>

        <Pagos items={items} onSave={(c)=>setItems(items.map(x=>x.id===c.id?c:x))} empresa={empresa} />

        <div className="row" style={{justifyContent:"flex-end", marginTop:10}}>
          <button className="btn outline" onClick={()=>exportGeneralPDF(items, empresa)}>Estado general (PDF)</button>
        </div>

        <footer>
          Archivos estáticos: logo desde <code>/public/logo.png</code> · PDFs usan tu logo automáticamente.
        </footer>
      </main>
    </div>
  );
}

function Stats({ items }){
  let cap=0, tot=0, pag=0;
  for(const c of items){
    cap += Number(c.monto||0);
    tot += Number(c.totalPagar||0);
    pag += (c.abonos||[]).reduce((a,b)=>a+Number(b.monto||0),0);
  }
  const sal = Math.max(tot - pag, 0);
  return (
    <div className="row">
      <div className="stat" style={{flex:"1 1 200px"}}><div className="t">Capital prestado</div><div className="v">{MXN(cap)}</div></div>
      <div className="stat" style={{flex:"1 1 200px"}}><div className="t">Total a cobrar</div><div className="v">{MXN(tot)}</div></div>
      <div className="stat" style={{flex:"1 1 200px"}}><div className="t">Pagado</div><div className="v">{MXN(pag)}</div></div>
      <div className="stat" style={{flex:"1 1 200px"}}><div className="t">Saldo</div><div className="v">{MXN(sal)}</div></div>
    </div>
  );
}

function ClientesForm({ onAdd }){
  const [f, setF] = useState({ nombre:"", telefono:"" });
  return (
    <div className="card" style={{flex:"1 1 280px"}}>
      <h3>Nuevo cliente</h3>
      <div className="row">
        <input className="input" placeholder="Nombre" value={f.nombre} onChange={e=>setF({...f, nombre:e.target.value})} style={{flex:1}}/>
        <input className="input" placeholder="Teléfono 10 dígitos" value={f.telefono} onChange={e=>setF({...f, telefono:e.target.value})} style={{flex:1}}/>
      </div>
      <div className="row" style={{marginTop:8}}>
        <button className="btn" onClick={()=>{
          if(!f.nombre) return alert("Nombre requerido");
          onAdd({ id: crypto.randomUUID(), nombre:f.nombre, telefono:f.telefono, monto:0, tasaMensual:0, meses:0, frecuencia:"semanal", fechaInicio:new Date().toISOString(), pagos:[], totalPagar:0, abonos:[] });
          setF({nombre:"", telefono:""});
        }}>Agregar</button>
      </div>
    </div>
  );
}

function ClientesTable({ items, onUpdate, onDelete, empresa }){
  return (
    <div className="card" style={{flex:"2 1 480px"}}>
      <div className="row" style={{justifyContent:"space-between", alignItems:"center"}}>
        <h3 style={{margin:0}}>Clientes</h3>
        <span className="badge">{items.length} registros</span>
      </div>
      <table className="table" style={{marginTop:8}}>
        <thead><tr><th>Cliente</th><th>Teléfono</th><th>Monto</th><th>Saldo</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map(c=>{
            const pagado = (c.abonos||[]).reduce((a,b)=>a+Number(b.monto||0),0);
            const saldo = Math.max(Number(c.totalPagar||0) - pagado, 0);
            return (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.telefono}</td>
                <td>{MXN(c.monto||0)}</td>
                <td><b>{MXN(saldo)}</b></td>
                <td>
                  <button className="btn outline" onClick={()=>{
                    const nombre = prompt("Nombre", c.nombre) ?? c.nombre;
                    const telefono = prompt("Teléfono", c.telefono) ?? c.telefono;
                    onUpdate({...c, nombre, telefono});
                  }}>Editar</button>{" "}
                  <button className="btn outline" onClick={()=>estadoClientePDF(c, empresa)}>Estado PDF</button>{" "}
                  <button className="btn outline" onClick={()=>onDelete(c.id)} style={{borderColor:"var(--danger)", color:"var(--danger)"}}>Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Prestamo({ items, onSave, empresa }){
  const [id, setId] = useState(items[0]?.id || "");
  const cli = items.find(x=>x.id===id);
  const [monto, setMonto] = useState(2500);
  const [tasa, setTasa] = useState(11.5);
  const [meses, setMeses] = useState(3.5);
  const [freq, setFreq] = useState("semanal");
  const [inicio, setInicio] = useState(()=> new Date().toISOString().slice(0,10));

  const plan = useMemo(()=>{
    if(!cli) return null;
    const interestTotal = +(monto*(tasa/100)*meses).toFixed(2);
    const totalPagar = +(Number(monto)+interestTotal).toFixed(2);
    const nPagos = freq==="mensual" ? Math.round(meses) : Math.round((meses*30)/freqDays[freq]);
    const abono = +(totalPagar/Math.max(nPagos,1)).toFixed(2);
    let saldo = totalPagar;
    const pagos = [];
    let f = new Date(inicio);
    for(let i=0;i<nPagos;i++){
      if(i>0){ f.setDate(f.getDate()+freqDays[freq]); }
      saldo = +(saldo - abono).toFixed(2);
      pagos.push({ idx:i+1, fecha:new Date(f).toISOString(), abono, saldo: Math.max(saldo,0) });
    }
    return { interestTotal, totalPagar, nPagos, abono, pagos };
  }, [cli, monto, tasa, meses, freq, inicio]);

  return (
    <div className="card">
      <h3>Asignar préstamo</h3>
      <div className="row">
        <select className="select" value={id} onChange={e=>setId(e.target.value)}>
          <option value="">Selecciona cliente…</option>
          {items.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <input className="input" type="number" placeholder="Monto" value={monto} onChange={e=>setMonto(+e.target.value)} />
        <input className="input" type="number" placeholder="Tasa mensual (%)" value={tasa} onChange={e=>setTasa(+e.target.value)} />
        <input className="input" type="number" step="0.1" placeholder="Meses" value={meses} onChange={e=>setMeses(+e.target.value)} />
        <select className="select" value={freq} onChange={e=>setFreq(e.target.value)}>
          <option value="diario">Diario</option>
          <option value="semanal">Semanal</option>
          <option value="quincenal">Quincenal</option>
          <option value="mensual">Mensual</option>
        </select>
        <input className="input" type="date" value={inicio} onChange={e=>setInicio(e.target.value)} />
      </div>

      <div className="row" style={{marginTop:8}}>
        <button className="btn" disabled={!cli || !plan} onClick={()=>{
          const c = { ...cli, monto, tasaMensual:tasa, meses, frecuencia:freq, fechaInicio:new Date(inicio).toISOString(), pagos:plan.pagos, totalPagar:plan.totalPagar, abonos:[] };
          onSave(c);
          alert("Préstamo asignado y plan generado.");
        }}>Guardar préstamo</button>
        <button className="btn outline" disabled={!plan || !cli} onClick={()=>planPDF(cli.nombre, plan, empresa)}>Plan PDF</button>
      </div>

      <div style={{overflowX:"auto", marginTop:8}}>
        {!plan ? <div className="muted">Completa los datos para ver el plan…</div> : (
          <table className="table">
            <thead><tr><th>#</th><th>Fecha</th><th>Abono</th><th>Saldo</th></tr></thead>
            <tbody>
              {plan.pagos.map(p=>(
                <tr key={p.idx}><td>{p.idx}</td><td>{fmt(p.fecha)}</td><td>{MXN(p.abono)}</td><td>{MXN(p.saldo)}</td></tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan="4"><b>Total a pagar:</b> {MXN(plan.totalPagar)} · Pagos: {plan.nPagos}</td></tr></tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

function Pagos({ items, onSave, empresa }){
  const [id, setId] = useState(items[0]?.id || "");
  const cli = items.find(x=>x.id===id);
  const [monto, setMonto] = useState("");

  const pagado = useMemo(()=> (cli?.abonos||[]).reduce((a,b)=>a+Number(b.monto||0),0), [cli]);
  const saldo = useMemo(()=> Math.max(Number(cli?.totalPagar||0) - pagado, 0), [cli, pagado]);

  return (
    <div className="card">
      <h3>Registrar abono</h3>
      <div className="row">
        <select className="select" value={id} onChange={e=>setId(e.target.value)}>
          <option value="">Selecciona cliente…</option>
          {items.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <input className="input" type="number" placeholder="Monto" value={monto} onChange={e=>setMonto(e.target.value)} />
        <button className="btn" disabled={!cli || !monto} onClick={()=>{
          const ab = { id: crypto.randomUUID(), fecha: new Date().toISOString(), monto: Number(monto) };
          const up = { ...cli, abonos:[ab, ...(cli.abonos||[])] };
          onSave(up); setMonto("");
        }}>Guardar</button>
        <button className="btn outline" disabled={!cli || !monto} onClick={()=>{
          const tmp = { nombre:cli?.nombre, telefono:cli?.telefono, abono:Number(monto), saldo: Math.max(Number(cli?.totalPagar||0) - (pagado + Number(monto)), 0) };
          reciboPDF(tmp, empresa);
        }}>Recibo PDF</button>
        {cli && (
          <a className="btn outline" href={`https://wa.me/52${(cli.telefono||'').replace(/\\D/g,'')}?text=${encodeURIComponent(`Hola ${cli.nombre}, ${empresa.nombre} te recuerda tu pago de ${MXN(Number(monto)||0)}. Gracias.`)}`} target="_blank">WhatsApp</a>
        )}
      </div>

      <div style={{marginTop:8}}>
        {!cli ? <div className="muted">Selecciona un cliente…</div> : (
          <table className="table">
            <thead><tr><th>Fecha</th><th>Monto</th></tr></thead>
            <tbody>{(cli.abonos||[]).map(a=> <tr key={a.id}><td>{fmt(a.fecha)}</td><td>{MXN(a.monto)}</td></tr>)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// PDFs
function planPDF(nombre, plan, empresa){
  const doc = new jsPDF();
  try { doc.addImage("/logo.png", "PNG", 10, 6, 30, 18); } catch {}
  doc.setFontSize(14); doc.text(empresa.nombre, 44, 14);
  doc.setFontSize(10); doc.text(empresa.leyenda||"", 44, 19);
  doc.setFontSize(12); doc.text(`Plan de pagos – ${nombre}`, 14, 32);
  autoTable(doc, { startY: 36, head: [["#", "Fecha", "Abono", "Saldo"]], body: plan.pagos.map(p=>[p.idx, fmt(p.fecha), MXN(p.abono), MXN(p.saldo)]) });
  const y = doc.lastAutoTable.finalY + 6;
  doc.text(`Total a pagar: ${MXN(plan.totalPagar)} · Pagos: {plan.nPagos}`, 14, y);
  doc.save(`plan-${nombre}.pdf`);
}
function reciboPDF({ nombre, telefono, abono, saldo }, empresa){
  const doc = new jsPDF();
  try { doc.addImage("/logo.png", "PNG", 10, 6, 30, 18); } catch {}
  doc.setFontSize(14); doc.text(empresa.nombre, 44, 14);
  doc.setFontSize(10); doc.text(empresa.leyenda||"", 44, 19);
  doc.setFontSize(12); doc.text("Comprobante de pago", 14, 34);
  autoTable(doc, { startY: 40, body: [["Cliente", nombre],["Teléfono", telefono||""],["Fecha", fmt(new Date())],["Pago", MXN(abono)],["Saldo", MXN(saldo)]] });
  doc.save(`recibo-${nombre}.pdf`);
}
function estadoClientePDF(c, empresa){
  const doc = new jsPDF();
  try { doc.addImage("/logo.png", "PNG", 10, 6, 30, 18); } catch {}
  doc.setFontSize(14); doc.text(empresa.nombre, 44, 14);
  doc.setFontSize(10); doc.text(empresa.leyenda||"", 44, 19);
  doc.setFontSize(12); doc.text(`Estado de cuenta – ${c.nombre}`, 14, 32);
  autoTable(doc, { startY: 38, head: [["#", "Fecha", "Abono", "Saldo"]], body: (c.pagos||[]).map(p=>[p.idx, fmt(p.fecha), MXN(p.abono), MXN(p.saldo)]) });
  const pagado = (c.abonos||[]).reduce((a,b)=>a+Number(b.monto||0),0);
  const saldo = Math.max(Number(c.totalPagar||0) - pagado, 0);
  const y = doc.lastAutoTable.finalY + 6;
  doc.text(`Monto: ${MXN(c.monto||0)} · Total: ${MXN(c.totalPagar||0)}`, 14, y);
  doc.text(`Pagado: ${MXN(pagado)} · Saldo: ${MXN(saldo)}`, 14, y+6);
  doc.save(`estado-${c.nombre}.pdf`);
}
function exportGeneralPDF(items, empresa){
  const doc = new jsPDF();
  try { doc.addImage("/logo.png", "PNG", 10, 6, 30, 18); } catch {}
  doc.setFontSize(14); doc.text(empresa.nombre, 44, 14);
  doc.setFontSize(10); doc.text(empresa.leyenda||"", 44, 19);
  doc.setFontSize(12); doc.text("Balance general", 14, 32);
  autoTable(doc, { startY: 38, head: [["Cliente","Teléfono","Monto","Total","Pagado","Saldo"]],
    body: items.map(c=>{
      const pagado = (c.abonos||[]).reduce((a,b)=>a+Number(b.monto||0),0);
      const saldo = Math.max(Number(c.totalPagar||0) - pagado, 0);
      return [c.nombre, c.telefono, MXN(c.monto||0), MXN(c.totalPagar||0), MXN(pagado), MXN(saldo)];
    })
  });
  doc.save("balance-general.pdf");
}
