import { useApp } from "../context/AppContext";
import { SUBJECTS, getDaysRemaining } from "../data/subjects";

export default function Dashboard({ setPage }) {
  const { user, myResults, checklist } = useApp();
  const days = getDaysRemaining();

  const totalChapters  = SUBJECTS.reduce((a, s) => a + s.chapters.length, 0);
  const doneChapters   = Object.values(checklist).filter(Boolean).length;
  const mockTests      = myResults.filter(r => r.isMock);
  const bestMock       = mockTests.length ? Math.max(...mockTests.map(r => r.score)) : 0;
  const avgAcc         = myResults.length ? Math.round(myResults.reduce((a, r) => a + (r.accuracy || 0), 0) / myResults.length) : 0;

  const c = {
    h1:     { fontSize:24, fontWeight:800, color:"#e2e2f0", marginBottom:4 },
    sub:    { color:"#666", fontSize:14, marginBottom:28 },
    grid3:  { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:14, marginBottom:28 },
    stat:   (col) => ({ background:"rgba(255,255,255,0.03)", border:`1px solid ${col}22`, borderRadius:14, padding:"20px 22px" }),
    statN:  (col) => ({ fontSize:32, fontWeight:800, color:col, marginBottom:2 }),
    statL:  { fontSize:12, color:"#666" },
    card:   { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:22, marginBottom:16 },
    h2:     { fontSize:15, fontWeight:700, color:"#ccc", marginBottom:16 },
    btn:    (col="#4f8ef7") => ({ padding:"9px 18px", borderRadius:9, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, background:`${col}22`, color:col, fontFamily:"inherit", transition:"all 0.2s" }),
    pbar:   { height:5, borderRadius:3, background:"rgba(255,255,255,0.06)", overflow:"hidden" },
    pfill:  (pct, col) => ({ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${col},${col}aa)`, borderRadius:3, transition:"width 0.5s" }),
  };

  const quickActions = [
    { label:"Start Mock Test",      color:"#4f8ef7", action:()=>setPage("mock-tests") },
    { label:"Practice Subjects",    color:"#a855f7", action:()=>setPage("subjects")   },
    { label:"View Revision List",   color:"#22d3ee", action:()=>setPage("checklist")  },
    { label:"Leaderboard",          color:"#fbbf24", action:()=>setPage("leaderboard")},
  ];

  return (
    <div>
      <div style={c.h1}>Good day, {user?.name?.split(" ")[0]} 👋</div>
      <div style={c.sub}>{user?.profile?.branch} · Target: {user?.profile?.goal}</div>

      {/* Stats */}
      <div style={c.grid3}>
        {[
          { n:`${days}`, l:"Days to DDCET", col:"#fb923c" },
          { n:`${doneChapters}/${totalChapters}`, l:"Chapters Revised", col:"#22d3ee" },
          { n:myResults.length, l:"Tests Attempted", col:"#a855f7" },
          { n:`${bestMock}`, l:"Best Mock Score", col:"#4f8ef7" },
          { n:`${avgAcc}%`, l:"Avg Accuracy", col:"#4ade80" },
          { n:mockTests.length, l:"Mock Tests Done", col:"#f472b6" },
        ].map(s => (
          <div key={s.l} style={c.stat(s.col)}>
            <div style={c.statN(s.col)}>{s.n}</div>
            <div style={c.statL}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={c.card}>
        <div style={c.h2}>Quick Actions</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {quickActions.map(a => (
            <button key={a.label} style={c.btn(a.color)} onClick={a.action}>{a.label} →</button>
          ))}
        </div>
      </div>

      {/* Subject progress */}
      <div style={c.card}>
        <div style={c.h2}>Syllabus Progress</div>
        {SUBJECTS.map(subj => {
          const total = subj.chapters.length;
          const done  = subj.chapters.filter(ch => checklist[`${subj.id}-${ch}`]).length;
          return (
            <div key={subj.id} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:13, color:"#ccc" }}>{subj.icon} {subj.name}</span>
                <span style={{ fontSize:12, color:subj.color }}>{done}/{total}</span>
              </div>
              <div style={c.pbar}><div style={c.pfill(done/total*100, subj.color)} /></div>
            </div>
          );
        })}
      </div>

      {/* Recent results */}
      {myResults.length > 0 && (
        <div style={c.card}>
          <div style={c.h2}>Recent Attempts</div>
          {myResults.slice(0,5).map(r => (
            <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:"#ddd" }}>{r.title}</div>
                <div style={{ fontSize:11, color:"#555" }}>{r.isMock?"Mock Test":"Unit Test"}</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:(r.accuracy||0)>=70?"rgba(74,222,128,0.12)":"rgba(239,68,68,0.12)", color:(r.accuracy||0)>=70?"#4ade80":"#f87171", border:`1px solid ${(r.accuracy||0)>=70?"rgba(74,222,128,0.2)":"rgba(239,68,68,0.2)"}` }}>
                  {r.accuracy}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
