import { useApp } from "../context/AppContext";
import { SUBJECTS } from "../data/subjects";

const FAKE_USERS = [
  { id:"f1", name:"Rahul Patel",   branch:"Computer",    goal:"320", targetAcc:80,
    progress:{ mathematics:78, physics:90, chemistry:60, environment:100, computer:95, english:70 } },
  { id:"f2", name:"Priya Desai",   branch:"Electrical",  goal:"280", targetAcc:70,
    progress:{ mathematics:55, physics:70, chemistry:80, environment:65, computer:50, english:85 } },
  { id:"f3", name:"Aryan Joshi",   branch:"Civil",       goal:"300", targetAcc:75,
    progress:{ mathematics:90, physics:85, chemistry:70, environment:80, computer:60, english:75 } },
  { id:"f4", name:"Sneha Modi",    branch:"Mechanical",  goal:"250", targetAcc:62,
    progress:{ mathematics:40, physics:55, chemistry:60, environment:70, computer:45, english:90 } },
  { id:"f5", name:"Dev Trivedi",   branch:"Computer",    goal:"350", targetAcc:87,
    progress:{ mathematics:95, physics:88, chemistry:75, environment:85, computer:100, english:80 } },
  { id:"f6", name:"Krisha Bhatt",  branch:"Chemical",    goal:"260", targetAcc:65,
    progress:{ mathematics:50, physics:60, chemistry:90, environment:75, computer:40, english:65 } },
  { id:"f7", name:"Mehul Shah",    branch:"Electronics", goal:"310", targetAcc:77,
    progress:{ mathematics:85, physics:78, chemistry:65, environment:70, computer:80, english:72 } },
  { id:"f8", name:"Nidhi Rao",     branch:"Computer",    goal:"330", targetAcc:82,
    progress:{ mathematics:80, physics:92, chemistry:70, environment:88, computer:95, english:78 } },
  { id:"f9", name:"Vivek Kumar",   branch:"Automobile",  goal:"240", targetAcc:60,
    progress:{ mathematics:45, physics:50, chemistry:55, environment:60, computer:35, english:70 } },
  { id:"f10",name:"Pooja Sharma",  branch:"Civil",       goal:"295", targetAcc:73,
    progress:{ mathematics:70, physics:75, chemistry:68, environment:82, computer:65, english:80 } },
];

export default function Explore() {
  const { user, users, checklist, darkMode } = useApp();

  const txt    = darkMode ? "#e2e2f0" : "#111";
  const sub    = darkMode ? "#666"    : "#888";
  const cardBg = darkMode ? "rgba(255,255,255,0.025)" : "#fff";
  const cardBr = darkMode ? "rgba(255,255,255,0.07)"  : "#e5e7eb";

  // Build real users with their progress
  const realUsers = users.filter(u => u.id !== user?.id && u.setupDone).map(u => {
    const progress = {};
    SUBJECTS.forEach(s => {
      const total = s.chapters.length * 4;
      const done  = s.chapters.reduce((acc, ch) => {
        const k = `${s.id}-${ch}`;
        return acc + (checklist[k] ? 1 : 0);
      }, 0);
      progress[s.id] = Math.round(done / total * 100);
    });
    return { id: u.id, name: u.name, branch: u.profile?.branch || "Student", goal: u.profile?.goal || "—", targetAcc: u.profile?.targetAcc || 0, progress, isReal: true };
  });

  const allUsers = [...realUsers, ...FAKE_USERS];

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:800, color:txt, marginBottom:4 }}>Explore Students</div>
      <div style={{ color:sub, fontSize:13, marginBottom:22 }}>See subject-wise progress of all students on Ranklify.</div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 }}>
        {allUsers.map((u, i) => {
          const overallPct = Math.round(Object.values(u.progress).reduce((a,v)=>a+v,0) / Object.values(u.progress).length);
          return (
            <div key={u.id || i} style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:"18px 20px" }}>
              {/* User header */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <div style={{ width:42, height:42, borderRadius:"50%", background:`linear-gradient(135deg,hsl(${(i*47)%360},70%,55%),hsl(${(i*47+60)%360},70%,45%))`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"#fff", flexShrink:0 }}>
                  {u.name[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:txt, fontSize:14 }}>{u.name}</div>
                  <div style={{ fontSize:11, color:sub }}>{u.branch} · Target: {u.goal} marks</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:18, fontWeight:800, color:"#4f8ef7" }}>{overallPct}%</div>
                  <div style={{ fontSize:10, color:sub }}>overall</div>
                </div>
              </div>

              {/* Subject bars */}
              {SUBJECTS.map(s => {
                const pct = u.progress[s.id] || 0;
                return (
                  <div key={s.id} style={{ marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                      <span style={{ fontSize:11, color:sub }}>{s.icon} {s.name}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:s.color }}>{pct}%</span>
                    </div>
                    <div style={{ height:4, background:darkMode?"rgba(255,255,255,0.06)":"#eee", borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${s.color},${s.color}88)`, borderRadius:2, transition:"width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
