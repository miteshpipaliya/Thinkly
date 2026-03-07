/**
 * Discussion.jsx — Ranklify v9
 * Real-time group chat — messages saved to localStorage (rkl9_gchat)
 * and polled every 1.5 s so all users see each other's messages live.
 */
import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";

const CHANNELS = [
  { id:"general",   name:"General Discussion", emoji:"💬" },
  { id:"math",      name:"Mathematics",         emoji:"∑"  },
  { id:"physics",   name:"Physics",             emoji:"⚛"  },
  { id:"chemistry", name:"Chemistry",           emoji:"⚗"  },
  { id:"english",   name:"English",             emoji:"Aa" },
  { id:"doubts",    name:"Quick Doubts",        emoji:"🤔"  },
  { id:"mock",      name:"Mock Test Tips",      emoji:"🎯"  },
  { id:"strategy",  name:"Study Strategy",      emoji:"📋"  },
];

/* seed messages shown before anyone chats (static, not stored) */
const SEEDS = {
  general: [
    {id:-1,userId:0,userName:"Rahul P.",text:"Anyone planning to give mock test today?",channel:"general",ts:Date.now()-3600000},
    {id:-2,userId:0,userName:"Priya D.",text:"Yes! Starting in 10 mins 🙌 Good luck everyone!",channel:"general",ts:Date.now()-3500000},
  ],
  math: [
    {id:-3,userId:0,userName:"Aryan J.",text:"Can someone explain integration by parts?",channel:"math",ts:Date.now()-7200000},
    {id:-4,userId:0,userName:"Dev T.",text:"Sure! ∫u·dv = u·v − ∫v·du. Pick u as the algebraic term.",channel:"math",ts:Date.now()-7100000},
  ],
  doubts: [
    {id:-5,userId:0,userName:"Sneha M.",text:"What's the formula for sin(A-B)?",channel:"doubts",ts:Date.now()-1800000},
    {id:-6,userId:0,userName:"Rahul P.",text:"sin(A−B) = sinA cosB − cosA sinB 👍",channel:"doubts",ts:Date.now()-1700000},
  ],
};

