import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };

  const [user,      setUser]      = useState(() => load("rkl3_user",      null));
  const [users,     setUsers]     = useState(() => load("rkl3_users",     []));
  const [results,   setResults]   = useState(() => load("rkl3_results",   []));
  const [checklist, setChecklist] = useState(() => load("rkl3_checklist", {}));
  const [darkMode,  setDarkMode]  = useState(() => load("rkl3_dark",      true));
  // Social: follow requests & accepted follows
  const [follows,   setFollows]   = useState(() => load("rkl3_follows",   [])); // [{from, to, status:'pending'|'accepted'}]
  // DMs
  const [dms,       setDms]       = useState(() => load("rkl3_dms",       [])); // [{id, from, to, text, ts}]
  // Group mock sessions
  const [groups,    setGroups]    = useState(() => load("rkl3_groups",    []));

  useEffect(() => { localStorage.setItem("rkl3_user",      JSON.stringify(user));      }, [user]);
  useEffect(() => { localStorage.setItem("rkl3_users",     JSON.stringify(users));     }, [users]);
  useEffect(() => { localStorage.setItem("rkl3_results",   JSON.stringify(results));   }, [results]);
  useEffect(() => { localStorage.setItem("rkl3_checklist", JSON.stringify(checklist)); }, [checklist]);
  useEffect(() => { localStorage.setItem("rkl3_dark",      JSON.stringify(darkMode));  }, [darkMode]);
  useEffect(() => { localStorage.setItem("rkl3_follows",   JSON.stringify(follows));   }, [follows]);
  useEffect(() => { localStorage.setItem("rkl3_dms",       JSON.stringify(dms));       }, [dms]);
  useEffect(() => { localStorage.setItem("rkl3_groups",    JSON.stringify(groups));    }, [groups]);

  function signup(email, password, name) {
    if (users.find(u => u.email === email)) return { error: "Email already registered." };
    const newUser = { id: Date.now(), email, password, name, setupDone: false, profile: {}, socialProfile: {} };
    setUsers(p => [...p, newUser]);
    setUser(newUser);
    return { ok: true };
  }

  function login(email, password) {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { error: "Invalid email or password." };
    setUser(found);
    return { ok: true };
  }

  function logout() { setUser(null); }

  function completeSetup(profile) {
    const updated = { ...user, setupDone: true, profile };
    setUser(updated);
    setUsers(p => p.map(u => u.id === user.id ? updated : u));
  }

  function updateSocialProfile(sp) {
    const updated = { ...user, socialProfile: { ...user.socialProfile, ...sp } };
    setUser(updated);
    setUsers(p => p.map(u => u.id === user.id ? updated : u));
  }

  function addResult(r) {
    const saved = { ...r, userId: user?.id, userName: user?.name, id: Date.now(), date: new Date().toLocaleDateString("en-IN") };
    setResults(p => [saved, ...p]);
    return saved;
  }

  function addMockResult(r) {
    const saved = { ...r, userId: user?.id, userName: user?.name, id: Date.now(), isMock: true };
    setResults(p => [saved, ...p]);
    return saved;
  }

  function deleteMockResult(id) { setResults(p => p.filter(r => r.id !== id)); }
  function toggleChecklist(key) { setChecklist(p => ({ ...p, [key]: !p[key] })); }
  function toggleDarkMode()     { setDarkMode(d => !d); }

  // ── Social ──────────────────────────────────────────────────────────────────
  function sendFollowRequest(toId) {
    if (follows.find(f => f.from === user.id && f.to === toId)) return;
    setFollows(p => [...p, { id: Date.now(), from: user.id, to: toId, status: "pending" }]);
  }

  function acceptFollow(followId) {
    setFollows(p => p.map(f => f.id === followId ? { ...f, status: "accepted" } : f));
  }

  function rejectFollow(followId) {
    setFollows(p => p.filter(f => f.id !== followId));
  }

  function unfollowUser(toId) {
    setFollows(p => p.filter(f => !(f.from === user.id && f.to === toId)));
  }

  function isFollowing(toId) {
    return follows.some(f => f.from === user.id && f.to === toId && f.status === "accepted");
  }

  function isPending(toId) {
    return follows.some(f => f.from === user.id && f.to === toId && f.status === "pending");
  }

  function myFollowers() {
    return follows.filter(f => f.to === user?.id && f.status === "accepted").map(f => users.find(u => u.id === f.from)).filter(Boolean);
  }

  function myFollowing() {
    return follows.filter(f => f.from === user?.id && f.status === "accepted").map(f => users.find(u => u.id === f.to)).filter(Boolean);
  }

  function pendingRequests() {
    return follows.filter(f => f.to === user?.id && f.status === "pending");
  }

  // ── DMs ─────────────────────────────────────────────────────────────────────
  function sendDM(toId, text) {
    const msg = { id: Date.now(), from: user.id, to: toId, text, ts: Date.now() };
    setDms(p => [...p, msg]);
  }

  function getDMs(withId) {
    return dms.filter(m => (m.from === user?.id && m.to === withId) || (m.from === withId && m.to === user?.id))
              .sort((a, b) => a.ts - b.ts);
  }

  // ── Group Mock ───────────────────────────────────────────────────────────────
  function createGroup(members) {
    const g = { id: Date.now(), host: user.id, members, status: "waiting", results: {}, createdAt: Date.now() };
    setGroups(p => [...p, g]);
    return g;
  }

  function joinGroup(groupId) {
    setGroups(p => p.map(g => g.id === groupId && !g.members.includes(user.id) ? { ...g, members: [...g.members, user.id] } : g));
  }

  function submitGroupResult(groupId, result) {
    setGroups(p => p.map(g => g.id === groupId ? { ...g, results: { ...g.results, [user.id]: result }, status: Object.keys({ ...g.results, [user.id]: result }).length >= g.members.length ? "done" : g.status } : g));
  }

  const myResults = results.filter(r => r.userId === user?.id);

  return (
    <AppContext.Provider value={{
      user, users, results, myResults, checklist, darkMode,
      follows, dms, groups,
      signup, login, logout, completeSetup, updateSocialProfile,
      addResult, addMockResult, deleteMockResult,
      toggleChecklist, toggleDarkMode,
      sendFollowRequest, acceptFollow, rejectFollow, unfollowUser,
      isFollowing, isPending, myFollowers, myFollowing, pendingRequests,
      sendDM, getDMs,
      createGroup, joinGroup, submitGroupResult,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
