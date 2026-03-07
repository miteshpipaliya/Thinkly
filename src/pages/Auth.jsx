import { useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";

const c = {
  page: { minHeight:"100vh", background:"#050508", display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" },
  glow1: { position:"absolute", top:"-20%", left:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(79,142,247,0.12) 0%,transparent 70%)", pointerEvents:"none" },
  glow2: { position:"absolute", bottom:"-20%", right:"-10%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(168,85,247,0.10) 0%,transparent 70%)", pointerEvents:"none" },
  card:  { background:"rgba(255,255,255,0.035)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"40px 44px", width:"100%", maxWidth:440, position:"relative", zIndex:1 },
  logo:  { display:"flex", alignItems:"center", gap:10, justifyContent:"center", marginBottom:32 },
  logoMark: { width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"#fff", fontFamily:"'Sora',sans-serif" },
  logoText: { fontSize:22, fontWeight:800, background:"linear-gradient(90deg,#4f8ef7,#a855f7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
  tagline: { fontSize:12, color:"#555", textAlign:"center", marginTop:-26, marginBottom:32 },
  tabs:  { display:"flex", background:"rgba(255,255,255,0.04)", borderRadius:10, padding:3, marginBottom:28 },
  tab:   (a) => ({ flex:1, padding:"9px 0", borderRadius:8, border:"none", cursor:"pointer", fontSize:14, fontWeight:600, background:a?"rgba(79,142,247,0.2)":"transparent", color:a?"#7aadff":"#666", transition:"all 0.2s" }),
  label: { fontSize:12, color:"#888", fontWeight:600, marginBottom:6, letterSpacing:"0.04em", textTransform:"uppercase" },
  inputWrap: { position:"relative", marginBottom:16 },
  input: { width:"100%", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", color:"#e2e2f0", fontSize:14, outline:"none", fontFamily:"inherit", transition:"border-color 0.2s" },
  eyeBtn: { position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#555", padding:2 },
  btn:   { width:"100%", padding:"13px", borderRadius:10, border:"none", cursor:"pointer", fontSize:15, fontWeight:700, background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", letterSpacing:"0.02em", transition:"opacity 0.2s", marginTop:4 },
  error: { background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, padding:"10px 14px", color:"#f87171", fontSize:13, marginBottom:16 },
};

export default function Auth() {
  const { signup, login } = useApp();
  const [tab, setTab]         = useState("login");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setErr("");
    if (!email || !pass) { setErr("Please fill all fields."); return; }
    if (tab === "signup" && !name) { setErr("Name is required."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const res = tab === "signup" ? signup(email, pass, name) : login(email, pass);
    setLoading(false);
    if (res.error) setErr(res.error);
  }

  return (
    <div style={c.page}>
      <div style={c.glow1} /><div style={c.glow2} />
      <div style={c.card}>
        <div style={c.logo}>
          <div style={c.logoMark}>R</div>
          <span style={c.logoText}>Ranklify</span>
        </div>
        <div style={c.tagline}>DDCET Rank Booster — Gujarat's #1 Prep Platform</div>

        <div style={c.tabs}>
          {["login","signup"].map(t => (
            <button key={t} style={c.tab(tab===t)} onClick={() => { setTab(t); setErr(""); }}>
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {err && <div style={c.error}>{err}</div>}

        {tab === "signup" && (
          <div>
            <div style={c.label}>Full Name</div>
            <div style={c.inputWrap}>
              <input style={c.input} placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
                onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)"}} />
            </div>
          </div>
        )}

        <div style={c.label}>Email Address</div>
        <div style={c.inputWrap}>
          <input style={c.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
            onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)"}} />
        </div>

        <div style={c.label}>Password</div>
        <div style={c.inputWrap}>
          <input style={{...c.input, paddingRight:44}} type={showPass?"text":"password"} placeholder="Min 6 characters" value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
            onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)"}} />
          <button style={c.eyeBtn} onClick={()=>setShowPass(s=>!s)}>
            <Icon name={showPass?"eye_off":"eye"} size={16} />
          </button>
        </div>

        <button style={{...c.btn, opacity:loading?0.7:1}} onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait…" : tab === "login" ? "Log In →" : "Create Account →"}
        </button>

        <p style={{ textAlign:"center", color:"#555", fontSize:12, marginTop:20 }}>
          {tab==="login" ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color:"#7aadff", cursor:"pointer" }} onClick={()=>{setTab(tab==="login"?"signup":"login");setErr("");}}>
            {tab==="login" ? "Sign Up" : "Log In"}
          </span>
        </p>
      </div>
    </div>
  );
}
