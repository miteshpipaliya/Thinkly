import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser]         = useState(() => { try { return JSON.parse(localStorage.getItem("rkl_user2") || "null"); } catch{ return null; }});
  const [users, setUsers]       = useState(() => { try { return JSON.parse(localStorage.getItem("rkl_users2") || "[]"); } catch{ return []; }});
  const [results, setResults]   = useState(() => { try { return JSON.parse(localStorage.getItem("rkl_results2") || "[]"); } catch{ return []; }});
  const [checklist, setChecklist] = useState(() => { try { return JSON.parse(localStorage.getItem("rkl_checklist2") || "{}"); } catch{ return {}; }});
  const [darkMode, setDarkMode] = useState(() => { try { return JSON.parse(localStorage.getItem("rkl_dark") !== null ? localStorage.getItem("rkl_dark") : "true"); } catch{ return true; }});

  useEffect(() => { localStorage.setItem("rkl_user2",      JSON.stringify(user));      }, [user]);
  useEffect(() => { localStorage.setItem("rkl_users2",     JSON.stringify(users));     }, [users]);
  useEffect(() => { localStorage.setItem("rkl_results2",   JSON.stringify(results));   }, [results]);
  useEffect(() => { localStorage.setItem("rkl_checklist2", JSON.stringify(checklist)); }, [checklist]);
  useEffect(() => { localStorage.setItem("rkl_dark",       JSON.stringify(darkMode));  }, [darkMode]);

  function signup(email, password, name) {
    if (users.find(u => u.email === email)) return { error: "Email already registered." };
    const newUser = { id: Date.now(), email, password, name, setupDone: false, profile: {} };
    const updated = [...users, newUser];
    setUsers(updated);
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
    setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
  }

  function addResult(result) {
    const r = { ...result, userId: user?.id, userName: user?.name, id: Date.now(), date: new Date().toLocaleDateString("en-IN") };
    setResults(prev => [r, ...prev]);
    return r;
  }

  function addMockResult(result) {
    const r = { ...result, userId: user?.id, userName: user?.name, id: Date.now(), isMock: true };
    setResults(prev => [r, ...prev]);
    return r;
  }

  function deleteMockResult(id) {
    setResults(prev => prev.filter(r => r.id !== id));
  }

  function toggleChecklist(key) {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleDarkMode() { setDarkMode(d => !d); }

  const myResults = results.filter(r => r.userId === user?.id);

  return (
    <AppContext.Provider value={{
      user, users, results, myResults, checklist, darkMode,
      signup, login, logout, completeSetup,
      addResult, addMockResult, deleteMockResult,
      toggleChecklist, toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
