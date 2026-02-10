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
    <div className="card">
      <div className="cardInner">
        <div className="rowWrap">
          <div>
            <h2 className="sectionTitle">Match on</h2>
            <p className="sectionSub">
              {matchState.runsNeeded} runs needed • {matchState.ballsLeft} balls left • Wickets left:{" "}
              {matchState.wicketsLeft}
            </p>
          </div>
          <span className="spacer" />
          <span className="pill pillStrong">Win prob: {winProb}%</span>
        </div>

        <div style={{ marginTop: 10 }}>
          <div className="barOuter" aria-label="Win probability bar">
            <div
              className="barInner"
              style={{
                width: `${winProb}%`,
                background:
                  winProb > 60
                    ? "rgba(34, 197, 94, 0.95)"
                    : winProb > 30
                      ? "rgba(245, 158, 11, 0.95)"
                      : "rgba(239, 68, 68, 0.95)",
              }}
            />
          </div>
        </div>

        <hr className="divider" />

        <div className="grid2">
          <div className="callout">
            <div className="rowWrap">
              <span className="badge badgeAnchor">Striker</span>
              <span className="pill pillStrong">
                {striker.name} — {striker.runs} ({striker.balls})
              </span>
              <span className="spacer" />
              <span className="pill">Confidence</span>
            </div>
            <div style={{ marginTop: 10 }}>
              <ConfidenceBar value={striker.confidence} />
            </div>
          </div>

          <div className="callout">
            <div className="rowWrap">
              <span className="badge badgePower">Non-striker</span>
              <span className="pill pillStrong">
                {nonStriker.name} — {nonStriker.runs} ({nonStriker.balls})
              </span>
              <span className="spacer" />
              <span className="pill">Confidence</span>
            </div>
            <div style={{ marginTop: 10 }}>
              <ConfidenceBar value={nonStriker.confidence} />
            </div>
          </div>
        </div>

        {lastBall && (
          <div className="callout calloutInfo">
            <strong>Last ball:</strong> {String(lastBall.outcome || "").toUpperCase()}
            <br />
            <em>{lastBall.commentary}</em>
          </div>
        )}

        {!matchState.matchOver && (
          <div className="rowWrap" style={{ marginTop: 16 }}>
            <button className="btn btnPrimary" onClick={() => playBall("attack")} disabled={playing}>
              Attack
            </button>
            <button className="btn" onClick={() => playBall("rotate")} disabled={playing}>
              Rotate
            </button>
            <button className="btn" onClick={() => playBall("defend")} disabled={playing}>
              Defend
            </button>
            <button className="btn" onClick={() => playBall("risk")} disabled={playing}>
              Risk All
            </button>
            <span className="spacer" />
            {playing && <span className="pill">Simulating…</span>}
          </div>
        )}

        {matchState.matchOver && (
          <div className="callout" style={{ marginTop: 16 }}>
            <h2 className="sectionTitle" style={{ marginBottom: 6 }}>
              {matchState.outcome === "you_win" ? "YOU WON THE MATCH" : "YOU LOST THE MATCH"}
            </h2>
            <p className="sectionSub" style={{ marginBottom: 0 }}>
              Refresh the page to start a new match.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   CONFIDENCE BAR
========================= */
function ConfidenceBar({ value = 0 }) {
  const percent = Math.round(value * 100);
  return (
    <div className="barOuter" style={{ height: 10 }}>
      <div
        className="barInner"
        style={{
          width: `${percent}%`,
          background: "rgba(56, 189, 248, 0.95)",
        }}
      />
    </div>
  );
}

export default MatchScreen;
