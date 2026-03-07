import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser]         = useState(() => JSON.parse(localStorage.getItem("ranklify_user") || "null"));
  const [users, setUsers]       = useState(() => JSON.parse(localStorage.getItem("ranklify_users") || "[]"));
  const [results, setResults]   = useState(() => JSON.parse(localStorage.getItem("ranklify_results") || "[]"));
  const [checklist, setChecklist] = useState(() => JSON.parse(localStorage.getItem("ranklify_checklist") || "{}"));

  // Persist
  useEffect(() => { localStorage.setItem("ranklify_user",      JSON.stringify(user));      }, [user]);
  useEffect(() => { localStorage.setItem("ranklify_users",     JSON.stringify(users));     }, [users]);
  useEffect(() => { localStorage.setItem("ranklify_results",   JSON.stringify(results));   }, [results]);
  useEffect(() => { localStorage.setItem("ranklify_checklist", JSON.stringify(checklist)); }, [checklist]);

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
    const r = { ...result, userId: user?.id, userName: user?.name, id: Date.now() };
    setResults(prev => [r, ...prev]);
    return r;
  }

  function toggleChecklist(key) {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const myResults = results.filter(r => r.userId === user?.id);

  return (
    <AppContext.Provider value={{ user, users, results, myResults, checklist, signup, login, logout, completeSetup, addResult, toggleChecklist }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
