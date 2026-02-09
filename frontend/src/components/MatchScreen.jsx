import { useState } from "react";
import { simulateBall } from "../api/matchApi";
import { useMatch } from "../context/MatchContext";

function MatchScreen() {
  const { matchState, setMatchState } = useMatch();
  const [playing, setPlaying] = useState(false);
  const [lastBall, setLastBall] = useState(null);

  /* =========================
     SAFETY
  ========================= */
  if (!matchState || !Array.isArray(matchState.players)) {
    return <h2>Loading match…</h2>;
  }

  const striker = matchState.players[matchState.strikerIndex];
  const nonStriker = matchState.players[matchState.nonStrikerIndex];
  const winProb = matchState.winProbability ?? 50;

  /* =========================
     PLAY BALL
  ========================= */
  const playBall = async (choice) => {
    if (playing || matchState.matchOver) return;

    setPlaying(true);
    try {
      const res = await simulateBall(matchState, choice);

      if (!res.data.success) {
        alert(res.data.error || "Something went wrong");
        return;
      }

      setLastBall(res.data.ballSummary);
      setMatchState(res.data.matchState);
    } catch (err) {
      console.error("Simulation error:", err);
      alert("Backend error — check console");
    } finally {
      setPlaying(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>🏏 Match On</h1>

      <h2>
        {matchState.runsNeeded} runs needed • {matchState.ballsLeft} balls left
      </h2>

      <p>Wickets left: {matchState.wicketsLeft}</p>

      {/* =========================
          WIN PROBABILITY
      ========================= */}
      <div style={{ margin: "15px 0" }}>
        <strong>Win Probability: {winProb}%</strong>
        <div
          style={{
            height: "12px",
            width: "100%",
            background: "#ddd",
            borderRadius: "6px",
            overflow: "hidden",
            marginTop: "5px"
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${winProb}%`,
              background:
                winProb > 60
                  ? "#2ecc71"
                  : winProb > 30
                    ? "#f1c40f"
                    : "#e74c3c",
              transition: "width 0.4s ease"
            }}
          />
        </div>
      </div>

      <hr />

      {/* =========================
          BATSMEN
      ========================= */}
      <p>
        🟢 Striker: {striker.name} — {striker.runs} ({striker.balls})
      </p>
      <ConfidenceBar value={striker.confidence} />

      <p>
        🔵 Non-Striker: {nonStriker.name} — {nonStriker.runs} ({nonStriker.balls})
      </p>
      <ConfidenceBar value={nonStriker.confidence} />


      {/* =========================
          COMMENTARY
      ========================= */}
      {lastBall && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            background: "#f9f9f9",
            borderLeft: "4px solid #3498db"
          }}
        >
          <strong>Last Ball:</strong> {lastBall.outcome.toUpperCase()}
          <br />
          <em>{lastBall.commentary}</em>
        </div>
      )}

      {/* =========================
          CONTROLS
      ========================= */}
      {!matchState.matchOver && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => playBall("attack")} disabled={playing}>
            Attack
          </button>{" "}
          <button onClick={() => playBall("rotate")} disabled={playing}>
            Rotate
          </button>{" "}
          <button onClick={() => playBall("defend")} disabled={playing}>
            Defend
          </button>{" "}
          <button onClick={() => playBall("risk")} disabled={playing}>
            Risk All
          </button>
        </div>
      )}

      {/* =========================
          RESULT
      ========================= */}
      {matchState.matchOver && (
        <h1 style={{ marginTop: "30px" }}>
          {matchState.outcome === "you_win"
            ? "🎉 YOU WON THE MATCH"
            : "❌ YOU LOST THE MATCH"}
        </h1>
      )}
    </div>
  );
}

/* =========================
   CONFIDENCE BAR
========================= */
function ConfidenceBar({ value = 0 }) {
  const percent = Math.round(value * 100);
  return (
    <div
      style={{
        width: "200px",
        height: "8px",
        background: "#eee",
        borderRadius: "4px",
        marginBottom: "8px"
      }}
    >
      <div
        style={{
          width: `${percent}%`,
          height: "100%",
          background: "#3498db",
          borderRadius: "4px",
          transition: "width 0.3s ease"
        }}
      />
    </div>
  );
}

export default MatchScreen;
