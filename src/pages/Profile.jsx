import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Profile({ setPage }) {
  const { user, users, myResults, updateSocialProfile, darkMode,
          pendingRequests, acceptFollow, rejectFollow,
          myFollowers, myFollowing, follows,
          sendDM, getDMs, isFollowing } = useApp();

  const mock    = myResults.filter(r => r.isMock);
  const best    = mock.length ? Math.max(...mock.map(r => r.score)) : "—";
  const avgAcc  = myResults.length ? Math.round(myResults.reduce((a,r)=>a+(r.accuracy||0),0)/myResults.length) : 0;

  const sp = user?.socialProfile || {};
  const [editing,  setEditing]  = useState(!sp.username);
  const [username, setUsername] = useState(sp.username || "");
  const [city,     setCity]     = useState(sp.city || "");
  const [ddcetRank,setDdcetRank]= useState(sp.ddcetRank || "");
  const [insta,    setInsta]    = useState(sp.insta || "");
  const [saved,    setSaved]    = useState(false);
  const [dmUser,   setDmUser]   = useState(null);
  const [dmText,   setDmText]   = useState("");
  const [tab,      setTab]      = useState("profile"); // profile | followers | following | requests | dms

  const pending  = pendingRequests ? pendingRequests() : [];
  const followers = myFollowers ? myFollowers() : [];
  const following = myFollowing ? myFollowing() : [];

  const txt    = darkMode ? "#e2e2f0" : "#111";
  const sub    = darkMode ? "#666"    : "#888";
  const cardBg = darkMode ? "rgba(255,255,255,0.03)"  : "#fff";
  const cardBr = darkMode ? "rgba(255,255,255,0.07)"  : "#e5e7eb";
  const inp    = { width:"100%", background:darkMode?"rgba(255,255,255,0.05)":"#f9fafb", border:`1.5px solid ${darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}`, borderRadius:9, padding:"10px 13px", color:txt, fontSize:13, outline:"none", fontFamily:"inherit" };
  const lbl    = { fontSize:11, color:sub, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5, display:"block" };
  const tabBtn = (t) => ({ padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit", background:tab===t?"linear-gradient(135deg,#4f8ef7,#a855f7)":"transparent", color:tab===t?"#fff":sub, transition:"all 0.2s" });

  function saveProfile() {
    if (!username.trim()) return;
    updateSocialProfile({ username: username.trim().replace(/\s/g,"").toLowerCase(), city, ddcetRank, insta });
    setSaved(true); setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  }

  function sendMessage() {
    if (!dmText.trim() || !dmUser) return;
    sendDM(dmUser.id, dmText.trim());
    setDmText("");
  }

  const dmMessages = dmUser ? getDMs(dmUser.id) : [];

  return (
    <div style={{ maxWidth:680 }}>
      <div style={{ fontSize:22, fontWeight:800, color:txt, marginBottom:20 }}>My Profile</div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:darkMode?"rgba(255,255,255,0.03)":"#f3f4f6", borderRadius:10, padding:4, flexWrap:"wrap" }}>
        {[
          { id:"profile",   label:"Profile"               },
          { id:"followers", label:`Followers (${followers.length})`},
          { id:"following", label:`Following (${following.length})`},
          { id:"requests",  label:`Requests ${pending.length>0?`(${pending.length})`:""}` },
          { id:"dms",       label:"Messages"              },
        ].map(t => (
          <button key={t.id} style={tabBtn(t.id)} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === "profile" && (
        <>
          {/* Avatar + name */}
          <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:24, marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
              <div style={{ width:70, height:70, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:800, color:"#fff", flexShrink:0 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:txt }}>{user?.name}</div>
                {sp.username && <div style={{ color:"#4f8ef7", fontSize:13 }}>@{sp.username}</div>}
                <div style={{ color:sub, fontSize:12, marginTop:2 }}>{sp.city || user?.profile?.branch}</div>
              </div>
              <button onClick={()=>setEditing(e=>!e)} style={{ marginLeft:"auto", padding:"7px 16px", borderRadius:8, border:`1px solid ${cardBr}`, background:"transparent", color:sub, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
                {editing ? "Cancel" : "✏ Edit"}
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:editing?20:0 }}>
              {[
                {l:"Mocks",     v:mock.length,    c:"#4f8ef7"},
                {l:"Best",      v:best,           c:"#4ade80"},
                {l:"Avg Acc",   v:avgAcc+"%",     c:"#a855f7"},
                {l:"Followers", v:followers.length,c:"#fb923c"},
              ].map(s=>(
                <div key={s.l} style={{ textAlign:"center", background:`${s.c}11`, border:`1px solid ${s.c}22`, borderRadius:9, padding:"12px 8px" }}>
                  <div style={{ fontSize:20, fontWeight:800, color:s.c }}>{s.v}</div>
                  <div style={{ fontSize:10, color:sub }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Edit form */}
            {editing && (
              <div style={{ borderTop:`1px solid ${cardBr}`, paddingTop:18 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  <div>
                    <label style={lbl}>Username *</label>
                    <input style={inp} placeholder="e.g. mitesh2202" value={username} onChange={e=>setUsername(e.target.value)}
                      onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor=darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}}/>
                  </div>
                  <div>
                    <label style={lbl}>City</label>
                    <input style={inp} placeholder="e.g. Surat" value={city} onChange={e=>setCity(e.target.value)}
                      onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor=darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}}/>
                  </div>
                  <div>
                    <label style={lbl}>DDCET Rank (optional)</label>
                    <input style={inp} placeholder="e.g. 1250" value={ddcetRank} onChange={e=>setDdcetRank(e.target.value)}
                      onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor=darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}}/>
                  </div>
                  <div>
                    <label style={lbl}>Instagram Handle (optional)</label>
                    <input style={inp} placeholder="e.g. @mitesh.22" value={insta} onChange={e=>setInsta(e.target.value)}
                      onFocus={e=>{e.target.style.borderColor="#4f8ef7"}} onBlur={e=>{e.target.style.borderColor=darkMode?"rgba(255,255,255,0.08)":"#e5e7eb"}}/>
                  </div>
                </div>
                <button onClick={saveProfile} style={{ padding:"10px 24px", borderRadius:9, border:"none", cursor:"pointer", background:saved?"rgba(74,222,128,0.15)":"linear-gradient(135deg,#4f8ef7,#a855f7)", color:saved?"#4ade80":"#fff", fontSize:13, fontWeight:700, fontFamily:"inherit" }}>
                  {saved ? "✓ Saved!" : "Save Profile"}
                </button>
              </div>
            )}
          </div>

          {/* Profile details */}
          {!editing && sp.username && (
            <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:20, marginBottom:14 }}>
              {[
                {l:"Email",         v:user?.email},
                {l:"Branch",        v:user?.profile?.branch},
                {l:"Target Marks",  v:`${user?.profile?.goal || "—"} / 200`},
                {l:"City",          v:sp.city || "—"},
                {l:"DDCET Rank",    v:sp.ddcetRank || "Not set"},
                {l:"Instagram",     v:sp.insta || "Not set"},
              ].map(r => (
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${cardBr}`, fontSize:13 }}>
                  <span style={{ color:sub }}>{r.l}</span>
                  <span style={{ color:r.l==="Instagram"&&r.v!=="Not set"?"#4f8ef7":txt, fontWeight:500 }}>{r.v}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── FOLLOWERS TAB ── */}
      {tab === "followers" && (
        <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:700, color:txt, marginBottom:14 }}>Followers ({followers.length})</div>
          {followers.length === 0 && <div style={{ color:sub, fontSize:13 }}>No followers yet.</div>}
          {followers.map(u => (
            <div key={u.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${cardBr}` }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:"#fff" }}>{u.name[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, color:txt, fontSize:13 }}>{u.name}</div>
                <div style={{ fontSize:11, color:sub }}>@{u.socialProfile?.username || "—"} · {u.profile?.branch}</div>
              </div>
              <button onClick={()=>{setDmUser(u);setTab("dms");}}
                style={{ padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer", background:"rgba(79,142,247,0.15)", color:"#7aadff", fontSize:12, fontWeight:600, fontFamily:"inherit" }}>
                💬 Message
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── FOLLOWING TAB ── */}
      {tab === "following" && (
        <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:700, color:txt, marginBottom:14 }}>Following ({following.length})</div>
          {following.length === 0 && <div style={{ color:sub, fontSize:13 }}>Not following anyone yet. Explore students!</div>}
          {following.map(u => (
            <div key={u.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${cardBr}` }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#a855f7,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:"#fff" }}>{u.name[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, color:txt, fontSize:13 }}>{u.name}</div>
                <div style={{ fontSize:11, color:sub }}>@{u.socialProfile?.username || "—"} · {u.profile?.branch}</div>
              </div>
              <button onClick={()=>{setDmUser(u);setTab("dms");}}
                style={{ padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer", background:"rgba(79,142,247,0.15)", color:"#7aadff", fontSize:12, fontWeight:600, fontFamily:"inherit" }}>
                💬 Message
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── REQUESTS TAB ── */}
      {tab === "requests" && (
        <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:700, color:txt, marginBottom:14 }}>Follow Requests ({pending.length})</div>
          {pending.length === 0 && <div style={{ color:sub, fontSize:13 }}>No pending requests.</div>}
          {pending.map(req => {
            const sender = users.find(u => u.id === req.from);
            if (!sender) return null;
            return (
              <div key={req.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:`1px solid ${cardBr}` }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#fb923c,#ef4444)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"#fff" }}>{sender.name[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, color:txt, fontSize:13 }}>{sender.name}</div>
                  <div style={{ fontSize:11, color:sub }}>@{sender.socialProfile?.username || "—"} · {sender.profile?.branch}</div>
                </div>
                <button onClick={()=>acceptFollow(req.id)}
                  style={{ padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer", background:"rgba(74,222,128,0.15)", color:"#4ade80", fontSize:12, fontWeight:700, fontFamily:"inherit", marginRight:6 }}>
                  ✓ Accept
                </button>
                <button onClick={()=>rejectFollow(req.id)}
                  style={{ padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer", background:"rgba(239,68,68,0.1)", color:"#f87171", fontSize:12, fontWeight:700, fontFamily:"inherit" }}>
                  ✕ Reject
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── DMs TAB ── */}
      {tab === "dms" && (
        <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, overflow:"hidden" }}>
          <div style={{ display:"grid", gridTemplateColumns:"180px 1fr" }}>
            {/* Contacts list */}
            <div style={{ borderRight:`1px solid ${cardBr}`, height:420, overflowY:"auto" }}>
              <div style={{ padding:"12px 14px", fontSize:12, fontWeight:700, color:sub, borderBottom:`1px solid ${cardBr}` }}>MESSAGES</div>
              {[...followers, ...following].filter((u,i,a)=>a.findIndex(x=>x.id===u.id)===i).map(u=>(
                <div key={u.id} onClick={()=>setDmUser(u)}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", cursor:"pointer", background:dmUser?.id===u.id?darkMode?"rgba(79,142,247,0.12)":"rgba(79,142,247,0.08)":"transparent", borderBottom:`1px solid ${cardBr}` }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff", flexShrink:0 }}>{u.name[0]}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:txt, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.name}</div>
                    <div style={{ fontSize:10, color:sub }}>@{u.socialProfile?.username||"—"}</div>
                  </div>
                </div>
              ))}
              {followers.length===0 && following.length===0 && (
                <div style={{ padding:16, fontSize:12, color:sub }}>Follow someone to message them.</div>
              )}
            </div>

            {/* Chat area */}
            <div style={{ display:"flex", flexDirection:"column", height:420 }}>
              {!dmUser ? (
                <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:sub, fontSize:13 }}>Select a contact to start messaging</div>
              ) : (
                <>
                  <div style={{ padding:"12px 16px", borderBottom:`1px solid ${cardBr}`, display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#fff" }}>{dmUser.name[0]}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:txt }}>{dmUser.name}</div>
                    <div style={{ fontSize:11, color:"#4ade80", marginLeft:4 }}>● Online</div>
                  </div>
                  <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
                    {dmMessages.length === 0 && <div style={{ color:sub, fontSize:12, textAlign:"center", marginTop:20 }}>Say hello! 👋</div>}
                    {dmMessages.map((m,i) => (
                      <div key={i} style={{ display:"flex", justifyContent:m.from===user.id?"flex-end":"flex-start" }}>
                        <div style={{ maxWidth:"72%", padding:"9px 13px", borderRadius:m.from===user.id?"14px 3px 14px 14px":"3px 14px 14px 14px", background:m.from===user.id?"linear-gradient(135deg,#4f8ef7,#a855f7)":darkMode?"rgba(255,255,255,0.07)":"#f3f4f6", color:txt, fontSize:13 }}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding:"10px 14px", borderTop:`1px solid ${cardBr}`, display:"flex", gap:8 }}>
                    <input value={dmText} onChange={e=>setDmText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()}
                      placeholder={`Message ${dmUser.name}...`}
                      style={{ flex:1, background:darkMode?"rgba(255,255,255,0.05)":"#f9fafb", border:`1px solid ${cardBr}`, borderRadius:8, padding:"9px 12px", color:txt, fontSize:13, outline:"none", fontFamily:"inherit" }}/>
                    <button onClick={sendMessage} style={{ padding:"9px 16px", borderRadius:8, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#4f8ef7,#a855f7)", color:"#fff", fontSize:16 }}>➤</button>
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
