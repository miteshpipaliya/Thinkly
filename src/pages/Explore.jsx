/**
 * Explore.jsx — Ranklify v9
 * ─ Real users only (no fake data)
 * ─ Online students section with green dot
 * ─ REQUEST → REQUESTED → CONNECTED button flow
 * ─ Dark mode: white bg / black text  |  Light: black bg / yellow text
 * ─ ⚔️ Start Peer Mock once CONNECTED
 * ─ Peer Mock 1v1 with live progress, results & loser message
 */
import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { SUBJECTS, QUESTION_BANK } from "../data/subjects";

/* ── seeded shuffle ─────────────────────────────────────────── */
function seededShuffle(arr, seed) {
  const a=[...arr]; let s=(seed%2147483647)||1;
  for(let i=a.length-1;i>0;i--){s=(s*16807)%2147483647;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function buildPaper(seed){
  const base=seededShuffle([...QUESTION_BANK],seed);
  let p=[...base]; while(p.length<100)p=[...p,...base];
  return p.slice(0,100);
}
const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const SECS=120*60;

export default function Explore() {
  const {
    user, users, darkMode, onlineIds,
    sendRequest, isConnected, isPending, isIncoming,
    createGroup, startGroupSession, submitGroupResult,
    sendGroupInvite, groups, addResult,
  } = useApp();

  const T = darkMode;
  const txt    = T?"#e2e2f0":"#111";
  const sub    = T?"#555":"#888";
  const cardBg = T?"rgba(255,255,255,0.025)":"#fff";
  const cardBr = T?"rgba(255,255,255,0.07)":"#e5e7eb";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | online | connected

  /* peer mock */
  const [pSess, setPSess]   = useState(null);
  const [phase, setPhase]   = useState("idle");
  const [qs,    setQs]      = useState([]);
  const [ans,   setAns]     = useState({});
  const [curr,  setCurr]    = useState(0);
  const [tLeft, setTLeft]   = useState(SECS);
  const [t0,    setT0]      = useState(null);
  const [myR,   setMyR]     = useState(null);
  const [peerR, setPeerR]   = useState(null);
  const tmr = useRef(null);

  /* ── students ── */
  const students = users
    .filter(u=>u.id!==user?.id)
    .map(u=>({...u, isOnline:onlineIds.includes(u.id)}));

  const onlineSt    = students.filter(u=>u.isOnline);
  const connectedSt = students.filter(u=>isConnected(u.id));

  /* consistent "fake" progress from user id */
  function progOf(u){
    const seed=(typeof u.id==="number"?u.id:0)%10000;
    const o={};
    SUBJECTS.forEach((s,i)=>{o[s.id]=Math.min(100,Math.max(5,((seed+(i+1)*17)%90)+5));});
    return o;
  }

  const visible = students.filter(u=>{
    const q=search.toLowerCase();
    const m=!q||u.name.toLowerCase().includes(q)||(u.socialProfile?.city||"").toLowerCase().includes(q)||(u.profile?.branch||"").toLowerCase().includes(q);
    if(filter==="online")    return m&&u.isOnline;
    if(filter==="connected") return m&&isConnected(u.id);
    return m;
  });

  /* ── watch peer result ── */
  useEffect(()=>{
    if(!pSess||phase!=="waiting") return;
    const grp=groups.find(g=>g.id===pSess.groupId);
    if(grp?.results?.[pSess.peerId]){setPeerR(grp.results[pSess.peerId]);setPhase("done");}
  },[groups,phase,pSess]);

  /* ── timer ── */
  useEffect(()=>{
    if(phase!=="running") return;
    tmr.current=setInterval(()=>{
      setTLeft(t=>{if(t<=1){clearInterval(tmr.current);doSubmit();return 0;}return t-1;});
    },1000);
    return()=>clearInterval(tmr.current);
  },[phase]);

  function startPeerMock(peer){
    const seed=Date.now();
    const g=createGroup(seed);
    sendGroupInvite(g.id,peer.id);
    startGroupSession(g.id);
    setQs(buildPaper(seed));
    setAns({}); setCurr(0); setTLeft(SECS); setT0(Date.now());
    setPSess({peerId:peer.id,peerName:peer.name,groupId:g.id});
    setPhase("running");
  }

  function doSubmit(){
    clearInterval(tmr.current);
    const elapsed=Math.round((Date.now()-t0)/1000);
    let score=0,correct=0,wrong=0,unanswered=0;
    qs.forEach((q,i)=>{
      const ua=ans[i];
      if(!ua)unanswered++;
      else if(ua===q.ans){correct++;score+=2;}
      else{wrong++;score-=0.5;}
    });
    score=Math.max(0,Math.round(score*10)/10);
    const accuracy=Math.round(correct/qs.length*100);
    const result={score,correct,wrong,unanswered,accuracy,timeTaken:elapsed};
    setMyR(result);
    if(pSess) submitGroupResult(pSess.groupId,result);
    addResult({title:`Peer Mock vs ${pSess?.peerName}`,isMock:true,...result});
    setPhase("waiting");
  }

  const pct=tLeft/SECS*100;
  const tcol=pct>50?"#4ade80":pct>20?"#fbbf24":"#f87171";

  /* ── REQUEST button ── */
  function ReqBtn({u}){
    const conn=isConnected(u.id), pend=isPending(u.id);
    if(conn) return(
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"8px",background:"rgba(74,222,128,0.10)",border:"1.5px solid rgba(74,222,128,0.3)",borderRadius:9}}>
          <span style={{fontSize:13,color:"#4ade80",fontWeight:900}}>✓ CONNECTED</span>
        </div>
        <button onClick={()=>startPeerMock(u)}
          style={{width:"100%",padding:"12px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",color:"#fff",fontSize:13,fontWeight:900,fontFamily:"inherit",letterSpacing:"0.04em",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow="0 4px 22px rgba(79,142,247,0.5)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
          ⚔️ START MOCK TOGETHER
        </button>
      </div>
    );
    if(pend) return(
      <button disabled style={{width:"100%",padding:"12px",borderRadius:10,border:"2px solid rgba(251,191,36,0.4)",cursor:"default",background:"rgba(251,191,36,0.09)",color:"#fbbf24",fontSize:14,fontWeight:900,fontFamily:"inherit",letterSpacing:"0.08em",textTransform:"uppercase",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <span>⏳</span><span>REQUESTED</span>
      </button>
    );
    /* default REQUEST */
    return(
      <button onClick={()=>sendRequest(u.id)}
        style={{width:"100%",padding:"12px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:900,letterSpacing:"0.1em",textTransform:"uppercase",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s",
          background:T?"#ffffff":"#000000",
          color:T?"#000000":"#fbbf24",
          border:T?"2px solid rgba(255,255,255,0.6)":"2px solid #000"}}
        onMouseEnter={e=>{e.currentTarget.style.background=T?"#eeeeee":"#1c1c1c";e.currentTarget.style.transform="scale(1.02)";e.currentTarget.style.boxShadow=T?"0 4px 22px rgba(255,255,255,0.18)":"0 4px 22px rgba(0,0,0,0.5)";}}
        onMouseLeave={e=>{e.currentTarget.style.background=T?"#ffffff":"#000000";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
        <span style={{fontSize:16}}>🔒</span><span>REQUEST</span>
      </button>
    );
  }

  /* ════════ PEER MOCK — RUNNING ═══════════════════════════════ */
  if(phase==="running"&&qs.length>0){
    const q=qs[curr], answered=Object.keys(ans).length;
    const grp=groups.find(g=>g.id===pSess?.groupId);
    const peerDone=grp?.results?.[pSess?.peerId];
    return(
      <div>
        {/* bar */}
        <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:12,padding:"11px 18px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>⚔️</span>
            <div><div style={{fontWeight:900,color:txt,fontSize:14}}>Peer Mock vs {pSess?.peerName}</div><div style={{fontSize:11,color:sub}}>100 Qs · +2/−0.5 · DDCET</div></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:120,height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${tcol},${tcol}88)`,transition:"width 1s linear"}}/>
            </div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:900,fontSize:18,color:tcol}}>{fmt(tLeft)}</span>
          </div>
          <span style={{fontSize:12,color:sub}}>Q{curr+1}/100 · {answered} answered</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 200px",gap:14}}>
          <div>
            <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:14,padding:"22px 24px",marginBottom:12}}>
              <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:"rgba(79,142,247,0.12)",color:"#7aadff",border:"1px solid rgba(79,142,247,0.2)"}}>{q.subject}</span>
              <div style={{fontSize:16,fontWeight:600,color:txt,lineHeight:1.75,marginTop:14,marginBottom:22}}>{q.q}</div>
              {q.opts.map((opt,i)=>{
                const sel=ans[curr]===opt;
                return(<button key={opt} onClick={()=>setAns(a=>({...a,[curr]:opt}))}
                  style={{display:"flex",alignItems:"center",gap:12,width:"100%",textAlign:"left",padding:"13px 16px",borderRadius:10,border:`1.5px solid ${sel?"#4f8ef7":T?"rgba(255,255,255,0.08)":"#e5e7eb"}`,background:sel?"rgba(79,142,247,0.13)":T?"rgba(255,255,255,0.02)":"#f9fafb",color:sel?"#7aadff":txt,cursor:"pointer",fontSize:14,fontWeight:sel?700:400,marginBottom:8,fontFamily:"inherit",transition:"all 0.15s"}}>
                  <span style={{width:28,height:28,borderRadius:"50%",background:sel?"#4f8ef722":T?"rgba(255,255,255,0.07)":"#eee",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0,color:sel?"#4f8ef7":sub}}>{["A","B","C","D"][i]}</span>{opt}
                </button>);
              })}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setCurr(c=>Math.max(0,c-1))} disabled={curr===0} style={{padding:"10px 20px",borderRadius:9,border:"none",cursor:"pointer",background:T?"rgba(255,255,255,0.07)":"#f3f4f6",color:txt,fontSize:13,fontWeight:700,fontFamily:"inherit"}}>← Prev</button>
              <button onClick={()=>setCurr(c=>Math.min(99,c+1))} disabled={curr===99} style={{padding:"10px 20px",borderRadius:9,border:"none",cursor:"pointer",background:T?"rgba(255,255,255,0.07)":"#f3f4f6",color:txt,fontSize:13,fontWeight:700,fontFamily:"inherit"}}>Next →</button>
              <div style={{flex:1}}/>
              <button onClick={()=>{if(window.confirm("Submit your test?"))doSubmit();}} style={{padding:"10px 22px",borderRadius:9,border:"none",cursor:"pointer",background:"rgba(239,68,68,0.15)",color:"#f87171",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>Submit</button>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:12,padding:14}}>
              <div style={{fontSize:11,fontWeight:800,color:sub,marginBottom:12,textTransform:"uppercase"}}>⚔️ Live Progress</div>
              {[{n:user?.name,c:"#4f8ef7",info:`Q${curr+1} · ${answered} done`},{n:pSess?.peerName,c:"#f87171",info:peerDone?"✅ Submitted":"⏳ In progress…"}].map((p,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${cardBr}`}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${p.c},${p.c}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff",flexShrink:0}}>{p.n?.[0]}</div>
                  <div><div style={{fontSize:12,fontWeight:700,color:p.c}}>{i===0?"You":p.n}</div><div style={{fontSize:10,color:sub}}>{p.info}</div></div>
                </div>
              ))}
            </div>
            <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:12,padding:14}}>
              <div style={{fontSize:11,fontWeight:800,color:sub,marginBottom:10,textTransform:"uppercase"}}>Palette</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                {qs.map((_,i)=>{const d=ans[i]!==undefined,a=i===curr;return(<button key={i} onClick={()=>setCurr(i)} style={{width:26,height:26,borderRadius:5,border:`1.5px solid ${a?"#4f8ef7":d?"rgba(79,142,247,0.4)":T?"rgba(255,255,255,0.08)":"#e5e7eb"}`,background:a?"#4f8ef7":d?"rgba(79,142,247,0.18)":"transparent",color:a?"#fff":d?"#7aadff":sub,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{i+1}</button>);})}
              </div>
              <div style={{fontSize:11,color:sub,marginTop:8}}>Done: <b style={{color:"#4ade80"}}>{answered}</b> · Left: <b style={{color:"#f87171"}}>{100-answered}</b></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════ PEER MOCK — WAITING ══════════════════════════════ */
  if(phase==="waiting") return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{fontSize:56,marginBottom:12}}>⏳</div>
        <div style={{fontSize:20,fontWeight:900,color:txt}}>You're done!</div>
        <div style={{color:sub,fontSize:13,marginTop:6,marginBottom:20}}>Waiting for {pSess?.peerName} to submit…</div>
        {myR&&<div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:14,padding:18}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {[{l:"Score",v:myR.score,c:"#4f8ef7"},{l:"Accuracy",v:myR.accuracy+"%",c:"#4ade80"},{l:"Correct",v:myR.correct,c:"#fbbf24"}].map(s=>(
              <div key={s.l} style={{textAlign:"center",background:`${s.c}12`,borderRadius:10,padding:12}}>
                <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div>
                <div style={{fontSize:10,color:sub}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );

  /* ════════ PEER MOCK — DONE ═════════════════════════════════ */
  if(phase==="done"&&myR){
    const iWon=myR.score>=(peerR?.score||0);
    return(
      <div>
        {!iWon&&<div style={{background:"rgba(239,68,68,0.08)",border:"2px solid rgba(239,68,68,0.3)",borderRadius:16,padding:"20px 24px",marginBottom:22,textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:8}}>💔</div>
          <div style={{fontSize:22,fontWeight:900,background:"linear-gradient(135deg,#f87171,#fbbf24)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>"Every winner was once a loser."</div>
          <div style={{fontSize:13,color:sub,marginTop:8}}>Keep practising! 💪🔥</div>
        </div>}
        <div style={{fontSize:22,fontWeight:900,color:txt,marginBottom:18}}>⚔️ Results vs {pSess?.peerName}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
          {[{n:user?.name,d:myR,w:iWon,c:"#4f8ef7"},{n:pSess?.peerName,d:peerR||{score:0,correct:0,wrong:0,accuracy:0},w:!iWon,c:"#f87171"}].map((p,pi)=>(
            <div key={pi} style={{background:p.w?"linear-gradient(135deg,rgba(251,191,36,0.15),rgba(251,191,36,0.03))":cardBg,border:`2px solid ${p.w?"#fbbf24":cardBr}`,borderRadius:16,padding:22,textAlign:"center"}}>
              {p.w&&<div style={{fontSize:12,fontWeight:900,color:"#fbbf24",marginBottom:6}}>🏆 WINNER</div>}
              <div style={{width:50,height:50,borderRadius:"50%",background:`linear-gradient(135deg,${p.c},${p.c}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff",margin:"0 auto 10px"}}>{p.n?.[0]}</div>
              <div style={{fontSize:15,fontWeight:900,color:txt,marginBottom:8}}>{p.n}</div>
              <div style={{fontSize:34,fontWeight:900,color:p.w?"#fbbf24":p.c}}>{p.d.score}</div>
              <div style={{fontSize:11,color:sub,marginBottom:12}}>/200 marks</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {[{l:"Correct",v:p.d.correct,c:"#4ade80"},{l:"Wrong",v:p.d.wrong,c:"#f87171"},{l:"Accuracy",v:(p.d.accuracy||0)+"%",c:"#7aadff"},{l:"Time",v:`${Math.floor((p.d.timeTaken||0)/60)}m`,c:"#fbbf24"}].map(s=>(
                  <div key={s.l} style={{background:`${s.c}10`,borderRadius:8,padding:8}}>
                    <div style={{fontSize:16,fontWeight:800,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:9,color:sub}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={()=>{setPhase("idle");setPSess(null);setMyR(null);setPeerR(null);}} style={{padding:"11px 26px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",color:"#fff",fontSize:13,fontWeight:800,fontFamily:"inherit"}}>
          ← Back to Explore
        </button>
      </div>
    );
  }

  /* ════════ MAIN PAGE ════════════════════════════════════════ */
  return(
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
        <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>👥</div>
        <div>
          <div style={{fontSize:22,fontWeight:900,color:txt}}>Explore Students</div>
          <div style={{fontSize:12,color:sub}}>Discover DDCET peers · Connect · Compete</div>
        </div>
      </div>

      {/* Privacy banner */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",background:"rgba(79,142,247,0.07)",border:"1.5px solid rgba(79,142,247,0.25)",borderRadius:11,marginBottom:20,marginTop:10}}>
        <span style={{fontSize:16}}>🔒</span>
        <span style={{fontSize:13,fontWeight:700,color:"#7aadff"}}>
          All accounts are private. Send a REQUEST — once accepted, view full profiles, chat &amp; do mock tests together.
        </span>
      </div>

      {/* ── ONLINE NOW ── */}
      {onlineSt.length>0&&(
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 10px #4ade80"}}/>
            <span style={{fontSize:16,fontWeight:900,color:txt}}>Online Now</span>
            <span style={{fontSize:12,color:sub}}>({onlineSt.length} active)</span>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {onlineSt.map((u,i)=>(
              <div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",background:cardBg,border:`1.5px solid ${isConnected(u.id)?"rgba(74,222,128,0.4)":cardBr}`,borderRadius:40}}>
                <div style={{position:"relative"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,hsl(${i*60%360},65%,55%),hsl(${(i*60+80)%360},65%,40%))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff"}}>{u.name[0]}</div>
                  <div style={{position:"absolute",bottom:-1,right:-1,width:10,height:10,borderRadius:"50%",background:"#4ade80",border:`2px solid ${cardBg}`}}/>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:txt}}>{u.name}</div>
                  <div style={{fontSize:10,color:sub}}>{u.profile?.branch}</div>
                </div>
                {isConnected(u.id)&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:"rgba(74,222,128,0.15)",color:"#4ade80",fontWeight:800}}>✓ Connected</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Search + Filters ── */}
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search name, city, branch…"
          style={{flex:1,minWidth:200,background:T?"rgba(255,255,255,0.05)":"#fff",border:`1.5px solid ${cardBr}`,borderRadius:10,padding:"10px 14px",color:txt,fontSize:13,outline:"none",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor="#4f8ef7"} onBlur={e=>e.target.style.borderColor=cardBr}/>
        {[{v:"all",l:`All (${students.length})`},{v:"online",l:`🟢 Online (${onlineSt.length})`},{v:"connected",l:`✓ Connected (${connectedSt.length})`}].map(f=>(
          <button key={f.v} onClick={()=>setFilter(f.v)}
            style={{padding:"9px 18px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",transition:"all 0.2s",background:filter===f.v?"linear-gradient(135deg,#4f8ef7,#a855f7)":T?"rgba(255,255,255,0.06)":"#f3f4f6",color:filter===f.v?"#fff":sub}}>
            {f.l}
          </button>
        ))}
      </div>

      {/* ── Empty states ── */}
      {students.length===0&&(
        <div style={{textAlign:"center",padding:"60px 20px",background:cardBg,border:`1px solid ${cardBr}`,borderRadius:16}}>
          <div style={{fontSize:56,marginBottom:14}}>👥</div>
          <div style={{fontSize:20,fontWeight:900,color:txt,marginBottom:10}}>No other students yet</div>
          <div style={{fontSize:13,color:sub,lineHeight:1.8,maxWidth:360,margin:"0 auto"}}>
            As more students sign up on Ranklify, they'll appear here.<br/>
            <b style={{color:"#7aadff"}}>Share Ranklify with friends!</b>
          </div>
        </div>
      )}

      {visible.length===0&&students.length>0&&(
        <div style={{textAlign:"center",padding:"40px",color:sub}}>
          <div style={{fontSize:36,marginBottom:10}}>😶</div>No students match your search.
        </div>
      )}

      {/* ── Cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {visible.map((u,i)=>{
          const prog=progOf(u);
          const ov=Math.round(Object.values(prog).reduce((a,v)=>a+v,0)/SUBJECTS.length);
          const conn=isConnected(u.id);
          return(
            <div key={u.id}
              style={{background:cardBg,border:`1.5px solid ${conn?"rgba(74,222,128,0.3)":cardBr}`,borderRadius:18,padding:"20px",position:"relative",overflow:"hidden",transition:"transform 0.2s,box-shadow 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=T?"0 8px 32px rgba(0,0,0,0.4)":"0 8px 32px rgba(0,0,0,0.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>

              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,hsl(${i*43%360},65%,55%),hsl(${(i*43+80)%360},65%,45%))`,borderRadius:"18px 18px 0 0"}}/>

              {u.isOnline&&<div style={{position:"absolute",top:12,right:12,display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 6px #4ade80"}}/>
                <span style={{fontSize:9,color:"#4ade80",fontWeight:800,letterSpacing:"0.05em"}}>ONLINE</span>
              </div>}

              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,marginTop:6}}>
                <div style={{position:"relative",flexShrink:0}}>
                  <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,hsl(${i*43%360},65%,55%),hsl(${(i*43+70)%360},65%,40%))`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,fontWeight:900,color:"#fff"}}>{u.name[0]}</div>
                  {conn&&<div style={{position:"absolute",bottom:-1,right:-1,width:14,height:14,borderRadius:"50%",background:"#4ade80",border:`2px solid ${cardBg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:900}}>✓</div>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:900,fontSize:15,color:txt}}>{u.name}</div>
                  <div style={{fontSize:11,color:sub}}>@{u.socialProfile?.username||u.name.split(" ")[0].toLowerCase()} · {u.socialProfile?.city||u.profile?.city||"Gujarat"}</div>
                  <div style={{fontSize:11,color:sub}}>{u.profile?.branch} · 🎯 {u.profile?.goal||"—"}/200</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:900,color:"#4f8ef7",lineHeight:1}}>{ov}%</div>
                  <div style={{fontSize:9,color:sub,marginTop:2}}>overall</div>
                </div>
              </div>

              <div style={{marginBottom:16}}>
                {SUBJECTS.map(s=>{
                  const p=prog[s.id]||0;
                  return(
                    <div key={s.id} style={{marginBottom:5}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                        <span style={{fontSize:10,color:sub}}>{s.icon} {s.name}</span>
                        <span style={{fontSize:10,fontWeight:800,color:s.color}}>{p}%</span>
                      </div>
                      <div style={{height:3,background:T?"rgba(255,255,255,0.06)":"#f0f0f0",borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${p}%`,background:`linear-gradient(90deg,${s.color},${s.color}66)`,borderRadius:2,transition:"width 0.6s"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              <ReqBtn u={u}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}
