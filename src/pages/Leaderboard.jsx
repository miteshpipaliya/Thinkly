/**
 * Leaderboard.jsx — Ranklify
 * ─────────────────────────────────────────────────────────────────
 * REAL DATA ONLY — no fake/placeholder entries.
 * Rankings are built from real users who have completed mock tests.
 * Ranking formula: 50% best score + 30% avg score + 20% accuracy.
 * Supports All Time / This Month / This Week filters.
 */
import { useState } from "react";
import { useApp } from "../context/AppContext";

/* ── ranking helpers ────────────────────────────────────────────── */
function getScoreStats(results, period) {
  let filtered = results;
  if (period !== "all") {
    const days = period === "weekly" ? 7 : 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    filtered = results.filter(r => new Date(r.date || 0).getTime() > cutoff || (r.id && r.id > cutoff));
  }
  if (!filtered.length) return null;
  const scores   = filtered.map(r => r.score || 0);
  const best     = Math.max(...scores);
  const avg      = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const totalAcc = filtered.reduce((a, r) => a + (r.accuracy || 0), 0);
  const accuracy = Math.round(totalAcc / filtered.length);
  // composite ranking score
  const composite = Math.round(best * 0.5 + avg * 0.3 + accuracy * 0.2);
  return { best, avg, accuracy, tests: filtered.length, composite };
}

const PERIOD_LABELS = [
  { key: "all",     label: "All Time" },
  { key: "monthly", label: "This Month" },
  { key: "weekly",  label: "This Week" },
];

