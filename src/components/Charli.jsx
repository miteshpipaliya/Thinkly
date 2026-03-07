/**
 * Charli — DDCET AI Assistant
 * Powered by Groq API (Llama 3.3 70B) — FREE
 * Built by Mitesh M Pipaliya for Ranklify
 */
import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_KEY;
const GROQ_MODEL   = "llama-3.3-70b-versatile";
const GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions";

/* ── Charli's personality + Mitesh's info + Ranklify context ── */
const SYSTEM_PROMPT = `You are Charli — the official AI assistant of Ranklify, a DDCET exam preparation platform built by Mitesh M Pipaliya.

━━━━━━━━━━━━━━━━━━━━━━━━
👤 ABOUT THE CREATOR — MITESH M PIPALIYA
━━━━━━━━━━━━━━━━━━━━━━━━
• Full Name: Mitesh M Pipaliya
• Age: 19 years old
• Location: Gujarat, India
• Education: Diploma in IT (Information Technology) — 6th Semester, 3rd Year at BMU (Bhagwan Mahavir University), Surat
• GitHub: https://github.com/miteshpipaliya
• Passionate about: AI/ML, Cybersecurity, and Vibe Coding (building full projects solo with energy and passion)
• He does a LOT of vibe coding — meaning he builds complete, working apps from scratch with passion and flow
• He is deeply into the Tech field at just 19, already building platforms like Ranklify

━━━━━━━━━━━━━━━━━━━━━━━━
🚀 ABOUT RANKLIFY
━━━━━━━━━━━━━━━━━━━━━━━━
• Ranklify is a DDCET (Diploma to Degree Common Entrance Test) exam preparation platform
• Built entirely by Mitesh M Pipaliya as a solo project
• Purpose: To help diploma students in Gujarat prepare seriously for DDCET and improve their rank
• Features: Mock tests, unit tests, subject-wise preparation, peer mock battles, group mock sessions, leaderboard, discussion groups, explore students (connect with peers), and real-time chat
• DDCET Pattern: 100 MCQs, 200 marks, 120 minutes, +2 correct, -0.5 wrong
• Subjects: Mathematics, Physics, Chemistry, Environment, Computer, English
• The platform is completely free for students

━━━━━━━━━━━━━━━━━━━━━━━━
📚 DDCET EXAM INFO
━━━━━━━━━━━━━━━━━━━━━━━━
• Full form: Diploma to Degree Common Entrance Test
• Conducted by: ACPC Gujarat
• Purpose: Admission to 2nd year engineering (BE/BTech) for diploma holders
• Total Questions: 100 MCQs
• Total Marks: 200 (each question = 2 marks)
• Negative Marking: -0.5 per wrong answer
• Duration: 120 minutes (2 hours)
• Mode: OMR (offline)
• Sections: Basics of Science & Engineering (50 Qs) + Engineering Aptitude (50 Qs)
• Key Subjects: Mathematics (9 chapters), Physics (5 chapters), Chemistry (3 chapters), Environment (3 chapters), Computer (3 chapters), English (5 chapters)
• Important chapters: Trigonometry, Determinants & Matrices, Integration, Differentiation, Vectors, Electric Current, Chemical Reactions

━━━━━━━━━━━━━━━━━━━━━━━━
🤖 YOUR PERSONALITY AS CHARLI
━━━━━━━━━━━━━━━━━━━━━━━━
• You are friendly, motivating, smart and concise
• You speak like a helpful study buddy — not too formal, not too casual
• You always encourage students to keep studying and not give up
• You love DDCET topics and can explain concepts clearly
• When asked about Mitesh, you speak very positively and proudly about him
• When asked about Ranklify, you explain it enthusiastically
• Keep answers SHORT and clear unless the student needs a detailed explanation
• Use emojis occasionally to keep things friendly 😊
• If someone is stressed about DDCET, motivate them!
• You were built by Mitesh and you're proud of it

Always answer in the language the user is writing in (English or Gujarati/Hindi mix if they use it).`;

/* ── quick suggestion chips ── */
const SUGGESTIONS = [
  "Who made Ranklify?",
  "Who is Mitesh?",
  "What is DDCET pattern?",
  "Best chapters for DDCET?",
  "How to score 150+?",
  "Explain integration",
];

