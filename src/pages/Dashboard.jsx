import { useState } from "react";
import { useApp } from "../context/AppContext";
import { SUBJECTS, getDaysRemaining } from "../data/subjects";

export default function Dashboard({ setPage }) {
  const { user, myResults, checklist, addMockResult, deleteMockResult } = useApp();
  const days = getDaysRemaining();

  // Only REAL mock tests (isMock = true, not unit tests)
  const mockTests   = myResults.filter(r => r.isMock);
  const bestMock    = mockTests.length ? Math.max(...mockTests.map(r => r.score)) : 0;
  const avgScore    = mockTests.length ? Math.round(mockTests.reduce((a,r)=>a+(r.score||0),0)/mockTests.length*10)/10 : 0;
  const avgAcc      = mockTests.length ? Math.round(mockTests.reduce((a,r)=>a+(r.accuracy||0),0)/mockTests.length) : 0;
  const targetMarks = user?.profile?.goal ? parseInt(user.profile.goal) || 165 : 165;
  const targetAcc   = Math.round(targetMarks/200*100*10)/10;

  // Add mock result modal state
  const [showAdd, setShowAdd]     = useState(false);
  const [mockName, setMockName]   = useState("");
  const [mockScore, setMockScore] = useState("");
  const [mockTotal, setMockTotal] = useState("200");
  const [addErr, setAddErr]       = useState("");

  function handleAddMock() {
    setAddErr("");
    if (!mockName.trim()) { setAddErr("Please enter a test name."); return; }
    const score = parseFloat(mockScore);
    const total = parseFloat(mockTotal) || 200;
    if (isNaN(score) || score < 0) { setAddErr("Please enter a valid score."); return; }
    if (score > total) { setAddErr("Score cannot be greater than total marks."); return; }
    const accuracy = Math.round(score/total*100);
    addMockResult({
      title: mockName.trim(),
      isMock: true,
      score,
      total,
      correct: Math.round(score/2),
      wrong: 0,
      unanswered: 0,
      accuracy,
      isManual: true,
      date: new Date().toLocaleDateString("en-IN"),
    });
    setMockName(""); setMockScore(""); setMockTotal("200");
    setShowAdd(false);
  }

  const c = {
    h1:    { fontSize:24, fontWeight:800, color:"#e2e2f0", marginBottom:4 },
    sub:   { color:"#666", fontSize:14, marginBottom:24 },
    card:  { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:22, marginBottom:16 },
    h2:    { fontSize:15, fontWeight:700, color:"#ccc", marginBottom:16 },
    btn:   (col="#4f8ef7") => ({ padding:"9px 18px", borderRadius:9, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, background:`${col}22`, color:col, fontFamily:"inherit", transition:"all 0.2s" }),
    pbar:  { height:5, borderRadius:3, background:"rgba(255,255,255,0.06)", overflow:"hidden" },
    pfill: (pct, col) => ({ height:"100%", width:`${Math.min(pct,100)}%`, background:`linear-gradient(90deg,${col},${col}aa)`, borderRadius:3, transition:"width 0.5s" }),
    inp:   { background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:9, padding:"10px 13px", color:"#e2e2f0", fontSize:13, outline:"none", fontFamily:"inherit", width:"100%" },
  };

  const statCards = [
    { l:"Target Marks",    v:`${targetMarks}`,    sub:"/200",           c:"#4f8ef7" },
    { l:"Target Accuracy", v:`${targetAcc}%`,      sub:"",               c:"#a855f7" },
    { l:"Avg Marks",       v:`${avgScore}`,        sub:`${mockTests.length} mocks`, c:"#22d3ee" },
    { l:"Avg Accuracy",    v:`${avgAcc}%`,         sub:"",               c:"#4ade80" },
  ];

  const perfMsg = avgAcc < 60 ? { msg:"Average accuracy below 60%. Focus on core concepts!", col:"#fb923c" }
                : avgAcc < 75 ? { msg:"Good progress! Push harder on weak chapters.", col:"#fbbf24" }
                : { msg:"Excellent! Keep maintaining this performance.", col:"#4ade80" };

  return (
    <div>
      <div style={c.h1}>Good day, {user?.name?.split(" ")[0]} 👋</div>
      <div style={c.sub}>{user?.profile?.branch} · Target: {user?.profile?.goal}</div>

      {/* Target vs Performance stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:12, marginBottom:16 }}>
        {statCards.map(s => (
          <div key={s.l} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${s.c}22`, borderRadius:13, padding:"18px 20px" }}>
            <div style={{ fontSize:11, color:"#555", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>{s.l}</div>
            <div style={{ fontSize:28, fontWeight:800, color:s.c }}>{s.v}</div>
            {s.sub && <div style={{ fontSize:11, color:"#555", marginTop:3 }}>{s.sub}</div>}
            <div style={{ height:3, background:"rgba(255,255,255,0.05)", borderRadius:2, marginTop:10, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${Math.min(avgAcc,100)}%`, background:`linear-gradient(90deg,${s.c},${s.c}88)`, borderRadius:2, transition:"width 0.5s" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Alert */}
      {mockTests.length > 0 && (
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 18px", background:`${perfMsg.col}10`, border:`1px solid ${perfMsg.col}30`, borderRadius:10, marginBottom:16 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:perfMsg.col, flexShrink:0 }} />
          <span style={{ fontSize:13, color:perfMsg.col }}>{perfMsg.msg}</span>
        </div>
      )}

      {/* Mock Test Results Table */}
      <div style={c.card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={c.h2}>📊 Mock Results</div>
          <button onClick={() => setShowAdd(true)}
            style={{ padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", fontSize:12, fontWeight:700, fontFamily:"inherit" }}>
            + Add Result
          </button>
        </div>

        {mockTests.length === 0 ? (
          <div style={{ textAlign:"center", color:"#444", padding:"24px 0", fontSize:13 }}>
            No mock results yet. Take a mock test or add your coaching result above.
          </div>
        ) : (
          <>
            {/* Sort header */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 80px 90px 90px 100px 40px", gap:8, padding:"8px 12px", background:"rgba(255,255,255,0.04)", borderRadius:8, marginBottom:8, fontSize:11, color:"#555", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>
              <span>Mock Name</span><span>Marks</span><span>Accuracy</span><span>Date</span><span>Performance</span><span></span>
            </div>
            {mockTests.map((r, i) => {
              const perf = (r.accuracy||0) >= 75 ? { l:"Excellent", c:"#4ade80" }
                         : (r.accuracy||0) >= 60 ? { l:"Good",      c:"#fbbf24" }
                         : (r.accuracy||0) >= 40 ? { l:"Average",   c:"#fb923c" }
                         : { l:"Really Bad", c:"#f87171" };
              return (
                <div key={r.id||i} style={{ display:"grid", gridTemplateColumns:"1fr 80px 90px 90px 100px 40px", gap:8, padding:"12px 12px", borderBottom:"1px solid rgba(255,255,255,0.04)", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:"#ddd" }}>{r.title}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:"#4f8ef7" }}>{r.score}</span>
                  <span style={{ fontSize:13, color:(r.accuracy||0)>=60?"#4ade80":"#f87171" }}>{r.accuracy}%</span>
                  <span style={{ fontSize:11, color:"#555" }}>{r.date || "—"}</span>
                  <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:`${perf.c}18`, color:perf.c, border:`1px solid ${perf.c}33`, textAlign:"center" }}>{perf.l}</span>
                  <button onClick={() => deleteMockResult(r.id||i)}
                    style={{ background:"none", border:"none", cursor:"pointer", color:"#f87171", fontSize:16, padding:2 }}>🗑</button>
                </div>
              );
            })}
          </>
        )}

        {/* Performance Analytics */}
        {mockTests.length > 0 && (
          <div style={{ marginTop:20, paddingTop:18, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#aaa", marginBottom:12 }}>📈 Performance Analytics</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10 }}>
              {[
                { l:"Best Score",     v:`${Math.max(...mockTests.map(r=>r.score))}`, sub:"/200",           c:"#4f8ef7" },
                { l:"Worst Score",    v:`${Math.min(...mockTests.map(r=>r.score))}`, sub:"/200",           c:"#f87171" },
                { l:"Overall Avg",    v:`${avgScore}`,                               sub:`${mockTests.length} mocks`, c:"#22d3ee" },
                { l:"Accuracy Trend", v:mockTests.length>=2 ? (mockTests.slice(-3).reduce((a,r)=>a+(r.accuracy||0),0)/Math.min(mockTests.length,3) > mockTests.slice(0,3).reduce((a,r)=>a+(r.accuracy||0),0)/Math.min(mockTests.length,3) ? "Improving" : "Stable") : "Stable", sub:"", c:"#4f8ef7" },
                { l:"Stability",      v:"Stable",                                    sub:`Variance: ${mockTests.length>1?Math.round(Math.sqrt(mockTests.reduce((a,r)=>a+Math.pow(r.score-avgScore,2),0)/mockTests.length)*10)/10:0}%`, c:"#4f8ef7" },
              ].map(s => (
                <div key={s.l} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, color:"#555", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>{s.l}</div>
                  <div style={{ fontSize:20, fontWeight:800, color:s.c }}>{s.v}</div>
                  {s.sub && <div style={{ fontSize:10, color:"#555", marginTop:2 }}>{s.sub}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={c.card}>
        <div style={c.h2}>Quick Actions</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[
            { label:"Start Mock Test",    color:"#4f8ef7", action:()=>setPage("mock-tests")  },
            { label:"Practice Subjects",  color:"#a855f7", action:()=>setPage("subjects")    },
            { label:"Revision Checklist", color:"#22d3ee", action:()=>setPage("checklist")   },
            { label:"Leaderboard",        color:"#fbbf24", action:()=>setPage("leaderboard") },
          ].map(a => (
            <button key={a.label} style={c.btn(a.color)} onClick={a.action}>{a.label} →</button>
          ))}
        </div>
      </div>

      {/* Syllabus Progress */}
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

      {/* ADD MOCK RESULT MODAL */}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:"#0d0d18", border:"1px solid rgba(255,255,255,0.1)", borderRadius:18, padding:32, width:"100%", maxWidth:420 }}>
            <div style={{ fontSize:17, fontWeight:800, color:"#e2e2f0", marginBottom:6 }}>+ Add Mock Result</div>
            <div style={{ fontSize:12, color:"#555", marginBottom:22 }}>Add your coaching or external mock test result here.</div>

            {addErr && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"9px 13px", color:"#f87171", fontSize:12, marginBottom:14 }}>{addErr}</div>}

            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:"#666", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Test Name *</div>
              <input style={c.inp} placeholder="e.g. ICON Mock Test 01 (FREE)" value={mockName} onChange={e=>setMockName(e.target.value)}
                onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)"}} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:22 }}>
              <div>
                <div style={{ fontSize:11, color:"#666", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Your Score *</div>
                <input style={c.inp} type="number" placeholder="e.g. 82.5" value={mockScore} onChange={e=>setMockScore(e.target.value)}
                  onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)"}} />
              </div>
              <div>
                <div style={{ fontSize:11, color:"#666", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Out of (Total)</div>
                <input style={c.inp} type="number" placeholder="200" value={mockTotal} onChange={e=>setMockTotal(e.target.value)}
                  onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)"}} />
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={handleAddMock}
                style={{ flex:1, padding:"11px", borderRadius:9, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", fontSize:14, fontWeight:700, fontFamily:"inherit" }}>
                Save Result
              </button>
              <button onClick={()=>{ setShowAdd(false); setAddErr(""); }}
                style={{ padding:"11px 20px", borderRadius:9, border:"1px solid rgba(255,255,255,0.08)", background:"transparent", color:"#666", cursor:"pointer", fontFamily:"inherit" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
