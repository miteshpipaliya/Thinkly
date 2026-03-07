import { useApp } from "../context/AppContext";
import { SUBJECTS } from "../data/subjects";

const FAKE_USERS = [
  { id:"f1",  name:"Rahul Patel",   socialProfile:{username:"rahul_p",city:"Ahmedabad"}, profile:{branch:"Computer",goal:"160"},   progress:{mathematics:78,physics:90,chemistry:60,environment:100,computer:95,english:70}},
  { id:"f2",  name:"Priya Desai",   socialProfile:{username:"priya_d",city:"Surat"},     profile:{branch:"Electrical",goal:"140"}, progress:{mathematics:55,physics:70,chemistry:80,environment:65,computer:50,english:85}},
  { id:"f3",  name:"Aryan Joshi",   socialProfile:{username:"aryan_j",city:"Vadodara"},  profile:{branch:"Civil",goal:"150"},      progress:{mathematics:90,physics:85,chemistry:70,environment:80,computer:60,english:75}},
  { id:"f4",  name:"Sneha Modi",    socialProfile:{username:"sneha_m",city:"Rajkot"},    profile:{branch:"Mechanical",goal:"125"}, progress:{mathematics:40,physics:55,chemistry:60,environment:70,computer:45,english:90}},
  { id:"f5",  name:"Dev Trivedi",   socialProfile:{username:"dev_t",city:"Surat"},       profile:{branch:"Computer",goal:"175"},   progress:{mathematics:95,physics:88,chemistry:75,environment:85,computer:100,english:80}},
  { id:"f6",  name:"Krisha Bhatt",  socialProfile:{username:"krisha_b",city:"Anand"},    profile:{branch:"Chemical",goal:"130"},   progress:{mathematics:50,physics:60,chemistry:90,environment:75,computer:40,english:65}},
  { id:"f7",  name:"Mehul Shah",    socialProfile:{username:"mehul_s",city:"Ahmedabad"}, profile:{branch:"Electronics",goal:"155"},progress:{mathematics:85,physics:78,chemistry:65,environment:70,computer:80,english:72}},
  { id:"f8",  name:"Nidhi Rao",     socialProfile:{username:"nidhi_r",city:"Surat"},     profile:{branch:"Computer",goal:"165"},   progress:{mathematics:80,physics:92,chemistry:70,environment:88,computer:95,english:78}},
  { id:"f9",  name:"Vivek Kumar",   socialProfile:{username:"vivek_k",city:"Navsari"},   profile:{branch:"Automobile",goal:"120"}, progress:{mathematics:45,physics:50,chemistry:55,environment:60,computer:35,english:70}},
  { id:"f10", name:"Pooja Sharma",  socialProfile:{username:"pooja_s",city:"Gandhinagar"},profile:{branch:"Civil",goal:"148"},    progress:{mathematics:70,physics:75,chemistry:68,environment:82,computer:65,english:80}},
];

export default function Explore() {
  const { user, users, checklist, darkMode, sendFollowRequest, isFollowing, isPending } = useApp();

  const txt    = darkMode ? "#e2e2f0" : "#111";
  const sub    = darkMode ? "#666"    : "#888";
  const cardBg = darkMode ? "rgba(255,255,255,0.025)" : "#fff";
  const cardBr = darkMode ? "rgba(255,255,255,0.07)"  : "#e5e7eb";

  const realUsers = users.filter(u => u.id !== user?.id && u.setupDone).map(u => {
    const progress = {};
    SUBJECTS.forEach(s => {
      const total = s.chapters.length;
      const done  = s.chapters.filter(ch => checklist[`${s.id}-${ch}`]).length;
      progress[s.id] = total ? Math.round(done/total*100) : 0;
    });
    return { ...u, progress, isReal:true };
  });

  const allUsers = [...realUsers, ...FAKE_USERS];

  function followBtn(u) {
    if (u.isReal) {
      if (isFollowing(u.id))  return { label:"✓ Following", col:"#4ade80", disabled:true };
      if (isPending(u.id))    return { label:"Pending…",    col:"#fbbf24", disabled:true };
      return { label:"+ Follow", col:"#4f8ef7", disabled:false };
    }
    return { label:"🔒 Private", col:"#555", disabled:true };
  }

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:800, color:txt, marginBottom:4 }}>Explore Students</div>
      <div style={{ color:sub, fontSize:13, marginBottom:8 }}>Discover other DDCET students. Send a follow request to see their full profile and message them.</div>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 16px", background:"rgba(79,142,247,0.08)", border:"1px solid rgba(79,142,247,0.2)", borderRadius:10, marginBottom:20, fontSize:12, color:"#7aadff" }}>
        🔒 All accounts are private. You must follow someone to view their details and message them.
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:14 }}>
        {allUsers.map((u, i) => {
          const fb = followBtn(u);
          const overallPct = Math.round(Object.values(u.progress).reduce((a,v)=>a+v,0)/Object.values(u.progress).length);
          return (
            <div key={u.id||i} style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:"18px 20px" }}>
              {/* Header */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,hsl(${i*43%360},65%,55%),hsl(${(i*43+70)%360},65%,40%))`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, color:"#fff", flexShrink:0 }}>
                  {u.name[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:txt, fontSize:14 }}>{u.name}</div>
                  <div style={{ fontSize:11, color:sub }}>@{u.socialProfile?.username||"—"} · {u.socialProfile?.city||"Gujarat"}</div>
                  <div style={{ fontSize:11, color:sub }}>{u.profile?.branch} · Target: {u.profile?.goal}/200</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:18, fontWeight:800, color:"#4f8ef7" }}>{overallPct}%</div>
                  <div style={{ fontSize:9, color:sub }}>overall</div>
                </div>
              </div>

              {/* Subject bars */}
              {SUBJECTS.map(s => {
                const pct = u.progress[s.id] || 0;
                return (
                  <div key={s.id} style={{ marginBottom:6 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                      <span style={{ fontSize:10, color:sub }}>{s.icon} {s.name}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:s.color }}>{pct}%</span>
                    </div>
                    <div style={{ height:3, background:darkMode?"rgba(255,255,255,0.06)":"#eee", borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${s.color},${s.color}88)`, borderRadius:2, transition:"width 0.5s" }}/>
                    </div>
                  </div>
                );
              })}

              {/* Follow button */}
              <button
                disabled={fb.disabled}
                onClick={()=>!fb.disabled&&u.isReal&&sendFollowRequest(u.id)}
                style={{ marginTop:14, width:"100%", padding:"9px", borderRadius:9, border:"none", cursor:fb.disabled?"default":"pointer", background:`${fb.col}18`, color:fb.col, border:`1px solid ${fb.col}33`, fontSize:12, fontWeight:700, fontFamily:"inherit", opacity:fb.disabled?0.7:1 }}>
                {fb.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
