/**
 * Auth.jsx — Ranklify v9
 * Sign Up collects name, email, password, branch, city for richer peer cards
 */
import { useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";

const BRANCHES = [
  "Mechanical","Civil","Electrical","Computer",
  "Electronics","Chemical","IT","Textile",
  "Automobile","Production","Instrumentation",
];

export default function Auth() {
  const { signup, login } = useApp();
  const [tab,     setTab]     = useState("login");
  const [name,      setName]      = useState("");
  const [username,  setUsername]  = useState("");
  const [email,     setEmail]     = useState("");
  const [pass,      setPass]      = useState("");
  const [branch,    setBranch]    = useState("");
  const [city,      setCity]      = useState("");
  const [rankGoal,  setRankGoal]  = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  const fo = e => e.target.style.borderColor = "#4f8ef7";
  const bl = e => e.target.style.borderColor = "rgba(255,255,255,0.09)";

  const inp = {
    width:"100%", background:"rgba(255,255,255,0.05)",
    border:"1.5px solid rgba(255,255,255,0.09)", borderRadius:10,
    padding:"12px 16px", color:"#e2e2f0", fontSize:14,
    outline:"none", fontFamily:"inherit", boxSizing:"border-box",
    transition:"border-color 0.2s",
  };
  const sel = { ...inp, background:"#0a0a14", appearance:"none", cursor:"pointer" };
  const lbl = { fontSize:11, color:"#555", fontWeight:800, textTransform:"uppercase",
                letterSpacing:"0.06em", marginBottom:5, display:"block" };

  async function submit() {
    setErr("");
    if (!email || !pass)               { setErr("Email and password are required."); return; }
    if (tab==="signup" && !name)       { setErr("Full name is required."); return; }
    if (tab==="signup" && pass.length<6){ setErr("Password must be at least 6 characters."); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,350));
    const res = tab==="signup"
      ? signup(email, pass, name, { username: username.trim().toLowerCase().replace(/\s/g,""), branch, city, rankGoal })
      : login(email, pass);
    setLoading(false);
    if (res.error) setErr(res.error);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#050508", display:"flex", alignItems:"center",
                  justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      {/* glows */}
      <div style={{ position:"absolute",top:"-20%",left:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(79,142,247,0.12),transparent 70%)",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(168,85,247,0.10),transparent 70%)",pointerEvents:"none" }}/>

      <div style={{ background:"rgba(255,255,255,0.035)", backdropFilter:"blur(20px)",
                    border:"1px solid rgba(255,255,255,0.08)", borderRadius:22,
                    padding:"38px 44px", width:"100%", maxWidth:460, position:"relative", zIndex:1 }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center", marginBottom:6 }}>
          <div style={{ width:42,height:42,borderRadius:11,background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <polyline points="22,12 18,12 15,20 9,4 6,12 2,12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize:24,fontWeight:900,background:"linear-gradient(90deg,#4f8ef7,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Ranklify</span>
        </div>
        <div style={{ textAlign:"center",fontSize:12,color:"#444",marginBottom:26 }}>DDCET Rank Booster — Gujarat's #1 Peer Prep Platform</div>

        {/* Tabs */}
        <div style={{ display:"flex",background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3,marginBottom:22 }}>
          {["login","signup"].map(t=>(
            <button key={t} onClick={()=>{setTab(t);setErr("");}}
              style={{ flex:1,padding:"9px 0",borderRadius:8,border:"none",cursor:"pointer",fontSize:14,fontWeight:700,background:tab===t?"rgba(79,142,247,0.2)":"transparent",color:tab===t?"#7aadff":"#555",transition:"all 0.2s",fontFamily:"inherit" }}>
              {t==="login"?"Log In":"Sign Up"}
            </button>
          ))}
        </div>

        {err && (
          <div style={{ background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"10px 14px",color:"#f87171",fontSize:13,marginBottom:14 }}>
            {err}
          </div>
        )}

        {tab==="signup" && <>
          <label style={lbl}>Full Name *</label>
          <div style={{ marginBottom:14 }}>
            <input style={inp} placeholder="e.g. Rahul Patel" value={name} onChange={e=>setName(e.target.value)} onFocus={fo} onBlur={bl}/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
            <div>
              <label style={lbl}>Username *</label>
              <input style={inp} placeholder="e.g. rahul_patel" value={username} onChange={e=>setUsername(e.target.value)} onFocus={fo} onBlur={bl}/>
            </div>
            <div>
              <label style={lbl}>DDCET Rank Goal</label>
              <input style={inp} type="number" min="1" placeholder="e.g. 100" value={rankGoal} onChange={e=>setRankGoal(e.target.value)} onFocus={fo} onBlur={bl}/>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
            <div>
              <label style={lbl}>Branch</label>
              <select style={sel} value={branch} onChange={e=>setBranch(e.target.value)} onFocus={fo} onBlur={bl}>
                <option value="">Select…</option>
                {BRANCHES.map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>City</label>
              <input style={inp} placeholder="e.g. Surat" value={city} onChange={e=>setCity(e.target.value)} onFocus={fo} onBlur={bl}/>
            </div>
          </div>
        </>}

        <label style={lbl}>Email Address *</label>
        <div style={{ marginBottom:14 }}>
          <input style={inp} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onFocus={fo} onBlur={bl}/>
        </div>

        <label style={lbl}>Password *</label>
        <div style={{ position:"relative", marginBottom:20 }}>
          <input style={{...inp,paddingRight:46}} type={showPw?"text":"password"} placeholder={tab==="signup"?"Min 6 characters":"Your password"} value={pass}
            onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} onFocus={fo} onBlur={bl}/>
          <button onClick={()=>setShowPw(s=>!s)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#555",padding:2 }}>
            <Icon name={showPw?"eye_off":"eye"} size={16}/>
          </button>
        </div>

        <button style={{ width:"100%",padding:"13px",borderRadius:10,border:"none",cursor:"pointer",fontSize:15,fontWeight:700,background:"linear-gradient(135deg,#4f8ef7,#a855f7)",color:"#fff",letterSpacing:"0.02em",opacity:loading?0.7:1,fontFamily:"inherit" }}
          onClick={submit} disabled={loading}>
          {loading ? "Please wait…" : tab==="login" ? "Log In →" : "Create Account →"}
        </button>

        <div style={{ marginTop:16,padding:"10px 14px",background:"rgba(79,142,247,0.06)",border:"1px solid rgba(79,142,247,0.15)",borderRadius:9 }}>
          <div style={{ fontSize:11,color:"#555",lineHeight:1.7 }}>
            👥 <b style={{color:"#7aadff"}}>Peer Platform:</b> After signing up you'll appear in Explore Students — other DDCET aspirants can find and connect with you!
          </div>
        </div>

        <p style={{ textAlign:"center",color:"#555",fontSize:12,marginTop:16 }}>
          {tab==="login"?"No account? ":"Already have one? "}
          <span style={{ color:"#7aadff",cursor:"pointer",fontWeight:700 }} onClick={()=>{setTab(tab==="login"?"signup":"login");setErr("");}}>
            {tab==="login"?"Sign Up free":"Log In"}
          </span>
        </p>
      </div>
    </div>
  );
}
