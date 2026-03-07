import { useState, useRef, useEffect } from "react";

const REPLY = "Charli is Currently in Developing Phase - Mitesh";

export default function Charli() {
  const [open, setOpen]   = useState(false);
  const [msgs, setMsgs]   = useState([
    { from:"charli", text:"Hi! I am Charli, your DDCET AI assistant. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs, open]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setMsgs(m => [...m, { from:"user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, { from:"charli", text: REPLY }]);
      setTyping(false);
    }, 900);
  }

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(o => !o)}
        style={{ position:"fixed", bottom:24, right:24, zIndex:999, width:60, height:60, borderRadius:"50%", background:"linear-gradient(135deg,#ef4444,#dc2626)", border:"none", cursor:"pointer", boxShadow:"0 4px 28px rgba(239,68,68,0.55)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, transition:"transform 0.2s", transform:open?"scale(0.9)":"scale(1)" }}
        title="Chat with Charli">
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat window — half screen height */}
      {open && (
        <div style={{ position:"fixed", bottom:96, right:24, zIndex:998, width:"min(480px, calc(100vw - 48px))", height:"50vh", minHeight:360, background:"#0d0d1a", border:"1px solid rgba(239,68,68,0.3)", borderRadius:20, display:"flex", flexDirection:"column", boxShadow:"0 12px 50px rgba(0,0,0,0.7)", overflow:"hidden" }}>

          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#ef4444,#dc2626)", padding:"16px 20px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
            <div style={{ fontSize:26 }}>🤖</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, color:"#fff", fontSize:17 }}>Charli</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)" }}>DDCET AI Assistant · Powered by Ranklify</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 8px #4ade80" }} />
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 8px" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent:m.from==="user"?"flex-end":"flex-start", marginBottom:12 }}>
                {m.from==="charli" && (
                  <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#ef4444,#dc2626)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, marginRight:8, flexShrink:0, alignSelf:"flex-end" }}>🤖</div>
                )}
                <div style={{ maxWidth:"75%", padding:"11px 15px", borderRadius:m.from==="user"?"16px 3px 16px 16px":"3px 16px 16px 16px", background:m.from==="user"?"linear-gradient(135deg,#4f8ef7,#a855f7)":"rgba(255,255,255,0.07)", color:"#e2e2f0", fontSize:14, lineHeight:1.55 }}>
                  {m.text}
                </div>
                {m.from==="user" && (
                  <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, marginLeft:8, flexShrink:0, alignSelf:"flex-end", fontWeight:700, color:"#fff" }}>U</div>
                )}
              </div>
            ))}
            {typing && (
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#ef4444,#dc2626)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🤖</div>
                <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:"3px 16px 16px 16px", padding:"12px 16px" }}>
                  <span style={{ color:"#888", fontSize:20, letterSpacing:4 }}>•••</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", gap:10, flexShrink:0, background:"rgba(0,0,0,0.2)" }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
              placeholder="Ask Charli anything about DDCET…"
              style={{ flex:1, background:"rgba(255,255,255,0.07)", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"11px 14px", color:"#e2e2f0", fontSize:14, outline:"none", fontFamily:"inherit" }}
              onFocus={e=>{e.target.style.borderColor="#ef4444"}} onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)"}} />
            <button onClick={send} style={{ padding:"11px 18px", borderRadius:10, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", fontSize:18, flexShrink:0 }}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
