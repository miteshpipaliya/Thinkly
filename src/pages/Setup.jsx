import { useState } from "react";
import { useApp } from "../context/AppContext";

const BRANCHES = ["Mechanical","Civil","Electrical","Computer","Electronics","Chemical","Textile","Automobile","Production","Instrumentation"];

export default function Setup() {
  const { completeSetup, user } = useApp();
  const [goal, setGoal]     = useState("");
  const [branch, setBranch] = useState("");
  const [err, setErr]       = useState("");

  const targetAcc = goal ? Math.min(100, Math.round(parseFloat(goal) / 400 * 100 * 10) / 10) : 0;

  function submit() {
    if (!goal || !branch) { setErr("Please fill all fields."); return; }
    if (isNaN(parseFloat(goal))) { setErr("Please enter a valid marks number."); return; }
    completeSetup({ goal, branch, targetAcc });
  }

  const dark = {
    page:   { minHeight:"100vh", background:"#050508", display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" },
    glow1:  { position:"absolute", top:"-20%", right:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(79,142,247,0.1) 0%,transparent 70%)", pointerEvents:"none" },
    glow2:  { position:"absolute", bottom:"-20%", left:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(168,85,247,0.08) 0%,transparent 70%)", pointerEvents:"none" },
    card:   { background:"rgba(255,255,255,0.035)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"40px 44px", width:"100%", maxWidth:460, position:"relative", zIndex:1 },
    label:  { fontSize:12, color:"#888", fontWeight:600, marginBottom:6, letterSpacing:"0.04em", textTransform:"uppercase" },
    wrap:   { marginBottom:18 },
    input:  { width:"100%", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", color:"#e2e2f0", fontSize:14, outline:"none", fontFamily:"inherit", transition:"border-color 0.2s" },
    select: { width:"100%", background:"#0d0d18", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", color:"#e2e2f0", fontSize:14, outline:"none", fontFamily:"inherit", appearance:"none", cursor:"pointer" },
    btn:    { width:"100%", padding:"13px", borderRadius:10, border:"none", cursor:"pointer", fontSize:15, fontWeight:700, background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", marginTop:8 },
    err:    { background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"10px 14px", color:"#f87171", fontSize:13, marginBottom:16 },
  };

  return (
    <div style={dark.page}>
      <div style={dark.glow1} /><div style={dark.glow2} />
      <div style={dark.card}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center", marginBottom:28 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize:22, fontWeight:800, background:"linear-gradient(90deg,#4f8ef7,#a855f7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Ranklify</span>
        </div>

        <div style={{ fontSize:20, fontWeight:800, color:"#e2e2f0", marginBottom:4 }}>Welcome, {user?.name?.split(" ")[0]}! 👋</div>
        <div style={{ color:"#666", fontSize:13, marginBottom:24, lineHeight:1.6 }}>Set your DDCET target to personalize your preparation.</div>

        {err && <div style={dark.err}>{err}</div>}

        <div style={dark.wrap}>
          <div style={dark.label}>Target Marks (out of 400)</div>
          <input style={dark.input} type="number" placeholder="e.g. 300" value={goal}
            onChange={e => setGoal(e.target.value)}
            onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)"}} />
        </div>

        {/* Target Accuracy Preview */}
        {goal && !isNaN(parseFloat(goal)) && (
          <div style={{ background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:10, padding:"12px 16px", marginBottom:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ fontSize:12, color:"#888" }}>Target Accuracy</span>
              <span style={{ fontSize:18, fontWeight:800, color:"#4ade80" }}>{targetAcc}%</span>
            </div>
            <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${targetAcc}%`, background:"linear-gradient(90deg,#4ade80,#22d3ee)", borderRadius:3 }} />
            </div>
            <div style={{ fontSize:11, color:"#555", marginTop:5 }}>Based on {goal} marks out of 400</div>
          </div>
        )}

        <div style={dark.wrap}>
          <div style={dark.label}>Current Diploma Branch</div>
          <select style={dark.select} value={branch} onChange={e => setBranch(e.target.value)}>
            <option value="">Select branch...</option>
            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <button style={dark.btn} onClick={submit}>Save and Start Preparing →</button>
      </div>
    </div>
  );
}
