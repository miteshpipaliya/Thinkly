import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Auth        from "./pages/Auth";
import Setup       from "./pages/Setup";
import Layout      from "./components/Layout";
import Charli      from "./components/Charli";
import Dashboard   from "./pages/Dashboard";
import Subjects    from "./pages/Subjects";
import UnitTests   from "./pages/UnitTests";
import MockTest    from "./pages/MockTest";
import Checklist   from "./pages/Checklist";
import Leaderboard from "./pages/Leaderboard";
import Discussion  from "./pages/Discussion";
import Profile     from "./pages/Profile";
import Settings    from "./pages/Settings";

function Inner() {
  const { user } = useApp();
  const [page, setPage] = useState("dashboard");

  if (!user)           return <Auth />;
  if (!user.setupDone) return <Setup />;

  const pages = {
    "dashboard":   <Dashboard setPage={setPage} />,
    "subjects":    <Subjects />,
    "unit-tests":  <UnitTests />,
    "mock-tests":  <MockTest />,
    "checklist":   <Checklist />,
    "leaderboard": <Leaderboard />,
    "discussion":  <Discussion />,
    "profile":     <Profile />,
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
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}
