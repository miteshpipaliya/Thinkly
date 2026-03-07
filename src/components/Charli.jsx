/**
 * Charli — DDCET AI Assistant v4.0
 * Powered by Groq API (Llama 3.3 70B)
 * Built by Mitesh M Pipaliya for Ranklify
 */
import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_KEY;
const GROQ_MODEL   = "llama-3.3-70b-versatile";
const GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are Charli — the official AI assistant of Ranklify, a DDCET exam preparation platform.

━━━━━━━━━━━━━━━━━━━━━━━━
👤 ABOUT THE CREATOR
━━━━━━━━━━━━━━━━━━━━━━━━
Name: Mitesh M Pipaliya (use "Mitesh Pipaliya" for casual mentions, "Mitesh M Pipaliya" only for detailed/formal questions)
Age: 19 years old
Location: Surat, Gujarat, India
Education: Diploma IT — 6th Semester, 3rd & Final Year at BMU (Bhagwan Mahavir University), Surat
GitHub: https://github.com/miteshpipaliya
Interests: AI/ML, Cybersecurity, Vibe Coding

PROJECTS BY MITESH:
• Ranklify — DDCET exam prep platform (this app)
• RankForge
• BlackSeal
• ChaiOS
• Upcoming: Charli (standalone AI assistant)

REPLY RULES FOR MITESH QUESTIONS:

1. Casual question like "who is mitesh", "tell me about mitesh", "who made this" etc:
Reply EXACTLY like this — word for word, nothing added, nothing removed:
"Mitesh Pipaliya is a 19-year-old tech student who's seriously deep into AI/ML, Cybersecurity, and Vibe Coding 🔥 He's the creator of Ranklify and is currently in his 3rd and final year of Diploma in IT at BMU, Surat."

2. Detailed question about Mitesh — use "Mitesh M Pipaliya", share his age, education, interests, GitHub. Keep it factual. No extra praise or motivational lines.

3. "What projects does Mitesh have" or similar — list the projects above exactly as bullet points.

IMPORTANT: Do NOT add extra lines like "pure dedication", "reshaping tech", "works late nights", "thinks big" — keep it clean and factual only.

━━━━━━━━━━━━━━━━━━━━━━━━
🚀 ABOUT RANKLIFY
━━━━━━━━━━━━━━━━━━━━━━━━
- DDCET exam prep platform built entirely by Mitesh Pipaliya as a solo project
- 100% free for all students
- Features: Mock Tests, Unit Tests, Subject prep, Peer Mock Battles (1v1), Group Mock Sessions, Leaderboard, Discussion Groups, Explore Students, Real-time Chat, Private DMs
- DDCET pattern: 100 MCQs, 200 marks, 120 min, +2 correct, -0.5 wrong
- Subjects: Mathematics, Physics, Chemistry, Environment, Computer Science, English

━━━━━━━━━━━━━━━━━━━━━━━━
📚 DDCET EXAM INFO
━━━━━━━━━━━━━━━━━━━━━━━━
- Full form: Diploma to Degree Common Entrance Test
- Conducted by: ACPC Gujarat
- For: Diploma holders seeking admission to 2nd year BE/BTech
- Questions: 100 MCQs | Marks: 200 | Duration: 120 minutes | Mode: OMR offline
- Negative marking: -0.5 per wrong answer
- Sections: Basics of Science & Engineering (50Q) + Engineering Aptitude (50Q)
- Key chapters: Trigonometry, Matrices & Determinants, Integration, Differentiation, Vectors, Coordinate Geometry, Electric Current, Heat & Thermometry, Chemical Reactions, HTML5, MS Office

