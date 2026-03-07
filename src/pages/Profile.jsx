/**
 * Profile.jsx — Ranklify v9
 * Tabs: Profile | Edit | Requests (incoming + outgoing) | Connections | Messages
 */
import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

export default function Profile({ setPage }) {
  const {
    user, users, myResults, darkMode,
    updateSocialProfile,
    incomingRequests, outgoingRequests, myConnections,
    acceptRequest, rejectRequest,
    sendDM, getDMs, markDMsRead, unreadFrom,
    isConnected,
  } = useApp();

  const T = darkMode;
  const txt    = T?"#e2e2f0":"#111";
  const sub    = T?"#555":"#888";
  const cardBg = T?"rgba(255,255,255,0.03)":"#fff";
  const cardBr = T?"rgba(255,255,255,0.07)":"#e5e7eb";
  const inp    = {width:"100%",background:T?"rgba(255,255,255,0.05)":"#f9fafb",border:`1.5px solid ${T?"rgba(255,255,255,0.1)":"#e5e7eb"}`,borderRadius:9,padding:"10px 13px",color:txt,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"};
  const lbl    = {fontSize:11,color:sub,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5,display:"block"};

  const mocks    = myResults.filter(r=>r.isMock);
  const best     = mocks.length ? Math.max(...mocks.map(r=>r.score)) : "—";
  const avgAcc   = myResults.length ? Math.round(myResults.reduce((a,r)=>a+(r.accuracy||0),0)/myResults.length) : 0;

  const sp       = user?.socialProfile || {};
  const incoming = incomingRequests ? incomingRequests() : [];
  const outgoing = outgoingRequests ? outgoingRequests() : [];
  const conns    = myConnections    ? myConnections()    : [];

  const badgeCount = incoming.length;

  const [tab,      setTab]      = useState(!sp.username?"edit":"profile");
  const [username, setUsername] = useState(sp.username||"");
  const [city,     setCity]     = useState(sp.city||"");
  const [rank,     setRank]     = useState(sp.ddcetRank||"");
  const [insta,    setInsta]    = useState(sp.insta||"");
  const [saved,    setSaved]    = useState(false);
  const [dmPeer,   setDmPeer]   = useState(null);
  const [dmText,   setDmText]   = useState("");
  const [viewUser, setViewUser] = useState(null);
  const msgEnd = useRef(null);

  useEffect(()=>{ msgEnd.current?.scrollIntoView({behavior:"smooth"}); },[dmPeer, tab]);

  function saveProfile(){
    if(!username.trim()) return;
    updateSocialProfile({username:username.trim().toLowerCase().replace(/\s/g,""),city,ddcetRank:rank,insta});
    setSaved(true); setTimeout(()=>{setSaved(false);setTab("profile");},1500);
  }

  function sendMsg(){
    if(!dmText.trim()||!dmPeer) return;
    sendDM(dmPeer.id,dmText.trim()); setDmText("");
    setTimeout(()=>msgEnd.current?.scrollIntoView({behavior:"smooth"}),50);
  }

  const tabs = [
    {id:"profile",  label:"👤 Profile"},
    {id:"edit",     label:"✏️ Edit"},
    {id:"requests", label:`🔔 Requests${badgeCount>0?` (${badgeCount})`:""}`},
    {id:"connections",label:`🤝 Connections (${conns.length})`},
    {id:"messages", label:"💬 Messages"},
  ];

  /* ── View Profile Modal ── */
  function ViewModal({u}){
    if(!u) return null;
    const sp2=u.socialProfile||{};
    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setViewUser(null)}>
        <div style={{background:T?"#0e0e1c":"#fff",border:`1px solid ${cardBr}`,borderRadius:20,padding:32,maxWidth:420,width:"100%",position:"relative"}} onClick={e=>e.stopPropagation()}>
          <button onClick={()=>setViewUser(null)} style={{position:"absolute",top:14,right:16,background:"none",border:"none",fontSize:18,color:sub,cursor:"pointer"}}>✕</button>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
            <div style={{width:58,height:58,borderRadius:"50%",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:"#fff"}}>{u.name[0]}</div>
            <div>
              <div style={{fontSize:18,fontWeight:900,color:txt}}>{u.name}</div>
              {sp2.username&&<div style={{color:"#4f8ef7",fontSize:13,fontWeight:600}}>@{sp2.username}</div>}
            </div>
          </div>
          {[{l:"Branch",v:u.profile?.branch},{l:"City",v:sp2.city||u.profile?.city},{l:"DDCET Rank",v:sp2.ddcetRank},{l:"Target",v:u.profile?.goal?`${u.profile.goal}/200`:""},{l:"Instagram",v:sp2.insta}].map(r=>r.v?(
            <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${cardBr}`,fontSize:13}}>
              <span style={{color:sub,fontWeight:600}}>{r.l}</span>
              <span style={{color:r.l==="Instagram"?"#4f8ef7":txt,fontWeight:600}}>{r.v}</span>
            </div>
          ):null)}
          {isConnected(u.id)&&(
            <button onClick={()=>{setDmPeer(u);setTab("messages");setViewUser(null);}}
              style={{marginTop:18,width:"100%",padding:"11px",borderRadius:10,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",color:"#fff",fontSize:13,fontWeight:800,fontFamily:"inherit"}}>
              💬 Send Message
            </button>
          )}
        </div>
      </div>
    );
  }

  return(
    <div style={{maxWidth:740}}>
      <ViewModal u={viewUser}/>

      <div style={{fontSize:22,fontWeight:900,color:txt,marginBottom:18}}>My Profile</div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:20,background:T?"rgba(255,255,255,0.03)":"#f3f4f6",borderRadius:12,padding:4}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{padding:"8px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap",transition:"all 0.2s",
              background:tab===t.id?"linear-gradient(135deg,#4f8ef7,#a855f7)":"transparent",
              color:tab===t.id?"#fff":sub,
              position:"relative"}}>
            {t.label}
            {t.id==="requests"&&badgeCount>0&&tab!=="requests"&&(
              <span style={{position:"absolute",top:-4,right:-4,width:16,height:16,borderRadius:"50%",background:"#ef4444",color:"#fff",fontSize:9,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>{badgeCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ══ PROFILE ══════════════════════════════════════════════ */}
      {tab==="profile"&&(
        <>
          <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:16,padding:24,marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
              <div style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:900,color:"#fff",flexShrink:0}}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{fontSize:20,fontWeight:900,color:txt}}>{user?.name}</div>
                <div style={{fontSize:13,color:"#4f8ef7",fontWeight:600}}>@{sp.username||"(no username)"}</div>
                <div style={{fontSize:12,color:sub,marginTop:2}}>{user?.profile?.branch} · {sp.city||user?.profile?.city||"Gujarat"}</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
              {[{l:"Mocks Taken",v:mocks.length,c:"#4f8ef7"},{l:"Best Score",v:best,c:"#fbbf24"},{l:"Avg Accuracy",v:avgAcc+"%",c:"#4ade80"},{l:"Target",v:(user?.profile?.goal||"—")+"/200",c:"#a855f7"},{l:"Connections",v:conns.length,c:"#22d3ee"}].map(s=>(
                <div key={s.l} style={{background:`${s.c}12`,border:`1px solid ${s.c}30`,borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:11,color:sub,marginTop:3}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          {[{l:"Email",v:user?.email},{l:"Branch",v:user?.profile?.branch},{l:"City",v:sp.city||user?.profile?.city},{l:"Target Marks",v:user?.profile?.goal?`${user.profile.goal}/200`:""},{l:"DDCET Rank",v:sp.ddcetRank},{l:"Instagram",v:sp.insta}].filter(r=>r.v).map(r=>(
            <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"11px 16px",background:cardBg,border:`1px solid ${cardBr}`,borderRadius:10,marginBottom:6,fontSize:13}}>
              <span style={{color:sub,fontWeight:600}}>{r.l}</span>
              <span style={{color:r.l==="Instagram"?"#4f8ef7":txt,fontWeight:700}}>{r.v}</span>
            </div>
          ))}
        </>
      )}

      {/* ══ EDIT ════════════════════════════════════════════════ */}
      {tab==="edit"&&(
        <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:16,padding:26}}>
          <div style={{fontSize:16,fontWeight:900,color:txt,marginBottom:20}}>Edit Social Profile</div>
          {[
            {lbl:"Username *",ph:"e.g. rahul_patel",val:username,set:setUsername},
            {lbl:"City",ph:"e.g. Surat",val:city,set:setCity},
            {lbl:"DDCET Rank (optional)",ph:"e.g. 450",val:rank,set:setRank},
            {lbl:"Instagram (optional)",ph:"@your_handle",val:insta,set:setInsta},
          ].map(f=>(
            <div key={f.lbl} style={{marginBottom:16}}>
              <label style={lbl}>{f.lbl}</label>
              <input style={inp} placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)}
                onFocus={e=>e.target.style.borderColor="#4f8ef7"} onBlur={e=>e.target.style.borderColor=T?"rgba(255,255,255,0.1)":"#e5e7eb"}/>
            </div>
          ))}
          <button onClick={saveProfile}
            style={{padding:"11px 26px",borderRadius:9,border:"none",cursor:"pointer",fontSize:14,fontWeight:700,background:saved?"rgba(74,222,128,0.15)":"linear-gradient(135deg,#4f8ef7,#a855f7)",color:saved?"#4ade80":"#fff",fontFamily:"inherit",transition:"all 0.3s"}}>
            {saved?"✓ Saved!":"Save Profile"}
          </button>
        </div>
      )}

      {/* ══ REQUESTS ════════════════════════════════════════════ */}
      {tab==="requests"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* Incoming */}
          <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:16,padding:22}}>
            <div style={{fontSize:16,fontWeight:900,color:txt,marginBottom:4}}>
              📥 Incoming Requests
              {incoming.length>0&&<span style={{marginLeft:8,padding:"2px 8px",borderRadius:20,background:"rgba(239,68,68,0.15)",color:"#f87171",fontSize:12,fontWeight:800}}>{incoming.length}</span>}
            </div>
            <div style={{fontSize:12,color:sub,marginBottom:14}}>Students who want to connect with you</div>
            {incoming.length===0&&<div style={{color:sub,fontSize:13,textAlign:"center",padding:"20px 0"}}>No incoming requests right now.</div>}
            {incoming.map(({req,from:u})=>(
              <div key={req.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:`1px solid ${cardBr}`}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#fff",flexShrink:0}}>{u.name[0]}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,color:txt,fontSize:14}}>{u.name}</div>
                  <div style={{fontSize:11,color:sub}}>
                    {u.profile?.branch||"—"} · {u.socialProfile?.city||u.profile?.city||"Gujarat"}
                    {u.profile?.goal&&` · Target: ${u.profile.goal}/200`}
                  </div>
                  <div style={{fontSize:10,color:sub,marginTop:2}}>{new Date(req.ts).toLocaleDateString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div>
                </div>
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <button onClick={()=>acceptRequest(req.id)}
                    style={{padding:"9px 16px",borderRadius:9,border:"none",cursor:"pointer",background:"rgba(74,222,128,0.15)",color:"#4ade80",fontSize:13,fontWeight:900,fontFamily:"inherit"}}>
                    ✓ Accept
                  </button>
                  <button onClick={()=>rejectRequest(req.id)}
                    style={{padding:"9px 16px",borderRadius:9,border:"none",cursor:"pointer",background:"rgba(239,68,68,0.12)",color:"#f87171",fontSize:13,fontWeight:900,fontFamily:"inherit"}}>
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Outgoing */}
          <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:16,padding:22}}>
            <div style={{fontSize:16,fontWeight:900,color:txt,marginBottom:4}}>📤 Outgoing Requests</div>
            <div style={{fontSize:12,color:sub,marginBottom:14}}>Requests you've sent — waiting for acceptance</div>
            {outgoing.length===0&&<div style={{color:sub,fontSize:13,textAlign:"center",padding:"20px 0"}}>No outgoing requests.</div>}
            {outgoing.map(({req,to:u})=>(
              <div key={req.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:`1px solid ${cardBr}`}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#a855f7,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#fff",flexShrink:0}}>{u.name[0]}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,color:txt,fontSize:14}}>{u.name}</div>
                  <div style={{fontSize:11,color:sub}}>{u.profile?.branch||"—"} · {u.socialProfile?.city||u.profile?.city||"Gujarat"}</div>
                </div>
                <span style={{padding:"5px 14px",borderRadius:20,background:"rgba(251,191,36,0.12)",color:"#fbbf24",fontSize:12,fontWeight:800,flexShrink:0}}>⏳ Requested</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ CONNECTIONS ════════════════════════════════════════ */}
      {tab==="connections"&&(
        <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:16,padding:22}}>
          <div style={{fontSize:16,fontWeight:900,color:txt,marginBottom:4}}>🤝 Connections ({conns.length})</div>
          <div style={{fontSize:12,color:sub,marginBottom:16}}>Students you're connected with — you can now message them and do peer mock tests</div>
          {conns.length===0&&<div style={{color:sub,fontSize:13,textAlign:"center",padding:"30px 0"}}>
            No connections yet. Go to <b style={{color:"#7aadff"}}>Explore Students</b> and send requests!
          </div>}
          {conns.map(u=>{
            const ud=unreadFrom(u.id)||0;
            return(
              <div key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:`1px solid ${cardBr}`}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#4ade80,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#fff",flexShrink:0,position:"relative"}}>
                  {u.name[0]}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,color:txt,fontSize:14}}>{u.name}</div>
                  <div style={{fontSize:11,color:sub}}>@{u.socialProfile?.username||"—"} · {u.profile?.branch}</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setViewUser(u)} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${cardBr}`,background:"transparent",color:sub,fontSize:12,fontFamily:"inherit",cursor:"pointer",fontWeight:700}}>View</button>
                  <button onClick={()=>{setDmPeer(u);setTab("messages");}}
                    style={{position:"relative",padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",background:"rgba(79,142,247,0.15)",color:"#7aadff",fontSize:12,fontWeight:800,fontFamily:"inherit"}}>
                    💬{ud>0&&<span style={{position:"absolute",top:-5,right:-5,width:16,height:16,borderRadius:"50%",background:"#ef4444",color:"#fff",fontSize:9,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>{ud}</span>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ MESSAGES ════════════════════════════════════════════ */}
      {tab==="messages"&&(
        <div style={{background:cardBg,border:`1px solid ${cardBr}`,borderRadius:16,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"200px 1fr"}}>
            {/* Contact list */}
            <div style={{borderRight:`1px solid ${cardBr}`,height:480,overflowY:"auto"}}>
              <div style={{padding:"12px 14px",fontSize:11,fontWeight:800,color:sub,borderBottom:`1px solid ${cardBr}`,textTransform:"uppercase",letterSpacing:"0.06em"}}>Connections</div>
              {conns.length===0&&<div style={{padding:"16px",fontSize:12,color:sub}}>Connect with someone first.</div>}
              {conns.map(u=>{
                const ud=unreadFrom(u.id)||0;
                return(
                  <div key={u.id} onClick={()=>{setDmPeer(u);markDMsRead&&markDMsRead(u.id);}}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",cursor:"pointer",background:dmPeer?.id===u.id?T?"rgba(79,142,247,0.12)":"rgba(79,142,247,0.07)":"transparent",borderBottom:`1px solid ${cardBr}`,position:"relative"}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff",flexShrink:0}}>{u.name[0]}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</div>
                      <div style={{fontSize:10,color:sub}}>@{u.socialProfile?.username||"—"}</div>
                    </div>
                    {ud>0&&<span style={{minWidth:18,height:18,borderRadius:9,background:"#ef4444",color:"#fff",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{ud}</span>}
                  </div>
                );
              })}
            </div>

            {/* Chat */}
            <div style={{display:"flex",flexDirection:"column",height:480}}>
              {!dmPeer?(
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:sub,gap:8}}>
                  <span style={{fontSize:36}}>💬</span>
                  <span style={{fontSize:13}}>Select a connection to start chatting</span>
                </div>
              ):(
                <>
                  {/* chat header */}
                  <div style={{padding:"12px 16px",borderBottom:`1px solid ${cardBr}`,display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff"}}>{dmPeer.name[0]}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:800,color:txt}}>{dmPeer.name}</div>
                      <div style={{fontSize:10,color:sub}}>@{dmPeer.socialProfile?.username||"—"} · {dmPeer.profile?.branch}</div>
                    </div>
                    <button onClick={()=>setViewUser(dmPeer)} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${cardBr}`,background:"transparent",color:sub,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>View Profile</button>
                  </div>

                  {/* messages */}
                  <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
                    {getDMs(dmPeer.id).length===0&&<div style={{textAlign:"center",color:sub,fontSize:12,marginTop:20}}>Say hello 👋</div>}
                    {getDMs(dmPeer.id).map((m,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:m.from===user.id?"flex-end":"flex-start"}}>
                        <div>
                          <div style={{fontSize:9,color:sub,marginBottom:3,textAlign:m.from===user.id?"right":"left"}}>
                            {new Date(m.ts).toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit"})}
                          </div>
                          <div style={{maxWidth:"72%",padding:"10px 14px",borderRadius:m.from===user.id?"16px 3px 16px 16px":"3px 16px 16px 16px",background:m.from===user.id?"linear-gradient(135deg,#4f8ef7,#a855f7)":T?"rgba(255,255,255,0.07)":"#f3f4f6",color:m.from===user.id?"#fff":txt,fontSize:13,lineHeight:1.6,wordBreak:"break-word",display:"inline-block"}}>
                            {m.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={msgEnd}/>
                  </div>

                  {/* input */}
                  <div style={{padding:"10px 14px",borderTop:`1px solid ${cardBr}`,display:"flex",gap:8}}>
                    <input value={dmText} onChange={e=>setDmText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}
                      placeholder={`Message ${dmPeer.name}…`}
                      style={{flex:1,background:T?"rgba(255,255,255,0.05)":"#f9fafb",border:`1px solid ${cardBr}`,borderRadius:9,padding:"10px 13px",color:txt,fontSize:13,outline:"none",fontFamily:"inherit"}}
                      onFocus={e=>e.target.style.borderColor="#4f8ef7"} onBlur={e=>e.target.style.borderColor=cardBr}/>
                    <button onClick={sendMsg} style={{width:44,height:44,borderRadius:9,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#4f8ef7,#a855f7)",color:"#fff",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>➤</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
