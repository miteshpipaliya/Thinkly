import { useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "./Icon";
import { getDaysRemaining } from "../data/subjects";

const NAV = [
  { id:"dashboard",   label:"Dashboard",         icon:"home"    },
  { id:"subjects",    label:"Subjects",           icon:"book"    },
  { id:"unit-tests",  label:"Unit Tests",         icon:"test"    },
  { id:"mock-tests",  label:"Mock Tests",         icon:"target"  },
  { id:"checklist",   label:"Subjects & Revision",icon:"list"    },
  { id:"explore",     label:"Explore Students",   icon:"grid"    },
  { id:"leaderboard", label:"Leaderboard",        icon:"trophy"  },
  { id:"discussion",  label:"Discussion Groups",  icon:"chat"    },
  { id:"profile",     label:"Profile",            icon:"user"    },
  { id:"settings",    label:"Settings",           icon:"settings"},
];

// Ranklify ECG/pulse logo SVG
function RanklifyLogo({ size = 32 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:Math.round(size*0.25), background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width={size*0.6} height={size*0.6} viewBox="0 0 24 24" fill="none">
        <polyline points="22,12 18,12 15,20 9,4 6,12 2,12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default function Layout({ page, setPage, children }) {
  const { user, logout, darkMode } = useApp();
  const [sideOpen, setSideOpen] = useState(false);
  const days = getDaysRemaining();

  const bg    = darkMode ? "#050508"                     : "#f0f2f8";
  const sidBg = darkMode ? "rgba(255,255,255,0.025)"     : "#fff";
  const sidBr = darkMode ? "rgba(255,255,255,0.06)"      : "#e5e7eb";
  const topBg = darkMode ? "rgba(5,5,8,0.92)"            : "rgba(255,255,255,0.95)";
  const topBr = darkMode ? "rgba(255,255,255,0.05)"      : "#e5e7eb";
  const txt   = darkMode ? "#e2e2f0"                     : "#111";
  const sub   = darkMode ? "#666"                        : "#888";
  const navAB = darkMode ? "rgba(79,142,247,0.15)"       : "rgba(79,142,247,0.1)";
  const navAC = darkMode ? "#7aadff"                     : "#2563eb";
  const navIC = darkMode ? "#555"                        : "#aaa";
  const navTC = darkMode ? "#666"                        : "#777";

  const SidebarContent = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"20px 18px 14px", borderBottom:`1px solid ${sidBr}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <RanklifyLogo size={36} />
          <div>
            <div style={{ fontSize:17, fontWeight:800, background:"linear-gradient(90deg,#4f8ef7,#a855f7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Ranklify</div>
            <div style={{ fontSize:10, color:sub, marginTop:-2 }}>DDCET Rank Booster</div>
          </div>
        </div>
      </div>

      <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => { setPage(n.id); setSideOpen(false); }}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 12px", borderRadius:9, border:"none", cursor:"pointer", marginBottom:2, background:active?navAB:"transparent", color:active?navAC:navTC, fontFamily:"inherit", fontSize:13.5, fontWeight:active?600:400, transition:"all 0.15s", textAlign:"left" }}>
              <Icon name={n.icon} size={16} color={active?navAC:navIC} />
              {n.label}
              {active && <div style={{ marginLeft:"auto", width:3, height:3, borderRadius:"50%", background:"#4f8ef7" }} />}
            </button>
          );
        })}
      </nav>

      <div style={{ padding:"10px 8px", borderTop:`1px solid ${sidBr}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:darkMode?"rgba(255,255,255,0.03)":"#f9fafb", borderRadius:9, marginBottom:6 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:txt, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name}</div>
            <div style={{ fontSize:11, color:sub }}>{user?.profile?.branch || "Student"}</div>
          </div>
        </div>
        <button onClick={logout}
          style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 12px", borderRadius:8, border:"none", cursor:"pointer", background:"transparent", color:sub, fontSize:13, fontFamily:"inherit", transition:"all 0.15s" }}
          onMouseEnter={e=>{e.currentTarget.style.color="#f87171"; e.currentTarget.style.background="rgba(239,68,68,0.08)"}}
          onMouseLeave={e=>{e.currentTarget.style.color=sub; e.currentTarget.style.background="transparent"}}>
          <Icon name="logout" size={15} /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:bg }}>
      {/* Desktop sidebar */}
      <aside style={{ width:220, background:sidBg, borderRight:`1px solid ${sidBr}`, position:"fixed", top:0, left:0, bottom:0, zIndex:50, display:"flex", flexDirection:"column" }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sideOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:200 }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)" }} onClick={()=>setSideOpen(false)} />
          <aside style={{ position:"absolute", left:0, top:0, bottom:0, width:230, background:darkMode?"#0a0a12":"#fff", borderRight:`1px solid ${sidBr}` }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div style={{ marginLeft:220, flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Topbar */}
        <header style={{ height:58, background:topBg, backdropFilter:"blur(12px)", borderBottom:`1px solid ${topBr}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", position:"sticky", top:0, zIndex:40 }}>
          <div style={{ flex:1 }} />
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 14px", background:"rgba(251,146,60,0.1)", border:"1px solid rgba(251,146,60,0.2)", borderRadius:20 }}>
              <Icon name="clock" size={13} color="#fb923c" />
              <span style={{ fontSize:12, fontWeight:700, color:"#fb923c" }}>{days}d to DDCET</span>
            </div>
            <button onClick={()=>setPage("leaderboard")}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", background:page==="leaderboard"?"rgba(79,142,247,0.15)":"rgba(255,255,255,0.05)", border:`1px solid ${sidBr}`, borderRadius:20, cursor:"pointer", color:darkMode?"#aaa":"#555", fontSize:12, fontWeight:600, fontFamily:"inherit" }}>
              <Icon name="trophy" size={13} color="#fbbf24" /><span>Leaderboard</span>
            </button>
            <button onClick={()=>setPage("profile")}
              style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff" }}>
              {user?.name?.[0]?.toUpperCase()}
            </button>
          </div>
        </header>

        <main style={{ flex:1, padding:28, maxWidth:1300, width:"100%" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
