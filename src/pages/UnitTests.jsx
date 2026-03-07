import { useState } from "react";
import { SUBJECTS, QUESTION_BANK, shuffle } from "../data/subjects";
import { useApp } from "../context/AppContext";

export default function UnitTests() {
  const { addResult } = useApp();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [curr, setCurr] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);

  function start(subj) {
    const pool = shuffle(QUESTION_BANK.filter(q => q.subject === subj.name)).slice(0, 20);
    if (!pool.length) { alert("Questions coming soon!"); return; }
    setQuiz({ title: `${subj.name} Unit Test`, questions: pool, subj });
    setAnswers({}); setCurr(0); setDone(false); setResult(null);
  }

  function answer(opt) {
    if (answers[curr] !== undefined) return;
    const newAns = { ...answers, [curr]: opt };
    setAnswers(newAns);
    setTimeout(() => {
      if (curr + 1 >= quiz.questions.length) finish(newAns);
      else setCurr(c => c+1);
    }, 700);
  }

  function finish(ans) {
    const scored = quiz.questions.map((q, i) => ({ ...q, userAns: ans[i], correct: ans[i]===q.ans }));
    const correct = scored.filter(q=>q.correct).length;
    const r = addResult({ title: quiz.title, isMock:false, score:correct*2, correct, wrong:quiz.questions.length-correct, accuracy:Math.round(correct/quiz.questions.length*100), scored });
    setResult({ scored, correct, wrong:quiz.questions.length-correct, accuracy:Math.round(correct/quiz.questions.length*100) });
    setDone(true);
  }

  const s = {
    card: { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:22, marginBottom:14 },
    btn:  (v="primary") => ({ padding:"9px 20px", borderRadius:9, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, background:v==="primary"?"linear-gradient(135deg,#4f8ef7,#a855f7)":"rgba(255,255,255,0.06)", color:v==="primary"?"#fff":"#aaa", fontFamily:"inherit" }),
  };

  if (!quiz) return (
    <div>
      <div style={{ fontSize:22, fontWeight:800, color:"#e2e2f0", marginBottom:4 }}>Unit Tests</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:24 }}>20 questions per subject, no time limit. Great for focused revision.</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
        {SUBJECTS.map(subj => (
          <div key={subj.id} style={{ ...s.card, cursor:"pointer" }} onClick={() => start(subj)}>
            <div style={{ fontSize:28, marginBottom:8 }}>{subj.icon}</div>
            <div style={{ fontWeight:700, color:subj.color, fontSize:15, marginBottom:4 }}>{subj.name}</div>
            <div style={{ color:"#666", fontSize:12, marginBottom:14 }}>
              {QUESTION_BANK.filter(q=>q.subject===subj.name).length} questions · 20 per attempt
            </div>
            <span style={{ padding:"6px 14px", borderRadius:8, background:`${subj.color}18`, color:subj.color, fontSize:12, fontWeight:600 }}>Start Unit Test →</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (done && result) return (
    <div>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>{result.accuracy>=70?"🎉":"📚"}</div>
        <div style={{ fontSize:20, fontWeight:800, color:"#e2e2f0", marginBottom:4 }}>{quiz.title}</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, maxWidth:360, margin:"20px auto" }}>
          {[{l:"Correct",v:result.correct,c:"#4ade80"},{l:"Accuracy",v:result.accuracy+"%",c:"#4f8ef7"},{l:"Wrong",v:result.wrong,c:"#f87171"}].map(s=>(
            <div key={s.l} style={{ background:`${s.c}11`, border:`1px solid ${s.c}22`, borderRadius:10, padding:"14px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:11, color:"#666" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      {result.scored.filter(q=>!q.correct).length > 0 && (
        <div style={s.card}>
          <div style={{ fontSize:14, fontWeight:700, color:"#f87171", marginBottom:10 }}>Review Wrong Answers</div>
          {result.scored.filter(q=>!q.correct).map((q,i)=>(
            <div key={i} style={{ padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize:13, color:"#ddd", marginBottom:4 }}>{q.q}</div>
              <div style={{ fontSize:12, color:"#f87171" }}>Yours: {q.userAns||"—"}</div>
              <div style={{ fontSize:12, color:"#4ade80" }}>✓ {q.ans}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display:"flex", gap:10 }}>
        <button style={s.btn("primary")} onClick={() => start(quiz.subj)}>Retry</button>
        <button style={s.btn()} onClick={() => setQuiz(null)}>Back to Subjects</button>
      </div>
    </div>
  );

  const q = quiz.questions[curr];
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ fontSize:14, color:"#aaa" }}>{quiz.title}</div>
        <div style={{ fontSize:13, color:"#666" }}>Q{curr+1}/{quiz.questions.length}</div>
      </div>
      <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2, marginBottom:22, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${(curr+1)/quiz.questions.length*100}%`, background:"linear-gradient(90deg,#4f8ef7,#a855f7)", transition:"width 0.3s" }} />
      </div>
      <div style={s.card}>
        <div style={{ fontSize:16, fontWeight:600, color:"#e2e2f0", marginBottom:22, lineHeight:1.6 }}>{q.q}</div>
        {q.opts.map((opt, i) => {
          const ua = answers[curr];
          let bg="rgba(255,255,255,0.03)", border="rgba(255,255,255,0.08)", color="#ccc";
          if (ua !== undefined) {
            if (opt===q.ans) { bg="rgba(74,222,128,0.1)"; border="#4ade8055"; color="#4ade80"; }
            else if (opt===ua) { bg="rgba(239,68,68,0.1)"; border="#f8717155"; color="#f87171"; }
          }
          return (
            <button key={opt} onClick={()=>answer(opt)}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", textAlign:"left", padding:"12px 16px", borderRadius:9, border:`1.5px solid ${border}`, background:bg, color, cursor:ua?"default":"pointer", fontSize:13.5, fontWeight:500, marginBottom:8, fontFamily:"inherit", transition:"all 0.15s" }}>
              <span style={{ width:24, height:24, borderRadius:"50%", background:"rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>
                {["A","B","C","D"][i]}
              </span>
              {opt}
            </button>
          );
        })}
        {answers[curr] && <div style={{ marginTop:10, padding:"9px 14px", background:"rgba(79,142,247,0.07)", borderLeft:"3px solid #4f8ef7", borderRadius:"0 8px 8px 0", fontSize:12, color:"#7aadff" }}>💡 {q.sol}</div>}
      </div>
      <button style={s.btn()} onClick={() => setQuiz(null)}>Exit</button>
    </div>
  );
}
