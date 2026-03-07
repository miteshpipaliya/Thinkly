import { useApp } from "../context/AppContext";
import { LEADERBOARD_DATA } from "../data/subjects";

export default function Leaderboard() {
  const { user, myResults } = useApp();
  const myBest = myResults.filter(r=>r.isMock).reduce((best, r) => Math.max(best, r.score), 0);
  const myAcc  = myResults.length ? Math.round(myResults.reduce((a,r)=>a+(r.accuracy||0),0)/myResults.length) : 0;

  // Merge "you" into leaderboard
  const allEntries = [...LEADERBOARD_DATA, { name: user?.name, branch: user?.profile?.branch || "Student", score: myBest, accuracy: myAcc, tests: myResults.length, badge: "", isMe: true }]
    .sort((a,b) => b.score - a.score);

  const cols = ["#ffd700","#c0c0c0","#cd7f32"];

  return (
    <div>
      <div style={{ fontSize:22, fontWeight:800, color:"#e2e2f0", marginBottom:4 }}>🏆 Leaderboard</div>
      <div style={{ color:"#666", fontSize:13, marginBottom:24 }}>Top students by mock test scores.</div>

      {/* Podium */}
      <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-end", gap:16, marginBottom:28 }}>
        {[allEntries[1], allEntries[0], allEntries[2]].map((e, i) => {
          const heights = [100, 130, 85];
          const col = cols[i===0?1:i===1?0:2];
          const rank = i===0?2:i===1?1:3;
          if (!e) return null;
          return (
            <div key={e.name} style={{ textAlign:"center", minWidth:80 }}>
              <div style={{ fontSize:18, marginBottom:5 }}>{rank===1?"👑":rank===2?"🥈":"🥉"}</div>
              <div style={{ fontSize:12, fontWeight:600, color:"#ccc", marginBottom:4 }}>{e.name.split(" ")[0]}</div>
              <div style={{ width:80, height:heights[i], background:`${col}15`, border:`1px solid ${col}30`, borderRadius:"8px 8px 0 0", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", margin:"0 auto" }}>
                <div style={{ color:col, fontWeight:800, fontSize:18 }}>{e.score}</div>
                <div style={{ color:"#555", fontSize:10 }}>pts</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"50px 1fr 100px 90px 80px", padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", fontSize:11, color:"#555", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>
          <span>Rank</span><span>Student</span><span>Score</span><span>Accuracy</span><span>Tests</span>
        </div>
        {allEntries.map((e, i) => (
          <div key={e.name+i} style={{ display:"grid", gridTemplateColumns:"50px 1fr 100px 90px 80px", padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.03)", background:e.isMe?"rgba(79,142,247,0.06)":"transparent", alignItems:"center" }}>
            <div style={{ fontWeight:800, fontSize:14, color:i<3?cols[i]:"#555" }}>
              {e.badge||`#${i+1}`}
            </div>
            <div>
              <div style={{ fontSize:13.5, fontWeight:600, color:e.isMe?"#7aadff":"#ccc" }}>{e.name}{e.isMe?" (You)":""}</div>
              <div style={{ fontSize:11, color:"#555" }}>{e.branch}</div>
            </div>
            <div style={{ fontWeight:700, color:i===0?"#ffd700":e.isMe?"#4f8ef7":"#aaa", fontSize:16 }}>{e.score}</div>
            <div style={{ fontSize:13, color:(e.accuracy||0)>=70?"#4ade80":"#aaa" }}>{e.accuracy||0}%</div>
            <div style={{ fontSize:13, color:"#666" }}>{e.tests}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
