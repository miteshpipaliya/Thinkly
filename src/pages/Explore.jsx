/*
 * Explore Students — Ranklify v6
 * • Online section  • REQUEST / REQUESTED / CONNECTED states
 * • Dark: white btn, black text  |  Light: black btn, yellow text
 * • Peer Mock button once connected
 * • Full student cards with subject bars, city, branch, target
 */
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { SUBJECTS, QUESTION_BANK } from "../data/subjects";

/* ── fake students data ─────────────────────────────────────── */
const FAKE = [
  { id:"f1",  name:"Rahul Patel",  socialProfile:{username:"rahul_p",  city:"Ahmedabad"}, profile:{branch:"Computer",    goal:"160"}, progress:{mathematics:78,physics:90,chemistry:60,environment:100,computer:95,english:70},  online:true  },
  { id:"f2",  name:"Priya Desai",  socialProfile:{username:"priya_d",  city:"Surat"},     profile:{branch:"Electrical",  goal:"140"}, progress:{mathematics:55,physics:70,chemistry:80,environment:65, computer:50,english:85},  online:true  },
  { id:"f3",  name:"Aryan Joshi",  socialProfile:{username:"aryan_j",  city:"Vadodara"},  profile:{branch:"Civil",       goal:"150"}, progress:{mathematics:90,physics:85,chemistry:70,environment:80, computer:60,english:75},  online:false },
  { id:"f4",  name:"Sneha Modi",   socialProfile:{username:"sneha_m",  city:"Rajkot"},    profile:{branch:"Mechanical",  goal:"125"}, progress:{mathematics:40,physics:55,chemistry:60,environment:70, computer:45,english:90},  online:true  },
  { id:"f5",  name:"Dev Trivedi",  socialProfile:{username:"dev_t",    city:"Surat"},     profile:{branch:"Computer",    goal:"175"}, progress:{mathematics:95,physics:88,chemistry:75,environment:85, computer:100,english:80}, online:false },
  { id:"f6",  name:"Krisha Bhatt", socialProfile:{username:"krisha_b", city:"Anand"},     profile:{branch:"Chemical",    goal:"130"}, progress:{mathematics:50,physics:60,chemistry:90,environment:75, computer:40,english:65},  online:true  },
  { id:"f7",  name:"Mehul Shah",   socialProfile:{username:"mehul_s",  city:"Ahmedabad"}, profile:{branch:"Electronics", goal:"155"}, progress:{mathematics:85,physics:78,chemistry:65,environment:70, computer:80,english:72},  online:false },
  { id:"f8",  name:"Nidhi Rao",    socialProfile:{username:"nidhi_r",  city:"Surat"},     profile:{branch:"Computer",    goal:"165"}, progress:{mathematics:80,physics:92,chemistry:70,environment:88, computer:95,english:78},  online:true  },
  { id:"f9",  name:"Vivek Kumar",  socialProfile:{username:"vivek_k",  city:"Navsari"},   profile:{branch:"Automobile",  goal:"120"}, progress:{mathematics:45,physics:50,chemistry:55,environment:60, computer:35,english:70},  online:false },
  { id:"f10", name:"Pooja Sharma", socialProfile:{username:"pooja_s",  city:"Gandhinagar"},profile:{branch:"Civil",      goal:"148"}, progress:{mathematics:70,physics:75,chemistry:68,environment:82, computer:65,english:80},  online:true  },
];

