/**
 * AppContext.jsx — Ranklify (Firebase edition + Group Ready System)
 * ─────────────────────────────────────────────────────────────────
 * New additions (all backward compatible):
 *   groups.ready       — {[userId]: true} — who clicked Ready
 *   groups.quit        — {[userId]: true} — who quit mid-exam
 *   setReady(groupId)  — mark self as ready
 *   quitGroup(groupId) — mark self as quit + remove from group
 *   unitResults stored under "unit_results" collection
 *   addUnitResult(r)   — store chapter test result
 * ─────────────────────────────────────────────────────────────────
 */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import {
  collection, doc, getDocs, setDoc, updateDoc,
  deleteDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const LS = {
  g: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  s: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

const col    = (name) => collection(db, name);
const toDocs = (snap) => snap.docs.map(d => ({ id: d.id, ...d.data() }));
const tsMs   = (v)    => v instanceof Timestamp ? v.toMillis() : (typeof v === "number" ? v : 0);

export function AppProvider({ children }) {
  const [user,        setUserS]    = useState(() => LS.g("rkl_session", null));
  const [users,       setUsers]    = useState([]);
  const [reqs,        setReqs]     = useState([]);
  const [dms,         setDms]      = useState([]);
  const [gchat,       setGchat]    = useState([]);
  const [groups,      setGroups]   = useState([]);
  const [invites,     setInvs]     = useState([]);
  const [results,     setRes]      = useState([]);
  const [unitResults, setUnitRes]  = useState([]);
  const [online,      setOnline]   = useState([]);
  const [dark,        setDark]     = useState(() => LS.g("rkl_dark", true));
  const [checks,      setChks]     = useState(() => LS.g("rkl_checks", {}));

  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  useEffect(() => { LS.s("rkl_session", user); }, [user]);
  useEffect(() => { LS.s("rkl_dark",    dark); }, [dark]);
  useEffect(() => { LS.s("rkl_checks",  checks); }, [checks]);

  const syncSession = useCallback((freshUser) => {
    setUserS(freshUser);
    LS.s("rkl_session", freshUser);
  }, []);

  /* ═══════ REAL-TIME LISTENERS ═══════════════════════════════ */
  useEffect(() => {
    const u1 = onSnapshot(col("users"), snap => {
      const all = toDocs(snap);
      setUsers(all);
      const cur = userRef.current;
      if (cur?.id) {
        const fresh = all.find(u => u.id === cur.id);
        if (fresh && JSON.stringify(fresh) !== JSON.stringify(cur)) syncSession(fresh);
      }
    });
    const u2 = onSnapshot(col("requests"),    snap => setReqs(toDocs(snap)));
    const u3 = onSnapshot(query(col("gchat"), orderBy("ts","asc")), snap => setGchat(toDocs(snap)));
    const u4 = onSnapshot(col("groups"),      snap => setGroups(toDocs(snap)));
    const u5 = onSnapshot(col("invites"),     snap => setInvs(toDocs(snap)));
    const u6 = onSnapshot(col("results"),     snap => setRes(toDocs(snap)));
    const u7 = onSnapshot(col("unit_results"),snap => setUnitRes(toDocs(snap)));
    const u8 = onSnapshot(col("online"),      snap => {
      const now = Date.now();
      setOnline(toDocs(snap).filter(h => now - tsMs(h.ts) < 45000).map(h => h.id));
    });
    return () => { u1(); u2(); u3(); u4(); u5(); u6(); u7(); u8(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const unsub = onSnapshot(query(col("dms"), orderBy("ts","asc")), snap => setDms(toDocs(snap)));
    return () => unsub();
  }, [user?.id]);

  /* heartbeat */
  useEffect(() => {
    if (!user?.id) return;
    const beat = () => setDoc(doc(db,"online",String(user.id)),{id:user.id,ts:serverTimestamp()});
    beat();
    const t = setInterval(beat, 20000);
    return () => { clearInterval(t); deleteDoc(doc(db,"online",String(user.id))).catch(()=>{}); };
  }, [user?.id]);

  /* ═══════ AUTH ══════════════════════════════════════════════ */
  async function signup(email, password, name) {
    const snap = await getDocs(col("users"));
    if (toDocs(snap).find(u => u.email === email)) return { error: "Email already registered." };
    const id = String(Date.now());
    const nu = { id, email, password, name, setupDone:false, profile:{}, socialProfile:{}, createdAt:Date.now() };
    await setDoc(doc(db,"users",id), nu);
    syncSession(nu);
    return { ok: true };
  }

  async function login(email, password) {
    const snap  = await getDocs(col("users"));
    const found = toDocs(snap).find(u => u.email===email && u.password===password);
    if (!found) return { error: "Invalid email or password." };
    syncSession(found);
    return { ok: true };
  }

  function logout() {
    if (user?.id) deleteDoc(doc(db,"online",String(user.id))).catch(()=>{});
    LS.s("rkl_session",null); setUserS(null);
  }

  async function _upsert(u2) {
    await setDoc(doc(db,"users",String(u2.id)), u2, {merge:true});
    syncSession(u2);
  }

  async function completeSetup(profile) {
    const { username, ddcetRank, city, ...rest } = profile;
    const updatedSP = {
      ...user.socialProfile,
      ...(username  ? {username}  : {}),
      ...(ddcetRank ? {ddcetRank} : {}),
      ...(city      ? {city}      : {}),
    };
    await _upsert({ ...user, setupDone:true, profile:{...user.profile,...rest,...(city?{city}:{})}, socialProfile:updatedSP });
  }

  async function updateSocialProfile(sp) {
    await _upsert({...user, socialProfile:{...user.socialProfile,...sp}});
  }

  /* ═══════ REQUESTS ══════════════════════════════════════════ */
  async function sendRequest(toId) {
    if (reqs.find(r => r.from===user.id && r.to===toId)) return;
    const id = String(Date.now());
    await setDoc(doc(db,"requests",id), {id,from:user.id,to:toId,status:"pending",ts:Date.now()});
  }
  async function acceptRequest(reqId) { await updateDoc(doc(db,"requests",String(reqId)),{status:"accepted"}); }
  async function rejectRequest(reqId) { await deleteDoc(doc(db,"requests",String(reqId))); }
  async function cancelRequest(toId) {
    const r = reqs.find(r=>r.from===user.id&&r.to===toId&&r.status==="pending");
    if (r) await deleteDoc(doc(db,"requests",String(r.id)));
  }

  const isConnected = (uid) => reqs.some(r=>((r.from===user?.id&&r.to===uid)||(r.from===uid&&r.to===user?.id))&&r.status==="accepted");
  const isPending   = (uid) => reqs.some(r=>r.from===user?.id&&r.to===uid&&r.status==="pending");
  const isIncoming  = (uid) => reqs.some(r=>r.from===uid&&r.to===user?.id&&r.status==="pending");

  const incomingRequests = () => reqs.filter(r=>r.to===user?.id&&r.status==="pending").map(r=>({req:r,from:users.find(u=>u.id===r.from)||null})).filter(x=>x.from);
  const outgoingRequests = () => reqs.filter(r=>r.from===user?.id&&r.status==="pending").map(r=>({req:r,to:users.find(u=>u.id===r.to)||null})).filter(x=>x.to);
  const myConnections    = () => {
    const ids=[...new Set([
      ...reqs.filter(r=>r.to===user?.id&&r.status==="accepted").map(r=>r.from),
      ...reqs.filter(r=>r.from===user?.id&&r.status==="accepted").map(r=>r.to),
    ])];
    return ids.map(id=>users.find(u=>u.id===id)).filter(Boolean);
  };

  const sendFollowRequest = sendRequest;
  const acceptFollow      = acceptRequest;
  const rejectFollow      = rejectRequest;
  const pendingRequests   = () => reqs.filter(r=>r.to===user?.id&&r.status==="pending");
  const myFollowers       = () => reqs.filter(r=>r.to===user?.id&&r.status==="accepted").map(r=>users.find(u=>u.id===r.from)).filter(Boolean);
  const myFollowing       = () => reqs.filter(r=>r.from===user?.id&&r.status==="accepted").map(r=>users.find(u=>u.id===r.to)).filter(Boolean);

  /* ═══════ DMs ═══════════════════════════════════════════════ */
  async function sendDM(toId,text) {
    const id=String(Date.now());
    await setDoc(doc(db,"dms",id),{id,from:user.id,to:toId,text,ts:Date.now(),read:false});
  }
  function getDMs(withId) {
    return dms.filter(m=>(m.from===user?.id&&m.to===withId)||(m.from===withId&&m.to===user?.id)).sort((a,b)=>tsMs(a.ts)-tsMs(b.ts));
  }
  async function markDMsRead(fromId) {
    const toMark=dms.filter(m=>m.from===fromId&&m.to===user?.id&&!m.read);
    await Promise.all(toMark.map(m=>updateDoc(doc(db,"dms",String(m.id)),{read:true})));
  }
  const unreadFrom  = (uid) => dms.filter(m=>m.from===uid&&m.to===user?.id&&!m.read).length;
  const totalUnread = ()    => dms.filter(m=>m.to===user?.id&&!m.read).length;

  /* ═══════ GROUP CHAT ════════════════════════════════════════ */
  async function sendGroupChat(text,channel="general") {
    if(!text.trim()) return;
    const id=String(Date.now());
    await setDoc(doc(db,"gchat",id),{id,userId:user.id,userName:user.name,text:text.trim(),channel,ts:Date.now()});
  }
  function getChannelMsgs(channel) {
    return gchat.filter(m=>m.channel===channel).sort((a,b)=>tsMs(a.ts)-tsMs(b.ts));
  }

  /* ═══════ RESULTS ═══════════════════════════════════════════ */
  async function addResult(r) {
    const id=String(Date.now());
    /* compute mock test sequence number for this user */
    const userMocks=results.filter(x=>x.userId===user?.id&&x.isMock===true);
    const mockNum=userMocks.length+1;
    const s={...r,id,userId:user?.id,userName:user?.name,mockNum,date:new Date().toLocaleDateString("en-IN"),createdAt:Date.now()};
    await setDoc(doc(db,"results",id),s);
    return s;
  }
  async function addMockResult(r) { return addResult({...r,isMock:true}); }
  async function deleteMockResult(id) { await deleteDoc(doc(db,"results",String(id))); }

  /* ── unit test results ── */
  async function addUnitResult(r) {
    const id=String(Date.now());
    const s={...r,id,userId:user?.id,userName:user?.name,date:new Date().toLocaleDateString("en-IN"),createdAt:Date.now()};
    await setDoc(doc(db,"unit_results",id),s);
    return s;
  }

  /* ═══════ CHECKLIST ═════════════════════════════════════════ */
  const checklist = checks[user?.id] || {};
  function toggleChecklist(key) {
    setChks(p=>{ const uc=p[user.id]||{}; const nx={...p,[user.id]:{...uc,[key]:!uc[key]}}; LS.s("rkl_checks",nx); return nx; });
  }

  /* ═══════ GROUP MOCK ════════════════════════════════════════ */
  async function createGroup(seed) {
    const id=String(Date.now());
    const g={id,host:user.id,members:[user.id],status:"lobby",results:{},ready:{},quit:{},seed:seed||Date.now(),createdAt:Date.now()};
    await setDoc(doc(db,"groups",id),g);
    return g;
  }
  async function sendGroupInvite(groupId,toId) {
    if(invites.find(i=>i.groupId===groupId&&i.to===toId)) return;
    const id=String(Date.now());
    await setDoc(doc(db,"invites",id),{id,groupId,from:user.id,to:toId,status:"pending",ts:Date.now()});
  }
  async function acceptGroupInvite(inviteId) {
    const inv=invites.find(i=>i.id===inviteId); if(!inv) return;
    await updateDoc(doc(db,"invites",String(inviteId)),{status:"accepted"});
    const grp=groups.find(g=>g.id===inv.groupId);
    if(grp&&!grp.members.includes(user.id)) {
      await updateDoc(doc(db,"groups",String(inv.groupId)),{members:[...grp.members,user.id]});
    }
  }
  async function rejectGroupInvite(inviteId) {
    await updateDoc(doc(db,"invites",String(inviteId)),{status:"rejected"});
  }

  /* NEW: mark self as ready */
  async function setReady(groupId) {
    const grp=groups.find(g=>g.id===groupId); if(!grp) return;
    const newReady={...grp.ready,[user.id]:true};
    await updateDoc(doc(db,"groups",String(groupId)),{ready:newReady});
  }

  async function startGroupSession(groupId) {
    await updateDoc(doc(db,"groups",String(groupId)),{status:"running",startedAt:Date.now()});
  }

  async function submitGroupResult(groupId,result) {
    const grp=groups.find(g=>g.id===groupId); if(!grp) return;
    const newResults={...grp.results,[user.id]:result};
    /* done = all non-quit members submitted */
    const activeMembers=grp.members.filter(id=>!grp.quit?.[id]);
    const allDone=activeMembers.every(id=>newResults[id]!==undefined);
    await updateDoc(doc(db,"groups",String(groupId)),{results:newResults,status:allDone?"done":grp.status});
  }

  /* NEW: quit mid-exam — marks quit, removes from active set */
  async function quitGroup(groupId) {
    const grp=groups.find(g=>g.id===groupId); if(!grp) return;
    const newQuit={...grp.quit,[user.id]:true};
    /* check if remaining non-quit members all submitted — if so, mark done */
    const activeMembers=grp.members.filter(id=>!newQuit[id]);
    const allDone=activeMembers.length>0&&activeMembers.every(id=>grp.results?.[id]!==undefined);
    await updateDoc(doc(db,"groups",String(groupId)),{quit:newQuit,status:allDone?"done":grp.status});
  }

  const myGroupInvites = () => invites.filter(i=>i.to===user?.id&&i.status==="pending");
  const myResults      = results.filter(r=>r.userId===user?.id);
  const myUnitResults  = unitResults.filter(r=>r.userId===user?.id);
  const toggleDarkMode = () => setDark(d=>!d);

  return (
    <Ctx.Provider value={{
      user, users, reqs, dms, gchat, groups, invites,
      results, myResults, unitResults, myUnitResults,
      checklist, darkMode:dark, onlineIds:online,
      signup, login, logout, completeSetup, updateSocialProfile,
      sendRequest, acceptRequest, rejectRequest, cancelRequest,
      isConnected, isPending, isIncoming,
      incomingRequests, outgoingRequests, myConnections,
      sendFollowRequest, acceptFollow, rejectFollow,
      pendingRequests, myFollowers, myFollowing,
      sendDM, getDMs, markDMsRead, unreadFrom, totalUnread,
      sendGroupChat, getChannelMsgs,
      addResult, addMockResult, deleteMockResult, addUnitResult,
      toggleChecklist,
      createGroup, sendGroupInvite, acceptGroupInvite, rejectGroupInvite,
      setReady, startGroupSession, submitGroupResult, quitGroup, myGroupInvites,
      toggleDarkMode,
    }}>
      {children}
    </Ctx.Provider>
  );
}
