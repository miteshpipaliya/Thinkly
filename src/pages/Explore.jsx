import { useApp } from "../context/AppContext";
import { SUBJECTS } from "../data/subjects";

const FAKE_USERS = [
  { id:"f1",  name:"Rahul Patel",  socialProfile:{username:"rahul_p", city:"Ahmedabad"}, profile:{branch:"Computer",   goal:"160"}, progress:{mathematics:78,physics:90,chemistry:60,environment:100,computer:95,english:70}},
  { id:"f2",  name:"Priya Desai",  socialProfile:{username:"priya_d", city:"Surat"},     profile:{branch:"Electrical", goal:"140"}, progress:{mathematics:55,physics:70,chemistry:80,environment:65, computer:50,english:85}},
  { id:"f3",  name:"Aryan Joshi",  socialProfile:{username:"aryan_j", city:"Vadodara"},  profile:{branch:"Civil",      goal:"150"}, progress:{mathematics:90,physics:85,chemistry:70,environment:80, computer:60,english:75}},
  { id:"f4",  name:"Sneha Modi",   socialProfile:{username:"sneha_m", city:"Rajkot"},    profile:{branch:"Mechanical", goal:"125"}, progress:{mathematics:40,physics:55,chemistry:60,environment:70, computer:45,english:90}},
  { id:"f5",  name:"Dev Trivedi",  socialProfile:{username:"dev_t",   city:"Surat"},     profile:{branch:"Computer",   goal:"175"}, progress:{mathematics:95,physics:88,chemistry:75,environment:85, computer:100,english:80}},
  { id:"f6",  name:"Krisha Bhatt", socialProfile:{username:"krisha_b",city:"Anand"},     profile:{branch:"Chemical",   goal:"130"}, progress:{mathematics:50,physics:60,chemistry:90,environment:75, computer:40,english:65}},
  { id:"f7",  name:"Mehul Shah",   socialProfile:{username:"mehul_s", city:"Ahmedabad"}, profile:{branch:"Electronics",goal:"155"}, progress:{mathematics:85,physics:78,chemistry:65,environment:70, computer:80,english:72}},
  { id:"f8",  name:"Nidhi Rao",    socialProfile:{username:"nidhi_r", city:"Surat"},     profile:{branch:"Computer",   goal:"165"}, progress:{mathematics:80,physics:92,chemistry:70,environment:88, computer:95,english:78}},
  { id:"f9",  name:"Vivek Kumar",  socialProfile:{username:"vivek_k", city:"Navsari"},   profile:{branch:"Automobile", goal:"120"}, progress:{mathematics:45,physics:50,chemistry:55,environment:60, computer:35,english:70}},
  { id:"f10", name:"Pooja Sharma", socialProfile:{username:"pooja_s", city:"Gandhinagar"},profile:{branch:"Civil",     goal:"148"}, progress:{mathematics:70,physics:75,chemistry:68,environment:82, computer:65,english:80}},
];

