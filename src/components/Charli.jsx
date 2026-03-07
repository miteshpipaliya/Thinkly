/*
 * Charli — DDCET AI Assistant
 * Version 3.0 — Ranklify
 * Updated: bigger chat window, more message space
 */
import { useState, useRef, useEffect } from "react";

const CHARLI_REPLY = "Charli is Currently in Developing Phase - Mitesh";

export default function Charli() {
  const [isOpen,  setIsOpen]  = useState(false);
  const [messages, setMessages] = useState([
    { role: "charli", text: "Hi! I am Charli 👋 Your DDCET AI assistant. Ask me anything about the exam!" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  function handleSend() {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { role: "user", text: trimmed }]);
    setInputVal("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "charli", text: CHARLI_REPLY }]);
      setIsTyping(false);
    }, 1000);
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        title="Chat with Charli"
        style={{
          position: "fixed",
          bottom: 22,
          right: 22,
          zIndex: 1000,
          width: 62,
          height: 62,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ef4444, #b91c1c)",
          border: "none",
          cursor: "pointer",
          fontSize: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 30px rgba(239,68,68,0.6)",
          transform: isOpen ? "scale(0.88)" : "scale(1)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {/* ── Chat panel ── */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 96,
            right: 22,
            zIndex: 999,
            width: "min(500px, calc(100vw - 44px))",
            height: "62vh",
            minHeight: 420,
            maxHeight: 680,
            background: "#0b0b16",
            border: "1.5px solid rgba(239,68,68,0.35)",
            borderRadius: 22,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 16px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(239,68,68,0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              flexShrink: 0,
              background: "linear-gradient(135deg, #ef4444, #b91c1c)",
              padding: "15px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              🤖
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: 17, lineHeight: 1.2 }}>Charli</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.72)" }}>DDCET AI Assistant · Powered by Ranklify</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 8px #4ade80",
                }}
              />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Online</span>
            </div>
          </div>

          {/* Messages area — this is the large scrollable space */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "18px 16px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  gap: 8,
                }}
              >
                {/* Charli avatar */}
                {msg.role === "charli" && (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    🤖
                  </div>
                )}

                {/* Bubble */}
                <div
                  style={{
                    maxWidth: "74%",
                    padding: "11px 15px",
                    borderRadius:
                      msg.role === "user"
                        ? "18px 4px 18px 18px"
                        : "4px 18px 18px 18px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #4f8ef7, #a855f7)"
                        : "rgba(255,255,255,0.08)",
                    color: "#e2e2f0",
                    fontSize: 14,
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>

                {/* User avatar */}
                {msg.role === "user" && (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#4f8ef7,#a855f7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    U
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  🤖
                </div>
                <div
                  style={{
                    padding: "12px 18px",
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "4px 18px 18px 18px",
                  }}
                >
                  <span style={{ color: "#888", fontSize: 22, letterSpacing: 5 }}>•••</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input bar */}
          <div
            style={{
              flexShrink: 0,
              padding: "12px 14px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(0,0,0,0.25)",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Charli anything about DDCET…"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "12px 15px",
                color: "#e2e2f0",
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
              }}
              onFocus={e => { e.target.style.borderColor = "#ef4444"; }}
              onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
            <button
              onClick={handleSend}
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                color: "#fff",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
