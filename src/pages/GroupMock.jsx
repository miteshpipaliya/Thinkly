/**
 * GroupMock.jsx — Ranklify v10
 * ✅ Ready button working for every player
 * ✅ All ready → host Start button enables
 * ✅ 3-2-1 countdown overlay for everyone simultaneously
 * ✅ Mock test starts together after countdown
 * ✅ PDF fixed — opens in new tab, Ranklify logo included
 * ✅ Broken PDF series removed
 */
import { useState, useEffect, useRef } from "react";
import { QUESTION_BANK } from "../data/subjects";
import { useApp } from "../context/AppContext";

/* ── seeded shuffle (same seed = same paper for everyone) ── */
function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = (seed % 2147483647) || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPaper(seed) {
  const base = seededShuffle([...QUESTION_BANK], seed);
  let pool = [...base];
  while (pool.length < 100) pool = [...pool, ...base];
  return pool.slice(0, 100);
}

/* ── PDF generator — opens in new tab with Ranklify branding ── */
function generatePDF(group, users, me) {
  const ranked = group.members
    .map(id => {
      const u = id === me.id ? me : (users.find(x => x.id === id) || { name:"Unknown", profile:{} });
      const r = group.results[id] || {};
      return {
        name: u.name, branch: u.profile?.branch || "—",
        score: r.score||0, correct: r.correct||0,
        wrong: r.wrong||0, accuracy: r.accuracy||0, time: r.timeTaken||0
      };
    })
    .sort((a,b) => b.score - a.score);

  const medals = ["🥇","🥈","🥉","💔"];
  const date   = new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"});
  const testNo = `GMT-${group.id.toString().slice(-4)}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Ranklify — Group Mock Result</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, Helvetica, sans-serif; background:#fff; color:#222; padding:36px 40px; max-width:900px; margin:0 auto; }

  /* ── Header ── */
  .header { display:flex; align-items:center; justify-content:space-between; padding-bottom:18px; border-bottom:3px solid #4f8ef7; margin-bottom:22px; }
  .logo-row { display:flex; align-items:center; gap:12px; }
  .logo-box { width:44px; height:44px; border-radius:10px; background:linear-gradient(135deg,#4f8ef7,#a855f7); display:flex; align-items:center; justify-content:center; }
  .logo-box svg { display:block; }
  .logo-name { font-size:26px; font-weight:900; background:linear-gradient(90deg,#4f8ef7,#a855f7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height:1; }
  .logo-sub  { font-size:10px; color:#888; margin-top:2px; }
  .header-right { text-align:right; font-size:11px; color:#888; line-height:1.8; }

  /* ── Title ── */
  .title { font-size:20px; font-weight:900; color:#111; margin-bottom:4px; }
  .subtitle { font-size:12px; color:#888; margin-bottom:20px; }

  /* ── Winner box ── */
  .winner-box { background:linear-gradient(135deg,#fffbeb,#fef9c3); border:2px solid #fbbf24; border-radius:10px; padding:14px 18px; margin-bottom:22px; display:flex; align-items:center; gap:14px; }
  .winner-trophy { font-size:36px; }
  .winner-name { font-size:17px; font-weight:900; color:#92400e; }
  .winner-stats { font-size:12px; color:#b45309; margin-top:3px; }

  /* ── Table ── */
  table { width:100%; border-collapse:collapse; font-size:13px; margin-bottom:28px; }
  thead tr { background:linear-gradient(135deg,#4f8ef7,#a855f7); }
  thead th { color:#fff; padding:11px 14px; text-align:left; font-weight:700; font-size:12px; text-transform:uppercase; letter-spacing:0.04em; }
  tbody tr:nth-child(even) td { background:#f8f9ff; }
  tbody tr.gold td { background:#fffbeb !important; }
  tbody tr.loser td { background:#fff5f5 !important; }
  td { padding:12px 14px; border-bottom:1px solid #eee; vertical-align:middle; }
  .rank-medal { font-size:18px; }
  .score-val { font-size:16px; font-weight:900; color:#4f8ef7; }
  .gold .score-val { color:#d97706; }
  .loser .score-val { color:#dc2626; }
  .acc-good { color:#16a34a; font-weight:700; }
  .acc-bad  { color:#dc2626; font-weight:700; }

  /* ── Stats row ── */
  .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:24px; }
  .stat-box { border:1px solid #e5e7eb; border-radius:8px; padding:12px; text-align:center; }
  .stat-val { font-size:22px; font-weight:900; color:#4f8ef7; }
  .stat-label { font-size:10px; color:#888; margin-top:4px; text-transform:uppercase; }

  /* ── Footer ── */
  .footer { border-top:1px solid #e5e7eb; padding-top:14px; display:flex; justify-content:space-between; align-items:center; }
  .footer-left { font-size:10px; color:#aaa; line-height:1.7; }
  .footer-brand { font-size:13px; font-weight:900; color:#4f8ef7; }

  @media print {
    body { padding:20px; }
    button { display:none; }
  }
</style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <div class="logo-row">
    <div class="logo-box">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polyline points="22,12 18,12 15,20 9,4 6,12 2,12" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div>
      <div class="logo-name">Ranklify</div>
      <div class="logo-sub">DDCET Rank Booster · Gujarat's #1 Peer Prep Platform</div>
    </div>
  </div>
  <div class="header-right">
    <div><b>Group Mock Test Result</b></div>
    <div>Test ID: ${testNo}</div>
    <div>Date: ${date}</div>
    <div>Players: ${ranked.length}</div>
  </div>
</div>

<!-- WINNER -->
<div class="winner-box">
  <div class="winner-trophy">🏆</div>
  <div>
    <div class="winner-name">🥇 Winner — ${ranked[0]?.name}</div>
    <div class="winner-stats">
      ${ranked[0]?.score} marks &nbsp;·&nbsp; ${ranked[0]?.correct} correct &nbsp;·&nbsp; ${ranked[0]?.accuracy}% accuracy
    </div>
  </div>
</div>

<!-- STATS -->
<div class="stats-row">
  <div class="stat-box"><div class="stat-val">${ranked.length}</div><div class="stat-label">Players</div></div>
  <div class="stat-box"><div class="stat-val">100</div><div class="stat-label">Questions</div></div>
  <div class="stat-box"><div class="stat-val">200</div><div class="stat-label">Total Marks</div></div>
  <div class="stat-box"><div class="stat-val">${ranked[0]?.score}</div><div class="stat-label">Top Score</div></div>
</div>

<!-- TABLE -->
<table>
  <thead>
    <tr>
      <th>Rank</th>
      <th>Name</th>
      <th>Branch</th>
      <th>Score /200</th>
      <th>Correct</th>
      <th>Wrong</th>
      <th>Accuracy</th>
      <th>Time</th>
    </tr>
  </thead>
  <tbody>
    ${ranked.map((m,i) => `
    <tr class="${i===0?"gold":i===ranked.length-1&&ranked.length>1?"loser":""}">
      <td class="rank-medal">${medals[i]||"#"+(i+1)}</td>
      <td><b>${m.name}</b>${i===0?' <span style="font-size:10px;color:#d97706;background:#fef9c3;padding:2px 6px;border-radius:4px;margin-left:6px;">WINNER</span>':i===ranked.length-1&&ranked.length>1?' <span style="font-size:10px;color:#dc2626;background:#fff5f5;padding:2px 6px;border-radius:4px;margin-left:6px;">LAST</span>':""}</td>
      <td style="color:#666;font-size:12px;">${m.branch}</td>
      <td><span class="score-val">${m.score}</span></td>
      <td style="color:#16a34a;font-weight:700;">${m.correct}</td>
      <td style="color:#dc2626;font-weight:700;">${m.wrong}</td>
      <td><span class="${m.accuracy>=60?"acc-good":"acc-bad"}">${m.accuracy}%</span></td>
      <td style="font-size:11px;color:#888;">${Math.floor(m.time/60)}m ${m.time%60}s</td>
    </tr>`).join("")}
  </tbody>
</table>

<!-- FOOTER -->
<div class="footer">
  <div class="footer-left">
    <div>📋 Same Questions · Same Time · Same Negative Marking (-0.5 per wrong)</div>
    <div>Generated by Ranklify · ranklify.vercel.app · DDCET Competitive Preparation</div>
  </div>
  <div class="footer-brand">⚡ Ranklify</div>
</div>

<script>window.onload = () => window.print();</script>
</body>
</html>`;

  const w = window.open("","_blank");
  if (!w) { alert("Please allow popups to download PDF."); return; }
  w.document.write(html);
  w.document.close();
}

