import { useApp } from "../context/AppContext";

export default function Profile() {
  const { user, myResults, logout } = useApp();
  const mock = myResults.filter(r=>r.isMock);
  const best = mock.length ? Math.max(...mock.map(r=>r.score)) : "—";
  const avgAcc = myResults.length ? Math.round(myResults.reduce((a,r)=>a+(r.accuracy||0),0)/myResults.length) : 0;

  const s = {
    card: { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:24, marginBottom:16 },
    row:  { display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.05)", fontSize:14 },
    lbl:  { color:"#666" },
    val:  { color:"#ddd", fontWeight:500 },
  };

  return (
    <div style={{ maxWidth:640 }}>
      <div style={{ fontSize:22, fontWeight:800, color:"#e2e2f0", marginBottom:24 }}>My Profile</div>

      {/* Avatar */}
      <div style={s.card}>
        <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:20 }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:800, color:"#fff" }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:"#e2e2f0" }}>{user?.name}</div>
            <div style={{ color:"#666", fontSize:13 }}>{user?.email}</div>
          </div>
        </div>
        <div style={s.row}><span style={s.lbl}>Branch</span><span style={s.val}>{user?.profile?.branch || "—"}</span></div>
        <div style={s.row}><span style={s.lbl}>Target</span><span style={s.val}>{user?.profile?.goal || "—"}</span></div>
        <div style={s.row}><span style={s.lbl}>College Pref 1</span><span style={s.val}>{user?.profile?.college1 || "—"}</span></div>
        <div style={s.row}><span style={s.lbl}>College Pref 2</span><span style={{...s.val, color:user?.profile?.college2?"#ddd":"#444"}}>{user?.profile?.college2 || "Not set"}</span></div>
      </div>

      {/* Stats */}
      <div style={s.card}>
        <div style={{ fontSize:14, fontWeight:700, color:"#aaa", marginBottom:16 }}>Performance Summary</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[
            { l:"Tests Taken",  v:myResults.length, c:"#4f8ef7" },
            { l:"Best Score",   v:best,             c:"#4ade80" },
            { l:"Avg Accuracy", v:avgAcc+"%",        c:"#a855f7" },
          ].map(s=>(
            <div key={s.l} style={{ background:`${s.c}11`, border:`1px solid ${s.c}22`, borderRadius:10, padding:"14px", textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:11, color:"#666", marginTop:3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={logout} style={{ padding:"11px 24px", borderRadius:9, border:"1px solid rgba(239,68,68,0.3)", background:"rgba(239,68,68,0.08)", color:"#f87171", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
        Log Out
      </button>
    </div>
  );
}
