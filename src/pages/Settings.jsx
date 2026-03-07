import { useState } from "react";
import { useApp } from "../context/AppContext";

const BRANCHES = ["Mechanical","Civil","Electrical","Computer","Electronics","Chemical","Textile","Automobile","Production","Instrumentation"];

export default function Settings() {
  const { user, completeSetup, darkMode, toggleDarkMode } = useApp();
  const [goal,   setGoal]   = useState(user?.profile?.goal   || "");
  const [branch, setBranch] = useState(user?.profile?.branch || "");
  const [saved,  setSaved]  = useState(false);

  const targetAcc = goal && !isNaN(parseFloat(goal)) ? Math.min(100, Math.round(parseFloat(goal)/200*100*10)/10) : 0;

  function save() {
    completeSetup({ goal, branch, targetAcc });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const txt    = darkMode ? "#e2e2f0" : "#111";
  const sub    = darkMode ? "#666"    : "#888";
  const cardBg = darkMode ? "rgba(255,255,255,0.03)"  : "#fff";
  const cardBr = darkMode ? "rgba(255,255,255,0.07)"  : "#e5e7eb";
  const inp    = { width:"100%", background:darkMode?"rgba(255,255,255,0.05)":"#f9fafb", border:`1.5px solid ${darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}`, borderRadius:10, padding:"11px 14px", color:txt, fontSize:14, outline:"none", fontFamily:"inherit" };
  const lbl    = { fontSize:12, color:sub, fontWeight:600, marginBottom:6, letterSpacing:"0.04em", textTransform:"uppercase", display:"block" };

  return (
    <div style={{ maxWidth:520 }}>
      <div style={{ fontSize:22, fontWeight:800, color:txt, marginBottom:24 }}>Settings</div>

      {/* Dark / Light Mode Toggle */}
      <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:22, marginBottom:14 }}>
        <div style={{ fontSize:14, fontWeight:700, color:txt, marginBottom:16 }}>Appearance</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:14, color:txt, fontWeight:600 }}>{darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</div>
            <div style={{ fontSize:12, color:sub, marginTop:2 }}>Currently using {darkMode ? "dark" : "light"} theme</div>
          </div>
          {/* Toggle switch */}
          <div onClick={toggleDarkMode} style={{ width:52, height:28, borderRadius:14, background:darkMode?"linear-gradient(135deg,#4f8ef7,#a855f7)":"#ccc", cursor:"pointer", position:"relative", transition:"background 0.3s", flexShrink:0 }}>
            <div style={{ position:"absolute", top:3, left:darkMode?26:3, width:22, height:22, borderRadius:"50%", background:"#fff", transition:"left 0.3s", boxShadow:"0 2px 6px rgba(0,0,0,0.3)" }} />
          </div>
        </div>
      </div>

      {/* Profile */}
      <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:28, marginBottom:14 }}>
        <div style={{ fontSize:14, fontWeight:700, color:txt, marginBottom:20 }}>Update Profile</div>

        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Target Marks (out of 200)</label>
          <input style={inp} type="number" placeholder="e.g. 150" value={goal} onChange={e=>setGoal(e.target.value)}
            onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor=darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}} />
          {targetAcc > 0 && <div style={{ fontSize:12, color:"#4ade80", marginTop:5 }}>Target Accuracy: {targetAcc}%</div>}
        </div>

        <div style={{ marginBottom:24 }}>
          <label style={lbl}>Diploma Branch</label>
          <select style={{ ...inp, background:darkMode?"#0d0d18":"#f9fafb", appearance:"none", cursor:"pointer" }} value={branch} onChange={e=>setBranch(e.target.value)}>
            <option value="">Select...</option>
            {BRANCHES.map(b=><option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <button onClick={save} style={{ padding:"11px 24px", borderRadius:9, border:"none", cursor:"pointer", fontSize:14, fontWeight:700, background:saved?"rgba(74,222,128,0.15)":"linear-gradient(135deg,#4f8ef7,#a855f7)", color:saved?"#4ade80":"#fff", fontFamily:"inherit", transition:"all 0.3s" }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:22 }}>
        <div style={{ fontSize:14, fontWeight:700, color:txt, marginBottom:8 }}>Account</div>
        <div style={{ fontSize:13, color:sub }}>Email: {user?.email}</div>
      </div>
    </div>
  );
}
