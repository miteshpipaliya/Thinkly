/**
 * AppContext.jsx — Ranklify v9 "Live Platform"
 * ─────────────────────────────────────────────
 * All localStorage keys prefixed "rkl9_" for a clean slate.
 * Per-user checklist, heartbeat, 1.5s polling, full social graph.
 */
import { createContext, useContext, useState, useEffect } from "react";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

/* ── storage ─────────────────────────────────────────────────── */
const LS = {
  g: (k,d) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch{return d;} },
  s: (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); }catch{} },
};
const K = {
  session : "rkl9_session",
  users   : "rkl9_users",
  requests: "rkl9_requests",  // {id,from,to,status:'pending'|'accepted'|'rejected',ts}
  dms     : "rkl9_dms",       // {id,from,to,text,ts,read}
  gchat   : "rkl9_gchat",     // {id,userId,userName,text,channel,ts}
  groups  : "rkl9_groups",    // mock sessions
  invites : "rkl9_invites",   // group mock invites
  results : "rkl9_results",
  checks  : "rkl9_checks",    // {[userId]: {[key]:bool}}
  dark    : "rkl9_dark",
  online  : "rkl9_online",    // [{id,ts}]
};

/* ── raw getters/setters ─────────────────────────────────────── */
const gUsers    = ()  => LS.g(K.users,    []);
const gReqs     = ()  => LS.g(K.requests, []);
const gDMs      = ()  => LS.g(K.dms,      []);
const gGchat    = ()  => LS.g(K.gchat,    []);
const gGroups   = ()  => LS.g(K.groups,   []);
const gInvites  = ()  => LS.g(K.invites,  []);
const gResults  = ()  => LS.g(K.results,  []);
const gChecks   = ()  => LS.g(K.checks,   {});
const gOnline   = ()  => LS.g(K.online,   []).filter(h=>Date.now()-h.ts<45000);

