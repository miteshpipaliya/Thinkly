import { useState } from "react";
import { useApp } from "../context/AppContext";

const BRANCHES = ["Mechanical","Civil","Electrical","Computer","Electronics","Chemical","Textile","Automobile","Production","Instrumentation"];

export default function Settings() {
  const { user, completeSetup } = useApp();
  const [goal, setGoal]     = useState(user?.profile?.goal || "");
  const [branch, setBranch] = useState(user?.profile?.branch || "");
  const [saved, setSaved]   = useState(false);

  function save() {
    completeSetup({ goal, branch });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inp = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"11px 14px", color:"#e2e2f0", fontSize:14, outline:"none", fontFamily:"inherit" };
  const lbl = { fontSize:12, color:"#666", fontWeight:600, marginBottom:6, letterSpacing:"0.04em", textTransform:"uppercase", display:"block" };

  return (
    <div style={{ maxWidth:520 }}>
      <div style={{ fontSize:22, fontWeight:800, color:"#e2e2f0", marginBottom:24 }}>Settings</div>
      <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:28 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#aaa", marginBottom:20 }}>Update Profile</div>
        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Target Marks / Rank</label>
          <input style={inp} value={goal} onChange={e=>setGoal(e.target.value)}
            onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)"}} />
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={lbl}>Diploma Branch</label>
          <select style={{ ...inp, background:"#0d0d18", appearance:"none", cursor:"pointer" }} value={branch} onChange={e=>setBranch(e.target.value)}>
            <option value="">Select…</option>
            {BRANCHES.map(b=><option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <button onClick={save}
          style={{ padding:"11px 24px", borderRadius:9, border:"none", cursor:"pointer", fontSize:14, fontWeight:700, background:saved?"rgba(74,222,128,0.15)":"linear-gradient(135deg,#4f8ef7,#a855f7)", color:saved?"#4ade80":"#fff", fontFamily:"inherit", transition:"all 0.3s" }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:22, marginTop:14 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"#aaa", marginBottom:8 }}>Account</div>
        <div style={{ fontSize:13, color:"#555" }}>Email: {user?.email}</div>
        <div style={{ fontSize:12, color:"#444", marginTop:6 }}>To delete your account, clear your browser data.</div>
      </div>
    </div>
  );
}
