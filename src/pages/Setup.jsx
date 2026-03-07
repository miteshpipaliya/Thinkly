import { useState } from "react";
import { useApp } from "../context/AppContext";

const BRANCHES = ["Mechanical","Civil","Electrical","Computer","Electronics","Chemical","Textile","Automobile","Production","Instrumentation"];

const s = {
  page: { minHeight:"100vh", background:"#050508", display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" },
  g1: { position:"absolute", top:"-20%", right:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(79,142,247,0.1) 0%,transparent 70%)", pointerEvents:"none" },
  g2: { position:"absolute", bottom:"-20%", left:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(168,85,247,0.08) 0%,transparent 70%)", pointerEvents:"none" },
  card: { background:"rgba(255,255,255,0.035)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"40px 44px", width:"100%", maxWidth:460, position:"relative", zIndex:1 },
  step: { display:"flex", alignItems:"center", gap:8, marginBottom:28 },
  stepNum: (a) => ({ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, background:a?"linear-gradient(135deg,#4f8ef7,#a855f7)":"rgba(255,255,255,0.06)", color:a?"#fff":"#555" }),
  stepLine: { flex:1, height:1, background:"rgba(255,255,255,0.06)" },
  h1: { fontSize:22, fontWeight:800, color:"#e2e2f0", marginBottom:6 },
  sub: { color:"#666", fontSize:13, marginBottom:28, lineHeight:1.6 },
  label: { fontSize:12, color:"#888", fontWeight:600, marginBottom:6, letterSpacing:"0.04em", textTransform:"uppercase" },
  wrap: { marginBottom:18 },
  input: { width:"100%", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", color:"#e2e2f0", fontSize:14, outline:"none", fontFamily:"inherit", transition:"border-color 0.2s" },
  select: { width:"100%", background:"#0d0d18", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", color:"#e2e2f0", fontSize:14, outline:"none", fontFamily:"inherit", appearance:"none", cursor:"pointer" },
  btn: { width:"100%", padding:"13px", borderRadius:10, border:"none", cursor:"pointer", fontSize:15, fontWeight:700, background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", marginTop:8 },
  err: { background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"10px 14px", color:"#f87171", fontSize:13, marginBottom:16 },
};

export default function Setup() {
  const { completeSetup, user } = useApp();
  const [form, setForm] = useState({ goal:"", branch:"" });
  const [err, setErr] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function submit() {
    if (!form.goal || !form.branch) {
      setErr("Please fill all required fields.");
      return;
    }
    completeSetup(form);
  }

  return (
    <div style={s.page}>
      <div style={s.g1} />
      <div style={s.g2} />
      <div style={s.card}>
        <div style={s.step}>
          <div style={s.stepNum(true)}>1</div>
          <div style={s.stepLine} />
          <div style={s.stepNum(true)}>2</div>
          <div style={s.stepLine} />
          <div style={s.stepNum(false)}>3</div>
        </div>

        <div style={s.h1}>Welcome, {user?.name?.split(" ")[0]}! 👋</div>
        <div style={s.sub}>
          Tell us about your DDCET goals so we can personalize your preparation.
        </div>

        {err && <div style={s.err}>{err}</div>}

        <div style={s.wrap}>
          <div style={s.label}>DDCET Target Marks / Rank Goal</div>
          <input
            style={s.input}
            placeholder="e.g. 300+ marks or Top 500 rank"
            value={form.goal}
            onChange={e => set("goal", e.target.value)}
            onFocus={e => { e.target.style.borderColor = "#4f8ef7"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
        </div>

        <div style={s.wrap}>
          <div style={s.label}>Current Diploma Branch</div>
          <select
            style={s.select}
            value={form.branch}
            onChange={e => set("branch", e.target.value)}
          >
            <option value="">Select branch...</option>
            {BRANCHES.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <button style={s.btn} onClick={submit}>
          Save and Start Preparing
        </button>
      </div>
    </div>
  );
}