const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const TOTAL_SECS = 120 * 60;

/* ══════════════════════════════════════════════════════════════ */
export default function GroupMock() {
  const {
    user, users, darkMode, groups, invites,
    myConnections, createGroup, sendGroupInvite,
    acceptGroupInvite, rejectGroupInvite,
    startGroupSession, submitGroupResult, myGroupInvites,
    addResult, markReady,
  } = useApp();

  const txt    = darkMode ? "#e2e2f0" : "#111";
  const sub    = darkMode ? "#555"    : "#888";
  const cardBg = darkMode ? "rgba(255,255,255,0.03)" : "#fff";
  const cardBr = darkMode ? "rgba(255,255,255,0.07)" : "#e5e7eb";

  const Btn = (v="primary") => ({
    padding:"10px 22px", borderRadius:9, border:"none", cursor:"pointer",
    fontSize:13, fontWeight:700, fontFamily:"inherit",
    background: v==="primary" ? "linear-gradient(135deg,#4f8ef7,#a855f7)"
              : v==="green"   ? "linear-gradient(135deg,#4ade80,#22c55e)"
              : v==="danger"  ? "rgba(239,68,68,0.15)"
              : darkMode      ? "rgba(255,255,255,0.07)" : "#f3f4f6",
    color: (v==="primary"||v==="green") ? "#fff" : v==="danger" ? "#f87171" : txt,
  });

  const [phase,     setPhase]     = useState("lobby");
  const [questions, setQuestions] = useState([]);
  const [answers,   setAnswers]   = useState({});
  const [curr,      setCurr]      = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(TOTAL_SECS);
  const [startedAt, setStartedAt] = useState(null);
  const [myResult,  setMyResult]  = useState(null);
  const [loserData, setLoserData] = useState(null);
  const [countdown, setCountdown] = useState(null); // 3,2,1,null
  const timerRef   = useRef(null);
  const countRef   = useRef(null);

  const myGroup        = groups.find(g => g.members.includes(user?.id) && g.status !== "done") || null;
  const pendingInvites = myGroupInvites ? myGroupInvites() : [];
  const connections    = myConnections ? myConnections() : [];

  const readyPlayers   = myGroup?.readyPlayers || [];
  const allReady       = myGroup && myGroup.members.length >= 2 && myGroup.members.every(id => readyPlayers.includes(id));
  const iAmReady       = readyPlayers.includes(user?.id);

  /* ── watch group status changes ── */
  useEffect(() => {
    if (!myGroup) return;

    /* group entered countdown — show 3-2-1 */
    if (myGroup.status === "countdown" && phase === "lobby") {
      setPhase("countdown");
      let n = 3;
      setCountdown(n);
      countRef.current = setInterval(() => {
        n--;
        if (n <= 0) {
          clearInterval(countRef.current);
          setCountdown(null);
        } else {
          setCountdown(n);
        }
      }, 1000);
    }

    /* group flipped to running */
    if (myGroup.status === "running" && (phase === "lobby" || phase === "countdown")) {
      clearInterval(countRef.current);
      setCountdown(null);
      const qs = buildPaper(myGroup.seed);
      setQuestions(qs);
      setAnswers({}); setCurr(0);
      setTimeLeft(TOTAL_SECS); setStartedAt(Date.now());
      setPhase("running");
    }

    /* done */
    if (myGroup.status === "done" && (phase === "running" || phase === "waiting")) {
      setPhase("done");
      const ranked = myGroup.members
        .map(id => ({ id, score: myGroup.results[id]?.score || 0 }))
        .sort((a,b) => b.score - a.score);
      const loserId = ranked[ranked.length-1]?.id;
      const loserU  = loserId === user.id ? user : users.find(u => u.id === loserId);
      setLoserData({ name: loserU?.name || "Unknown", isMe: loserId === user.id });
    }
  }, [myGroup?.status]);

  /* ── exam timer ── */
  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); doSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  function doSubmit() {
    clearInterval(timerRef.current);
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    let score=0, correct=0, wrong=0, unanswered=0;
    questions.forEach((q,i) => {
      const ua = answers[i];
      if (!ua)           unanswered++;
      else if (ua===q.ans){ correct++; score+=2; }
      else               { wrong++;   score-=0.5; }
    });
    score = Math.max(0, Math.round(score*10)/10);
    const accuracy = Math.round(correct/questions.length*100);
    const result   = { score, correct, wrong, unanswered, accuracy, timeTaken:elapsed };
    setMyResult(result);
    if (myGroup) submitGroupResult(myGroup.id, result);
    addResult({ title:`Group Mock (${myGroup?.members?.length||"?"} players)`, isMock:true, ...result });
    setPhase("waiting");
  }

  const timerPct   = timeLeft/TOTAL_SECS*100;
  const timerColor = timerPct>50?"#4ade80":timerPct>20?"#fbbf24":"#f87171";

  /* ── Loser Popup ── */
  function LoserPopup() {
    if (!loserData) return null;
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{background:darkMode?"#0e0e1c":"#fff",border:"2px solid rgba(239,68,68,0.45)",borderRadius:24,padding:"40px 36px",maxWidth:440,width:"100%",textAlign:"center"}}>
          <div style={{fontSize:72,marginBottom:10}}>💔</div>
          <div style={{fontSize:20,fontWeight:900,color:"#f87171",marginBottom:6}}>
            {loserData.isMe?"You Finished Last!":`${loserData.name} Finished Last!`}
          </div>
          <div style={{fontSize:28,fontWeight:900,lineHeight:1.4,margin:"18px 0",background:"linear-gradient(135deg,#f87171,#fbbf24,#4ade80)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            "Every winner was once a loser."
          </div>
          <div style={{fontSize:14,color:sub,marginBottom:28,lineHeight:1.7}}>
            {loserData.isMe
              ?"Don't quit. Every expert was once a beginner. Keep practising! 💪🔥"
              :`Keep encouraging ${loserData.name} — every loss is a lesson! 💪`}
          </div>
          <button onClick={()=>setLoserData(null)} style={{...Btn("primary"),width:"100%",padding:"13px"}}>
            See Full Results →
          </button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     COUNTDOWN OVERLAY
  ══════════════════════════════════════════ */
  if (phase === "countdown") {
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.95)",zIndex:5000,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <style>{`
          @keyframes pop { 0%{transform:scale(0.5);opacity:0} 50%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        `}</style>
        <div style={{fontSize:14,fontWeight:700,color:"#7aadff",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:24}}>
          🎯 Group Mock Test Starting
        </div>
        <div key={countdown} style={{
          fontSize:180,fontWeight:900,lineHeight:1,
          background:"linear-gradient(135deg,#4f8ef7,#a855f7)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          animation:"pop 0.5s ease",
        }}>
          {countdown || "GO!"}
        </div>
        <div style={{marginTop:32,fontSize:14,color:"#555"}}>
          All players are starting simultaneously
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     RUNNING PHASE
  ══════════════════════════════════════════ */
  if (phase === "running" && questions.length > 0) {
    const q       = questions[curr];
    const userAns = answers[curr];
    const answered= Object.keys(answers).length;

    return (
      <div>
        <LoserPopup />
        <div style={{display:"grid",gridTemplateColumns:"1fr 220px",gap:14,alignItems:"start"}}>

          {/* question side */}
          <div>
            <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:11,padding:"10px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <span style={{padding:"4px 12px",borderRadius:20,background:"rgba(79,142,247,0.12)",border:"1px solid rgba(79,142,247,0.25)",fontSize:11,fontWeight:800,color:"#7aadff"}}>
                👥 GROUP MOCK · Q{curr+1}/{questions.length}
              </span>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:100,height:5,background:darkMode?"rgba(255,255,255,0.06)":"#eee",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${timerPct}%`,background:`linear-gradient(90deg,${timerColor},${timerColor}88)`,transition:"width 1s linear"}}/>
                </div>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:900,color:timerColor,fontSize:18,minWidth:68}}>{fmt(timeLeft)}</span>
              </div>
              <span style={{fontSize:12,color:sub}}>{answered}/{questions.length} answered</span>
            </div>

            <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:14,padding:"22px 24px",marginBottom:12}}>
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:"rgba(79,142,247,0.12)",color:"#7aadff",border:"1px solid rgba(79,142,247,0.2)"}}>{q.subject}</span>
                <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,background:darkMode?"rgba(255,255,255,0.05)":"#f3f4f6",color:sub}}>{q.chapter}</span>
              </div>
              <div style={{fontSize:16,fontWeight:600,color:txt,lineHeight:1.75,marginBottom:22}}>{q.q}</div>
              {q.opts.map((opt,i) => {
                const sel = userAns===opt;
                return (
                  <button key={opt} onClick={()=>setAnswers(a=>({...a,[curr]:opt}))}
                    style={{display:"flex",alignItems:"center",gap:12,width:"100%",textAlign:"left",padding:"13px 16px",borderRadius:10,border:`1.5px solid ${sel?"#4f8ef7":"rgba(255,255,255,0.08)"}`,background:sel?"rgba(79,142,247,0.13)":darkMode?"rgba(255,255,255,0.02)":"#f9fafb",color:sel?"#7aadff":darkMode?"#ccc":"#444",cursor:"pointer",fontSize:14,fontWeight:sel?700:400,marginBottom:8,fontFamily:"inherit",transition:"all 0.15s"}}>
                    <span style={{width:28,height:28,borderRadius:"50%",background:sel?"#4f8ef722":darkMode?"rgba(255,255,255,0.07)":"#eee",border:`1.5px solid ${sel?"#4f8ef7":"transparent"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0,color:sel?"#4f8ef7":sub}}>
                      {["A","B","C","D"][i]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <div style={{display:"flex",gap:10}}>
              <button style={Btn("ghost")} onClick={()=>setCurr(c=>Math.max(0,c-1))} disabled={curr===0}>← Prev</button>
              <button style={Btn("ghost")} onClick={()=>setCurr(c=>Math.min(questions.length-1,c+1))} disabled={curr===questions.length-1}>Next →</button>
              <div style={{flex:1}}/>
              <button style={Btn("danger")} onClick={()=>{if(window.confirm("Submit your test? You cannot change answers after this."))doSubmit();}}>
                Submit Test
              </button>
            </div>
          </div>

          {/* right side */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:12,padding:14}}>
              <div style={{fontSize:12,fontWeight:800,color:sub,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>👥 Players</div>
              {myGroup?.members.map(id => {
                const u    = id===user.id?user:users.find(x=>x.id===id);
                const done = myGroup?.results?.[id];
                return (
                  <div key={id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${cardBr}`}}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",flexShrink:0}}>
                      {u?.name?.[0]||"?"}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:id===user.id?800:500,color:id===user.id?"#7aadff":txt}}>
                        {u?.name||"Unknown"}{id===user.id?" (You)":""}
                      </div>
                    </div>
                    <span style={{fontSize:20}}>{done?"✅":"⏳"}</span>
                  </div>
                );
              })}
            </div>

            <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:12,padding:14}}>
              <div style={{fontSize:12,fontWeight:800,color:sub,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>Question Palette</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
                {questions.map((_,i) => {
                  const done=answers[i]!==undefined, active=i===curr;
                  return (
                    <button key={i} onClick={()=>setCurr(i)}
                      style={{width:28,height:28,borderRadius:5,border:`1.5px solid ${active?"#4f8ef7":done?"rgba(79,142,247,0.4)":darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}`,background:active?"#4f8ef7":done?"rgba(79,142,247,0.18)":darkMode?"rgba(255,255,255,0.03)":"#f9fafb",color:active?"#fff":done?"#7aadff":sub,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                      {i+1}
                    </button>
                  );
                })}
              </div>
              <div style={{fontSize:11,color:sub}}>Done: <b style={{color:"#4ade80"}}>{answered}</b> &nbsp;|&nbsp; Left: <b style={{color:"#f87171"}}>{questions.length-answered}</b></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     WAITING PHASE
  ══════════════════════════════════════════ */
  if (phase === "waiting") {
    const submitted = Object.keys(myGroup?.results||{}).length;
    const total     = myGroup?.members?.length||0;
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"65vh"}}>
        <LoserPopup />
        <div style={{textAlign:"center",maxWidth:460,width:"100%"}}>
          <div style={{fontSize:64,marginBottom:12}}>⏳</div>
          <div style={{fontSize:22,fontWeight:900,color:txt,marginBottom:6}}>Submitted! Waiting…</div>
          <div style={{color:sub,fontSize:13,marginBottom:24}}>Your answers are saved. Results will appear when everyone finishes.</div>
          <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:16,padding:22,marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:800,color:txt,marginBottom:14}}>Submission Status</div>
            {myGroup?.members.map(id => {
              const u    = id===user.id?user:users.find(x=>x.id===id);
              const done = myGroup?.results?.[id];
              return (
                <div key={id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${cardBr}`}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:"#fff",flexShrink:0}}>
                    {u?.name?.[0]||"?"}
                  </div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <div style={{fontSize:13,fontWeight:id===user.id?800:500,color:id===user.id?"#7aadff":txt}}>
                      {u?.name||"Unknown"}{id===user.id?" (You)":""}
                    </div>
                    {done&&<div style={{fontSize:11,color:"#4ade80"}}>{myGroup.results[id].score} marks · {myGroup.results[id].accuracy}% accuracy</div>}
                  </div>
                  <div style={{fontSize:28}}>{done?"✅":"⏳"}</div>
                </div>
              );
            })}
          </div>
          <div style={{fontSize:13,color:"#4f8ef7",fontWeight:700}}>{submitted}/{total} submitted · Results appear when all finish</div>
          <div style={{width:`${(submitted/total)*100}%`,height:4,background:"linear-gradient(90deg,#4f8ef7,#a855f7)",borderRadius:4,margin:"12px auto 0",transition:"width 0.5s"}}/>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     DONE — RESULTS
  ══════════════════════════════════════════ */
  if (phase === "done" && myGroup) {
    const medals = ["🥇","🥈","🥉","💔"];
    const ranked = myGroup.members
      .map(id => {
        const u = id===user.id?user:(users.find(x=>x.id===id)||{name:"Unknown",profile:{}});
        const r = myGroup.results[id]||{};
        return {id,name:u.name,branch:u.profile?.branch||"—",score:r.score||0,correct:r.correct||0,wrong:r.wrong||0,unanswered:r.unanswered||0,accuracy:r.accuracy||0,time:r.timeTaken||0};
      })
      .sort((a,b)=>b.score-a.score);

    return (
      <div>
        <LoserPopup/>
        <div style={{textAlign:"center",marginBottom:30}}>
          <div style={{fontSize:60,marginBottom:8}}>🏆</div>
          <div style={{fontSize:26,fontWeight:900,color:txt}}>Group Mock Results</div>
          <div style={{color:sub,fontSize:13,marginTop:4}}>DDCET Group Mock · {new Date().toLocaleDateString("en-IN")} · {ranked.length} Players</div>
        </div>

        <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:28,flexWrap:"wrap"}}>
          {ranked.map((m,i) => {
            const isLoser  = i===ranked.length-1&&ranked.length>1;
            const isWinner = i===0;
            return (
              <div key={m.id} style={{background:isWinner?"linear-gradient(135deg,rgba(251,191,36,0.2),rgba(251,191,36,0.04))":isLoser?"linear-gradient(135deg,rgba(239,68,68,0.12),transparent)":cardBg,border:`2px solid ${isWinner?"#fbbf24":isLoser?"rgba(239,68,68,0.4)":i===1?"#9ca3af":"rgba(205,124,46,0.5)"}`,borderRadius:18,padding:"24px 20px",textAlign:"center",minWidth:160,flex:"1 1 140px",maxWidth:200,position:"relative"}}>
                <div style={{fontSize:40,marginBottom:8}}>{medals[i]||"🏅"}</div>
                <div style={{width:50,height:50,borderRadius:"50%",background:`linear-gradient(135deg,hsl(${i*80}deg,70%,55%),hsl(${i*80+60}deg,65%,40%))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff",margin:"0 auto 10px"}}>
                  {m.name[0]}
                </div>
                <div style={{fontWeight:900,fontSize:15,color:isLoser?"#f87171":isWinner?"#fbbf24":txt,marginBottom:3}}>{m.name}</div>
                <div style={{fontSize:11,color:sub,marginBottom:10}}>{m.branch}</div>
                <div style={{fontSize:30,fontWeight:900,color:isLoser?"#f87171":isWinner?"#fbbf24":"#4f8ef7",lineHeight:1}}>{m.score}</div>
                <div style={{fontSize:10,color:sub,marginBottom:6}}>/ 200 marks</div>
                <div style={{fontSize:12,fontWeight:700,color:m.accuracy>=60?"#4ade80":"#f87171"}}>{m.accuracy}% acc</div>
                {m.id===user.id&&<div style={{position:"absolute",top:8,right:8,fontSize:9,padding:"2px 6px",borderRadius:8,background:"rgba(79,142,247,0.2)",color:"#7aadff",fontWeight:800}}>YOU</div>}
              </div>
            );
          })}
        </div>

        <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:16,padding:22,marginBottom:20}}>
          <div style={{fontSize:16,fontWeight:800,color:txt,marginBottom:16}}>📊 Full Comparison</div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 70px 75px 70px 90px 75px",gap:6,padding:"9px 12px",background:darkMode?"rgba(255,255,255,0.05)":"#f5f5f5",borderRadius:9,marginBottom:6,fontSize:11,color:sub,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.04em"}}>
            <span>Player</span><span>Score</span><span>Correct</span><span>Wrong</span><span>Accuracy</span><span>Time</span>
          </div>
          {ranked.map((m,i) => {
            const isLoser=i===ranked.length-1&&ranked.length>1, isWinner=i===0;
            return (
              <div key={m.id} style={{display:"grid",gridTemplateColumns:"2fr 70px 75px 70px 90px 75px",gap:6,padding:"13px 12px",borderBottom:`1px solid ${darkMode?"rgba(255,255,255,0.04)":"#f0f0f0"}`,alignItems:"center",background:m.id===user.id?darkMode?"rgba(79,142,247,0.07)":"rgba(79,142,247,0.04)":"transparent"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18}}>{medals[i]||"🏅"}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:m.id===user.id?900:500,color:isWinner?"#fbbf24":isLoser?"#f87171":m.id===user.id?"#7aadff":txt}}>
                      {m.name}{m.id===user.id?" (You)":""}
                    </div>
                    <div style={{fontSize:10,color:sub}}>{m.branch}</div>
                  </div>
                </div>
                <span style={{fontSize:16,fontWeight:900,color:isWinner?"#fbbf24":isLoser?"#f87171":"#4f8ef7"}}>{m.score}</span>
                <span style={{fontSize:13,fontWeight:700,color:"#4ade80"}}>{m.correct}</span>
                <span style={{fontSize:13,fontWeight:700,color:"#f87171"}}>{m.wrong}</span>
                <div>
                  <span style={{fontSize:13,fontWeight:700,color:m.accuracy>=60?"#4ade80":"#f87171"}}>{m.accuracy}%</span>
                  <div style={{height:3,background:darkMode?"rgba(255,255,255,0.06)":"#eee",borderRadius:2,marginTop:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${m.accuracy}%`,background:`linear-gradient(90deg,${m.accuracy>=60?"#4ade80":"#f87171"},transparent)`,borderRadius:2}}/>
                  </div>
                </div>
                <span style={{fontSize:11,color:sub}}>{Math.floor(m.time/60)}m{m.time%60}s</span>
              </div>
            );
          })}
        </div>

        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <button style={Btn("primary")} onClick={()=>generatePDF(myGroup,users,user)}>
            ⬇ Download Result PDF
          </button>
          <button style={Btn("ghost")} onClick={()=>{setPhase("lobby");setMyResult(null);setLoserData(null);}}>
            ← Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     LOBBY
  ══════════════════════════════════════════ */
  return (
    <div>
      <div style={{fontSize:22,fontWeight:900,color:txt,marginBottom:4}}>Group Mock Test</div>
      <div style={{color:sub,fontSize:13,marginBottom:20}}>
        Challenge up to 3 friends. Same questions, same time, ranked results. 🏆
      </div>

      {/* pending invites */}
      {pendingInvites.length > 0 && (
        <div style={{background:"rgba(79,142,247,0.07)",border:"2px solid rgba(79,142,247,0.35)",borderRadius:14,padding:20,marginBottom:22}}>
          <div style={{fontSize:15,fontWeight:900,color:"#7aadff",marginBottom:14}}>📨 Group Mock Invites ({pendingInvites.length})</div>
          {pendingInvites.map(inv => {
            const host = users.find(u=>u.id===inv.from);
            const grp  = groups.find(g=>g.id===inv.groupId);
            return (
              <div key={inv.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:"1px solid rgba(79,142,247,0.12)"}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:800,color:"#fff",flexShrink:0}}>
                  {host?.name?.[0]||"?"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,color:txt,fontSize:14}}>
                    <span style={{color:"#7aadff"}}>{host?.name||"Someone"}</span> invited you to a Group Mock!
                  </div>
                  <div style={{fontSize:11,color:sub,marginTop:2}}>
                    {grp?.members?.length||1} player(s) · 100 Qs · 120 min · DDCET pattern
                  </div>
                </div>
                <button onClick={()=>acceptGroupInvite(inv.id)} style={{...Btn("green"),padding:"8px 16px",fontSize:12,marginRight:6}}>✓ Join</button>
                <button onClick={()=>rejectGroupInvite(inv.id)} style={{...Btn("danger"),padding:"8px 14px",fontSize:12}}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {/* active session */}
      {myGroup ? (
        <div style={{background:cardBg,border:"2px solid rgba(79,142,247,0.35)",borderRadius:16,padding:24}}>

          {/* header */}
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,gap:12,flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:17,fontWeight:900,color:txt}}>
                {myGroup.host===user.id?"🎮 Your Session":"🎮 Active Session"}
              </div>
              <div style={{fontSize:12,color:sub,marginTop:3}}>
                Status: <b style={{color:myGroup.status==="lobby"?"#fbbf24":"#4ade80",textTransform:"uppercase"}}>{myGroup.status}</b>
                &nbsp;·&nbsp; {myGroup.members.length}/4 players
                &nbsp;·&nbsp; {readyPlayers.length}/{myGroup.members.length} ready
              </div>
            </div>

            {/* START button — host only, all ready */}
            {myGroup.host===user.id && myGroup.status==="lobby" && (
              <button
                onClick={()=>{ if(allReady) startGroupSession(myGroup.id); }}
                disabled={!allReady}
                style={{
                  ...Btn("green"),
                  opacity: allReady?1:0.4,
                  cursor: allReady?"pointer":"not-allowed",
                  position:"relative",
                }}>
                {allReady?"🚀 Start Exam for Everyone":"⏳ Waiting for all to be Ready"}
              </button>
            )}
          </div>

          {/* PLAYER SLOTS */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:800,color:sub,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.05em"}}>
              Player Slots (Max 4)
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {/* filled slots */}
              {myGroup.members.map(id => {
                const u       = id===user.id?user:users.find(x=>x.id===id);
                const isHost  = id===myGroup.host;
                const isReady = readyPlayers.includes(id);
                const isMe    = id===user.id;
                return (
                  <div key={id} style={{
                    background: isReady?"rgba(74,222,128,0.08)":darkMode?"rgba(255,255,255,0.04)":"#f9fafb",
                    border:`2px solid ${isReady?"rgba(74,222,128,0.5)":isMe?"rgba(79,142,247,0.4)":cardBr}`,
                    borderRadius:14,padding:"18px 12px",textAlign:"center",
                    transition:"all 0.3s",
                  }}>
                    {/* avatar */}
                    <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${isReady?"#4ade80,#22c55e":"#4f8ef7,#a855f7"})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff",margin:"0 auto 10px"}}>
                      {u?.name?.[0]||"?"}
                    </div>
                    <div style={{fontSize:12,fontWeight:700,color:isMe?"#7aadff":txt,marginBottom:4}}>
                      {u?.name||"Unknown"}{isMe?" (You)":""}
                    </div>
                    {isHost&&<div style={{fontSize:9,color:"#fbbf24",fontWeight:800,marginBottom:6}}>👑 HOST</div>}

                    {/* ready indicator or button */}
                    {isMe ? (
                      <button
                        onClick={()=>{ if(!iAmReady) markReady(myGroup.id); }}
                        disabled={iAmReady}
                        style={{
                          width:"100%",padding:"7px 0",borderRadius:8,border:"none",
                          cursor:iAmReady?"default":"pointer",
                          background:iAmReady?"linear-gradient(135deg,#4ade80,#22c55e)":"linear-gradient(135deg,#4f8ef7,#a855f7)",
                          color:"#fff",fontSize:11,fontWeight:800,fontFamily:"inherit",
                          transition:"all 0.3s",
                        }}>
                        {iAmReady?"✅ Ready!":"Click READY"}
                      </button>
                    ) : (
                      <div style={{
                        padding:"6px 0",borderRadius:8,fontSize:11,fontWeight:700,
                        color:isReady?"#4ade80":"#f87171",
                        background:isReady?"rgba(74,222,128,0.1)":"rgba(248,113,113,0.1)",
                        border:`1px solid ${isReady?"rgba(74,222,128,0.3)":"rgba(248,113,113,0.3)"}`,
                      }}>
                        {isReady?"✅ Ready":"Not Ready"}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* empty slots */}
              {Array.from({length: 4-myGroup.members.length}).map((_,i) => (
                <div key={`empty-${i}`} style={{background:darkMode?"rgba(255,255,255,0.02)":"#fafafa",border:`2px dashed ${cardBr}`,borderRadius:14,padding:"18px 12px",textAlign:"center",opacity:0.5}}>
                  <div style={{width:48,height:48,borderRadius:"50%",background:darkMode?"rgba(255,255,255,0.06)":"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:20,color:sub}}>?</div>
                  <div style={{fontSize:12,color:sub}}>Waiting…</div>
                  <div style={{fontSize:10,color:sub,marginTop:4}}>Empty Slot</div>
                </div>
              ))}
            </div>
          </div>

          {/* ready status bar */}
          <div style={{
            padding:"12px 16px",borderRadius:10,marginBottom:16,
            background:allReady?"rgba(74,222,128,0.08)":"rgba(251,191,36,0.07)",
            border:`1.5px solid ${allReady?"rgba(74,222,128,0.4)":"rgba(251,191,36,0.35)"}`,
            display:"flex",alignItems:"center",gap:10,
          }}>
            <span style={{fontSize:18}}>{allReady?"✅":"⏳"}</span>
            <span style={{fontSize:13,fontWeight:700,color:allReady?"#4ade80":"#fbbf24"}}>
              {allReady
                ? "All players ready! Host can start the exam."
                : `${readyPlayers.length}/${myGroup.members.length} players ready. Waiting for everyone to click READY.`}
            </span>
          </div>

          {/* invite panel */}
          {myGroup.host===user.id && myGroup.status==="lobby" && myGroup.members.length<4 && (
            <div style={{borderTop:`1px solid ${cardBr}`,paddingTop:18}}>
              <div style={{fontSize:14,fontWeight:900,color:txt,marginBottom:4}}>
                👥 Invite Friends &nbsp;
                <span style={{fontSize:12,color:sub,fontWeight:400}}>({myGroup.members.length}/4 slots)</span>
              </div>
              {connections.length===0 ? (
                <div style={{padding:18,background:darkMode?"rgba(255,255,255,0.03)":"#f9fafb",borderRadius:10,fontSize:13,color:sub,textAlign:"center"}}>
                  No connections yet. Go to <b style={{color:"#4f8ef7"}}>Explore Students</b> and connect first.
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {connections.filter(c=>!myGroup.members.includes(c.id)).map(c => {
                    const alreadyInvited = invites.some(i=>i.groupId===myGroup.id&&i.to===c.id&&i.status==="pending");
                    const accepted       = invites.some(i=>i.groupId===myGroup.id&&i.to===c.id&&i.status==="accepted");
                    return (
                      <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:darkMode?"rgba(255,255,255,0.03)":"#f9fafb",borderRadius:11,border:`1px solid ${cardBr}`}}>
                        <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#a855f7,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:"#fff",flexShrink:0}}>
                          {c.name[0]}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,fontWeight:800,color:txt}}>{c.name}</div>
                          <div style={{fontSize:11,color:sub}}>@{c.socialProfile?.username||"—"} · {c.profile?.branch}</div>
                        </div>
                        <button
                          disabled={alreadyInvited||accepted}
                          onClick={()=>sendGroupInvite(myGroup.id,c.id)}
                          style={{padding:"8px 18px",borderRadius:9,border:"none",cursor:alreadyInvited||accepted?"default":"pointer",background:accepted?"rgba(74,222,128,0.15)":alreadyInvited?"rgba(251,191,36,0.15)":"linear-gradient(135deg,#4f8ef7,#a855f7)",color:accepted?"#4ade80":alreadyInvited?"#fbbf24":"#fff",fontSize:12,fontWeight:800,fontFamily:"inherit"}}>
                          {accepted?"✓ Joined":alreadyInvited?"⏳ Invited":"Invite →"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* non-host waiting */}
          {myGroup.host!==user.id && myGroup.status==="lobby" && (
            <div style={{marginTop:4,padding:"14px 16px",background:"rgba(79,142,247,0.07)",border:"1px solid rgba(79,142,247,0.2)",borderRadius:10,fontSize:13,color:"#7aadff",fontWeight:600}}>
              ⏳ Waiting for the host to start the test. Make sure you click READY!
            </div>
          )}
        </div>

      ) : (
        /* no active session */
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginBottom:24}}>
            {[
              {icon:"👥",t:"2–4 Players",    d:"Max 4 per session"},
              {icon:"📝",t:"100 Questions",  d:"Real DDCET pattern"},
              {icon:"⏱", t:"120 Minutes",   d:"Same as actual exam"},
              {icon:"✅",t:"Ready System",   d:"All must click Ready"},
              {icon:"3️⃣",t:"3-2-1 Countdown",d:"Start together"},
              {icon:"🏆",t:"Ranked Results", d:"Winner to Loser"},
            ].map(c=>(
              <div key={c.t} style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:12,padding:"18px 16px",textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:8}}>{c.icon}</div>
                <div style={{fontWeight:800,color:txt,fontSize:13}}>{c.t}</div>
                <div style={{fontSize:11,color:sub,marginTop:3}}>{c.d}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>createGroup()} style={{...Btn("primary"),padding:"14px 36px",fontSize:15}}>
            🚀 Create Group Session
          </button>
          <div style={{fontSize:12,color:sub,marginTop:10}}>
            After creating, invite friends from your connections list.
          </div>
        </>
      )}
    </div>
  );
}
