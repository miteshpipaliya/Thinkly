/**
 * WelcomePopup.jsx — Ranklify v2
 * Short 3-line typing popup. No skip. No mute. Button enables after typing done.
 */
import { useState, useEffect, useRef } from "react";

const YEAR = new Date().getFullYear() >= 2027 ? new Date().getFullYear() : 2026;

export default function WelcomePopup({ username, onClose }) {
  const name    = username || "student";
  const LINES   = [
    `Welcome to Ranklify, @${name}.`,
    `You chose the right place to prepare for DDCET.`,
    `Let's compete, improve, and chase the top rank.`,
  ];
  const fullText = LINES.join("\n");

  const [displayed, setDisplayed] = useState("");
  const [charIdx,   setCharIdx]   = useState(0);
  const [done,      setDone]      = useState(false);
  const [fading,    setFading]    = useState(false);
  const audioCtx    = useRef(null);

  /* ── typing sound ── */
  function playTick() {
    try {
      if (!audioCtx.current)
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx  = audioCtx.current;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(520 + Math.random() * 180, ctx.currentTime);
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.045);
    } catch(_) {}
  }

  /* ── type character by character ── */
  useEffect(() => {
    if (done) return;
    if (charIdx >= fullText.length) { setDone(true); return; }
    const ch    = fullText[charIdx];
    const delay = ch === "\n" ? 220 : ch === "." || ch === "," ? 90 : 32;
    const t = setTimeout(() => {
      setDisplayed(p => p + ch);
      setCharIdx(i => i + 1);
      if (ch !== " " && ch !== "\n") playTick();
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, done]);

  function handleClick() {
    if (!done) return;
    setFading(true);
    setTimeout(onClose, 380);
  }

  /* render lines */
  const lines = displayed.split("\n");

  return (
    <div style={{
      position:   "fixed",
      inset:      0,
      zIndex:     9999,
      background: "rgba(0,0,0,0.78)",
      backdropFilter: "blur(6px)",
      display:    "flex",
      alignItems: "center",
      justifyContent: "center",
      padding:    20,
      opacity:    fading ? 0 : 1,
      transition: "opacity 0.38s ease",
    }}>
      <style>{`
        @keyframes rkl-in  { from { opacity:0; transform:translateY(16px) scale(0.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes rkl-cur { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      <div style={{
        background:   "linear-gradient(160deg,#0c0c1a 0%,#0f0f20 100%)",
        border:       "1px solid rgba(79,142,247,0.22)",
        borderRadius: 20,
        padding:      "38px 40px 32px",
        width:        "100%",
        maxWidth:     480,
        boxShadow:    "0 20px 60px rgba(0,0,0,0.7)",
        animation:    "rkl-in 0.35s ease",
      }}>

        {/* Logo row */}
        <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:26 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <polyline points="22,12 18,12 15,20 9,4 6,12 2,12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize:18, fontWeight:900, background:"linear-gradient(90deg,#4f8ef7,#a855f7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Ranklify
          </span>
        </div>

        {/* Typing text */}
        <div style={{ minHeight: 88, marginBottom: 28 }}>
          {lines.map((line, i) => (
            <p key={i} style={{
              margin:     "0 0 10px 0",
              fontSize:   i === 0 ? 17 : 14.5,
              fontWeight: i === 0 ? 700 : 400,
              color:      i === 0 ? "#ffffff"
                        : i === 2 ? "#a5b4fc"
                        : "#94a3b8",
              lineHeight: 1.6,
              fontFamily: "inherit",
              minHeight:  "1.2em",
            }}>
              {line}
              {/* cursor only on last actively-typing line */}
              {!done && i === lines.length - 1 && (
                <span style={{
                  display:        "inline-block",
                  width:          2,
                  height:         "0.95em",
                  background:     "#4f8ef7",
                  marginLeft:     3,
                  verticalAlign:  "middle",
                  animation:      "rkl-cur 0.65s infinite",
                  borderRadius:   1,
                }}/>
              )}
            </p>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleClick}
          disabled={!done}
          style={{
            width:          "100%",
            padding:        "13px",
            borderRadius:   11,
            border:         "none",
            fontSize:       15,
            fontWeight:     800,
            fontFamily:     "inherit",
            letterSpacing:  "0.02em",
            cursor:         done ? "pointer" : "not-allowed",
            background:     done
              ? "linear-gradient(135deg,#4f8ef7,#a855f7)"
              : "rgba(255,255,255,0.06)",
            color:          done ? "#fff" : "rgba(255,255,255,0.2)",
            transition:     "all 0.3s ease",
            boxShadow:      done ? "0 4px 20px rgba(79,142,247,0.35)" : "none",
          }}
          onMouseEnter={e => { if(done){ e.currentTarget.style.transform="scale(1.015)"; e.currentTarget.style.boxShadow="0 6px 28px rgba(79,142,247,0.5)"; }}}
          onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=done?"0 4px 20px rgba(79,142,247,0.35)":"none"; }}
        >
          {done ? `🎯 Let's Ace DDCET ${YEAR}` : "Please wait…"}
        </button>

      </div>
    </div>
  );
}
