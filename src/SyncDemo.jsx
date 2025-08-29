// src/SyncDemo.jsx
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, limit } from "firebase/firestore";

export default function SyncDemo() {
  const [items, setItems] = useState([]);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const q = query(collection(db, "_syncTest"), orderBy("ts","desc"), limit(20));
    const off = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, err => console.error("onSnapshot", err));
    return off;
  }, []);

  const add = async () => {
    await addDoc(collection(db, "_syncTest"), { source: "web", nombre, ts: serverTimestamp() });
    setNombre("");
  };

  return (
    <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3>Prueba Firestore (en vivo)</h3>
      <input placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} />
      <button onClick={add} style={{ marginLeft: 8 }}>Guardar</button>
      <ul>
        {items.map(it => (
          <li key={it.id}>[{it.source}] {it.nombre ?? "(sin nombre)"} — {it.ts?.toDate?.()?.toLocaleString?.() ?? ""}</li>
        ))}
      </ul>
    </div>
  );
}