const BRANCH_COLORS = {
  Mechanical: "#F97316", Civil: "#84CC16", Electrical: "#EAB308",
  Computer: "#3B82F6", Chemical: "#A855F7", IT: "#06B6D4",
  Electronics: "#EC4899", Textile: "#14B8A6", Automobile: "#F59E0B",
  Production: "#6366F1", Instrumentation: "#22D3EE",
};

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function Leaderboard() {
  const { user, users, results, darkMode } = useApp();
  const [period, setPeriod] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const T      = darkMode;
  const txt    = T ? "#e2e2f0" : "#111";
  const sub    = T ? "#555"    : "#888";
  const cardBg = T ? "rgba(255,255,255,0.025)" : "#fff";
  const cardBr = T ? "rgba(255,255,255,0.07)"  : "#e5e7eb";

  /* ── build leaderboard from real users + real results ── */
  const entries = users
    .filter(u => u.setupDone)
    .map(u => {
      const userResults = results.filter(r => r.userId === u.id && r.isMock);
      const stats = getScoreStats(userResults, period);
      if (!stats) return null; // exclude users with no mock tests
      return {
        id:       u.id,
        name:     u.name,
        branch:   u.profile?.branch || "—",
        city:     u.socialProfile?.city || u.profile?.city || "Gujarat",
        username: u.socialProfile?.username || u.name.split(" ")[0].toLowerCase(),
        goal:     u.profile?.goal || "—",
        ...stats,
        isMe: u.id === user?.id,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.composite - a.composite || b.best - a.best || b.accuracy - a.accuracy)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const myEntry = entries.find(e => e.isMe);

  /* ── empty state ── */
  if (entries.length === 0) {
    return (
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: txt, marginBottom: 4 }}>🏆 Leaderboard</div>
        <div style={{ color: sub, fontSize: 13, marginBottom: 24 }}>Rankings based on real mock test performance.</div>
        <div style={{ textAlign: "center", padding: "60px 20px", background: cardBg, border: `1px solid ${cardBr}`, borderRadius: 16 }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>📋</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: txt, marginBottom: 8 }}>No rankings yet</div>
          <div style={{ fontSize: 13, color: sub, maxWidth: 320, margin: "0 auto", lineHeight: 1.8 }}>
            Rankings appear here once students complete mock tests.<br />
            <b style={{ color: "#7aadff" }}>Go to Mock Tests and be the first!</b>
          </div>
        </div>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const rest  = entries.slice(3);

  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, color: txt, marginBottom: 4 }}>🏆 Leaderboard</div>
      <div style={{ color: sub, fontSize: 13, marginBottom: 16 }}>
        Rankings based on real mock test performance — only verified students.
      </div>

      {/* ── My Rank Banner ── */}
      {myEntry && (
        <div style={{ background: "linear-gradient(135deg,rgba(79,142,247,0.15),rgba(168,85,247,0.10))", border: "1.5px solid #4f8ef7", borderRadius: 14, padding: "13px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#4f8ef7,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff" }}>{user?.name?.[0]}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: txt }}>Your Ranking</div>
              <div style={{ fontSize: 12, color: sub }}>{myEntry.tests} test{myEntry.tests !== 1 ? "s" : ""} completed</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[["Rank", `#${myEntry.rank}`], ["Best Score", myEntry.best], ["Avg Score", myEntry.avg], ["Accuracy", `${myEntry.accuracy}%`]].map(([l, v]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 17, fontWeight: 900, color: "#4f8ef7" }}>{v}</div>
                <div style={{ fontSize: 11, color: sub }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Period Filter ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
        {PERIOD_LABELS.map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)}
            style={{ padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit", transition: "all 0.15s", background: period === p.key ? "linear-gradient(135deg,#4f8ef7,#a855f7)" : T ? "rgba(255,255,255,0.06)" : "#f3f4f6", color: period === p.key ? "#fff" : sub }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Podium ── */}
      {top3.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 12, marginBottom: 28 }}>
          {[top3[1], top3[0], top3[2]].filter(Boolean).map((e, i) => {
            const heights = [100, 132, 84];
            const col = MEDAL_COLORS[i === 0 ? 1 : i === 1 ? 0 : 2];
            const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const bc = BRANCH_COLORS[e.branch] || "#6B7280";
            return (
              <div key={e.id} style={{ textAlign: "center", minWidth: 90 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{rank === 1 ? "👑" : rank === 2 ? "🥈" : "🥉"}</div>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${col},${col}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, color: "#fff", margin: "0 auto 6px" }}>{e.name[0]}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: txt, marginBottom: 2 }}>
                  {e.name.split(" ")[0]}{e.isMe && <span style={{ marginLeft: 4, fontSize: 9, background: "#4f8ef7", color: "#fff", borderRadius: 4, padding: "1px 4px" }}>YOU</span>}
                </div>
                <div style={{ fontSize: 10, color: bc, fontWeight: 600, marginBottom: 5 }}>{e.branch}</div>
                <div style={{ width: 90, height: heights[i], background: `${col}15`, border: `1px solid ${col}30`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", margin: "0 auto" }}>
                  <div style={{ color: col, fontWeight: 900, fontSize: 20 }}>{e.best}</div>
                  <div style={{ color: sub, fontSize: 9 }}>best score</div>
                  <div style={{ color: sub, fontSize: 9, marginTop: 2 }}>⌀ {e.avg}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Table (rank 4+) ── */}
      {rest.length > 0 && (
        <div style={{ background: cardBg, border: `1px solid ${cardBr}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 100px 72px 72px 68px 68px", padding: "10px 18px", borderBottom: `1px solid ${cardBr}`, fontSize: 11, color: sub, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", background: T ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
            <span>Rank</span><span>Student</span><span>Branch</span>
            <span style={{ textAlign: "right" }}>Best</span>
            <span style={{ textAlign: "right" }}>Avg</span>
            <span style={{ textAlign: "right" }}>Acc%</span>
            <span style={{ textAlign: "right" }}>Tests</span>
          </div>
          {rest.map((e, idx) => {
            const isExp = expanded === e.id;
            const bc = BRANCH_COLORS[e.branch] || "#6B7280";
            const accColor = e.accuracy >= 75 ? "#4ade80" : e.accuracy >= 50 ? "#fbbf24" : "#f87171";
            return (
              <div key={e.id}>
                <div onClick={() => setExpanded(isExp ? null : e.id)}
                  style={{ display: "grid", gridTemplateColumns: "52px 1fr 100px 72px 72px 68px 68px", padding: "12px 18px", alignItems: "center", cursor: "pointer", borderBottom: `1px solid ${cardBr}`, background: e.isMe ? "rgba(79,142,247,0.07)" : idx % 2 !== 0 ? T ? "rgba(255,255,255,0.012)" : "rgba(0,0,0,0.015)" : "transparent", transition: "background 0.12s" }}
                  onMouseEnter={e2 => { if (!e.isMe) e2.currentTarget.style.background = "rgba(79,142,247,0.05)"; }}
                  onMouseLeave={e2 => { e2.currentTarget.style.background = e.isMe ? "rgba(79,142,247,0.07)" : "transparent"; }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: sub }}>#{e.rank}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${bc},${bc}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{e.name[0]}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: txt, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {e.name}{e.isMe && <span style={{ marginLeft: 6, fontSize: 9, background: "#4f8ef7", color: "#fff", borderRadius: 4, padding: "1px 5px", verticalAlign: "middle", fontWeight: 700 }}>YOU</span>}
                      </div>
                      {e.city && <div style={{ fontSize: 10, color: sub }}>📍 {e.city}</div>}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: bc, background: `${bc}15`, padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>{e.branch}</span>
                  <span style={{ textAlign: "right", fontWeight: 700, color: txt }}>{e.best}</span>
                  <span style={{ textAlign: "right", fontSize: 13, color: sub }}>{e.avg}</span>
                  <span style={{ textAlign: "right", fontSize: 13, color: accColor, fontWeight: 600 }}>{e.accuracy}%</span>
                  <span style={{ textAlign: "right", fontSize: 13, color: sub }}>{e.tests}</span>
                </div>
                {isExp && (
                  <div style={{ padding: "10px 18px 14px 68px", background: T ? "rgba(255,255,255,0.02)" : "#f9fafb", borderBottom: `1px solid ${cardBr}`, display: "flex", gap: 22, flexWrap: "wrap" }}>
                    {[["Target", e.goal ? `${e.goal}/200` : "—"], ["Gap to Target", e.goal !== "—" ? (e.best >= +e.goal ? "✅ Achieved!" : `${+e.goal - e.best} pts to go`) : "—"]].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: 10, color: sub, marginBottom: 2 }}>{l}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: txt }}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <p style={{ textAlign: "center", color: sub, fontSize: 11, marginTop: 14 }}>
        Rankings update after each mock test · Composite = 50% best + 30% avg + 20% accuracy
      </p>
    </div>
  );
}