━━━━━━━━━━━━━━━━━━━━━━━━
🤖 YOUR PERSONALITY AS CHARLI
━━━━━━━━━━━━━━━━━━━━━━━━
- Friendly, smart, motivating — like a cool study buddy
- NOT too formal, NOT too casual — just right
- Keep answers short and punchy unless explanation is needed
- Use emojis occasionally — don't overdo it
- When talking about Mitesh, speak with genuine pride and admiration
- Always motivate students who are stressed or struggling
- If someone is rude, stay calm and helpful
- Answer in whatever language the user writes in (English, Hindi, or Gujarati mix)
- Never say you are ChatGPT or made by OpenAI — you are Charli, made by Mitesh Pipaliya for Ranklify`;

export default function Charli() {
  const { user } = useApp();
  const firstName = user?.name?.split(" ")[0] || "";

  const [isOpen,  setIsOpen]  = useState(false);
  const [messages,setMessages]= useState([
    {
      role: "charli",
      text: `Hey${firstName ? ` ${firstName}` : ""} 👋\nI'm Charli — your personal DDCET AI assistant.\n\nAsk me anything — exam tips, concepts, or about Ranklify! 🚀`,
    }
  ]);
  const [input,   setInput]   = useState("");
  const [typing,  setTyping]  = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => {
    if (isOpen) chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, typing]);

  async function sendMessage(textArg) {
    const msg = (textArg || input).trim();
    if (!msg || typing) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setTyping(true);

    const history = messages.map(m => ({
      role:    m.role === "user" ? "user" : "assistant",
      content: m.text,
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
          max_tokens:  600,
          temperature: 0.75,
          messages: [
            { role: "system",  content: SYSTEM_PROMPT },
            ...history,
            { role: "user",    content: msg },
          ],
        }),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error?.message || `Error ${res.status}`);
      }

      const data  = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim()
        || "Sorry, I couldn't get a response. Please try again!";

      setMessages(prev => [...prev, { role: "charli", text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "charli",
        text: "Oops! Something went wrong on my end. Please try again in a moment 🙏",
      }]);
    } finally {
      setTyping(false);
    }
  }

  /* render with line breaks */
  function renderText(text) {
    return text.split("\n").map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));
  }

  /* ── pulse animation keyframes injected once ── */
  const pulseStyle = `
    @keyframes charli-pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
      50%      { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
    }
    @keyframes charli-dot {
      0%,80%,100% { opacity:0.3; transform:scale(0.8); }
      40%         { opacity:1;   transform:scale(1.2); }
    }
    .charli-dot1 { animation: charli-dot 1.2s infinite 0s; }
    .charli-dot2 { animation: charli-dot 1.2s infinite 0.2s; }
    .charli-dot3 { animation: charli-dot 1.2s infinite 0.4s; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.3); border-radius: 4px; }
  `;

  return (
    <>
      <style>{pulseStyle}</style>

      {/* ── Floating button ── */}
      <button
        onClick={() => setIsOpen(p => !p)}
        title="Chat with Charli"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 1000,
          width: 60, height: 60, borderRadius: "50%",
          background: isOpen
            ? "linear-gradient(135deg,#374151,#1f2937)"
            : "linear-gradient(135deg,#ef4444,#dc2626)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isOpen
            ? "0 4px 20px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(239,68,68,0.55)",
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          transform: isOpen ? "rotate(90deg) scale(0.9)" : "rotate(0deg) scale(1)",
          animation: isOpen ? "none" : "charli-pulse 2.5s infinite",
        }}
      >
        <span style={{ fontSize: 26, transition: "all 0.2s", lineHeight: 1 }}>
          {isOpen ? "✕" : "🤖"}
        </span>
      </button>

      {/* ── Chat panel ── */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: 96, right: 24, zIndex: 999,
          width: "min(460px, calc(100vw - 48px))",
          height: "65vh", minHeight: 440, maxHeight: 700,
          background: "linear-gradient(180deg,#0d0d1a 0%,#0a0a14 100%)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 24,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(239,68,68,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}>

          {/* ── Header ── */}
          <div style={{
            flexShrink: 0,
            background: "linear-gradient(135deg,#1a0505 0%,#2d0808 50%,#1a0505 100%)",
            borderBottom: "1px solid rgba(239,68,68,0.2)",
            padding: "14px 18px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            {/* avatar with glow ring */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
                boxShadow: "0 0 0 2px rgba(239,68,68,0.3), 0 0 16px rgba(239,68,68,0.3)",
              }}>🤖</div>
              {/* online dot */}
              <div style={{
                position: "absolute", bottom: 1, right: 1,
                width: 11, height: 11, borderRadius: "50%",
                background: "#4ade80",
                border: "2px solid #1a0505",
                boxShadow: "0 0 6px #4ade80",
              }}/>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: 900, color: "#fff", fontSize: 16,
                letterSpacing: "0.02em", lineHeight: 1.2,
              }}>Charli</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
                DDCET AI · by Mitesh Pipaliya
              </div>
            </div>

            {/* powered by pill */}
            <div style={{
              padding: "3px 10px", borderRadius: 20,
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              fontSize: 10, fontWeight: 700,
              color: "#f87171", letterSpacing: "0.04em",
            }}>
              ⚡ GROQ AI
            </div>
          </div>

          {/* ── Messages ── */}
          <div style={{
            flex: 1, overflowY: "auto",
            padding: "16px 14px 10px",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-end", gap: 8,
              }}>
                {/* Charli avatar */}
                {msg.role === "charli" && (
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(239,68,68,0.4)",
                  }}>🤖</div>
                )}

                {/* bubble */}
                <div style={{
                  maxWidth: "76%",
                  padding: "11px 15px",
                  borderRadius: msg.role === "user"
                    ? "18px 4px 18px 18px"
                    : "4px 18px 18px 18px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg,#4f8ef7,#7c3aed)"
                    : "rgba(255,255,255,0.07)",
                  border: msg.role === "user"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.07)",
                  color: "#e8e8f0",
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  wordBreak: "break-word",
                  backdropFilter: "blur(4px)",
                }}>
                  {renderText(msg.text)}
                </div>

                {/* User avatar */}
                {msg.role === "user" && (
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "linear-gradient(135deg,#4f8ef7,#7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 900, color: "#fff", flexShrink: 0,
                  }}>
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
            ))}

            {/* ── Typing dots ── */}
            {typing && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15,
                }}>🤖</div>
                <div style={{
                  padding: "13px 18px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "4px 18px 18px 18px",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  {[1,2,3].map(n => (
                    <div key={n} className={`charli-dot${n}`} style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: "#ef4444",
                    }}/>
                  ))}
                </div>
              </div>
            )}

            <div ref={chatEnd} />
          </div>

          {/* ── Input bar ── */}
          <div style={{
            flexShrink: 0,
            padding: "12px 14px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.3)",
            display: "flex", gap: 10, alignItems: "center",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask me anything…"
              disabled={typing}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1.5px solid rgba(255,255,255,0.09)",
                borderRadius: 14,
                padding: "11px 16px",
                color: "#e8e8f0",
                fontSize: 13.5,
                outline: "none",
                fontFamily: "inherit",
                opacity: typing ? 0.5 : 1,
                transition: "border-color 0.2s, opacity 0.2s",
              }}
              onFocus={e  => e.target.style.borderColor = "rgba(239,68,68,0.6)"}
              onBlur={e   => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
            />
            <button
              onClick={() => sendMessage()}
              disabled={typing || !input.trim()}
              style={{
                width: 44, height: 44, borderRadius: 12,
                border: "none",
                cursor: typing || !input.trim() ? "not-allowed" : "pointer",
                background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                color: "#fff", fontSize: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                opacity: typing || !input.trim() ? 0.4 : 1,
                transition: "opacity 0.2s, transform 0.1s",
                boxShadow: "0 2px 12px rgba(239,68,68,0.4)",
              }}
              onMouseEnter={e => { if(!typing && input.trim()) e.currentTarget.style.transform="scale(1.08)"; }}
              onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
