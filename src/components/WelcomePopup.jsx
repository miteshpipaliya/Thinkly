/**
 * WelcomePopup.jsx — Ranklify
 * Typing animation welcome popup shown once per login session
 */
import { useState, useEffect, useRef } from "react";

const DDCET_YEAR = new Date().getFullYear() > 2026 ? new Date().getFullYear() : 2026;

const MSG_LINES = [
  (name) => `Welcome to Ranklify, @${name}.`,
  () => ``,
  () => `You just made one of the smartest decisions for your DDCET preparation.`,
  () => ``,
  () => `Thousands of diploma students study harder every year — but the ones who achieve top ranks are those who prepare smarter, compete consistently, and track their progress.`,
  () => ``,
  () => `Ranklify is built exactly for that.`,
  () => ``,
  () => `From real DDCET-level mock tests to peer competition and live study sessions — everything here is designed to push you closer to your dream rank.`,
  () => ``,
  () => `You didn't just log in to a website today.`,
  () => `You stepped into a competitive preparation arena.`,
  () => ``,
  () => `Let's begin the journey.`,
];

export default function WelcomePopup({ username, onClose }) {
  const [displayed, setDisplayed]   = useState("");
  const [lineIdx,   setLineIdx]     = useState(0);
  const [charIdx,   setCharIdx]     = useState(0);
  const [done,      setDone]        = useState(false);
  const [visible,   setVisible]     = useState(true);
  const audioCtx = useRef(null);
  const [muted, setMuted] = useState(false);

  // Build full text
  const lines = MSG_LINES.map(fn => fn(username || "student"));
  const fullText = lines.join("\n");

  // Typing sound using Web Audio API
  function playTick() {
    if (muted) return;
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch(e) {}
  }

  useEffect(() => {
    if (done) return;
    if (charIdx < fullText.length) {
      const ch = fullText[charIdx];
      const delay = ch === "\n" ? 60 : ch === "." || ch === "," ? 120 : 28;
      const t = setTimeout(() => {
        setDisplayed(prev => prev + ch);
        setCharIdx(i => i + 1);
        if (ch !== " " && ch !== "\n") playTick();
      }, delay);
      return () => clearTimeout(t);
    } else {
      setDone(true);
    }
  }, [charIdx, done, fullText]);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 400);
  }

  if (!visible) return null;

  // render text with line breaks
  const paragraphs = displayed.split("\n");

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
      animation: "fadeIn 0.3s ease",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes fadeOut { from { opacity:1 } to { opacity:0 } }
        @keyframes glow { 0%,100%{box-shadow:0 0 30px rgba(79,142,247,0.3)} 50%{box-shadow:0 0 60px rgba(168,85,247,0.4)} }
        @keyframes cursor { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      <div style={{
        background: "linear-gradient(145deg,#0a0a18,#0d0d22)",
        border: "1px solid rgba(79,142,247,0.3)",
        borderRadius: 24,
        padding: "40px 44px",
        width: "100%", maxWidth: 560,
        position: "relative",
        animation: "glow 3s infinite",
        boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
      }}>

        {/* Mute button */}
        <button onClick={() => setMuted(m => !m)} style={{
          position: "absolute", top: 16, right: 50,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, padding: "4px 10px", cursor: "pointer",
          color: "#555", fontSize: 11, fontFamily: "inherit",
        }}>
          {muted ? "🔇" : "🔊"}
        </button>

        {/* Close X */}
        <button onClick={handleClose} style={{
          position: "absolute", top: 14, right: 16,
          background: "none", border: "none", cursor: "pointer",
          color: "#444", fontSize: 20, lineHeight: 1,
        }}>✕</button>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#4f8ef7,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polyline points="22,12 18,12 15,20 9,4 6,12 2,12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, background: "linear-gradient(90deg,#4f8ef7,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Ranklify
          </span>
        </div>

        {/* Typing text */}
        <div style={{
          minHeight: 220,
          fontSize: 14.5,
          lineHeight: 1.85,
          color: "#c8cfe8",
          fontFamily: "'Sora', sans-serif",
          letterSpacing: "0.01em",
        }}>
          {paragraphs.map((line, i) => (
            <p key={i} style={{
              margin: line === "" ? "8px 0" : "0 0 2px 0",
              color: line.startsWith("Welcome") ? "#fff" :
                     line.startsWith("You didn't") || line.startsWith("You stepped") || line.startsWith("Let's") ? "#a5b4fc" :
                     line.startsWith("Ranklify is") ? "#7dd3fc" : "#c8cfe8",
              fontWeight: line.startsWith("Welcome") || line.startsWith("Let's") ? 700 : 400,
              fontSize: line.startsWith("Welcome") ? 17 : 14.5,
            }}>
              {line}
            </p>
          ))}
          {/* blinking cursor while typing */}
          {!done && (
            <span style={{ display: "inline-block", width: 2, height: 16, background: "#4f8ef7", marginLeft: 2, verticalAlign: "middle", animation: "cursor 0.7s infinite" }}/>
          )}
        </div>

        {/* Button — shown when typing done */}
        {done && (
          <button onClick={handleClose} style={{
            marginTop: 28,
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 800,
            background: "linear-gradient(135deg,#4f8ef7,#a855f7)",
            color: "#fff",
            letterSpacing: "0.03em",
            fontFamily: "inherit",
            boxShadow: "0 4px 24px rgba(79,142,247,0.4)",
            transition: "transform 0.15s, box-shadow 0.15s",
            animation: "fadeIn 0.4s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="scale(1.02)"; e.currentTarget.style.boxShadow="0 6px 32px rgba(79,142,247,0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 24px rgba(79,142,247,0.4)"; }}
          >
            🎯 Let's Ace DDCET {DDCET_YEAR}
          </button>
        )}

        {/* Skip while typing */}
        {!done && (
          <button onClick={() => { setDisplayed(fullText); setDone(true); setCharIdx(fullText.length); }}
            style={{ marginTop: 20, background: "none", border: "none", cursor: "pointer", color: "#444", fontSize: 12, width: "100%", fontFamily: "inherit" }}>
            Skip →
          </button>
        )}
      </div>
    </div>
  );
}
