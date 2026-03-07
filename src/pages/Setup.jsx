/**
 * Setup.jsx — Ranklify
 * Shown once after first signup / login (when setupDone is false).
 * Collects: Username (@handle), Target Marks, Branch, City, DDCET Rank Goal.
 * Branch & City are ONLY asked here — never on the login/signup screen.
 */
import { useState } from "react";
import { useApp } from "../context/AppContext";

const BRANCHES = [
  "Mechanical","Civil","Electrical","Computer",
  "Electronics","Chemical","IT","Textile",
  "Automobile","Production","Instrumentation",
];

export default function Setup() {
  const { completeSetup, user } = useApp();

  const [username, setUsername] = useState(user?.socialProfile?.username || "");
  const [goal,     setGoal]     = useState(user?.profile?.goal   || "");
  const [branch,   setBranch]   = useState(user?.profile?.branch || "");
  const [city,     setCity]     = useState(user?.socialProfile?.city || "");
  const [rankGoal, setRankGoal] = useState(user?.socialProfile?.ddcetRank || "");
  const [err,      setErr]      = useState("");

  const acc = goal && !isNaN(+goal)
    ? Math.min(100, Math.round(+goal / 200 * 1000) / 10) : 0;

  function submit() {
    setErr("");
    if (!username.trim()) { setErr("Username is required."); return; }
    if (!goal || !branch)  { setErr("Please fill target marks and branch."); return; }
    if (isNaN(+goal))      { setErr("Enter a valid number for target marks."); return; }
    if (+goal > 200)       { setErr("Max marks is 200."); return; }

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    completeSetup({
      goal, branch, city, targetAcc: acc,
      username: cleanUsername,
      ddcetRank: rankGoal,
    });
  }

  const bg  = "#050508";
  const inp = { width:"100%",background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.09)",borderRadius:10,padding:"12px 16px",color:"#e2e2f0",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border-color 0.2s" };
  const sel = { ...inp,background:"#0a0a14",appearance:"none",cursor:"pointer" };
  const lbl = { fontSize:11,color:"#555",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5,display:"block" };
  const fo  = e => e.target.style.borderColor = "#4f8ef7";
  const bl  = e => e.target.style.borderColor = "rgba(255,255,255,0.09)";

  return (
    <div style={{ minHeight:"100vh",background:bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"-20%",right:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(79,142,247,0.1),transparent 70%)",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:"-20%",left:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(168,85,247,0.08),transparent 70%)",pointerEvents:"none" }}/>

      <div style={{ background:"rgba(255,255,255,0.035)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:22,padding:"40px 44px",width:"100%",maxWidth:500,position:"relative",zIndex:1 }}>

        {/* Logo */}
        <div style={{ display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:20 }}>
          <div style={{ width:42,height:42,borderRadius:11,background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <polyline points="22,12 18,12 15,20 9,4 6,12 2,12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize:22,fontWeight:900,background:"linear-gradient(90deg,#4f8ef7,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Ranklify</span>
        </div>

        <div style={{ fontSize:21,fontWeight:900,color:"#e2e2f0",marginBottom:4 }}>Welcome, {user?.name?.split(" ")[0]}! 👋</div>
        <div style={{ color:"#555",fontSize:13,marginBottom:24,lineHeight:1.7 }}>
          Complete your profile to appear in Explore Students and connect with peers.
        </div>

        {err && (
          <div style={{ background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,padding:"10px 14px",color:"#f87171",fontSize:13,marginBottom:16 }}>
            {err}
          </div>
        )}

        {/* Username with @ prefix */}
        <label style={lbl}>Username *</label>
        <div style={{ position:"relative", marginBottom:16 }}>
          <div style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#4f8ef7",fontSize:15,fontWeight:800,pointerEvents:"none",userSelect:"none" }}>@</div>
          <input
            style={{ ...inp, paddingLeft:30 }}
            placeholder="your_handle"
            value={username}
            onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,""))}
            onFocus={fo} onBlur={bl}
          />
        </div>

        {/* Target Marks */}
        <label style={lbl}>Target Marks (out of 200) *</label>
        <div style={{ marginBottom:12 }}>
          <input style={inp} type="number" min="0" max="200" placeholder="e.g. 150"
            value={goal} onChange={e=>setGoal(e.target.value)} onFocus={fo} onBlur={bl}/>
        </div>

        {acc > 0 && (
          <div style={{ background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.2)",borderRadius:10,padding:"11px 15px",marginBottom:16 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
              <span style={{ fontSize:12,color:"#888" }}>Target Accuracy</span>
              <span style={{ fontSize:20,fontWeight:900,color:"#4ade80" }}>{acc}%</span>
            </div>
            <div style={{ height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden" }}>
              <div style={{ height:"100%",width:`${acc}%`,background:"linear-gradient(90deg,#4ade80,#22d3ee)",borderRadius:3,transition:"width 0.3s" }}/>
            </div>
            <div style={{ fontSize:11,color:"#555",marginTop:4 }}>{goal} marks = {acc}% accuracy needed</div>
          </div>
        )}

        {/* Branch + City */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
          <div>
            <label style={lbl}>Diploma Branch *</label>
            <select style={sel} value={branch} onChange={e=>setBranch(e.target.value)} onFocus={fo} onBlur={bl}>
              <option value="">Select…</option>
              {BRANCHES.map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Your City</label>
            <input style={inp} placeholder="e.g. Surat" value={city}
              onChange={e=>setCity(e.target.value)} onFocus={fo} onBlur={bl}/>
          </div>
        </div>

        {/* DDCET Rank Goal */}
        <div style={{ marginBottom:20 }}>
          <label style={lbl}>DDCET Rank Goal <span style={{color:"#444",textTransform:"none",fontWeight:400}}>(optional)</span></label>
          <input style={inp} type="number" min="1" placeholder="e.g. 100"
            value={rankGoal} onChange={e=>setRankGoal(e.target.value)} onFocus={fo} onBlur={bl}/>
        </div>

        <button
          style={{ width:"100%",padding:"13px",borderRadius:10,border:"none",cursor:"pointer",fontSize:15,fontWeight:700,background:"linear-gradient(135deg,#4f8ef7,#a855f7)",color:"#fff",fontFamily:"inherit" }}
          onClick={submit}>
          Start Preparing →
        </button>
      </div>
    </div>
  );
}
