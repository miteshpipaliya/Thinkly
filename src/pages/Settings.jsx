/**
 * Settings.jsx — Ranklify v9
 */
import { useState } from "react";
import { useApp } from "../context/AppContext";

const BRANCHES = [
  "Mechanical","Civil","Electrical","Computer",
  "Electronics","Chemical","IT","Textile",
  "Automobile","Production","Instrumentation",
];

export default function Settings() {
  const { user, completeSetup, darkMode, toggleDarkMode } = useApp();
  const [goal,   setGoal]   = useState(user?.profile?.goal   || "");
  const [branch, setBranch] = useState(user?.profile?.branch || "");
  const [saved,  setSaved]  = useState(false);

  const acc = goal && !isNaN(+goal) ? Math.min(100, Math.round(+goal/200*1000)/10) : 0;

  function save(){
    completeSetup({goal,branch,targetAcc:acc});
    setSaved(true); setTimeout(()=>setSaved(false),2500);
  }

  const T      = darkMode;
  const txt    = T?"#e2e2f0":"#111";
  const sub    = T?"#555":"#888";
  const cardBg = T?"rgba(255,255,255,0.03)":"#fff";
  const cardBr = T?"rgba(255,255,255,0.07)":"#e5e7eb";
  const inp    = {width:"100%",background:T?"rgba(255,255,255,0.05)":"#f9fafb",border:`1.5px solid ${T?"rgba(255,255,255,0.08)":"#e5e7eb"}`,borderRadius:10,padding:"11px 14px",color:txt,fontSize:14,outline:"none",fontFamily:"inherit"};
  const lbl    = {fontSize:11,color:sub,fontWeight:700,marginBottom:5,letterSpacing:"0.04em",textTransform:"uppercase",display:"block"};
  const fo     = e=>e.target.style.borderColor="#4f8ef7";
  const bl     = e=>e.target.style.borderColor=T?"rgba(255,255,255,0.08)":"#e5e7eb";

  return(
    <div style={{maxWidth:520}}>
      <div style={{fontSize:22,fontWeight:800,color:txt,marginBottom:24}}>Settings</div>

      {/* Appearance */}
      <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:14,padding:22,marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700,color:txt,marginBottom:16}}>Appearance</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:14,color:txt,fontWeight:600}}>{T?"🌙 Dark Mode":"☀️ Light Mode"}</div>
            <div style={{fontSize:12,color:sub,marginTop:2}}>Currently using {T?"dark":"light"} theme</div>
          </div>
          <div onClick={toggleDarkMode} style={{width:52,height:28,borderRadius:14,background:T?"linear-gradient(135deg,#4f8ef7,#a855f7)":"#ccc",cursor:"pointer",position:"relative",transition:"background 0.3s",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:T?26:3,width:22,height:22,borderRadius:"50%",background:"#fff",transition:"left 0.3s",boxShadow:"0 2px 6px rgba(0,0,0,0.3)"}}/>
          </div>
        </div>
      </div>

      {/* Update profile */}
      <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:14,padding:28,marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700,color:txt,marginBottom:20}}>Update Profile</div>
        <div style={{marginBottom:16}}>
          <label style={lbl}>Target Marks (out of 200)</label>
          <input style={inp} type="number" placeholder="e.g. 150" value={goal} onChange={e=>setGoal(e.target.value)} onFocus={fo} onBlur={bl}/>
          {acc>0&&<div style={{fontSize:12,color:"#4ade80",marginTop:5}}>Target Accuracy: {acc}%</div>}
        </div>
        <div style={{marginBottom:24}}>
          <label style={lbl}>Diploma Branch</label>
          <select style={{...inp,background:T?"#0d0d18":"#f9fafb",appearance:"none",cursor:"pointer"}} value={branch} onChange={e=>setBranch(e.target.value)} onFocus={fo} onBlur={bl}>
            <option value="">Select…</option>
            {BRANCHES.map(b=><option key={b}>{b}</option>)}
          </select>
        </div>
        <button onClick={save} style={{padding:"11px 24px",borderRadius:9,border:"none",cursor:"pointer",fontSize:14,fontWeight:700,background:saved?"rgba(74,222,128,0.15)":"linear-gradient(135deg,#4f8ef7,#a855f7)",color:saved?"#4ade80":"#fff",fontFamily:"inherit",transition:"all 0.3s"}}>
          {saved?"✓ Saved!":"Save Changes"}
        </button>
      </div>

      {/* Account */}
      <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:14,padding:22}}>
        <div style={{fontSize:14,fontWeight:700,color:txt,marginBottom:10}}>Account</div>
        <div style={{fontSize:13,color:sub,marginBottom:4}}>Email: <b style={{color:txt}}>{user?.email}</b></div>
        <div style={{fontSize:13,color:sub}}>Member since: <b style={{color:txt}}>{user?.createdAt?new Date(user.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}):"—"}</b></div>
      </div>
    </div>
  );
}
