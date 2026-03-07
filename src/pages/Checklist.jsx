import { useApp } from "../context/AppContext";
import { SUBJECTS } from "../data/subjects";

const REVISIONS = ["Revision 1", "Revision 2", "Revision 3"];

function Checkbox({ checked, onChange, color, darkMode }) {
  return (
    <div onClick={onChange} style={{ width:18, height:18, borderRadius:4, border:`2px solid ${checked ? color : darkMode ? "rgba(255,255,255,0.15)" : "#ccc"}`, background:checked?color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer", transition:"all 0.2s" }}>
      {checked && <svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
    </div>
  );
}

function SubjectCard({ subj, checklist, toggleChecklist, darkMode }) {
  const cardBg  = darkMode ? "rgba(255,255,255,0.025)" : "#fff";
  const cardBr  = darkMode ? "rgba(255,255,255,0.07)"  : "#e5e7eb";
  const txt     = darkMode ? "#ddd" : "#222";
  const sub     = darkMode ? "#666" : "#999";
  const chBg    = darkMode ? "rgba(255,255,255,0.03)"  : "#f9fafb";
  const chBr    = darkMode ? "rgba(255,255,255,0.04)"  : "#f0f0f0";

  // count all checkboxes (chapter + 3 revisions each)
  const totalBoxes = subj.chapters.length * 4;
  const doneBoxes  = subj.chapters.reduce((acc, ch) => {
    const chKey = `${subj.id}-${ch}`;
    let n = checklist[chKey] ? 1 : 0;
    REVISIONS.forEach((_, ri) => { if (checklist[`${chKey}-r${ri}`]) n++; });
    return acc + n;
  }, 0);
  const pct = Math.round(doneBoxes / totalBoxes * 100);

  return (
    <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:"18px 18px", marginBottom:14 }}>
      {/* Subject header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:20 }}>{subj.icon}</span>
          <span style={{ fontWeight:700, color:subj.color, fontSize:15 }}>{subj.name}</span>
        </div>
        <span style={{ fontSize:13, fontWeight:700, color:subj.color }}>{pct}%</span>
      </div>
      <div style={{ height:5, background:darkMode?"rgba(255,255,255,0.06)":"#eee", borderRadius:3, marginBottom:14, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${subj.color},${subj.color}88)`, borderRadius:3, transition:"width 0.4s" }} />
      </div>

      {/* Chapters */}
      {subj.chapters.map(ch => {
        const chKey  = `${subj.id}-${ch}`;
        const isDone = checklist[chKey];
        return (
          <div key={ch} style={{ background:chBg, border:`1px solid ${chBr}`, borderRadius:9, padding:"10px 12px", marginBottom:8 }}>
            {/* Chapter row */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <Checkbox checked={!!isDone} onChange={()=>toggleChecklist(chKey)} color={subj.color} darkMode={darkMode} />
              <span style={{ flex:1, fontSize:13.5, fontWeight:600, color:isDone?subj.color:txt }}>{ch}</span>
              {isDone && <span style={{ fontSize:10, color:subj.color, fontWeight:700 }}>✓ Done</span>}
            </div>
            {/* Revision checkboxes */}
            <div style={{ display:"flex", gap:14, paddingLeft:28, flexWrap:"wrap" }}>
              {REVISIONS.map((rev, ri) => {
                const rKey   = `${chKey}-r${ri}`;
                const rDone  = checklist[rKey];
                return (
                  <div key={rev} onClick={() => toggleChecklist(rKey)}
                    style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer" }}>
                    <div style={{ width:14, height:14, borderRadius:3, border:`1.5px solid ${rDone?subj.color:darkMode?"rgba(255,255,255,0.15)":"#ccc"}`, background:rDone?subj.color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", flexShrink:0 }}>
                      {rDone && <svg width="8" height="8" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>}
                    </div>
                    <span style={{ fontSize:11, color:rDone?subj.color:sub, fontWeight:rDone?600:400 }}>{rev}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Checklist() {
  const { checklist, toggleChecklist, darkMode } = useApp();
  const txt = darkMode ? "#e2e2f0" : "#111";
  const sub = darkMode ? "#666"    : "#888";

  // Total overall
  const totalBoxes = SUBJECTS.reduce((a, s) => a + s.chapters.length * 4, 0);
  const doneBoxes  = Object.values(checklist).filter(Boolean).length;
  const pct = Math.round(doneBoxes / totalBoxes * 100);

  // Split subjects: left column = first 3, right = last 3
  const leftSubjects  = SUBJECTS.slice(0, 3);
  const rightSubjects = SUBJECTS.slice(3);

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:800, color:txt, marginBottom:4 }}>Subjects & Revision Checklist</div>
      <div style={{ color:sub, fontSize:13, marginBottom:18 }}>Track chapter completion and 3 revision rounds per chapter.</div>

      {/* Overall progress */}
      <div style={{ background:darkMode?"rgba(255,255,255,0.03)":"#fff", border:`1px solid ${darkMode?"rgba(255,255,255,0.07)":"#e5e7eb"}`, borderRadius:12, padding:"16px 20px", marginBottom:22 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontWeight:600, color:txt }}>Overall Progress</span>
          <span style={{ color:"#4f8ef7", fontWeight:700 }}>{doneBoxes}/{totalBoxes} checkboxes · {pct}%</span>
        </div>
        <div style={{ height:7, background:darkMode?"rgba(255,255,255,0.06)":"#eee", borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#4f8ef7,#a855f7)", borderRadius:4, transition:"width 0.4s" }} />
        </div>
      </div>

      {/* Two column layout */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div>
          {leftSubjects.map(subj => (
            <SubjectCard key={subj.id} subj={subj} checklist={checklist} toggleChecklist={toggleChecklist} darkMode={darkMode} />
          ))}
        </div>
        <div>
          {rightSubjects.map(subj => (
            <SubjectCard key={subj.id} subj={subj} checklist={checklist} toggleChecklist={toggleChecklist} darkMode={darkMode} />
          ))}
        </div>
      </div>
    </div>
  );
}
