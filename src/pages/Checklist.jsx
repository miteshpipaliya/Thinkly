import { useApp } from "../context/AppContext";
import { SUBJECTS } from "../data/subjects";
import Icon from "../components/Icon";

export default function Checklist() {
  const { checklist, toggleChecklist } = useApp();
  const total = SUBJECTS.reduce((a, s) => a + s.chapters.length, 0);
  const done  = Object.values(checklist).filter(Boolean).length;

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:800, color:"#e2e2f0", marginBottom:4 }}>Revision Checklist</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:20 }}>Track which chapters you've studied. Click to toggle.</div>

      {/* Overall */}
      <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"18px 22px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontWeight:600, color:"#ccc" }}>Overall Progress</span>
          <span style={{ color:"#4f8ef7", fontWeight:700 }}>{done}/{total} chapters</span>
        </div>
        <div style={{ height:7, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${done/total*100}%`, background:"linear-gradient(90deg,#4f8ef7,#a855f7)", borderRadius:4, transition:"width 0.4s" }} />
        </div>
        <div style={{ color:"#555", fontSize:12, marginTop:8 }}>{Math.round(done/total*100)}% syllabus revised</div>
      </div>

      {SUBJECTS.map(subj => {
        const subjDone = subj.chapters.filter(ch => checklist[`${subj.id}-${ch}`]).length;
        return (
          <div key={subj.id} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:13, padding:"18px 22px", marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{subj.icon}</span>
                <span style={{ fontWeight:700, color:subj.color, fontSize:15 }}>{subj.name}</span>
              </div>
              <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:`${subj.color}15`, color:subj.color }}>{subjDone}/{subj.chapters.length}</span>
            </div>
            <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2, marginBottom:14, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${subjDone/subj.chapters.length*100}%`, background:`linear-gradient(90deg,${subj.color},${subj.color}88)`, borderRadius:2, transition:"width 0.4s" }} />
            </div>
            {subj.chapters.map(ch => {
              const key = `${subj.id}-${ch}`;
              const isDone = checklist[key];
              return (
                <div key={ch} onClick={() => toggleChecklist(key)}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", cursor:"pointer" }}>
                  <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${isDone?subj.color:"rgba(255,255,255,0.12)"}`, background:isDone?subj.color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
                    {isDone && <Icon name="check" size={12} color="#fff" />}
                  </div>
                  <span style={{ flex:1, fontSize:13.5, color:isDone?"#e2e2f0":"#888", fontWeight:isDone?500:400 }}>{ch}</span>
                  {isDone && <span style={{ fontSize:10, color:subj.color }}>Revised ✓</span>}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
