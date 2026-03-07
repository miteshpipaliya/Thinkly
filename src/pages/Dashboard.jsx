import { useState } from "react";
import { useApp } from "../context/AppContext";
import { SUBJECTS, getDaysRemaining } from "../data/subjects";

export default function Dashboard({ setPage }) {
  const { user, myResults, checklist, addMockResult, deleteMockResult, darkMode } = useApp();
  const days = getDaysRemaining();

  const mockTests  = myResults.filter(r => r.isMock);
  const targetMarks = parseFloat(user?.profile?.goal) || 0;
  const targetAcc   = user?.profile?.targetAcc || 0;
  const avgScore    = mockTests.length ? Math.round(mockTests.reduce((a,r)=>a+(r.score||0),0)/mockTests.length*10)/10 : 0;
  const avgAcc      = mockTests.length ? Math.round(mockTests.reduce((a,r)=>a+(r.accuracy||0),0)/mockTests.length) : 0;

  const [showAdd, setShowAdd]     = useState(false);
  const [mockName, setMockName]   = useState("");
  const [mockScore, setMockScore] = useState("");
  const [mockTotal, setMockTotal] = useState("400");
  const [addErr, setAddErr]       = useState("");

  function handleAddMock() {
    setAddErr("");
    if (!mockName.trim()) { setAddErr("Please enter a test name."); return; }
    const score = parseFloat(mockScore);
    const total = parseFloat(mockTotal) || 400;
    if (isNaN(score) || score < 0) { setAddErr("Please enter a valid score."); return; }
    if (score > total) { setAddErr("Score cannot exceed total marks."); return; }
    const accuracy = Math.round(score / total * 100);
    addMockResult({ title: mockName.trim(), isMock: true, score, total, correct: 0, wrong: 0, unanswered: 0, accuracy, isManual: true, date: new Date().toLocaleDateString("en-IN") });
    setMockName(""); setMockScore(""); setMockTotal("400");
    setShowAdd(false);
  }

  const txt    = darkMode ? "#e2e2f0" : "#111";
  const sub    = darkMode ? "#666"    : "#888";
  const cardBg = darkMode ? "rgba(255,255,255,0.03)"  : "#fff";
  const cardBr = darkMode ? "rgba(255,255,255,0.07)"  : "#e5e7eb";
  const inp    = { background:darkMode?"rgba(255,255,255,0.05)":"#f9fafb", border:`1.5px solid ${darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}`, borderRadius:9, padding:"10px 13px", color:txt, fontSize:13, outline:"none", fontFamily:"inherit", width:"100%" };

  const perfMsg = avgAcc === 0 ? null
    : avgAcc < 60 ? { msg:"Average accuracy below 60%. Focus on core concepts!", col:"#f87171" }
    : avgAcc < 75 ? { msg:"Good progress! Push harder on weak chapters.", col:"#fbbf24" }
    : { msg:"Excellent performance! Keep it up.", col:"#4ade80" };

  return (
    <div>
      <div style={{ fontSize:24, fontWeight:800, color:txt, marginBottom:4 }}>Good day, {user?.name?.split(" ")[0]} 👋</div>
      <div style={{ color:sub, fontSize:14, marginBottom:20 }}>{user?.profile?.branch} · Target: {targetMarks} marks</div>

      {/* ── ACCURACY TRACKER LINE ── */}
      <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:"18px 22px", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <span style={{ fontWeight:700, color:txt, fontSize:14 }}>📈 Daily Accuracy Tracker</span>
          <div style={{ display:"flex", gap:16 }}>
            <span style={{ fontSize:12, color:sub }}>Target: <b style={{ color:"#4ade80" }}>{targetAcc}%</b></span>
            <span style={{ fontSize:12, color:sub }}>Current Avg: <b style={{ color: avgAcc >= targetAcc ? "#4ade80" : "#f87171" }}>{avgAcc}%</b></span>
          </div>
        </div>

        {/* Track bar with target stop marker */}
        <div style={{ position:"relative", height:12, background:darkMode?"rgba(255,255,255,0.06)":"#eee", borderRadius:6, overflow:"visible", marginBottom:8 }}>
          {/* Filled bar */}
          <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${Math.min(avgAcc,100)}%`, background:`linear-gradient(90deg,${avgAcc>=targetAcc?"#4ade80":"#4f8ef7"},${avgAcc>=targetAcc?"#22d3ee":"#a855f7"})`, borderRadius:6, transition:"width 0.5s" }} />
          {/* Target stop marker */}
          {targetAcc > 0 && (
            <div style={{ position:"absolute", left:`${Math.min(targetAcc,98)}%`, top:-4, width:3, height:20, background:"#4ade80", borderRadius:2, zIndex:2 }}>
              <div style={{ position:"absolute", top:-18, left:"50%", transform:"translateX(-50%)", fontSize:9, color:"#4ade80", fontWeight:700, whiteSpace:"nowrap" }}>TARGET</div>
            </div>
          )}
          {/* 100% stop */}
          <div style={{ position:"absolute", right:0, top:-4, width:3, height:20, background:"#fbbf24", borderRadius:2 }}>
            <div style={{ position:"absolute", top:-18, left:"50%", transform:"translateX(-50%)", fontSize:9, color:"#fbbf24", fontWeight:700 }}>100%</div>
          </div>
        </div>

        {/* Daily dots (last 7 mocks) */}
        {mockTests.length > 0 && (
          <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
            {mockTests.slice(0,10).reverse().map((r,i) => (
              <div key={i} title={`${r.title}: ${r.accuracy}%`}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:r.accuracy >= targetAcc ? "#4ade80" : "#f87171" }} />
                <span style={{ fontSize:9, color:sub }}>{r.accuracy}%</span>
              </div>
            ))}
          </div>
        )}
        {mockTests.length === 0 && <div style={{ fontSize:12, color:sub, marginTop:6 }}>Add mock results to track your accuracy.</div>}
      </div>

      {/* Alert */}
      {perfMsg && (
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 16px", background:`${perfMsg.col}10`, border:`1px solid ${perfMsg.col}30`, borderRadius:10, marginBottom:16 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:perfMsg.col, flexShrink:0 }} />
          <span style={{ fontSize:13, color:perfMsg.col }}>{perfMsg.msg}</span>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12, marginBottom:16 }}>
        {[
          { l:"Days to DDCET",   v:`${days}`,         c:"#fb923c" },
          { l:"Target Marks",    v:`${targetMarks}`,  c:"#4f8ef7" },
          { l:"Target Accuracy", v:`${targetAcc}%`,   c:"#4ade80" },
          { l:"Avg Accuracy",    v:`${avgAcc}%`,       c:avgAcc>=targetAcc?"#4ade80":"#f87171" },
          { l:"Best Score",      v:mockTests.length?`${Math.max(...mockTests.map(r=>r.score))}`:"—", c:"#a855f7" },
          { l:"Mocks Done",      v:mockTests.length,  c:"#22d3ee" },
        ].map(s => (
          <div key={s.l} style={{ background:cardBg, border:`1px solid ${s.c}22`, borderRadius:13, padding:"16px 18px" }}>
            <div style={{ fontSize:11, color:sub, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>{s.l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Mock Results */}
      <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:22, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:15, fontWeight:700, color:txt }}>📊 Mock Results</div>
          <button onClick={()=>setShowAdd(true)}
            style={{ padding:"7px 16px", borderRadius:8, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", fontSize:12, fontWeight:700, fontFamily:"inherit" }}>
            + Add Result
          </button>
        </div>

        {mockTests.length === 0 ? (
          <div style={{ textAlign:"center", color:sub, padding:"20px 0", fontSize:13 }}>No results yet. Take a mock test or add your coaching result.</div>
        ) : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 70px 80px 85px 100px 36px", gap:8, padding:"7px 10px", background:darkMode?"rgba(255,255,255,0.04)":"#f5f5f5", borderRadius:8, marginBottom:8, fontSize:11, color:sub, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em" }}>
              <span>Name</span><span>Marks</span><span>Accuracy</span><span>Date</span><span>Performance</span><span></span>
            </div>
            {mockTests.map((r,i) => {
              const perf = (r.accuracy||0)>=75?{l:"Excellent",c:"#4ade80"}:(r.accuracy||0)>=60?{l:"Good",c:"#fbbf24"}:(r.accuracy||0)>=40?{l:"Average",c:"#fb923c"}:{l:"Really Bad",c:"#f87171"};
              return (
                <div key={r.id||i} style={{ display:"grid", gridTemplateColumns:"1fr 70px 80px 85px 100px 36px", gap:8, padding:"11px 10px", borderBottom:`1px solid ${darkMode?"rgba(255,255,255,0.04)":"#f0f0f0"}`, alignItems:"center" }}>
                  <span style={{ fontSize:13, color:txt }}>{r.title}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:"#4f8ef7" }}>{r.score}</span>
                  <span style={{ fontSize:13, color:(r.accuracy||0)>=60?"#4ade80":"#f87171" }}>{r.accuracy}%</span>
                  <span style={{ fontSize:11, color:sub }}>{r.date||"—"}</span>
                  <span style={{ padding:"3px 8px", borderRadius:20, fontSize:11, fontWeight:700, background:`${perf.c}18`, color:perf.c, border:`1px solid ${perf.c}33`, textAlign:"center" }}>{perf.l}</span>
                  <button onClick={()=>deleteMockResult(r.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#f87171", fontSize:15, padding:2 }}>🗑</button>
                </div>
              );
            })}
          </>
        )}

        {mockTests.length > 1 && (
          <div style={{ marginTop:18, paddingTop:16, borderTop:`1px solid ${darkMode?"rgba(255,255,255,0.05)":"#eee"}` }}>
            <div style={{ fontSize:13, fontWeight:700, color:sub, marginBottom:10 }}>📈 Analytics</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:10 }}>
              {[
                {l:"Best",     v:`${Math.max(...mockTests.map(r=>r.score))}`, c:"#4ade80"},
                {l:"Worst",    v:`${Math.min(...mockTests.map(r=>r.score))}`, c:"#f87171"},
                {l:"Avg Score",v:`${avgScore}`,                               c:"#4f8ef7"},
                {l:"Avg Acc",  v:`${avgAcc}%`,                                c:"#a855f7"},
              ].map(s=>(
                <div key={s.l} style={{ background:darkMode?"rgba(255,255,255,0.02)":"#f9fafb", border:`1px solid ${darkMode?"rgba(255,255,255,0.06)":"#e5e7eb"}`, borderRadius:9, padding:"10px 12px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:sub, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>{s.l}</div>
                  <div style={{ fontSize:20, fontWeight:800, color:s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:22, marginBottom:16 }}>
        <div style={{ fontSize:15, fontWeight:700, color:txt, marginBottom:14 }}>Quick Actions</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[
            {label:"Start Mock Test",    color:"#4f8ef7", action:()=>setPage("mock-tests")},
            {label:"Practice Subjects",  color:"#a855f7", action:()=>setPage("subjects")},
            {label:"Revision Checklist", color:"#22d3ee", action:()=>setPage("checklist")},
            {label:"Explore Students",   color:"#fb923c", action:()=>setPage("explore")},
          ].map(a=>(
            <button key={a.label} onClick={a.action}
              style={{ padding:"9px 18px", borderRadius:9, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, background:`${a.color}22`, color:a.color, fontFamily:"inherit" }}>
              {a.label} →
            </button>
          ))}
        </div>
      </div>

      {/* Syllabus Progress */}
      <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:22 }}>
        <div style={{ fontSize:15, fontWeight:700, color:txt, marginBottom:14 }}>Syllabus Progress</div>
        {SUBJECTS.map(subj => {
          const total = subj.chapters.length;
          const done  = subj.chapters.filter(ch => checklist[`${subj.id}-${ch}`]).length;
          return (
            <div key={subj.id} style={{ marginBottom:13 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:13, color:txt }}>{subj.icon} {subj.name}</span>
                <span style={{ fontSize:12, color:subj.color }}>{done}/{total}</span>
              </div>
              <div style={{ height:5, background:darkMode?"rgba(255,255,255,0.06)":"#eee", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${done/total*100}%`, background:`linear-gradient(90deg,${subj.color},${subj.color}88)`, borderRadius:3, transition:"width 0.4s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Mock Modal */}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:darkMode?"#0d0d18":"#fff", border:`1px solid ${darkMode?"rgba(255,255,255,0.1)":"#e5e7eb"}`, borderRadius:18, padding:32, width:"100%", maxWidth:420 }}>
            <div style={{ fontSize:17, fontWeight:800, color:txt, marginBottom:6 }}>+ Add Mock Result</div>
            <div style={{ fontSize:12, color:sub, marginBottom:20 }}>Add your coaching or external mock test result.</div>
            {addErr && <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"9px 13px", color:"#f87171", fontSize:12, marginBottom:14 }}>{addErr}</div>}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:sub, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Test Name</div>
              <input style={inp} placeholder="e.g. ICON Mock Test 01" value={mockName} onChange={e=>setMockName(e.target.value)}
                onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor=darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:22 }}>
              <div>
                <div style={{ fontSize:11, color:sub, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Your Score</div>
                <input style={inp} type="number" placeholder="e.g. 82.5" value={mockScore} onChange={e=>setMockScore(e.target.value)}
                  onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor=darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}} />
              </div>
              <div>
                <div style={{ fontSize:11, color:sub, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Out of (Total)</div>
                <input style={inp} type="number" placeholder="400" value={mockTotal} onChange={e=>setMockTotal(e.target.value)}
                  onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor=darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}} />
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={handleAddMock} style={{ flex:1, padding:"11px", borderRadius:9, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", fontSize:14, fontWeight:700, fontFamily:"inherit" }}>Save Result</button>
              <button onClick={()=>{setShowAdd(false);setAddErr("");}} style={{ padding:"11px 18px", borderRadius:9, border:`1px solid ${darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}`, background:"transparent", color:sub, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
