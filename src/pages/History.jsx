/**
 * History.jsx — Ranklify
 * Full test history: mock tests, unit tests, scores, accuracy
 */
import { useApp } from "../context/AppContext";

export default function History() {
  const { myResults, darkMode, user } = useApp();
  const T    = darkMode;
  const txt  = T ? "#e2e2f0" : "#111";
  const sub  = T ? "#555"    : "#888";
  const cardBg = T ? "rgba(255,255,255,0.04)" : "#fff";
  const cardBr = T ? "rgba(255,255,255,0.08)" : "#e5e7eb";

  const results = (myResults || []).slice().reverse();
  const mocks   = results.filter(r => r.isMock);
  const units   = results.filter(r => !r.isMock);

  const avgAcc  = results.length
    ? Math.round(results.reduce((s,r) => s + (r.accuracy||0), 0) / results.length)
    : 0;
  const best    = results.length
    ? Math.max(...results.map(r => r.score||0))
    : 0;

  function ScoreCard({ r, idx }) {
    const acc = r.accuracy || 0;
    const col = acc >= 75 ? "#4ade80" : acc >= 50 ? "#fbbf24" : "#f87171";
    return (
      <div style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:"16px 20px", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:txt }}>{r.title || (r.isMock ? "Mock Test" : "Unit Test")}</div>
            <div style={{ fontSize:11, color:sub, marginTop:2 }}>
              {r.isMock ? "🎯 Mock Test" : "📚 Unit Test"} · {r.date ? new Date(r.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : ""}
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:22, fontWeight:900, color:col }}>{acc}%</div>
            <div style={{ fontSize:11, color:sub }}>accuracy</div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {[
            { l:"Score",   v:`${r.score||0}/${r.total||0}`, c:"#4f8ef7" },
            { l:"Correct", v:r.correct||0,                   c:"#4ade80" },
            { l:"Wrong",   v:r.wrong||0,                     c:"#f87171" },
          ].map(s=>(
            <div key={s.l} style={{ textAlign:"center", background:`${s.c}12`, border:`1px solid ${s.c}22`, borderRadius:9, padding:"8px 6px" }}>
              <div style={{ fontSize:18, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:10, color:sub }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:720 }}>
      <div style={{ fontSize:22, fontWeight:800, color:txt, marginBottom:4 }}>
        📋 Test History
      </div>
      <div style={{ color:sub, fontSize:13, marginBottom:24 }}>
        All your past tests — mock and unit
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:28 }}>
        {[
          { l:"Total Tests",  v:results.length,       c:"#4f8ef7" },
          { l:"Avg Accuracy", v:`${avgAcc}%`,          c:"#4ade80" },
          { l:"Best Score",   v:`${best} pts`,         c:"#fbbf24" },
        ].map(s=>(
          <div key={s.l} style={{ background:cardBg, border:`1px solid ${cardBr}`, borderRadius:14, padding:"16px", textAlign:"center" }}>
            <div style={{ fontSize:26, fontWeight:900, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:12, color:sub, marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {results.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 20px", color:sub }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
          <div style={{ fontSize:15, fontWeight:600, color:txt, marginBottom:6 }}>No tests yet</div>
          <div style={{ fontSize:13 }}>Take a Mock Test or Unit Test to see your history here.</div>
        </div>
      ) : (
        <>
          {mocks.length > 0 && (
            <>
              <div style={{ fontSize:13, fontWeight:700, color:sub, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                🎯 Mock Tests ({mocks.length})
              </div>
              {mocks.map((r,i) => <ScoreCard key={i} r={r} idx={i}/>)}
              <div style={{ marginBottom:20 }}/>
            </>
          )}
          {units.length > 0 && (
            <>
              <div style={{ fontSize:13, fontWeight:700, color:sub, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                📚 Unit Tests ({units.length})
              </div>
              {units.map((r,i) => <ScoreCard key={i} r={r} idx={i}/>)}
            </>
          )}
        </>
      )}
    </div>
  );
}
