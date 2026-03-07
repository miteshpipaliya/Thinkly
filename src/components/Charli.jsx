import { useState, useRef, useEffect } from "react";

const REPLY = "Charli is Currently in Developing Phase - Mitesh";

export default function Charli() {
  const [open, setOpen]     = useState(false);
  const [msgs, setMsgs]     = useState([
    { from:"charli", text:"Hi! I am Charli, your DDCET assistant. How can I help?" }
  ]);
  const [input, setInput]   = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef           = useRef(null);

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
      {/* Floating button — red AI style */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position:"fixed", bottom:24, right:24, zIndex:999,
          width:56, height:56, borderRadius:"50%",
          background:"linear-gradient(135deg,#ef4444,#dc2626)",
          border:"none", cursor:"pointer",
          boxShadow:"0 4px 24px rgba(239,68,68,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:26, transition:"transform 0.2s",
          transform: open ? "scale(0.9)" : "scale(1)",
        }}
        title="Chat with Charli"
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position:"fixed", bottom:92, right:24, zIndex:998,
          width:320, height:420, background:"#0d0d1a",
          border:"1px solid rgba(239,68,68,0.3)",
          borderRadius:18, display:"flex", flexDirection:"column",
          boxShadow:"0 8px 40px rgba(0,0,0,0.6)",
          overflow:"hidden",
        }}>
          {/* Header */}
          <div style={{
            background:"linear-gradient(135deg,#ef4444,#dc2626)",
            padding:"14px 18px", display:"flex", alignItems:"center", gap:10,
          }}>
            <div style={{ fontSize:22 }}>🤖</div>
            <div>
              <div style={{ fontWeight:800, color:"#fff", fontSize:15 }}>Charli</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)" }}>DDCET AI Assistant</div>
            </div>
            <div style={{ marginLeft:"auto", width:8, height:8, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 6px #4ade80" }} />
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                display:"flex", justifyContent: m.from==="user" ? "flex-end" : "flex-start",
                marginBottom:10,
              }}>
                {m.from === "charli" && (
                  <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#ef4444,#dc2626)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, marginRight:7, flexShrink:0, alignSelf:"flex-end" }}>🤖</div>
                )}
                <div style={{
                  maxWidth:"78%", padding:"9px 13px", borderRadius: m.from==="user" ? "14px 2px 14px 14px" : "2px 14px 14px 14px",
                  background: m.from==="user" ? "linear-gradient(135deg,#4f8ef7,#a855f7)" : "rgba(255,255,255,0.06)",
                  color:"#e2e2f0", fontSize:13, lineHeight:1.5,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#ef4444,#dc2626)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>🤖</div>
                <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:"2px 14px 14px 14px", padding:"9px 14px" }}>
                  <span style={{ color:"#888", fontSize:18, letterSpacing:3 }}>•••</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding:"10px 12px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask Charli anything…"
              style={{
                flex:1, background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.08)",
                borderRadius:9, padding:"9px 12px", color:"#e2e2f0", fontSize:13,
                outline:"none", fontFamily:"inherit",
              }}
              onFocus={e=>{e.target.style.borderColor="#ef4444"}}
              onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)"}}
            />
            <button onClick={send} style={{
              padding:"9px 14px", borderRadius:9, border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", fontSize:16,
            }}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