export default function Explore() {
  const { user, users, checklist, darkMode, sendFollowRequest, isFollowing, isPending } = useApp();

  const txt    = darkMode ? "#e2e2f0" : "#111";
  const sub    = darkMode ? "#666"    : "#888";
  const cardBg = darkMode ? "rgba(255,255,255,0.025)" : "#fff";
  const cardBr = darkMode ? "rgba(255,255,255,0.07)"  : "#e5e7eb";

  /* real registered users (excluding self) */
  const realUsers = users.filter(u => u.id !== user?.id && u.setupDone).map(u => {
    const progress = {};
    SUBJECTS.forEach(s => {
      const done = s.chapters.filter(ch => checklist[`${s.id}-${ch}`]).length;
      progress[s.id] = s.chapters.length ? Math.round(done / s.chapters.length * 100) : 0;
    });
    return { ...u, progress, isReal: true };
  });

  const allUsers = [...realUsers, ...FAKE_USERS];

  function followState(u) {
    if (!u.isReal) return { label: "🔒 Private", col: "#555", disabled: true };
    if (isFollowing(u.id)) return { label: "✓ Following", col: "#4ade80", disabled: true };
    if (isPending(u.id))   return { label: "⏳ Pending…",  col: "#fbbf24", disabled: true };
    return { label: "+ Send Request",  col: "#4f8ef7", disabled: false };
  }

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:800, color:txt, marginBottom:4 }}>Explore Students</div>
      <div style={{ color:sub, fontSize:13, marginBottom:10 }}>
        All accounts are private. Send a follow request — once accepted, you can view their full profile and chat with them.
      </div>

      {/* Private notice */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 16px", background:"rgba(79,142,247,0.08)", border:"1.5px solid rgba(79,142,247,0.25)", borderRadius:11, marginBottom:22 }}>
        <span style={{ fontSize:18 }}>🔒</span>
        <span style={{ fontSize:13, fontWeight:700, color:"#7aadff" }}>
          All accounts are private. You must follow someone and get accepted to see their details & message them.
        </span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:14 }}>
        {allUsers.map((u, i) => {
          const fb  = followState(u);
          const pct = Math.round(Object.values(u.progress).reduce((a,v)=>a+v,0) / Object.values(u.progress).length);

          return (
            <div key={u.id||i} style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:16, padding:"20px", position:"relative", overflow:"hidden" }}>

              {/* Top accent line */}
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,hsl(${i*43%360},65%,55%),hsl(${(i*43+80)%360},65%,45%))`, borderRadius:"16px 16px 0 0" }}/>

              {/* Header row */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <div style={{ width:46, height:46, borderRadius:"50%", background:`linear-gradient(135deg,hsl(${i*43%360},65%,55%),hsl(${(i*43+70)%360},65%,40%))`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:"#fff", flexShrink:0 }}>
                  {u.name[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, color:txt, fontSize:14 }}>{u.name}</div>
                  <div style={{ fontSize:11, color:sub }}>@{u.socialProfile?.username||"—"} · {u.socialProfile?.city||"Gujarat"}</div>
                  <div style={{ fontSize:11, color:sub }}>{u.profile?.branch} · Target {u.profile?.goal}/200</div>
                </div>
                <div style={{ textAlign:"center", minWidth:42 }}>
                  <div style={{ fontSize:20, fontWeight:900, color:"#4f8ef7", lineHeight:1 }}>{pct}%</div>
                  <div style={{ fontSize:9, color:sub, marginTop:2 }}>overall</div>
                </div>
              </div>

              {/* Subject bars */}
              {SUBJECTS.map(s => {
                const p = u.progress[s.id] || 0;
                return (
                  <div key={s.id} style={{ marginBottom:5 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                      <span style={{ fontSize:10, color:sub }}>{s.icon} {s.name}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:s.color }}>{p}%</span>
                    </div>
                    <div style={{ height:3, background:darkMode?"rgba(255,255,255,0.06)":"#f0f0f0", borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${p}%`, background:`linear-gradient(90deg,${s.color},${s.color}88)`, borderRadius:2, transition:"width 0.6s ease" }}/>
                    </div>
                  </div>
                );
              })}

              {/* REQUEST button */}
              {(() => {
                const sent     = fb.label.includes("Pending");
                const accepted = fb.label.includes("Following");
                const locked   = !u.isReal;

                return (
                  <button
                    disabled={fb.disabled}
                    onClick={() => !fb.disabled && sendFollowRequest(u.id)}
                    style={{
                      marginTop: 16,
                      width: "100%",
                      padding: "11px 0",
                      borderRadius: 10,
                      border: accepted ? "2px solid #4ade80"
                            : sent     ? "2px solid #fbbf24"
                            : locked   ? "2px solid rgba(255,255,255,0.15)"
                            :            "2px solid rgba(255,255,255,0.25)",
                      cursor: fb.disabled ? "default" : "pointer",
                      background: accepted ? "rgba(74,222,128,0.12)"
                                : sent     ? "rgba(251,191,36,0.12)"
                                : locked   ? "rgba(255,255,255,0.07)"
                                :            "#ffffff",
                      color: accepted ? "#4ade80"
                           : sent     ? "#fbbf24"
                           : locked   ? "rgba(255,255,255,0.35)"
                           :            "#000000",
                      fontSize: 13,
                      fontWeight: 900,
                      fontFamily: "inherit",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      transition: "all 0.2s ease",
                      opacity: 1,
                    }}
                    onMouseEnter={e => {
                      if (!fb.disabled && !locked) {
                        e.currentTarget.style.background = "#f0f0f0";
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,255,255,0.15)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!fb.disabled && !locked) {
                        e.currentTarget.style.background = accepted ? "rgba(74,222,128,0.12)" : sent ? "rgba(251,191,36,0.12)" : "#ffffff";
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    <span style={{ fontSize: 15 }}>
                      {accepted ? "✓" : sent ? "⏳" : "🔒"}
                    </span>
                    <span>
                      {accepted ? "Following" : sent ? "Request Sent" : locked ? "Private" : "Request"}
                    </span>
                  </button>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
