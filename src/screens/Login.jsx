// src/screens/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import Panel from "../ui/Panel.jsx";

export default function Login({ onSuccess }){
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [show, setShow]   = useState(false);
  const [err, setErr]     = useState("");

  async function submit(e){
    e.preventDefault();
    setErr("");
    try{
      await signInWithEmailAndPassword(auth, email, pass);
      onSuccess?.();
    }catch(ex){ setErr(ex.message || "Error al iniciar sesión"); }
  }

  return (
    <Panel title="" tone="grad-clientes">
      <form onSubmit={submit} style={{display:"grid", gap:12}}>
        <input className="input" type="email" placeholder="Correo"
               value={email} onChange={e=>setEmail(e.target.value)} required />
        <div style={{position:"relative"}}>
          <input className="input" type={show?'text':'password'} placeholder="Contraseña"
                 value={pass} onChange={e=>setPass(e.target.value)} required />
          <button type="button" className="btn-ghost"
                  onClick={()=>setShow(s=>!s)}
                  style={{position:'absolute', right:8, top:6, padding:'6px 8px'}}>
            {show ? '🙈' : '👁️'}
          </button>
        </div>
        {err && <div className="helper" style={{color:'#ffd2d2'}}>{err}</div>}
        <button className="btn btn-full" type="submit">Iniciar sesión</button>
      </form>
    </Panel>
  );
}