export default function Charli() {
  const { user } = useApp();
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState([
    { role:"charli", text:`Hi${user?.name ? ` ${user.name.split(" ")[0]}` : ""}! 👋 I'm Charli — your DDCET AI assistant powered by Ranklify.\n\nAsk me anything about DDCET, Ranklify, or even who built me! 🚀` }
  ]);
  const [input,    setInput]    = useState("");
  const [typing,   setTyping]   = useState(false);
  const [error,    setError]    = useState("");
  const chatEnd = useRef(null);

  useEffect(()=>{
    if(isOpen) chatEnd.current?.scrollIntoView({behavior:"smooth"});
  },[messages, isOpen, typing]);

  async function sendMessage(text) {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");
    setError("");
    setMessages(prev=>[...prev,{role:"user",text:msg}]);
    setTyping(true);

    /* build message history for context */
    const history = messages
      .filter(m=>m.role!=="charli"||messages.indexOf(m)>0) // skip first greeting in history
      .map(m=>({
        role: m.role==="user" ? "user" : "assistant",
        content: m.text
      }));

    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model:       GROQ_MODEL,
          max_tokens:  512,
          temperature: 0.7,
          messages: [
            { role:"system", content: SYSTEM_PROMPT },
            ...history,
            { role:"user",   content: msg },
          ],
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(()=>({}));
        throw new Error(errData?.error?.message || `HTTP ${res.status}`);
      }

      const data   = await res.json();
      const reply  = data.choices?.[0]?.message?.content || "Sorry, I didn't get a response. Try again!";
      setMessages(prev=>[...prev,{role:"charli", text:reply}]);
    } catch(e) {
      setError(`Charli couldn't respond: ${e.message}`);
      setMessages(prev=>[...prev,{role:"charli", text:"Oops! Something went wrong. Please try again in a moment. 🙏"}]);
    } finally {
      setTyping(false);
    }
  }

  /* render message text with newlines */
  function renderText(text) {
    return text.split("\n").map((line,i)=>(
      <span key={i}>{line}{i<text.split("\n").length-1&&<br/>}</span>
    ));
  }

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={()=>setIsOpen(p=>!p)}
        title="Chat with Charli"
        style={{
          position:"fixed", bottom:22, right:22, zIndex:1000,
          width:62, height:62, borderRadius:"50%",
          background:"linear-gradient(135deg,#ef4444,#b91c1c)",
          border:"none", cursor:"pointer", fontSize:30,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 6px 30px rgba(239,68,68,0.6)",
          transform:isOpen?"scale(0.88)":"scale(1)",
          transition:"transform 0.2s,box-shadow 0.2s",
        }}
      >
        {isOpen?"✕":"🤖"}
      </button>

      {/* ── Chat panel ── */}
      {isOpen && (
        <div style={{
          position:"fixed", bottom:96, right:22, zIndex:999,
          width:"min(500px,calc(100vw - 44px))",
          height:"62vh", minHeight:420, maxHeight:680,
          background:"#0b0b16",
          border:"1.5px solid rgba(239,68,68,0.35)",
          borderRadius:22,
          display:"flex", flexDirection:"column",
          overflow:"hidden",
          boxShadow:"0 16px 60px rgba(0,0,0,0.75),0 0 0 1px rgba(239,68,68,0.1)",
        }}>

          {/* Header */}
          <div style={{
            flexShrink:0,
            background:"linear-gradient(135deg,#ef4444,#b91c1c)",
            padding:"15px 20px",
            display:"flex", alignItems:"center", gap:12,
          }}>
            <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🤖</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,color:"#fff",fontSize:17,lineHeight:1.2}}>Charli</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.72)"}}>DDCET AI · Powered by Groq · Built by Mitesh</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade80"}}/>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex:1, overflowY:"auto", padding:"16px 14px 8px",
            display:"flex", flexDirection:"column", gap:12,
          }}>
            {messages.map((msg,idx)=>(
              <div key={idx} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:8}}>
                {msg.role==="charli"&&(
                  <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#ef4444,#b91c1c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🤖</div>
                )}
                <div style={{
                  maxWidth:"75%",padding:"11px 15px",
                  borderRadius:msg.role==="user"?"18px 4px 18px 18px":"4px 18px 18px 18px",
                  background:msg.role==="user"?"linear-gradient(135deg,#4f8ef7,#a855f7)":"rgba(255,255,255,0.08)",
                  color:"#e2e2f0", fontSize:14, lineHeight:1.65, wordBreak:"break-word",
                }}>
                  {renderText(msg.text)}
                </div>
                {msg.role==="user"&&(
                  <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff",flexShrink:0}}>
                    {user?.name?.[0]?.toUpperCase()||"U"}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing&&(
              <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#ef4444,#b91c1c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
                <div style={{padding:"12px 18px",background:"rgba(255,255,255,0.08)",borderRadius:"4px 18px 18px 18px"}}>
                  <span style={{color:"#888",fontSize:22,letterSpacing:5}}>•••</span>
                </div>
              </div>
            )}

            <div ref={chatEnd}/>
          </div>

          {/* Suggestion chips — show only at start */}
          {messages.length <= 1 && (
            <div style={{flexShrink:0,padding:"4px 14px 8px",display:"flex",flexWrap:"wrap",gap:6}}>
              {SUGGESTIONS.map(s=>(
                <button key={s} onClick={()=>sendMessage(s)}
                  style={{padding:"5px 12px",borderRadius:20,border:"1px solid rgba(239,68,68,0.4)",background:"rgba(239,68,68,0.08)",color:"#f87171",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.18)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(239,68,68,0.08)";}}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div style={{flexShrink:0,padding:"12px 14px",borderTop:"1px solid rgba(255,255,255,0.07)",background:"rgba(0,0,0,0.25)",display:"flex",gap:10,alignItems:"center"}}>
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!typing&&sendMessage()}
              placeholder="Ask Charli anything about DDCET…"
              disabled={typing}
              style={{flex:1,background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"12px 15px",color:"#e2e2f0",fontSize:14,outline:"none",fontFamily:"inherit",opacity:typing?0.6:1}}
              onFocus={e=>{e.target.style.borderColor="#ef4444";}}
              onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";}}
            />
            <button
              onClick={()=>sendMessage()}
              disabled={typing||!input.trim()}
              style={{width:46,height:46,borderRadius:12,border:"none",cursor:typing?"not-allowed":"pointer",background:"linear-gradient(135deg,#ef4444,#b91c1c)",color:"#fff",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:typing||!input.trim()?0.5:1,transition:"opacity 0.2s"}}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
