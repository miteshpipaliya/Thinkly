import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

/* ── tiny helpers ──────────────────────────────────────────────────── */
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

export function AppProvider({ children }) {
  const [user,     setUser]     = useState(() => LS.get("rkl4_user",    null));
  const [users,    setUsers]    = useState(() => LS.get("rkl4_users",   []));
  const [results,  setResults]  = useState(() => LS.get("rkl4_results", []));
  const [checklist,setChecklist]= useState(() => LS.get("rkl4_checks",  {}));
  const [darkMode, setDarkMode] = useState(() => LS.get("rkl4_dark",    true));
  const [follows,  setFollows]  = useState(() => LS.get("rkl4_follows", []));
  const [dms,      setDms]      = useState(() => LS.get("rkl4_dms",     []));
  const [groups,   setGroups]   = useState(() => LS.get("rkl4_groups",  []));
  const [invites,  setInvites]  = useState(() => LS.get("rkl4_invites", []));

  /* persist */
  useEffect(() => { LS.set("rkl4_user",    user);     }, [user]);
  useEffect(() => { LS.set("rkl4_users",   users);    }, [users]);
  useEffect(() => { LS.set("rkl4_results", results);  }, [results]);
  useEffect(() => { LS.set("rkl4_checks",  checklist);}, [checklist]);
  useEffect(() => { LS.set("rkl4_dark",    darkMode); }, [darkMode]);
  useEffect(() => { LS.set("rkl4_follows", follows);  }, [follows]);
  useEffect(() => { LS.set("rkl4_dms",     dms);      }, [dms]);
  useEffect(() => { LS.set("rkl4_groups",  groups);   }, [groups]);
  useEffect(() => { LS.set("rkl4_invites", invites);  }, [invites]);

  /* poll every 1.5 s so two tabs / users on same browser stay in sync */
  useEffect(() => {
    const t = setInterval(() => {
      setGroups(LS.get("rkl4_groups",  []));
      setInvites(LS.get("rkl4_invites", []));
      setFollows(LS.get("rkl4_follows", []));
      setDms(LS.get("rkl4_dms",     []));
      setUsers(LS.get("rkl4_users",  []));
    }, 1500);
    return () => clearInterval(t);
  }, []);

  /* ── AUTH ──────────────────────────────────────────────────────── */
  function signup(email, password, name) {
    const all = LS.get("rkl4_users", []);
    if (all.find(u => u.email === email)) return { error: "Email already registered." };
    const nu = { id: Date.now(), email, password, name, setupDone: false, profile: {}, socialProfile: {} };
    const next = [...all, nu];
    LS.set("rkl4_users", next); setUsers(next); setUser(nu);
    return { ok: true };
  }

  function login(email, password) {
    const all = LS.get("rkl4_users", []);
    const found = all.find(u => u.email === email && u.password === password);
    if (!found) return { error: "Invalid email or password." };
    setUsers(all); setUser(found);
    return { ok: true };
  }

  function logout() { setUser(null); }

  function completeSetup(profile) {
    const u2 = { ...user, setupDone: true, profile };
    setUser(u2);
    const next = users.map(u => u.id === user.id ? u2 : u);
    setUsers(next); LS.set("rkl4_users", next);
  }

  function updateSocialProfile(sp) {
    const u2 = { ...user, socialProfile: { ...user.socialProfile, ...sp } };
    setUser(u2);
    const next = users.map(u => u.id === user.id ? u2 : u);
    setUsers(next); LS.set("rkl4_users", next);
  }

  /* ── RESULTS ───────────────────────────────────────────────────── */
  function addResult(r) {
    const s = { ...r, userId: user?.id, userName: user?.name, id: Date.now(), date: new Date().toLocaleDateString("en-IN") };
    setResults(p => [s, ...p]); return s;
  }
  function addMockResult(r) {
    const s = { ...r, userId: user?.id, userName: user?.name, id: Date.now(), isMock: true };
    setResults(p => [s, ...p]); return s;
  }
  function deleteMockResult(id) { setResults(p => p.filter(r => r.id !== id)); }
  function toggleChecklist(key) { setChecklist(p => ({ ...p, [key]: !p[key] })); }
  function toggleDarkMode()     { setDarkMode(d => !d); }

  /* ── FOLLOW SYSTEM ─────────────────────────────────────────────── */
  function sendFollowRequest(toId) {
    const latest = LS.get("rkl4_follows", []);
    if (latest.find(f => f.from === user.id && f.to === toId)) return;
    const next = [...latest, { id: Date.now(), from: user.id, to: toId, status: "pending" }];
    LS.set("rkl4_follows", next); setFollows(next);
  }

  function acceptFollow(followId) {
    const next = follows.map(f => f.id === followId ? { ...f, status: "accepted" } : f);
    LS.set("rkl4_follows", next); setFollows(next);
  }

  function rejectFollow(followId) {
    const next = follows.filter(f => f.id !== followId);
    LS.set("rkl4_follows", next); setFollows(next);
  }

  function isFollowing(toId)  { return follows.some(f => f.from === user?.id && f.to === toId && f.status === "accepted"); }
  function isPending(toId)    { return follows.some(f => f.from === user?.id && f.to === toId && f.status === "pending"); }

  /* people who follow ME (accepted) */
  function myFollowers() {
    return follows
      .filter(f => f.to === user?.id && f.status === "accepted")
      .map(f => users.find(u => u.id === f.from))
      .filter(Boolean);
  }
  /* people I follow (accepted) */
  function myFollowing() {
    return follows
      .filter(f => f.from === user?.id && f.status === "accepted")
      .map(f => users.find(u => u.id === f.to))
      .filter(Boolean);
  }
  /* incoming pending follow requests to me */
  function pendingRequests() {
    return follows.filter(f => f.to === user?.id && f.status === "pending");
  }
  /* all mutual / one-way accepted connections I can invite */
  function myConnections() {
    const flwrs = myFollowers().map(u => u.id);
    const flwng = myFollowing().map(u => u.id);
    const ids   = [...new Set([...flwrs, ...flwng])];
    return ids.map(id => users.find(u => u.id === id)).filter(Boolean);
  }

  /* ── DMs ───────────────────────────────────────────────────────── */
  function sendDM(toId, text) {
    const msg  = { id: Date.now(), from: user.id, to: toId, text, ts: Date.now() };
    const next = [...dms, msg];
    LS.set("rkl4_dms", next); setDms(next);
  }
  function getDMs(withId) {
    return dms
      .filter(m => (m.from === user?.id && m.to === withId) || (m.from === withId && m.to === user?.id))
      .sort((a, b) => a.ts - b.ts);
  }

  /* ── GROUP MOCK ─────────────────────────────────────────────────── */
  /* create session – host only, seed = session id */
  function createGroup() {
    const seed = Date.now();
    const g = { id: seed, host: user.id, members: [user.id], status: "lobby", results: {}, seed, createdAt: seed };
    const next = [...LS.get("rkl4_groups", []), g];
    LS.set("rkl4_groups", next); setGroups(next);
    return g;
  }

  /* host invites a connection */
  function sendGroupInvite(groupId, toId) {
    const latest = LS.get("rkl4_invites", []);
    if (latest.find(i => i.groupId === groupId && i.to === toId)) return;
    const next = [...latest, { id: Date.now(), groupId, from: user.id, to: toId, status: "pending", ts: Date.now() }];
    LS.set("rkl4_invites", next); setInvites(next);
  }

  /* invited person accepts → joins group */
  function acceptGroupInvite(inviteId) {
    const inv = invites.find(i => i.id === inviteId);
    if (!inv) return;
    const ni = invites.map(i => i.id === inviteId ? { ...i, status: "accepted" } : i);
    LS.set("rkl4_invites", ni); setInvites(ni);
    const ng = LS.get("rkl4_groups", []).map(g =>
      g.id === inv.groupId && !g.members.includes(user.id)
        ? { ...g, members: [...g.members, user.id] }
        : g
    );
    LS.set("rkl4_groups", ng); setGroups(ng);
  }

  function rejectGroupInvite(inviteId) {
    const next = invites.map(i => i.id === inviteId ? { ...i, status: "rejected" } : i);
    LS.set("rkl4_invites", next); setInvites(next);
  }

  /* host starts the test – everyone locked in */
  function startGroupSession(groupId) {
    const ng = LS.get("rkl4_groups", []).map(g =>
      g.id === groupId ? { ...g, status: "running", startedAt: Date.now() } : g
    );
    LS.set("rkl4_groups", ng); setGroups(ng);
  }

  /* each member submits their result */
  function submitGroupResult(groupId, result) {
    const ng = LS.get("rkl4_groups", []).map(g => {
      if (g.id !== groupId) return g;
      const newResults = { ...g.results, [user.id]: result };
      const allDone    = g.members.every(id => newResults[id] !== undefined);
      return { ...g, results: newResults, status: allDone ? "done" : g.status };
    });
    LS.set("rkl4_groups", ng); setGroups(ng);
  }

  /* invites waiting for me */
  function myGroupInvites() {
    return invites.filter(i => i.to === user?.id && i.status === "pending");
  }

  const myResults = results.filter(r => r.userId === user?.id);

  return (
    <AppContext.Provider value={{
      user, users, results, myResults, checklist, darkMode,
      follows, dms, groups, invites,
      signup, login, logout, completeSetup, updateSocialProfile,
      addResult, addMockResult, deleteMockResult,
      toggleChecklist, toggleDarkMode,
      sendFollowRequest, acceptFollow, rejectFollow,
      isFollowing, isPending, myFollowers, myFollowing, pendingRequests, myConnections,
      sendDM, getDMs,
      createGroup, sendGroupInvite, acceptGroupInvite, rejectGroupInvite,
      startGroupSession, submitGroupResult, myGroupInvites,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
