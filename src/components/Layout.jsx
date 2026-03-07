/**
 * Layout.jsx — Ranklify v9
 * Sidebar with request badge, unread DM badge, dark/light support
 */
import { useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "./Icon";
import { getDaysRemaining } from "../data/subjects";

const NAV = [
  { id:"dashboard",   label:"Dashboard",        icon:"home"    },
  { id:"subjects",    label:"Subjects",          icon:"book"    },
  { id:"unit-tests",  label:"Unit Tests",        icon:"test"    },
  { id:"mock-tests",  label:"Mock Tests",        icon:"target"  },
  { id:"group-mock",  label:"Group Mock Test",   icon:"grid"    },
  { id:"explore",     label:"Explore Students",  icon:"users"   },
  { id:"leaderboard", label:"Leaderboard",       icon:"trophy"  },
  { id:"discussion",  label:"Discussion Groups", icon:"chat"    },
  { id:"profile",     label:"My Profile",        icon:"user"    },
  { id:"history",     label:"History",           icon:"history" },
  { id:"settings",    label:"Settings",          icon:"settings"},
];

function RanklifyLogo({ size=34 }) {
  const r=Math.round(size*0.26);
  return(
    <div style={{width:size,height:size,borderRadius:r,background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <svg width={size*0.65} height={size*0.52} viewBox="0 0 26 20" fill="none">
        <polyline points="25,10 20,10 16.5,18.5 9.5,1.5 6,10 1,10" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default function Layout({ page, setPage, children }) {
  const { user, logout, darkMode, incomingRequests, totalUnread } = useApp();
  const days     = getDaysRemaining();
  const reqCount = incomingRequests ? incomingRequests().length : 0;
  const dmCount  = totalUnread ? totalUnread() : 0;

  const T      = darkMode;
  const bg     = T?"#050508":"#f0f2f8";
  const sidBg  = T?"#09090f":"#fff";
  const sidBr  = T?"rgba(255,255,255,0.06)":"#e5e7eb";
  const topBg  = T?"rgba(5,5,8,0.95)":"rgba(255,255,255,0.95)";
  const txt    = T?"#e2e2f0":"#111";
  const sub    = T?"#555":"#888";
  const navAB  = T?"rgba(79,142,247,0.14)":"rgba(79,142,247,0.08)";
  const navAC  = "#7aadff";
  const navIC  = T?"#444":"#bbb";
  const navTC  = T?"#555":"#777";

  const totalBadge = reqCount + dmCount;

  return(
    <div style={{display:"flex",minHeight:"100vh",background:bg}}>
      {/* Sidebar */}
      <aside style={{width:220,background:sidBg,borderRight:`1px solid ${sidBr}`,position:"fixed",top:0,left:0,bottom:0,zIndex:50,display:"flex",flexDirection:"column"}}>

        {/* Brand */}
        <div style={{padding:"18px 16px 14px",borderBottom:`1px solid ${sidBr}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <RanklifyLogo size={36}/>
            <div>
              <div style={{fontSize:17,fontWeight:800,background:"linear-gradient(90deg,#4f8ef7,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1.2}}>Ranklify</div>
              <div style={{fontSize:10,color:sub}}>DDCET Rank Booster</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"8px",overflowY:"auto"}}>
          {NAV.map(n=>{
            const active=page===n.id;
            /* badge logic */
            let badge=0;
            if(n.id==="profile")  badge=reqCount+dmCount;
            if(n.id==="explore")  { /* no badge needed */ }
            return(
              <button key={n.id} onClick={()=>setPage(n.id)}
                style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:9,border:"none",cursor:"pointer",marginBottom:1,background:active?navAB:"transparent",color:active?navAC:navTC,fontFamily:"inherit",fontSize:13,fontWeight:active?600:400,transition:"all 0.15s",textAlign:"left",position:"relative"}}
                onMouseEnter={e=>{if(!active)e.currentTarget.style.background=T?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)";}}
                onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
                <Icon name={n.icon} size={15} color={active?navAC:navIC}/>
                <span style={{flex:1}}>{n.label}</span>
                {badge>0&&(
                  <span style={{minWidth:18,height:18,borderRadius:9,background:"#ef4444",color:"#fff",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{badge}</span>
                )}
                {active&&<div style={{width:3,height:3,borderRadius:"50%",background:"#4f8ef7"}}/>}
              </button>
            );
          })}
        </nav>

        {/* User block */}
        <div style={{padding:"8px 8px 10px",borderTop:`1px solid ${sidBr}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:T?"rgba(255,255,255,0.03)":"#f9fafb",borderRadius:9,marginBottom:4,cursor:"pointer"}} onClick={()=>setPage("profile")}>
            <div style={{position:"relative"}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff",flexShrink:0}}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              {totalBadge>0&&<span style={{position:"absolute",top:-4,right:-4,width:14,height:14,borderRadius:"50%",background:"#ef4444",color:"#fff",fontSize:8,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>{totalBadge}</span>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.name}</div>
              <div style={{fontSize:10,color:sub}}>@{user?.socialProfile?.username||user?.name?.toLowerCase().replace(/\s/g,"")}</div>
            </div>
          </div>
          <button onClick={logout}
            style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",borderRadius:8,border:"none",cursor:"pointer",background:"transparent",color:sub,fontSize:12,fontFamily:"inherit"}}
            onMouseEnter={e=>{e.currentTarget.style.color="#f87171";e.currentTarget.style.background="rgba(239,68,68,0.08)";}}
            onMouseLeave={e=>{e.currentTarget.style.color=sub;e.currentTarget.style.background="transparent";}}>
            <Icon name="logout" size={14}/> Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{marginLeft:220,flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <header style={{height:54,background:topBg,backdropFilter:"blur(12px)",borderBottom:`1px solid ${sidBr}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"sticky",top:0,zIndex:40}}>
          <div style={{flex:1}}/>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",background:"rgba(251,146,60,0.1)",border:"1px solid rgba(251,146,60,0.2)",borderRadius:20}}>
              <Icon name="clock" size={12} color="#fb923c"/>
              <span style={{fontSize:11,fontWeight:700,color:"#fb923c"}}>{days}d to DDCET</span>
            </div>
            <button onClick={()=>setPage("leaderboard")}
              style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",background:T?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)",border:`1px solid ${sidBr}`,borderRadius:20,cursor:"pointer",color:T?"#aaa":"#555",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>
              <Icon name="trophy" size={12} color="#fbbf24"/><span>Leaderboard</span>
            </button>
            <button onClick={()=>setPage("profile")} style={{position:"relative",width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff"}}>
              {user?.name?.[0]?.toUpperCase()}
              {totalBadge>0&&<span style={{position:"absolute",top:-2,right:-2,width:13,height:13,borderRadius:"50%",background:"#ef4444",border:"2px solid "+bg,fontSize:7,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>{totalBadge}</span>}
            </button>
          </div>
        </header>
        <main style={{flex:1,padding:26,maxWidth:1320,width:"100%"}}>
          {children}
        </main>
      </div>
    </div>
  );
}