export default function Discussion() {
  const { user, darkMode, sendGroupChat, getChannelMsgs } = useApp();
  const [active, setActive] = useState("general");
  const [input,  setInput]  = useState("");
  const msgEnd = useRef(null);

  const T      = darkMode;
  const txt    = T?"#e2e2f0":"#111";
  const sub    = T?"#555":"#888";
  const sidBg  = T?"rgba(255,255,255,0.02)":"#f9fafb";
  const chatBg = T?"rgba(255,255,255,0.02)":"#fff";
  const br     = T?"rgba(255,255,255,0.07)":"#e5e7eb";

  // real stored msgs + seed msgs merged
  const realMsgs  = getChannelMsgs ? getChannelMsgs(active) : [];
  const seedMsgs  = SEEDS[active] || [];
  const allMsgs   = [...seedMsgs, ...realMsgs].sort((a,b)=>a.ts-b.ts);

  useEffect(()=>{
    msgEnd.current?.scrollIntoView({behavior:"smooth"});
  },[active, allMsgs.length]);

  function send(){
    if(!input.trim()) return;
    sendGroupChat(input.trim(), active);
    setInput("");
    setTimeout(()=>msgEnd.current?.scrollIntoView({behavior:"smooth"}),50);
  }

  const ch = CHANNELS.find(c=>c.id===active);
  const countFor = (id) => getChannelMsgs?.(id)?.length || 0;

  return(
    <div style={{display:"flex",gap:0,height:"calc(100vh - 120px)",background:chatBg,border:`1px solid ${br}`,borderRadius:16,overflow:"hidden"}}>

      {/* ── Sidebar ── */}
      <div style={{width:210,flexShrink:0,background:sidBg,borderRight:`1px solid ${br}`,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${br}`,fontSize:11,fontWeight:800,color:sub,textTransform:"uppercase",letterSpacing:"0.06em"}}>
          💬 Channels
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"6px 8px"}}>
          {CHANNELS.map(ch=>{
            const cnt = countFor(ch.id);
            return(
              <button key={ch.id} onClick={()=>setActive(ch.id)}
                style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:9,border:"none",cursor:"pointer",marginBottom:2,background:active===ch.id?T?"rgba(79,142,247,0.15)":"rgba(79,142,247,0.08)":"transparent",color:active===ch.id?"#7aadff":sub,fontFamily:"inherit",fontSize:13,fontWeight:active===ch.id?700:400,textAlign:"left",transition:"all 0.15s"}}>
                <span style={{fontSize:15,width:20,textAlign:"center"}}>{ch.emoji}</span>
                <span style={{flex:1}}>{ch.name}</span>
                {cnt>0&&<span style={{fontSize:9,background:"rgba(79,142,247,0.2)",color:"#7aadff",padding:"1px 6px",borderRadius:10,fontWeight:800}}>{cnt}</span>}
              </button>
            );
          })}
        </div>
        <div style={{padding:"10px 14px",borderTop:`1px solid ${br}`,fontSize:11,color:sub}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#4ade80"}}/>
            Messages are saved &amp; shared with all Ranklify users.
          </div>
        </div>
      </div>

      {/* ── Chat area ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* header */}
        <div style={{padding:"13px 20px",borderBottom:`1px solid ${br}`,display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <span style={{fontSize:18}}>{ch?.emoji}</span>
          <div>
            <span style={{fontWeight:800,color:txt,fontSize:15}}>{ch?.name}</span>
            <div style={{fontSize:11,color:sub}}>All Ranklify students can read and post here</div>
          </div>
        </div>

        {/* messages */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:14}}>
          {allMsgs.map((m,i)=>{
            const isMe = m.userId===user?.id;
            return(
              <div key={m.id||i} style={{display:"flex",gap:10,flexDirection:isMe?"row-reverse":"row",alignItems:"flex-end"}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:isMe?"linear-gradient(135deg,#4f8ef7,#a855f7)":T?"rgba(255,255,255,0.1)":"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:isMe?"#fff":sub,flexShrink:0}}>
                  {m.userName?.[0]||"?"}
                </div>
                <div style={{maxWidth:"70%"}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4,flexDirection:isMe?"row-reverse":"row"}}>
                    <span style={{fontSize:12,fontWeight:700,color:isMe?"#7aadff":"#888"}}>{m.userName}</span>
                    <span style={{fontSize:10,color:T?"#333":"#ccc"}}>
                      {new Date(m.ts).toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"})}
                    </span>
                  </div>
                  <div style={{background:isMe?"rgba(79,142,247,0.12)":T?"rgba(255,255,255,0.05)":"#f3f4f6",border:`1px solid ${isMe?"rgba(79,142,247,0.25)":T?"rgba(255,255,255,0.07)":"#e5e7eb"}`,borderRadius:isMe?"14px 3px 14px 14px":"3px 14px 14px 14px",padding:"10px 14px",fontSize:13.5,color:txt,lineHeight:1.65,wordBreak:"break-word"}}>
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })}
          {allMsgs.length===0&&(
            <div style={{textAlign:"center",color:sub,paddingTop:60}}>
              <div style={{fontSize:36,marginBottom:10}}>{ch?.emoji}</div>
              <div style={{fontSize:14,fontWeight:600}}>Be the first to post in #{ch?.name}!</div>
            </div>
          )}
          <div ref={msgEnd}/>
        </div>

        {/* input */}
        <div style={{padding:"12px 16px",borderTop:`1px solid ${br}`,display:"flex",gap:10,flexShrink:0}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder={`Message #${ch?.name}…`}
            style={{flex:1,background:T?"rgba(255,255,255,0.05)":"#f9fafb",border:`1.5px solid ${br}`,borderRadius:10,padding:"11px 15px",color:txt,fontSize:13.5,outline:"none",fontFamily:"inherit"}}
            onFocus={e=>e.target.style.borderColor="#4f8ef7"} onBlur={e=>e.target.style.borderColor=br}/>
          <button onClick={send} style={{width:46,height:46,borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon name="send" size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
}
