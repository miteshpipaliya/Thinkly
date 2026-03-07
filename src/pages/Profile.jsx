import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Profile() {
  const {
    user, users, myResults, darkMode,
    updateSocialProfile,
    pendingRequests, acceptFollow, rejectFollow,
    myFollowers, myFollowing,
    sendDM, getDMs,
  } = useApp();

  const mock   = myResults.filter(r => r.isMock);
  const best   = mock.length ? Math.max(...mock.map(r => r.score)) : "—";
  const avgAcc = myResults.length ? Math.round(myResults.reduce((a,r)=>a+(r.accuracy||0),0)/myResults.length) : 0;

  const sp = user?.socialProfile || {};
  const [tab,      setTab]      = useState(!sp.username ? "edit" : "profile");
  const [username, setUsername] = useState(sp.username  || "");
  const [city,     setCity]     = useState(sp.city      || "");
  const [rank,     setRank]     = useState(sp.ddcetRank || "");
  const [insta,    setInsta]    = useState(sp.insta     || "");
  const [saved,    setSaved]    = useState(false);
  const [dmPeer,   setDmPeer]   = useState(null);
  const [dmText,   setDmText]   = useState("");
  const [viewUser, setViewUser] = useState(null); // profile modal

  const pending   = pendingRequests ? pendingRequests() : [];
  const followers = myFollowers     ? myFollowers()     : [];
  const following = myFollowing     ? myFollowing()     : [];
  const contacts  = [...followers, ...following].filter((u,i,a)=>a.findIndex(x=>x.id===u.id)===i);

  const txt    = darkMode ? "#e2e2f0" : "#111";
  const sub    = darkMode ? "#555"    : "#888";
  const cardBg = darkMode ? "rgba(255,255,255,0.03)"  : "#fff";
  const cardBr = darkMode ? "rgba(255,255,255,0.07)"  : "#e5e7eb";
  const inp    = { width:"100%", background:darkMode?"rgba(255,255,255,0.05)":"#f9fafb", border:`1.5px solid ${darkMode?"rgba(255,255,255,0.1)":"#e5e7eb"}`, borderRadius:9, padding:"10px 13px", color:txt, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
  const lbl    = { fontSize:11, color:sub, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5, display:"block" };

  const tabs = [
    { id:"profile",   label:"Profile"                                     },
    { id:"edit",      label:"✏ Edit"                                      },
    { id:"requests",  label:`Requests${pending.length>0?` (${pending.length})`:""}`},
    { id:"followers", label:`Followers (${followers.length})`             },
    { id:"following", label:`Following (${following.length})`             },
    { id:"messages",  label:"Messages"                                    },
  ];

  const TabBtn = ({ id, label }) => (
    <button onClick={()=>setTab(id)} style={{ padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit", whiteSpace:"nowrap", transition:"all 0.2s",
      background:tab===id?"linear-gradient(135deg,#4f8ef7,#a855f7)":"transparent",
      color:tab===id?"#fff":sub }}>
      {label}
    </button>
  );

  function saveProfile() {
    if (!username.trim()) return;
    updateSocialProfile({ username:username.trim().toLowerCase().replace(/\s/g,""), city, ddcetRank:rank, insta });
    setSaved(true); setTimeout(()=>{setSaved(false); setTab("profile");}, 1500);
  }

  function sendMessage() {
    if (!dmText.trim() || !dmPeer) return;
    sendDM(dmPeer.id, dmText.trim()); setDmText("");
  }

  /* ── Profile view modal (for contacts) ── */
  function ProfileModal({ u }) {
    if (!u) return null;
    const sp2 = u.socialProfile || {};
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={()=>setViewUser(null)}>
        <div style={{ background:darkMode?"#0e0e1c":"#fff", border:`1px solid ${cardBr}`, borderRadius:20, padding:32, maxWidth:400, width:"100%", position:"relative" }} onClick={e=>e.stopPropagation()}>
          <button onClick={()=>setViewUser(null)} style={{ position:"absolute", top:14, right:16, background:"none", border:"none", fontSize:18, color:sub, cursor:"pointer" }}>✕</button>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
            <div style={{ width:58, height:58, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:"#fff" }}>{u.name[0]}</div>
            <div>
              <div style={{ fontSize:18, fontWeight:900, color:txt }}>{u.name}</div>
              {sp2.username && <div style={{ color:"#4f8ef7", fontSize:13, fontWeight:600 }}>@{sp2.username}</div>}
            </div>
          </div>
          {[
            { l:"Branch",      v:u.profile?.branch    },
            { l:"City",        v:sp2.city             },
            { l:"DDCET Rank",  v:sp2.ddcetRank        },
            { l:"Instagram",   v:sp2.insta            },
          ].map(r => r.v ? (
            <div key={r.l} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${cardBr}`, fontSize:13 }}>
              <span style={{ color:sub, fontWeight:600 }}>{r.l}</span>
              <span style={{ color:r.l==="Instagram"?"#4f8ef7":txt, fontWeight:600 }}>{r.v}</span>
            </div>
          ) : null)}
          <button onClick={()=>{ setDmPeer(u); setTab("messages"); setViewUser(null); }}
            style={{ marginTop:18, width:"100%", padding:"11px", borderRadius:10, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", fontSize:13, fontWeight:800, fontFamily:"inherit" }}>
            💬 Send Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:700 }}>
      <ProfileModal u={viewUser} />

      <div style={{ fontSize:22, fontWeight:900, color:txt, marginBottom:18 }}>My Profile</div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:20, background:darkMode?"rgba(255,255,255,0.03)":"#f3f4f6", borderRadius:12, padding:4 }}>
        {tabs.map(t => <TabBtn key={t.id} {...t} />)}
      </div>

      {/* ══ PROFILE ══ */}
      {tab === "profile" && (
        <>
          <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:16, padding:24, marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
              <div style={{ width:68, height:68, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:900, color:"#fff", flexShrink:0 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:21, fontWeight:900, color:txt }}>{user?.name}</div>
                {sp.username && <div style={{ color:"#4f8ef7", fontSize:14, fontWeight:600 }}>@{sp.username}</div>}
                <div style={{ color:sub, fontSize:12, marginTop:2 }}>{sp.city || user?.profile?.branch}</div>
              </div>
              <button onClick={()=>setTab("edit")} style={{ padding:"7px 16px", borderRadius:8, border:`1px solid ${cardBr}`, background:"transparent", color:sub, cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:600 }}>✏ Edit</button>
            </div>
            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
              {[{l:"Mocks",v:mock.length,c:"#4f8ef7"},{l:"Best",v:best,c:"#4ade80"},{l:"Avg Acc",v:avgAcc+"%",c:"#a855f7"},{l:"Followers",v:followers.length,c:"#fb923c"}].map(s=>(
                <div key={s.l} style={{ textAlign:"center", background:`${s.c}12`, border:`1px solid ${s.c}25`, borderRadius:10, padding:"13px 8px" }}>
                  <div style={{ fontSize:22, fontWeight:900, color:s.c }}>{s.v}</div>
                  <div style={{ fontSize:10, color:sub, marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {sp.username && (
            <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:20 }}>
              {[{l:"Email",v:user?.email},{l:"Branch",v:user?.profile?.branch},{l:"Target",v:`${user?.profile?.goal||"—"}/200`},{l:"City",v:sp.city||"—"},{l:"DDCET Rank",v:sp.ddcetRank||"Not set"},{l:"Instagram",v:sp.insta||"Not set"}].map(r=>(
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${cardBr}`, fontSize:13 }}>
                  <span style={{ color:sub, fontWeight:600 }}>{r.l}</span>
                  <span style={{ color:r.l==="Instagram"&&r.v!=="Not set"?"#4f8ef7":txt, fontWeight:600 }}>{r.v}</span>
                </div>
              ))}
            </div>
          )}

          {!sp.username && (
            <div style={{ padding:"20px", background:"rgba(251,191,36,0.08)", border:"1.5px solid rgba(251,191,36,0.3)", borderRadius:12, fontSize:13, color:"#fbbf24", fontWeight:600 }}>
              ⚠️ Complete your social profile to unlock follow requests, messaging & group mocks!
              <button onClick={()=>setTab("edit")} style={{ marginLeft:12, padding:"5px 14px", borderRadius:7, border:"none", cursor:"pointer", background:"rgba(251,191,36,0.2)", color:"#fbbf24", fontSize:12, fontFamily:"inherit", fontWeight:800 }}>Set Up →</button>
            </div>
          )}
        </>
      )}

      {/* ══ EDIT ══ */}
      {tab === "edit" && (
        <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:16, padding:26 }}>
          <div style={{ fontSize:16, fontWeight:900, color:txt, marginBottom:18 }}>Edit Social Profile</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
            <div>
              <label style={lbl}>Username *</label>
              <input style={inp} placeholder="e.g. mitesh_22" value={username} onChange={e=>setUsername(e.target.value)} onFocus={e=>e.target.style.borderColor="#4f8ef7"} onBlur={e=>e.target.style.borderColor=darkMode?"rgba(255,255,255,0.1)":"#e5e7eb"}/>
            </div>
            <div>
              <label style={lbl}>City</label>
              <input style={inp} placeholder="e.g. Surat" value={city} onChange={e=>setCity(e.target.value)} onFocus={e=>e.target.style.borderColor="#4f8ef7"} onBlur={e=>e.target.style.borderColor=darkMode?"rgba(255,255,255,0.1)":"#e5e7eb"}/>
            </div>
            <div>
              <label style={lbl}>DDCET Rank (optional)</label>
              <input style={inp} placeholder="e.g. 1250" value={rank} onChange={e=>setRank(e.target.value)} onFocus={e=>e.target.style.borderColor="#4f8ef7"} onBlur={e=>e.target.style.borderColor=darkMode?"rgba(255,255,255,0.1)":"#e5e7eb"}/>
            </div>
            <div>
              <label style={lbl}>Instagram (optional)</label>
              <input style={inp} placeholder="e.g. @mitesh.22" value={insta} onChange={e=>setInsta(e.target.value)} onFocus={e=>e.target.style.borderColor="#4f8ef7"} onBlur={e=>e.target.style.borderColor=darkMode?"rgba(255,255,255,0.1)":"#e5e7eb"}/>
            </div>
          </div>
          <button onClick={saveProfile} disabled={!username.trim()}
            style={{ padding:"11px 28px", borderRadius:10, border:"none", cursor:username.trim()?"pointer":"default", background:saved?"rgba(74,222,128,0.2)":"linear-gradient(135deg,#4f8ef7,#a855f7)", color:saved?"#4ade80":"#fff", fontSize:14, fontWeight:800, fontFamily:"inherit", opacity:username.trim()?1:0.5 }}>
            {saved ? "✓ Saved!" : "Save Profile"}
          </button>
        </div>
      )}

      {/* ══ REQUESTS ══ */}
      {tab === "requests" && (
        <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:16, padding:22 }}>
          <div style={{ fontSize:16, fontWeight:900, color:txt, marginBottom:6 }}>Follow Requests</div>
          <div style={{ fontSize:12, color:sub, marginBottom:16 }}>
            Accept a request to allow that person to see your profile and message you.
          </div>

          {pending.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px 0", color:sub, fontSize:13 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📭</div>
              No pending follow requests.
            </div>
          ) : (
            pending.map(req => {
              const sender = users.find(u => u.id === req.from);
              if (!sender) return null;
              const sp2 = sender.socialProfile || {};
              return (
                <div key={req.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 0", borderBottom:`1px solid ${cardBr}` }}>
                  <div style={{ width:46, height:46, borderRadius:"50%", background:"linear-gradient(135deg,#fb923c,#ef4444)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:"#fff", flexShrink:0 }}>
                    {sender.name[0]}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:900, color:txt, fontSize:15 }}>{sender.name}</div>
                    <div style={{ fontSize:12, color:sub, marginTop:2 }}>
                      {sp2.username ? `@${sp2.username}` : sender.email} · {sender.profile?.branch}
                      {sp2.city ? ` · ${sp2.city}` : ""}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => acceptFollow(req.id)}
                      style={{ padding:"9px 20px", borderRadius:9, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#4ade80,#22c55e)", color:"#fff", fontSize:13, fontWeight:900, fontFamily:"inherit" }}>
                      ✓ Accept
                    </button>
                    <button onClick={() => rejectFollow(req.id)}
                      style={{ padding:"9px 16px", borderRadius:9, border:"none", cursor:"pointer", background:"rgba(239,68,68,0.12)", color:"#f87171", fontSize:13, fontWeight:900, fontFamily:"inherit" }}>
                      ✕ Reject
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ══ FOLLOWERS ══ */}
      {tab === "followers" && (
        <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:16, padding:22 }}>
          <div style={{ fontSize:16, fontWeight:900, color:txt, marginBottom:16 }}>Followers ({followers.length})</div>
          {followers.length === 0 && <div style={{ color:sub, fontSize:13, textAlign:"center", padding:"20px 0" }}>No followers yet.</div>}
          {followers.map(u => (
            <div key={u.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:`1px solid ${cardBr}` }}>
              <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, color:"#fff", flexShrink:0 }}>{u.name[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, color:txt, fontSize:14 }}>{u.name}</div>
                <div style={{ fontSize:11, color:sub }}>@{u.socialProfile?.username||"—"} · {u.profile?.branch}</div>
              </div>
              <button onClick={()=>setViewUser(u)} style={{ padding:"6px 14px", borderRadius:8, border:`1px solid ${cardBr}`, background:"transparent", color:sub, fontSize:12, fontFamily:"inherit", cursor:"pointer", fontWeight:700 }}>View Profile</button>
              <button onClick={()=>{setDmPeer(u);setTab("messages");}} style={{ padding:"7px 14px", borderRadius:8, border:"none", cursor:"pointer", background:"rgba(79,142,247,0.15)", color:"#7aadff", fontSize:12, fontWeight:800, fontFamily:"inherit" }}>💬</button>
            </div>
          ))}
        </div>
      )}

      {/* ══ FOLLOWING ══ */}
      {tab === "following" && (
        <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:16, padding:22 }}>
          <div style={{ fontSize:16, fontWeight:900, color:txt, marginBottom:16 }}>Following ({following.length})</div>
          {following.length === 0 && <div style={{ color:sub, fontSize:13, textAlign:"center", padding:"20px 0" }}>Not following anyone yet.</div>}
          {following.map(u => (
            <div key={u.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:`1px solid ${cardBr}` }}>
              <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#a855f7,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, color:"#fff", flexShrink:0 }}>{u.name[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, color:txt, fontSize:14 }}>{u.name}</div>
                <div style={{ fontSize:11, color:sub }}>@{u.socialProfile?.username||"—"} · {u.profile?.branch}</div>
              </div>
              <button onClick={()=>setViewUser(u)} style={{ padding:"6px 14px", borderRadius:8, border:`1px solid ${cardBr}`, background:"transparent", color:sub, fontSize:12, fontFamily:"inherit", cursor:"pointer", fontWeight:700 }}>View Profile</button>
              <button onClick={()=>{setDmPeer(u);setTab("messages");}} style={{ padding:"7px 14px", borderRadius:8, border:"none", cursor:"pointer", background:"rgba(79,142,247,0.15)", color:"#7aadff", fontSize:12, fontWeight:800, fontFamily:"inherit" }}>💬</button>
            </div>
          ))}
        </div>
      )}

      {/* ══ MESSAGES ══ */}
      {tab === "messages" && (
        <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:16, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"190px 1fr" }}>
            {/* Contact list */}
            <div style={{ borderRight:`1px solid ${cardBr}`, height:460, overflowY:"auto" }}>
              <div style={{ padding:"12px 14px", fontSize:11, fontWeight:800, color:sub, borderBottom:`1px solid ${cardBr}`, textTransform:"uppercase", letterSpacing:"0.06em" }}>Contacts</div>
              {contacts.length === 0 && <div style={{ padding:"16px", fontSize:12, color:sub }}>Follow someone to message them.</div>}
              {contacts.map(u => (
                <div key={u.id} onClick={()=>setDmPeer(u)}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", cursor:"pointer", background:dmPeer?.id===u.id?darkMode?"rgba(79,142,247,0.12)":"rgba(79,142,247,0.07)":"transparent", borderBottom:`1px solid ${cardBr}` }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff", flexShrink:0 }}>{u.name[0]}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:txt, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.name}</div>
                    <div style={{ fontSize:10, color:sub }}>@{u.socialProfile?.username||"—"}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat window */}
            <div style={{ display:"flex", flexDirection:"column", height:460 }}>
              {!dmPeer ? (
                <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:sub, gap:8 }}>
                  <span style={{ fontSize:32 }}>💬</span>
                  <span style={{ fontSize:13 }}>Select a contact to start chatting</span>
                </div>
              ) : (
                <>
                  <div style={{ padding:"12px 16px", borderBottom:`1px solid ${cardBr}`, display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff" }}>{dmPeer.name[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:txt }}>{dmPeer.name}</div>
                      <div style={{ fontSize:10, color:"#4ade80" }}>● Online</div>
                    </div>
                    <button onClick={()=>setViewUser(dmPeer)} style={{ padding:"5px 12px", borderRadius:7, border:`1px solid ${cardBr}`, background:"transparent", color:sub, fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>View Profile</button>
                  </div>

                  {/* Messages */}
                  <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                    {getDMs(dmPeer.id).length === 0 && (
                      <div style={{ textAlign:"center", color:sub, fontSize:12, marginTop:20 }}>Say hello 👋</div>
                    )}
                    {getDMs(dmPeer.id).map((m,i) => (
                      <div key={i} style={{ display:"flex", justifyContent:m.from===user.id?"flex-end":"flex-start" }}>
                        <div style={{ maxWidth:"72%", padding:"10px 14px", borderRadius:m.from===user.id?"16px 3px 16px 16px":"3px 16px 16px 16px", background:m.from===user.id?"linear-gradient(135deg,#4f8ef7,#a855f7)":darkMode?"rgba(255,255,255,0.07)":"#f3f4f6", color:txt, fontSize:13, lineHeight:1.6, wordBreak:"break-word" }}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div style={{ padding:"10px 14px", borderTop:`1px solid ${cardBr}`, display:"flex", gap:8 }}>
                    <input value={dmText} onChange={e=>setDmText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()}
                      placeholder={`Message ${dmPeer.name}…`}
                      style={{ flex:1, background:darkMode?"rgba(255,255,255,0.05)":"#f9fafb", border:`1px solid ${cardBr}`, borderRadius:9, padding:"10px 13px", color:txt, fontSize:13, outline:"none", fontFamily:"inherit" }}
                      onFocus={e=>e.target.style.borderColor="#4f8ef7"} onBlur={e=>e.target.style.borderColor=cardBr}/>
                    <button onClick={sendMessage} style={{ width:44, height:44, borderRadius:9, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>➤</button>
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
