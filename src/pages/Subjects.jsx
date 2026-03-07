import { useState } from "react";
import { SUBJECTS, QUESTION_BANK, shuffle } from "../data/subjects";
import { useApp } from "../context/AppContext";

function QuizModal({ questions, title, onClose, addResult, darkMode }) {
  const [curr, setCurr]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [result, setResult]   = useState(null);

  const txt    = darkMode ? "#e2e2f0" : "#111";
  const sub    = darkMode ? "#666"    : "#888";
  const boxBg  = darkMode ? "#0d0d18" : "#fff";
  const boxBr  = darkMode ? "rgba(255,255,255,0.08)" : "#e5e7eb";

  function answer(opt) {
    if (answers[curr] !== undefined) return;
    const next = { ...answers, [curr]: opt };
    setAnswers(next);
    setTimeout(() => {
      if (curr + 1 >= questions.length) finish(next);
      else setCurr(c => c + 1);
    }, 800);
  }

  function finish(ans) {
    const scored = questions.map((q, i) => ({ ...q, userAns: ans[i], correct: ans[i] === q.ans }));
    const correct  = scored.filter(q => q.correct).length;
    const accuracy = Math.round(correct / questions.length * 100);
    addResult({ title, isMock: false, score: correct * 2, total: questions.length * 2, correct, wrong: questions.length - correct, accuracy, scored });
    setResult({ scored, correct, accuracy });
    setFinished(true);
  }

  const overlay = { position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:16 };
  const box     = { background:boxBg, border:`1px solid ${boxBr}`, borderRadius:18, width:"100%", maxWidth:580, maxHeight:"90vh", overflowY:"auto", padding:28 };

  if (finished && result) return (
    <div style={overlay}>
      <div style={box}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>{result.accuracy >= 70 ? "🎉" : "📚"}</div>
          <div style={{ fontSize:20, fontWeight:800, color:txt, marginBottom:4 }}>{result.accuracy >= 70 ? "Great Work!" : "Keep Practicing!"}</div>
          <div style={{ color:sub, fontSize:13 }}>{title}</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:22 }}>
          {[{l:"Correct",v:result.correct,c:"#4ade80"},{l:"Accuracy",v:result.accuracy+"%",c:"#4f8ef7"},{l:"Wrong",v:questions.length-result.correct,c:"#f87171"}].map(s=>(
            <div key={s.l} style={{ textAlign:"center", background:`${s.c}11`, border:`1px solid ${s.c}22`, borderRadius:10, padding:"14px 10px" }}>
              <div style={{ fontSize:24, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:11, color:sub }}>{s.l}</div>
            </div>
          ))}
        </div>
        {result.scored.filter(q=>!q.correct).map((q,i)=>(
          <div key={i} style={{ padding:"10px 0", borderBottom:`1px solid ${darkMode?"rgba(255,255,255,0.05)":"#f0f0f0"}` }}>
            <div style={{ fontSize:13, color:txt, marginBottom:4 }}>{q.q}</div>
            <div style={{ fontSize:12, color:"#f87171" }}>Your: {q.userAns||"—"}</div>
            <div style={{ fontSize:12, color:"#4ade80" }}>✓ {q.ans}</div>
            <div style={{ fontSize:11, color:"#7aadff", marginTop:4, padding:"5px 10px", background:"rgba(79,142,247,0.08)", borderRadius:6 }}>💡 {q.sol}</div>
          </div>
        ))}
        <button onClick={onClose} style={{ width:"100%", padding:"12px", borderRadius:10, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", fontSize:14, fontWeight:700, fontFamily:"inherit", marginTop:16 }}>Close</button>
      </div>
    </div>
  );

  const q = questions[curr];
  const userAns = answers[curr];
  return (
    <div style={overlay}>
      <div style={box}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:13, color:sub, fontWeight:600 }}>{title}</div>
          <div style={{ fontSize:12, color:sub }}>Q{curr+1}/{questions.length}</div>
        </div>
        <div style={{ height:4, background:darkMode?"rgba(255,255,255,0.06)":"#eee", borderRadius:2, marginBottom:22, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${(curr+1)/questions.length*100}%`, background:"linear-gradient(90deg,#4f8ef7,#a855f7)", transition:"width 0.3s" }} />
        </div>
        <div style={{ fontSize:16, fontWeight:600, color:txt, marginBottom:22, lineHeight:1.65 }}>{q.q}</div>
        {q.opts.map((opt, i) => {
          let bg = darkMode?"rgba(255,255,255,0.03)":"#f9fafb", border = darkMode?"rgba(255,255,255,0.08)":"#e5e7eb", color = darkMode?"#ccc":"#444";
          if (userAns !== undefined) {
            if (opt === q.ans)    { bg="rgba(74,222,128,0.1)"; border="#4ade8055"; color="#4ade80"; }
            else if (opt===userAns){ bg="rgba(239,68,68,0.1)"; border="#f8717155"; color="#f87171"; }
          }
          return (
            <button key={opt} onClick={()=>answer(opt)}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", textAlign:"left", padding:"12px 16px", borderRadius:9, border:`1.5px solid ${border}`, background:bg, color, cursor:userAns?"default":"pointer", fontSize:13, fontWeight:500, marginBottom:8, fontFamily:"inherit", transition:"all 0.2s" }}>
              <span style={{ width:22, height:22, borderRadius:"50%", background:darkMode?"rgba(255,255,255,0.06)":"#eee", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>
                {["A","B","C","D"][i]}
              </span>
              {opt}
            </button>
          );
        })}
        {userAns && <div style={{ marginTop:10, padding:"10px 14px", background:"rgba(79,142,247,0.08)", borderLeft:"3px solid #4f8ef7", borderRadius:"0 8px 8px 0", fontSize:12, color:"#7aadff" }}>💡 {q.sol}</div>}
        <button onClick={onClose} style={{ marginTop:16, padding:"8px 16px", borderRadius:8, border:`1px solid ${darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}`, background:"transparent", color:sub, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Exit Quiz</button>
      </div>
    </div>
  );
}

export default function Subjects() {
  const { addResult, checklist, darkMode } = useApp();
  const [expanded, setExpanded] = useState(null);
  const [quiz, setQuiz]         = useState(null);

  const txt    = darkMode ? "#e2e2f0" : "#111";
  const sub    = darkMode ? "#666"    : "#888";
  const cardBg = darkMode ? "rgba(255,255,255,0.025)" : "#fff";
  const cardBr = darkMode ? "rgba(255,255,255,0.06)"  : "#e5e7eb";

  function startQuiz(subjName, ch) {
    const pool = shuffle(QUESTION_BANK.filter(q => q.subject === subjName && q.chapter === ch));
    if (!pool.length) { alert("Questions for this chapter coming soon!"); return; }
    setQuiz({ questions: pool.slice(0, Math.min(10, pool.length)), title: `${subjName} — ${ch}` });
  }

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:800, color:txt, marginBottom:4 }}>Subjects</div>
      <div style={{ color:sub, fontSize:13, marginBottom:24 }}>Select a chapter to start a practice quiz.</div>

      {SUBJECTS.map(subj => (
        <div key={subj.id} style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, marginBottom:12, overflow:"hidden" }}>
          <button onClick={() => setExpanded(expanded === subj.id ? null : subj.id)}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"18px 22px", background:"transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
            <span style={{ fontSize:24 }}>{subj.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700, color:subj.color }}>{subj.name}</div>
              <div style={{ fontSize:12, color:sub }}>
                {subj.chapters.length} chapters · {subj.chapters.filter(ch=>checklist[`${subj.id}-${ch}`]).length} revised
              </div>
            </div>
            <div style={{ fontSize:20, color:subj.color, transition:"transform 0.2s", transform:expanded===subj.id?"rotate(90deg)":"none" }}>›</div>
          </button>

          {expanded === subj.id && (
            <div style={{ padding:"0 22px 18px", borderTop:`1px solid ${darkMode?"rgba(255,255,255,0.05)":"#f0f0f0"}` }}>
              {subj.chapters.map(ch => {
                const done = checklist[`${subj.id}-${ch}`];
                const qCount = QUESTION_BANK.filter(q => q.subject === subj.name && q.chapter === ch).length;
                return (
                  <div key={ch} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${darkMode?"rgba(255,255,255,0.04)":"#f5f5f5"}` }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:done?subj.color:darkMode?"rgba(255,255,255,0.1)":"#ddd", flexShrink:0 }} />
                    <span style={{ flex:1, fontSize:13.5, color:done?txt:sub }}>{ch}</span>
                    <span style={{ fontSize:11, color:sub }}>{qCount} Qs</span>
                    {done && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:`${subj.color}15`, color:subj.color }}>Revised ✓</span>}
                    <button onClick={()=>startQuiz(subj.name, ch)}
                      style={{ padding:"6px 14px", borderRadius:7, border:`1px solid ${subj.color}44`, background:`${subj.color}12`, color:subj.color, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                      Practice →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {quiz && <QuizModal questions={quiz.questions} title={quiz.title} addResult={addResult} onClose={()=>setQuiz(null)} darkMode={darkMode} />}
    </div>
  );
}
