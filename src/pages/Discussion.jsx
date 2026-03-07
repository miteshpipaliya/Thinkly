import { useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";

const CHANNELS = [
  { id:"general",   name:"General Discussion", emoji:"💬", count:24 },
  { id:"math",      name:"Mathematics",         emoji:"∑",  count:18 },
  { id:"physics",   name:"Physics",             emoji:"⚛",  count:15 },
  { id:"chemistry", name:"Chemistry",           emoji:"⚗",  count:11 },
  { id:"english",   name:"English",             emoji:"Aa", count:9  },
  { id:"doubts",    name:"Quick Doubts",        emoji:"🤔",  count:32 },
  { id:"mock",      name:"Mock Test Tips",      emoji:"🎯",  count:21 },
];

const SAMPLE_MSGS = {
  general: [
    { user:"Rahul P.",  time:"2:30 PM", msg:"Anyone planning to give mock test today?" },
    { user:"Priya D.",  time:"2:35 PM", msg:"Yes! Starting in 10 mins 🙌" },
    { user:"Mehul S.",  time:"2:40 PM", msg:"Good luck everyone! Focus on trigonometry, lots of Qs from it." },
  ],
  math: [
    { user:"Aryan J.", time:"1:10 PM", msg:"Can someone explain integration by parts?" },
    { user:"Dev T.",   time:"1:15 PM", msg:"Sure! ∫u·dv = u·v − ∫v·du. Pick u as the algebraic term." },
  ],
  doubts: [
    { user:"Sneha M.", time:"3:00 PM", msg:"What's the formula for sin(A-B)?" },
    { user:"Rahul P.", time:"3:02 PM", msg:"sin(A−B) = sinA cosB − cosA sinB 👍" },
  ],
};

export default function Discussion() {
  const { user } = useApp();
  const [active, setActive] = useState("general");
  const [msgs, setMsgs] = useState(SAMPLE_MSGS);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    const msg = { user: user?.name?.split(" ")[0] || "You", time: new Date().toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"}), msg: input.trim(), isMe: true };
    setMsgs(m => ({ ...m, [active]: [...(m[active]||[]), msg] }));
    setInput("");
  }

  return (
    <div style={{ display:"flex", gap:16, height:"calc(100vh - 120px)" }}>
      {/* Channels */}
      <div style={{ width:200, flexShrink:0 }}>
        <div style={{ fontSize:12, color:"#555", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Channels</div>
        {CHANNELS.map(ch => (
          <button key={ch.id} onClick={() => setActive(ch.id)}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:8, padding:"9px 12px", borderRadius:8, border:"none", cursor:"pointer", marginBottom:2, background:active===ch.id?"rgba(79,142,247,0.12)":"transparent", color:active===ch.id?"#7aadff":"#666", fontFamily:"inherit", fontSize:13, fontWeight:active===ch.id?600:400, textAlign:"left" }}>
            <span style={{ fontSize:14 }}>{ch.emoji}</span>
            <span style={{ flex:1 }}>{ch.name}</span>
            <span style={{ fontSize:10, color:"#444" }}>{ch.count}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex:1, background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:16 }}>{CHANNELS.find(c=>c.id===active)?.emoji}</span>
          <span style={{ fontWeight:700, color:"#ddd" }}>{CHANNELS.find(c=>c.id===active)?.name}</span>
        </div>

        {/* Messages list */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
          {(msgs[active] || []).map((m, i) => (
            <div key={i} style={{ marginBottom:16, display:"flex", gap:10, flexDirection:m.isMe?"row-reverse":"row" }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:m.isMe?"linear-gradient(135deg,#4f8ef7,#a855f7)":"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:m.isMe?"#fff":"#aaa", flexShrink:0 }}>
                {m.user[0]}
              </div>
              <div style={{ maxWidth:"70%" }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4, flexDirection:m.isMe?"row-reverse":"row" }}>
                  <span style={{ fontSize:12, fontWeight:600, color:m.isMe?"#7aadff":"#888" }}>{m.user}</span>
                  <span style={{ fontSize:10, color:"#444" }}>{m.time}</span>
                </div>
                <div style={{ background:m.isMe?"rgba(79,142,247,0.12)":"rgba(255,255,255,0.04)", border:`1px solid ${m.isMe?"rgba(79,142,247,0.2)":"rgba(255,255,255,0.06)"}`, borderRadius:m.isMe?"12px 2px 12px 12px":"2px 12px 12px 12px", padding:"10px 14px", fontSize:13.5, color:"#ddd", lineHeight:1.6 }}>
                  {m.msg}
                </div>
              </div>
            </div>
          ))}
          {(!msgs[active] || msgs[active].length === 0) && (
            <div style={{ textAlign:"center", color:"#444", paddingTop:40 }}>No messages yet. Start the conversation!</div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:10 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder={`Message #${CHANNELS.find(c=>c.id===active)?.name}…`}
            style={{ flex:1, background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:9, padding:"10px 14px", color:"#e2e2f0", fontSize:13.5, outline:"none", fontFamily:"inherit" }} />
          <button onClick={send} style={{ padding:"10px 16px", borderRadius:9, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff" }}>
            <Icon name="send" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
