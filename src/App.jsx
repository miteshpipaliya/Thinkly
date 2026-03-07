import { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Auth        from "./pages/Auth";
import Setup       from "./pages/Setup";
import Layout      from "./components/Layout";
import Charli      from "./components/Charli";
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

function Inner() {
  const { user, darkMode } = useApp();
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    document.body.style.background = darkMode ? "#050508" : "#f0f2f8";
    document.body.style.color      = darkMode ? "#e2e2f0" : "#111";
  }, [darkMode]);

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
    "settings":    <Settings />,
  };

  return (
    <>
      <Layout page={page} setPage={setPage}>
        {pages[page] || <Dashboard setPage={setPage} />}
      </Layout>
      <Charli />
    </>
  );
}

export default function App() {
  return <AppProvider><Inner /></AppProvider>;
}
