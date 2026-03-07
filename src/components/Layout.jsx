import { useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "./Icon";
import { getDaysRemaining } from "../data/subjects";

const NAV = [
  { id:"dashboard",   label:"Dashboard",        icon:"home"   },
  { id:"subjects",    label:"Subjects",          icon:"book"   },
  { id:"unit-tests",  label:"Unit Tests",        icon:"test"   },
  { id:"mock-tests",  label:"Mock Tests",        icon:"target" },
  { id:"checklist",   label:"Revision Checklist",icon:"list"   },
  { id:"leaderboard", label:"Leaderboard",       icon:"trophy" },
  { id:"discussion",  label:"Discussion Groups", icon:"chat"   },
  { id:"profile",     label:"Profile",           icon:"user"   },
  { id:"settings",    label:"Settings",          icon:"settings"},
];

export default function Layout({ page, setPage, children }) {
  const { user, logout } = useApp();
  const [sideOpen, setSideOpen] = useState(false);
  const days = getDaysRemaining();

  const SidebarContent = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Logo */}
      <div style={{ padding:"22px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, color:"#fff" }}>R</div>
          <div>
            <div style={{ fontSize:17, fontWeight:800, background:"linear-gradient(90deg,#4f8ef7,#a855f7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Ranklify</div>
            <div style={{ fontSize:10, color:"#444", marginTop:-2 }}>DDCET Rank Booster</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, padding:"12px 10px", overflowY:"auto" }}>
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id}
              onClick={() => { setPage(n.id); setSideOpen(false); }}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 12px", borderRadius:9, border:"none", cursor:"pointer", marginBottom:2, background:active?"rgba(79,142,247,0.15)":"transparent", color:active?"#7aadff":"#666", fontFamily:"inherit", fontSize:13.5, fontWeight:active?600:400, transition:"all 0.15s", textAlign:"left" }}>
              <Icon name={n.icon} size={16} color={active?"#7aadff":"#555"} />
              {n.label}
              {active && <div style={{ marginLeft:"auto", width:3, height:3, borderRadius:"50%", background:"#4f8ef7" }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom user */}
      <div style={{ padding:"12px 10px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"rgba(255,255,255,0.03)", borderRadius:9, marginBottom:6 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:"#ccc", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name}</div>
            <div style={{ fontSize:11, color:"#555" }}>{user?.profile?.branch || "Student"}</div>
          </div>
        </div>
        <button onClick={logout} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 12px", borderRadius:8, border:"none", cursor:"pointer", background:"transparent", color:"#555", fontSize:13, fontFamily:"inherit", transition:"all 0.15s" }}
          onMouseEnter={e=>{e.currentTarget.style.color="#f87171"; e.currentTarget.style.background="rgba(239,68,68,0.08)"}}
          onMouseLeave={e=>{e.currentTarget.style.color="#555"; e.currentTarget.style.background="transparent"}}>
          <Icon name="logout" size={15} /><span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#050508" }}>
      {/* DESKTOP SIDEBAR */}
      <aside style={{ width:220, background:"rgba(255,255,255,0.025)", borderRight:"1px solid rgba(255,255,255,0.06)", position:"fixed", top:0, left:0, bottom:0, zIndex:50, display:"flex", flexDirection:"column" }}>
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sideOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:200 }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)" }} onClick={()=>setSideOpen(false)} />
          <aside style={{ position:"absolute", left:0, top:0, bottom:0, width:230, background:"#0a0a12", borderRight:"1px solid rgba(255,255,255,0.06)" }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* MAIN AREA */}
      <div style={{ marginLeft:220, flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* TOP BAR */}
        <header style={{ height:58, background:"rgba(5,5,8,0.9)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", position:"sticky", top:0, zIndex:40 }}>
          <button style={{ display:"none", background:"none", border:"none", cursor:"pointer", color:"#aaa", padding:4 }} className="menu-btn" onClick={()=>setSideOpen(true)}>
            <Icon name="menu" size={20} />
          </button>
          <div style={{ flex:1 }} />

          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* Days countdown */}
            <div style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 14px", background:"rgba(251,146,60,0.1)", border:"1px solid rgba(251,146,60,0.2)", borderRadius:20 }}>
              <Icon name="clock" size={13} color="#fb923c" />
              <span style={{ fontSize:12, fontWeight:700, color:"#fb923c" }}>{days}d to DDCET</span>
            </div>
            {/* Leaderboard quick */}
            <button onClick={()=>setPage("leaderboard")} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", background:page==="leaderboard"?"rgba(79,142,247,0.15)":"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, cursor:"pointer", color:"#aaa", fontSize:12, fontWeight:600, fontFamily:"inherit" }}>
              <Icon name="trophy" size={13} color="#fbbf24" />
              <span>Leaderboard</span>
            </button>
            {/* Profile */}
            <button onClick={()=>setPage("profile")} style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff" }}>
              {user?.name?.[0]?.toUpperCase()}
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex:1, padding:28, maxWidth:1200, width:"100%" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          aside:first-of-type { display: none !important; }
          .menu-btn { display: flex !important; }
          main { padding: 16px !important; }
          [style*="marginLeft: 220"] { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