/* ── seeded shuffle so peer gets same paper ─────────────────── */
function seededShuffle(arr, seed) {
  const a = [...arr]; let s = (seed % 2147483647) || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function buildPaper(seed) {
  const base = seededShuffle([...QUESTION_BANK], seed);
  let pool = [...base];
  while (pool.length < 100) pool = [...pool, ...base];
  return pool.slice(0, 100);
}
const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const SECS = 120 * 60;

/* ═══════════════════════════════════════════════════════════════ */
export default function Explore({ setPage }) {
  const {
    user, users, checklist, darkMode, follows,
    sendFollowRequest, isFollowing, isPending,
    createGroup, startGroupSession, submitGroupResult,
    sendGroupInvite, groups, myGroupInvites, acceptGroupInvite,
    addResult,
  } = useApp();

  /* ── theme ── */
  const txt    = darkMode ? "#e2e2f0" : "#111";
  const sub    = darkMode ? "#555"    : "#888";
  const cardBg = darkMode ? "rgba(255,255,255,0.025)" : "#fff";
  const cardBr = darkMode ? "rgba(255,255,255,0.07)"  : "#e5e7eb";
  const pageBg = darkMode ? "#050508" : "#f0f2f8";

  /* ── peer mock test state ── */
  const [peerSession, setPeerSession] = useState(null); // { peerId, peerName, groupId, seed }
  const [peerPhase,   setPeerPhase]   = useState("idle"); // idle | running | waiting | done
  const [questions,   setQuestions]   = useState([]);
  const [answers,     setAnswers]     = useState({});
  const [curr,        setCurr]        = useState(0);
  const [timeLeft,    setTimeLeft]    = useState(SECS);
  const [startedAt,   setStartedAt]   = useState(null);
  const [myPeerResult,setMyPeerResult]= useState(null);
  const [peerResult,  setPeerResult]  = useState(null);
  const [timerRef,    setTimerRef]    = useState(null);

  /* ── search / filter ── */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | online | connected

  /* ── build allUsers with real progress ── */
  const realUsers = users.filter(u => u.id !== user?.id && u.setupDone).map(u => {
    const progress = {};
    SUBJECTS.forEach(s => {
      const done = s.chapters.filter(ch => checklist[`${s.id}-${ch}`]).length;
      progress[s.id] = s.chapters.length ? Math.round(done/s.chapters.length*100) : 0;
    });
    return { ...u, progress, isReal: true, online: Math.random() > 0.4 };
  });

  const allUsers = [...realUsers, ...FAKE];

  /* ── connection state per user ── */
  function connState(u) {
    if (!u.isReal) return "fake";
    if (isFollowing(u.id)) return "connected";
    if (isPending(u.id))   return "requested";
    return "none";
  }

  /* ── filter + search ── */
  const visibleUsers = allUsers.filter(u => {
    const matchSearch = search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.socialProfile?.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.profile?.branch || "").toLowerCase().includes(search.toLowerCase());
    const cs = connState(u);
    if (filter === "online")    return matchSearch && u.online;
    if (filter === "connected") return matchSearch && cs === "connected";
    return matchSearch;
  });

  const onlineUsers    = allUsers.filter(u => u.online);
  const connectedUsers = allUsers.filter(u => connState(u) === "connected");

  /* ── watch for peer group done ── */
  useEffect(() => {
    if (!peerSession || peerPhase !== "waiting") return;
    const grp = groups.find(g => g.id === peerSession.groupId);
    if (!grp) return;
    const peerRes = grp.results[peerSession.peerId];
    if (peerRes) {
      setPeerResult(peerRes);
      setPeerPhase("done");
    }
  }, [groups, peerPhase, peerSession]);

  /* ── timer ── */
  useEffect(() => {
    if (peerPhase !== "running") return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); doSubmitPeer(); return 0; }
        return t - 1;
      });
    }, 1000);
    setTimerRef(id);
    return () => clearInterval(id);
  }, [peerPhase]);

  /* ── start peer mock ── */
  function startPeerMock(peer) {
    const seed = Date.now();
    const g    = createGroup(seed);
    sendGroupInvite(g.id, peer.id);
    const qs = buildPaper(seed);
    setPeerSession({ peerId: peer.id, peerName: peer.name, groupId: g.id, seed });
    setQuestions(qs);
    setAnswers({}); setCurr(0); setTimeLeft(SECS); setStartedAt(Date.now());
    startGroupSession(g.id);
    setPeerPhase("running");
  }

  /* ── submit peer answers ── */
  function doSubmitPeer() {
    if (timerRef) clearInterval(timerRef);
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    let score = 0, correct = 0, wrong = 0, unanswered = 0;
    questions.forEach((q, i) => {
      const ua = answers[i];
      if (!ua)           { unanswered++; }
      else if (ua===q.ans){ correct++; score += 2; }
      else               { wrong++;    score -= 0.5; }
    });
    score = Math.max(0, Math.round(score * 10) / 10);
    const accuracy = Math.round((correct / questions.length) * 100);
    const result   = { score, correct, wrong, unanswered, accuracy, timeTaken: elapsed };
    setMyPeerResult(result);
    if (peerSession) submitGroupResult(peerSession.groupId, result);
    addResult({ title: `Peer Mock vs ${peerSession?.peerName}`, isMock: true, ...result });
    setPeerPhase("waiting");
  }

  const timerPct   = timeLeft / SECS * 100;
  const timerColor = timerPct > 50 ? "#4ade80" : timerPct > 20 ? "#fbbf24" : "#f87171";

  /* ══════════════════════ PEER MOCK RUNNING ══════════════════════ */
  if (peerPhase === "running" && questions.length > 0) {
    const q        = questions[curr];
    const userAns  = answers[curr];
    const answered = Object.keys(answers).length;
    const grp      = groups.find(g => g.id === peerSession?.groupId);
    const peerDone = grp?.results?.[peerSession?.peerId];

    return (
      <div>
        {/* Header */}
        <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:12, padding:"11px 18px", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:18 }}>⚔️</span>
            <div>
              <div style={{ fontWeight:900, color:txt, fontSize:14 }}>Peer Mock vs {peerSession?.peerName}</div>
              <div style={{ fontSize:11, color:sub }}>Q{curr+1}/100 · +2 correct · −0.5 wrong</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:120, height:5, background:darkMode?"rgba(255,255,255,0.06)":"#eee", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${timerPct}%`, background:`linear-gradient(90deg,${timerColor},${timerColor}88)`, transition:"width 1s linear" }}/>
            </div>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:900, fontSize:18, color:timerColor }}>{fmt(timeLeft)}</span>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 200px", gap:14 }}>
          {/* Question */}
          <div>
            <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:"22px 24px", marginBottom:12 }}>
              <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:"rgba(79,142,247,0.12)", color:"#7aadff", border:"1px solid rgba(79,142,247,0.2)" }}>{q.subject}</span>
                <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, background:darkMode?"rgba(255,255,255,0.05)":"#f3f4f6", color:sub }}>{q.chapter}</span>
              </div>
              <div style={{ fontSize:16, fontWeight:600, color:txt, lineHeight:1.75, marginBottom:22 }}>{q.q}</div>
              {q.opts.map((opt,i) => {
                const sel = userAns === opt;
                return (
                  <button key={opt} onClick={() => setAnswers(a => ({...a,[curr]:opt}))}
                    style={{ display:"flex", alignItems:"center", gap:12, width:"100%", textAlign:"left", padding:"13px 16px", borderRadius:10, border:`1.5px solid ${sel?"#4f8ef7":darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}`, background:sel?"rgba(79,142,247,0.13)":darkMode?"rgba(255,255,255,0.02)":"#f9fafb", color:sel?"#7aadff":txt, cursor:"pointer", fontSize:14, fontWeight:sel?700:400, marginBottom:8, fontFamily:"inherit", transition:"all 0.15s" }}>
                    <span style={{ width:28,height:28,borderRadius:"50%",background:sel?"#4f8ef722":darkMode?"rgba(255,255,255,0.07)":"#eee",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0,color:sel?"#4f8ef7":sub }}>
                      {["A","B","C","D"][i]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setCurr(c=>Math.max(0,c-1))} disabled={curr===0}
                style={{ padding:"10px 20px", borderRadius:9, border:"none", cursor:"pointer", background:darkMode?"rgba(255,255,255,0.07)":"#f3f4f6", color:txt, fontSize:13, fontWeight:700, fontFamily:"inherit" }}>← Prev</button>
              <button onClick={() => setCurr(c=>Math.min(99,c+1))} disabled={curr===99}
                style={{ padding:"10px 20px", borderRadius:9, border:"none", cursor:"pointer", background:darkMode?"rgba(255,255,255,0.07)":"#f3f4f6", color:txt, fontSize:13, fontWeight:700, fontFamily:"inherit" }}>Next →</button>
              <div style={{ flex:1 }}/>
              <button onClick={() => { if(window.confirm("Submit test? You can't change answers after this.")) doSubmitPeer(); }}
                style={{ padding:"10px 22px", borderRadius:9, border:"none", cursor:"pointer", background:"rgba(239,68,68,0.15)", color:"#f87171", fontSize:13, fontWeight:700, fontFamily:"inherit" }}>
                Submit Test
              </button>
            </div>
          </div>

          {/* Side panel */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Peer status */}
            <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:12, padding:14 }}>
              <div style={{ fontSize:11, fontWeight:800, color:sub, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.05em" }}>⚔️ Peer Progress</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <div style={{ width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff" }}>
                  {user?.name?.[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#7aadff" }}>You</div>
                  <div style={{ fontSize:11, color:sub }}>Q{curr+1} · {answered} answered</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#f87171,#ef4444)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff" }}>
                  {peerSession?.peerName?.[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#f87171" }}>{peerSession?.peerName}</div>
                  <div style={{ fontSize:11, color:sub }}>{peerDone ? "✅ Submitted!" : "⏳ In progress"}</div>
                </div>
              </div>
            </div>

            {/* Palette */}
            <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:12, padding:14 }}>
              <div style={{ fontSize:11, fontWeight:800, color:sub, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.05em" }}>Palette</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                {questions.map((_,i) => {
                  const done=answers[i]!==undefined, active=i===curr;
                  return (
                    <button key={i} onClick={()=>setCurr(i)}
                      style={{ width:26,height:26,borderRadius:5,border:`1.5px solid ${active?"#4f8ef7":done?"rgba(79,142,247,0.4)":darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}`,background:active?"#4f8ef7":done?"rgba(79,142,247,0.18)":darkMode?"rgba(255,255,255,0.03)":"#f9fafb",color:active?"#fff":done?"#7aadff":sub,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
                      {i+1}
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize:11,color:sub,marginTop:8 }}>
                Done: <b style={{color:"#4ade80"}}>{answered}</b> · Left: <b style={{color:"#f87171"}}>{100-answered}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════ PEER WAITING ═══════════════════════════ */
  if (peerPhase === "waiting") {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"65vh" }}>
        <div style={{ textAlign:"center", maxWidth:420 }}>
          <div style={{ fontSize:60, marginBottom:12 }}>⏳</div>
          <div style={{ fontSize:20, fontWeight:900, color:txt, marginBottom:6 }}>You're done! Waiting for {peerSession?.peerName}…</div>
          <div style={{ color:sub, fontSize:13, marginBottom:20 }}>Your score is saved. Results show when they submit.</div>
          {myPeerResult && (
            <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:18, textAlign:"left" }}>
              <div style={{ fontSize:13, color:sub, marginBottom:8 }}>Your Performance:</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                {[{l:"Score",v:myPeerResult.score,c:"#4f8ef7"},{l:"Accuracy",v:myPeerResult.accuracy+"%",c:"#4ade80"},{l:"Correct",v:myPeerResult.correct,c:"#fbbf24"}].map(s=>(
                  <div key={s.l} style={{ textAlign:"center", background:`${s.c}12`, borderRadius:10, padding:12 }}>
                    <div style={{ fontSize:22, fontWeight:900, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:10, color:sub }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ══════════════════════ PEER DONE — RESULTS ════════════════════ */
  if (peerPhase === "done" && myPeerResult) {
    const myS    = myPeerResult.score;
    const peerS  = peerResult?.score || 0;
    const iWon   = myS >= peerS;
    const isLoser = !iWon;

    return (
      <div>
        {/* Loser motivational popup */}
        {isLoser && (
          <div style={{ background:"rgba(239,68,68,0.08)", border:"2px solid rgba(239,68,68,0.3)", borderRadius:16, padding:"20px 24px", marginBottom:22, textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:8 }}>💔</div>
            <div style={{ fontSize:22, fontWeight:900, background:"linear-gradient(135deg,#f87171,#fbbf24)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              "Every winner was once a loser."
            </div>
            <div style={{ fontSize:13, color:sub, marginTop:8 }}>You lost this time — but every loss is a lesson! Keep practising 💪🔥</div>
          </div>
        )}

        <div style={{ fontSize:22, fontWeight:900, color:txt, marginBottom:4 }}>⚔️ Peer Mock Results</div>
        <div style={{ color:sub, fontSize:13, marginBottom:20 }}>vs {peerSession?.peerName}</div>

        {/* Score cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
          {[
            { label:"You", name:user?.name, data:myPeerResult,   winner: iWon,   color:"#4f8ef7" },
            { label:"Opponent", name:peerSession?.peerName, data:peerResult||{score:0,correct:0,wrong:0,accuracy:0}, winner: !iWon, color:"#f87171" },
          ].map(p => (
            <div key={p.label} style={{ background:p.winner?"linear-gradient(135deg,rgba(251,191,36,0.15),rgba(251,191,36,0.03))":cardBg, border:`2px solid ${p.winner?"#fbbf24":cardBr}`, borderRadius:16, padding:22, textAlign:"center" }}>
              {p.winner && <div style={{ fontSize:13, fontWeight:900, color:"#fbbf24", marginBottom:6 }}>🏆 WINNER</div>}
              <div style={{ width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${p.color},${p.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff",margin:"0 auto 10px" }}>{p.name?.[0]}</div>
              <div style={{ fontSize:16, fontWeight:900, color:txt, marginBottom:10 }}>{p.name}</div>
              <div style={{ fontSize:36, fontWeight:900, color:p.winner?"#fbbf24":p.color }}>{p.data.score}</div>
              <div style={{ fontSize:11, color:sub, marginBottom:12 }}>/200 marks</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[{l:"Correct",v:p.data.correct,c:"#4ade80"},{l:"Wrong",v:p.data.wrong,c:"#f87171"},{l:"Accuracy",v:(p.data.accuracy||0)+"%",c:"#7aadff"},{l:"Time",v:`${Math.floor((p.data.timeTaken||0)/60)}m`,c:"#fbbf24"}].map(s=>(
                  <div key={s.l} style={{ background:`${s.c}10`, borderRadius:8, padding:8 }}>
                    <div style={{ fontSize:16, fontWeight:800, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:9, color:sub }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Subject comparison */}
        <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:22, marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:800, color:txt, marginBottom:14 }}>📊 Score Comparison</div>
          <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}><div style={{ width:12,height:12,borderRadius:"50%",background:"#4f8ef7" }}/><span style={{ fontSize:12,color:sub }}>You ({myS} pts)</span></div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}><div style={{ width:12,height:12,borderRadius:"50%",background:"#f87171" }}/><span style={{ fontSize:12,color:sub }}>{peerSession?.peerName} ({peerS} pts)</span></div>
          </div>
          {[
            {l:"Score",    a:myS,                          b:peerS,                          max:200},
            {l:"Correct",  a:myPeerResult.correct,         b:peerResult?.correct||0,         max:100},
            {l:"Accuracy", a:myPeerResult.accuracy,        b:peerResult?.accuracy||0,        max:100},
          ].map(row => (
            <div key={row.l} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:sub, fontWeight:600 }}>{row.l}</span>
                <span style={{ fontSize:12, color:sub }}>{row.a} vs {row.b}</span>
              </div>
              <div style={{ position:"relative", height:8, background:darkMode?"rgba(255,255,255,0.06)":"#eee", borderRadius:4, overflow:"hidden" }}>
                <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${(row.a/row.max)*100}%`, background:"#4f8ef7", borderRadius:4, transition:"width 0.6s" }}/>
              </div>
              <div style={{ marginTop:3, height:8, background:darkMode?"rgba(255,255,255,0.06)":"#eee", borderRadius:4, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(row.b/row.max)*100}%`, background:"#f87171", borderRadius:4, transition:"width 0.6s" }}/>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <button onClick={() => { setPeerPhase("idle"); setPeerSession(null); setMyPeerResult(null); setPeerResult(null); }}
            style={{ padding:"11px 26px", borderRadius:10, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", fontSize:13, fontWeight:800, fontFamily:"inherit" }}>
            ← Back to Explore
          </button>
        </div>
      </div>
    );
  }

  /* ══════════════════════ MAIN EXPLORE PAGE ══════════════════════ */
  return (
    <div>
      {/* Page header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👥</div>
        <div>
          <div style={{ fontSize:22, fontWeight:900, color:txt }}>Explore Students</div>
          <div style={{ fontSize:12, color:sub }}>Discover DDCET peers · Connect · Compete</div>
        </div>
      </div>

      {/* Privacy banner */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 16px", background:"rgba(79,142,247,0.07)", border:"1.5px solid rgba(79,142,247,0.25)", borderRadius:11, marginBottom:22, marginTop:14 }}>
        <span style={{ fontSize:16 }}>🔒</span>
        <span style={{ fontSize:13, fontWeight:700, color:"#7aadff" }}>
          All accounts are private. Send a REQUEST — once accepted, view their profile, chat &amp; do mock tests together.
        </span>
      </div>

      {/* ── ONLINE NOW section ── */}
      {onlineUsers.length > 0 && (
        <div style={{ marginBottom:28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <div style={{ width:9,height:9,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 10px #4ade80" }}/>
            <span style={{ fontSize:16, fontWeight:900, color:txt }}>Online Now</span>
            <span style={{ fontSize:12, color:sub }}>({onlineUsers.length} students active)</span>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {onlineUsers.map((u, i) => {
              const cs = connState(u);
              return (
                <div key={u.id||"f"+i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:cardBg, border:`1px solid ${cardBr}`, borderRadius:40, position:"relative" }}>
                  <div style={{ width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,hsl(${i*60%360},65%,55%),hsl(${(i*60+80)%360},65%,40%))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff",position:"relative" }}>
                    {u.name[0]}
                    <div style={{ position:"absolute",bottom:-1,right:-1,width:9,height:9,borderRadius:"50%",background:"#4ade80",border:`2px solid ${cardBg}` }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:txt, whiteSpace:"nowrap" }}>{u.name}</div>
                    <div style={{ fontSize:10, color:sub }}>{u.profile?.branch}</div>
                  </div>
                  {cs === "connected" && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"rgba(74,222,128,0.15)", color:"#4ade80", fontWeight:700 }}>Connected</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Search + Filter bar ── */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍  Search by name, city, branch…"
          style={{ flex:1, minWidth:200, background:darkMode?"rgba(255,255,255,0.05)":"#fff", border:`1.5px solid ${cardBr}`, borderRadius:10, padding:"10px 14px", color:txt, fontSize:13, outline:"none", fontFamily:"inherit" }}
          onFocus={e=>e.target.style.borderColor="#4f8ef7"} onBlur={e=>e.target.style.borderColor=cardBr}
        />
        {["all","online","connected"].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
            style={{ padding:"9px 18px", borderRadius:9, border:"none", cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit", transition:"all 0.2s",
              background: filter===f ? "linear-gradient(135deg,#4f8ef7,#a855f7)" : darkMode?"rgba(255,255,255,0.06)":"#f3f4f6",
              color: filter===f ? "#fff" : sub }}>
            {f === "all" ? `All (${allUsers.length})` : f === "online" ? `🟢 Online (${onlineUsers.length})` : `✓ Connected (${connectedUsers.length})`}
          </button>
        ))}
      </div>

      {/* ── Student Cards Grid ── */}
      {visibleUsers.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 0", color:sub, fontSize:14 }}>
          <div style={{ fontSize:40, marginBottom:10 }}>😶</div>
          No students found. Try a different search.
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:16 }}>
        {visibleUsers.map((u, i) => {
          const cs  = connState(u);
          const pct = Math.round(Object.values(u.progress).reduce((a,v)=>a+v,0) / Object.values(u.progress).length);

          return (
            <div key={u.id||"f"+i} style={{ background:cardBg, border:`1.5px solid ${cs==="connected"?"rgba(74,222,128,0.3)":cardBr}`, borderRadius:18, padding:"20px", position:"relative", overflow:"hidden", transition:"transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=darkMode?"0 8px 32px rgba(0,0,0,0.4)":"0 8px 32px rgba(0,0,0,0.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>

              {/* accent line */}
              <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,hsl(${i*43%360},65%,55%),hsl(${(i*43+80)%360},65%,45%))`,borderRadius:"18px 18px 0 0" }}/>

              {/* Online dot */}
              {u.online && <div style={{ position:"absolute",top:14,right:14,display:"flex",alignItems:"center",gap:4 }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 6px #4ade80" }}/>
                <span style={{ fontSize:9,color:"#4ade80",fontWeight:700 }}>ONLINE</span>
              </div>}

              {/* Header */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <div style={{ width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,hsl(${i*43%360},65%,55%),hsl(${(i*43+70)%360},65%,40%))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,fontWeight:900,color:"#fff",flexShrink:0,position:"relative" }}>
                  {u.name[0]}
                  {cs === "connected" && <div style={{ position:"absolute",bottom:-1,right:-1,width:14,height:14,borderRadius:"50%",background:"#4ade80",border:`2px solid ${cardBg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8 }}>✓</div>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:900, color:txt, fontSize:15 }}>{u.name}</div>
                  <div style={{ fontSize:11, color:sub, marginTop:1 }}>@{u.socialProfile?.username||"—"} · {u.socialProfile?.city||"Gujarat"}</div>
                  <div style={{ fontSize:11, color:sub }}>{u.profile?.branch} · 🎯 Target {u.profile?.goal}/200</div>
                </div>
                <div style={{ textAlign:"center", flexShrink:0 }}>
                  <div style={{ fontSize:22,fontWeight:900,color:"#4f8ef7",lineHeight:1 }}>{pct}%</div>
                  <div style={{ fontSize:9,color:sub,marginTop:2 }}>overall</div>
                </div>
              </div>

              {/* Subject bars */}
              <div style={{ marginBottom:16 }}>
                {SUBJECTS.map(s => {
                  const p = u.progress[s.id] || 0;
                  return (
                    <div key={s.id} style={{ marginBottom:5 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                        <span style={{ fontSize:10,color:sub }}>{s.icon} {s.name}</span>
                        <span style={{ fontSize:10,fontWeight:800,color:s.color }}>{p}%</span>
                      </div>
                      <div style={{ height:3,background:darkMode?"rgba(255,255,255,0.06)":"#f0f0f0",borderRadius:2,overflow:"hidden" }}>
                        <div style={{ height:"100%",width:`${p}%`,background:`linear-gradient(90deg,${s.color},${s.color}66)`,borderRadius:2,transition:"width 0.6s ease" }}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── ACTION BUTTONS ── */}
              {cs === "connected" ? (
                /* Connected — show Start Mock Together */
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"7px", background:"rgba(74,222,128,0.1)", borderRadius:8, border:"1px solid rgba(74,222,128,0.25)" }}>
                    <span style={{ fontSize:12 }}>✓</span>
                    <span style={{ fontSize:12, fontWeight:800, color:"#4ade80" }}>CONNECTED</span>
                  </div>
                  {u.isReal && (
                    <button onClick={() => startPeerMock(u)}
                      style={{ width:"100%", padding:"11px", borderRadius:10, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", fontSize:13, fontWeight:900, fontFamily:"inherit", letterSpacing:"0.05em", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s" }}
                      onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow="0 4px 20px rgba(79,142,247,0.5)";}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                      ⚔️ START MOCK TOGETHER
                    </button>
                  )}
                </div>
              ) : cs === "requested" ? (
                /* Pending */
                <button disabled style={{ width:"100%", padding:"11px", borderRadius:10, border:"2px solid rgba(251,191,36,0.4)", cursor:"default", background:"rgba(251,191,36,0.1)", color:"#fbbf24", fontSize:13, fontWeight:900, fontFamily:"inherit", letterSpacing:"0.06em", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <span>⏳</span><span>REQUESTED</span>
                </button>
              ) : cs === "fake" ? (
                /* Fake/demo accounts */
                <button disabled style={{ width:"100%", padding:"11px", borderRadius:10, border:`2px solid ${darkMode?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.1)"}`, cursor:"default", background:darkMode?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)", color:darkMode?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.2)", fontSize:13, fontWeight:900, fontFamily:"inherit", letterSpacing:"0.06em", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <span>🔒</span><span>DEMO PROFILE</span>
                </button>
              ) : (
                /* REQUEST — Dark: white bg black text | Light: black bg yellow text */
                <button
                  onClick={() => sendFollowRequest(u.id)}
                  style={{ width:"100%", padding:"12px", borderRadius:10, border: darkMode ? "2px solid rgba(255,255,255,0.6)" : "2px solid #000", cursor:"pointer", background: darkMode ? "#ffffff" : "#000000", color: darkMode ? "#000000" : "#fbbf24", fontSize:14, fontWeight:900, fontFamily:"inherit", letterSpacing:"0.1em", textTransform:"uppercase", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = darkMode ? "#f0f0f0" : "#1a1a1a"; e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = darkMode ? "0 4px 20px rgba(255,255,255,0.25)" : "0 4px 20px rgba(0,0,0,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = darkMode ? "#ffffff" : "#000000"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <span style={{ fontSize:16 }}>🔒</span>
                  <span>REQUEST</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