/* ════════════════════════════════════════════════════════════════ */
export function AppProvider({ children }) {
  const [user,    setUserS]  = useState(() => LS.g(K.session, null));
  const [users,   setUsers]  = useState(() => gUsers());
  const [reqs,    setReqs]   = useState(() => gReqs());
  const [dms,     setDms]    = useState(() => gDMs());
  const [gchat,   setGchat]  = useState(() => gGchat());
  const [groups,  setGroups] = useState(() => gGroups());
  const [invites, setInvs]   = useState(() => gInvites());
  const [results, setRes]    = useState(() => gResults());
  const [checks,  setChks]   = useState(() => gChecks());
  const [dark,    setDark]   = useState(() => LS.g(K.dark, true));
  const [online,  setOnline] = useState(() => gOnline().map(h=>h.id));

  /* persist simple keys */
  useEffect(()=>{ LS.s(K.session, user); }, [user]);
  useEffect(()=>{ LS.s(K.dark,    dark); }, [dark]);
  useEffect(()=>{ LS.s(K.checks,  checks); }, [checks]);

  /* ── heartbeat ── */
  useEffect(()=>{
    if (!user?.id) return;
    const beat=()=>{
      const prev=LS.g(K.online,[]).filter(h=>Date.now()-h.ts<45000);
      LS.s(K.online,[...prev.filter(h=>h.id!==user.id),{id:user.id,ts:Date.now()}]);
    };
    beat();
    const t=setInterval(beat,20000);
    return()=>clearInterval(t);
  },[user?.id]);

  /* ── polling every 1.5 s ── */
  useEffect(()=>{
    const t=setInterval(()=>{
      const nu=gUsers(); setUsers(nu);
      setReqs(gReqs()); setDms(gDMs()); setGchat(gGchat());
      setGroups(gGroups()); setInvs(gInvites()); setRes(gResults());
      setOnline(gOnline().map(h=>h.id));
      if (user?.id) {
        const fr=nu.find(u=>u.id===user.id);
        if(fr && JSON.stringify(fr)!==JSON.stringify(user)){
          const u2={...fr};
          setUserS(u2); LS.s(K.session,u2);
        }
      }
    },1500);
    return()=>clearInterval(t);
  },[user?.id]);

  /* ═══════ AUTH ══════════════════════════════════════════════ */
  function signup(email,password,name,extra={}){
    const all=gUsers();
    if(all.find(u=>u.email===email)) return{error:"Email already registered."};
    if(extra.username && all.find(u=>u.socialProfile?.username===extra.username))
      return{error:"Username already taken."};
    const nu={
      id:Date.now(), email, password, name,
      setupDone:false,
      profile:{ branch: extra.branch||"", city: extra.city||"" },
      socialProfile:{
        username: extra.username||"",
        city:     extra.city||"",
        ddcetRank: extra.rankGoal||"",
      },
      createdAt:Date.now()
    };
    const next=[...all,nu];
    LS.s(K.users,next); setUsers(next);
    setUserS(nu); LS.s(K.session,nu);
    return{ok:true};
  }

  function login(email,password){
    const found=gUsers().find(u=>u.email===email&&u.password===password);
    if(!found) return{error:"Invalid email or password."};
    setUsers(gUsers()); setUserS(found); LS.s(K.session,found);
    return{ok:true};
  }

  function logout(){ LS.s(K.session,null); setUserS(null); }

  function _upsert(u2){
    const next=gUsers().map(u=>u.id===u2.id?u2:u);
    LS.s(K.users,next); setUsers(next);
    setUserS(u2); LS.s(K.session,u2);
  }

  function completeSetup(profile){
    _upsert({...user,setupDone:true,profile:{...user.profile,...profile}});
  }

  function updateSocialProfile(sp){
    _upsert({...user,socialProfile:{...user.socialProfile,...sp}});
  }

  /* ═══════ REQUESTS (peer connections) ══════════════════════ */
  function sendRequest(toId){
    const latest=gReqs();
    if(latest.find(r=>r.from===user.id&&r.to===toId)) return;
    const next=[...latest,{id:Date.now(),from:user.id,to:toId,status:"pending",ts:Date.now()}];
    LS.s(K.requests,next); setReqs(next);
  }

  function acceptRequest(reqId){
    const next=gReqs().map(r=>r.id===reqId?{...r,status:"accepted"}:r);
    LS.s(K.requests,next); setReqs(next);
  }

  function rejectRequest(reqId){
    const next=gReqs().filter(r=>r.id!==reqId);
    LS.s(K.requests,next); setReqs(next);
  }

  function cancelRequest(toId){
    const next=gReqs().filter(r=>!(r.from===user.id&&r.to===toId&&r.status==="pending"));
    LS.s(K.requests,next); setReqs(next);
  }

  /* computed helpers */
  const isConnected = (uid) => reqs.some(r=>
    ((r.from===user?.id&&r.to===uid)||(r.from===uid&&r.to===user?.id))&&r.status==="accepted"
  );
  const isPending  = (uid) => reqs.some(r=>r.from===user?.id&&r.to===uid&&r.status==="pending");
  const isIncoming = (uid) => reqs.some(r=>r.from===uid&&r.to===user?.id&&r.status==="pending");

  const incomingRequests = () => reqs
    .filter(r=>r.to===user?.id&&r.status==="pending")
    .map(r=>({ req:r, from:gUsers().find(u=>u.id===r.from)||null }))
    .filter(x=>x.from);

  const outgoingRequests = () => reqs
    .filter(r=>r.from===user?.id&&r.status==="pending")
    .map(r=>({ req:r, to:gUsers().find(u=>u.id===r.to)||null }))
    .filter(x=>x.to);

  const myConnections = () => {
    const ids=[...new Set([
      ...reqs.filter(r=>r.to===user?.id&&r.status==="accepted").map(r=>r.from),
      ...reqs.filter(r=>r.from===user?.id&&r.status==="accepted").map(r=>r.to),
    ])];
    return ids.map(id=>gUsers().find(u=>u.id===id)).filter(Boolean);
  };

  /* legacy aliases used by Profile/GroupMock */
  const sendFollowRequest = sendRequest;
  const acceptFollow      = acceptRequest;
  const rejectFollow      = rejectRequest;
  const pendingRequests   = () => reqs.filter(r=>r.to===user?.id&&r.status==="pending");
  const myFollowers       = () => reqs.filter(r=>r.to===user?.id&&r.status==="accepted").map(r=>gUsers().find(u=>u.id===r.from)).filter(Boolean);
  const myFollowing       = () => reqs.filter(r=>r.from===user?.id&&r.status==="accepted").map(r=>gUsers().find(u=>u.id===r.to)).filter(Boolean);

  /* ═══════ DMs ═══════════════════════════════════════════════ */
  function sendDM(toId,text){
    const msg={id:Date.now(),from:user.id,to:toId,text,ts:Date.now(),read:false};
    const next=[...gDMs(),msg]; LS.s(K.dms,next); setDms(next);
  }
  function getDMs(withId){
    return dms.filter(m=>(m.from===user?.id&&m.to===withId)||(m.from===withId&&m.to===user?.id)).sort((a,b)=>a.ts-b.ts);
  }
  function markDMsRead(fromId){
    const next=gDMs().map(m=>m.from===fromId&&m.to===user?.id?{...m,read:true}:m);
    LS.s(K.dms,next); setDms(next);
  }
  const unreadFrom = (uid) => dms.filter(m=>m.from===uid&&m.to===user?.id&&!m.read).length;
  const totalUnread = () => dms.filter(m=>m.to===user?.id&&!m.read).length;

  /* ═══════ GROUP CHAT ════════════════════════════════════════ */
  function sendGroupChat(text,channel="general"){
    if(!text.trim()) return;
    const msg={id:Date.now(),userId:user.id,userName:user.name,text:text.trim(),channel,ts:Date.now()};
    const next=[...gGchat(),msg]; LS.s(K.gchat,next); setGchat(next);
  }
  function getChannelMsgs(channel){
    return gchat.filter(m=>m.channel===channel).sort((a,b)=>a.ts-b.ts);
  }

  /* ═══════ RESULTS ═══════════════════════════════════════════ */
  function addResult(r){
    const s={...r,userId:user?.id,userName:user?.name,id:Date.now(),date:new Date().toLocaleDateString("en-IN")};
    const next=[s,...gResults()]; LS.s(K.results,next); setRes(next); return s;
  }
  function addMockResult(r){ return addResult({...r,isMock:true}); }
  function deleteMockResult(id){
    const next=gResults().filter(r=>r.id!==id); LS.s(K.results,next); setRes(next);
  }

  /* ═══════ CHECKLIST (per user) ══════════════════════════════ */
  const checklist = checks[user?.id] || {};
  function toggleChecklist(key){
    setChks(p=>{
      const uc=p[user.id]||{};
      const nx={...p,[user.id]:{...uc,[key]:!uc[key]}};
      LS.s(K.checks,nx); return nx;
    });
  }

  /* ═══════ GROUP MOCK ════════════════════════════════════════ */
  function createGroup(seed){
    const g={id:Date.now(),host:user.id,members:[user.id],status:"lobby",results:{},seed:seed||Date.now(),createdAt:Date.now()};
    const next=[...gGroups(),g]; LS.s(K.groups,next); setGroups(next); return g;
  }
  function sendGroupInvite(groupId,toId){
    const latest=gInvites();
    if(latest.find(i=>i.groupId===groupId&&i.to===toId)) return;
    const next=[...latest,{id:Date.now(),groupId,from:user.id,to:toId,status:"pending",ts:Date.now()}];
    LS.s(K.invites,next); setInvs(next);
  }
  function acceptGroupInvite(inviteId){
    const inv=gInvites().find(i=>i.id===inviteId); if(!inv) return;
    const ni=gInvites().map(i=>i.id===inviteId?{...i,status:"accepted"}:i);
    LS.s(K.invites,ni); setInvs(ni);
    const ng=gGroups().map(g=>g.id===inv.groupId&&!g.members.includes(user.id)?{...g,members:[...g.members,user.id]}:g);
    LS.s(K.groups,ng); setGroups(ng);
  }
  function rejectGroupInvite(inviteId){
    const next=gInvites().map(i=>i.id===inviteId?{...i,status:"rejected"}:i);
    LS.s(K.invites,next); setInvs(next);
  }
  function startGroupSession(groupId){
    const ng=gGroups().map(g=>g.id===groupId?{...g,status:"running",startedAt:Date.now()}:g);
    LS.s(K.groups,ng); setGroups(ng);
  }
  function submitGroupResult(groupId,result){
    const ng=gGroups().map(g=>{
      if(g.id!==groupId) return g;
      const nr={...g.results,[user.id]:result};
      return{...g,results:nr,status:g.members.every(id=>nr[id]!==undefined)?"done":g.status};
    });
    LS.s(K.groups,ng); setGroups(ng);
  }
  const myGroupInvites = () => invites.filter(i=>i.to===user?.id&&i.status==="pending");

  const myResults = results.filter(r=>r.userId===user?.id);
  const toggleDarkMode = () => setDark(d=>!d);

  return (
    <Ctx.Provider value={{
      /* state */
      user, users, reqs, dms, gchat, groups, invites,
      results, myResults, checklist, darkMode:dark,
      onlineIds:online,
      /* auth */
      signup, login, logout, completeSetup, updateSocialProfile,
      /* requests */
      sendRequest, acceptRequest, rejectRequest, cancelRequest,
      isConnected, isPending, isIncoming,
      incomingRequests, outgoingRequests, myConnections,
      /* legacy aliases */
      sendFollowRequest, acceptFollow, rejectFollow,
      pendingRequests, myFollowers, myFollowing,
      /* dms */
      sendDM, getDMs, markDMsRead, unreadFrom, totalUnread,
      /* group chat */
      sendGroupChat, getChannelMsgs,
      /* results */
      addResult, addMockResult, deleteMockResult,
      /* checklist */
      toggleChecklist,
      /* group mock */
      createGroup, sendGroupInvite, acceptGroupInvite, rejectGroupInvite,
      startGroupSession, submitGroupResult, myGroupInvites,
      /* misc */
      toggleDarkMode,
    }}>
      {children}
    </Ctx.Provider>
  );
}
