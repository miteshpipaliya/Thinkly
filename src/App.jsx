import { useState, useEffect, useRef } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Auth        from "./pages/Auth";
import Setup       from "./pages/Setup";
import Layout      from "./components/Layout";
import Charli      from "./components/Charli";
import WelcomePopup from "./components/WelcomePopup";
import Dashboard   from "./pages/Dashboard";
import Subjects    from "./pages/Subjects";
import UnitTests   from "./pages/UnitTests";
import MockTest    from "./pages/MockTest";
import GroupMock   from "./pages/GroupMock";
import Explore     from "./pages/Explore";
import Leaderboard from "./pages/Leaderboard";
import Discussion  from "./pages/Discussion";
import Profile     from "./pages/Profile";
import Settings    from "./pages/Settings";
import History     from "./pages/History";

function Inner() {
  const { user, darkMode } = useApp();
  const [page, setPage] = useState("dashboard");
  const [showWelcome, setShowWelcome] = useState(false);
  const prevUser = useRef(null);

  useEffect(() => {
    document.body.style.background = darkMode ? "#050508" : "#f0f2f8";
    document.body.style.color      = darkMode ? "#e2e2f0" : "#111";
  }, [darkMode]);

  // Show welcome popup ONLY once — right after first ever signup
  useEffect(() => {
    if (user && user.setupDone && !prevUser.current) {
      const key = `rkl9_firstwelcome_${user.id}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, "1");
        setShowWelcome(true);
      }
    }
    prevUser.current = user;
  }, [user]);

  if (!user)           return <Auth />;
  if (!user.setupDone) return <Setup />;

  const pages = {
    "dashboard":   <Dashboard setPage={setPage} />,
    "subjects":    <Subjects />,
    "unit-tests":  <UnitTests />,
    "mock-tests":  <MockTest />,
    "group-mock":  <GroupMock />,
    "explore":     <Explore />,
    "leaderboard": <Leaderboard />,
    "discussion":  <Discussion />,
    "profile":     <Profile setPage={setPage} />,
    "history":     <History />,
    "settings":    <Settings />,
  };

  return (
    <>
      <Layout page={page} setPage={setPage}>
        {pages[page] || <Dashboard setPage={setPage} />}
      </Layout>
      <Charli />
      {showWelcome && (
        <WelcomePopup
          username={user.name?.split(" ")[0] || user.email?.split("@")[0] || "student"}
          onClose={() => setShowWelcome(false)}
        />
      )}
    </>
  );
}

export default function App() {
  return <AppProvider><Inner /></AppProvider>;
}
