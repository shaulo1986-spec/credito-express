// src/AuthGate.jsx
import React, { useEffect, useState } from "react";
import Panel from "./ui/Panel.jsx";
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

export default function AuthGate({ children }) {
  const [user, setUser] = useState();
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [show,  setShow]  = useState(false);
  const [mode,  setMode]  = useState("signin"); // 'signin' | 'signup'
  const [loading, setLoading] = useState(true);
  const [err, setErr]   = useState("");

  useEffect(() => {
    const off = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return off;
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        await createUserWithEmailAndPassword(auth, email, pass);
      }
      setEmail("");
      setPass("");
    } catch (e) {
      setErr(e?.message || String(e));
    }
  };

  if (loading) return <div style={{padding:16, color:"#fff"}}>Cargando…</div>;

  return (
    <div>
      {/* Barra de estado */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:"#0b2555", color:"#fff", fontSize:12}}>
        <div>
          Estado: {user
            ? <>conectado <b>{user.email || "(sin email)"}</b></>
            : <b>no autenticado</b>}
        </div>
        <div style={{display:"flex", gap:8}}>
          {user ? (
            <button className="btn-ghost" onClick={()=>signOut(auth)}>Salir</button>
          ) : null}
        </div>
      </div>

      {/* Formulario SI no hay usuario */}
      {!user && (
        <Panel title="" tone="grad-clientes">
          <form onSubmit={onSubmit} style={{ display:"grid", gap:12 }}>
            <input className="input" type="email" placeholder="Correo" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            <div style={{position:"relative"}}>
              <input className="input" type={show?"text":"password"} placeholder="Contraseña" value={pass} onChange={(e)=>setPass(e.target.value)} required />
              <button type="button" className="btn-ghost" onClick={()=>setShow(s=>!s)} style={{position:"absolute", right:8, top:6, padding:"6px 8px"}}>
                {show ? "🙈" : "👁️"}
              </button>
            </div>
            {err && <div className="helper" style={{color:"#ffd2d2"}}>{err}</div>}
            <button className="btn btn-full" type="submit">{mode === "signin" ? "Entrar" : "Crear cuenta"}</button>
            <div className="helper" style={{marginTop:8}}>
              {mode === "signin" ? (
                <>¿No tienes cuenta? <button type="button" className="btn-ghost" onClick={()=>setMode("signup")}>Crear cuenta</button></>
              ) : (
                <>¿Ya tienes cuenta? <button type="button" className="btn-ghost" onClick={()=>setMode("signin")}>Inicia sesión</button></>
              )}
            </div>
          </form>
        </Panel>
      )}

      {/* Contenido de la App SOLO si hay usuario con email */}
      {user?.email ? children : null}
    </div>
  );
}
