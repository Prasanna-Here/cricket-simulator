import { useState } from "react";
import { useMatch } from "../context/MatchContext";
import { startMatch } from "../api/matchApi";

function Scenario() {
  const {
    myPlayingXI,
    opponentXI,
    setMatchState,
    setScreen
  } = useMatch();

  const [runsNeeded, setRunsNeeded] = useState(36);
  const [ballsLeft, setBallsLeft] = useState(18);
  const [wicketsDown, setWicketsDown] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (wicketsDown >= 10) {
      alert("Wickets down must be less than 10");
      return;
    }

    setLoading(true);

    const payload = {
      runsNeeded,
      ballsLeft,
      wicketsDown,
      selectedPlayers: myPlayingXI,
      opponentXI
    };

    const res = await startMatch(payload);
    setMatchState(res.data);
    setScreen("match");

    setLoading(false);
  };

  return (
    <div className="card">
      <div className="cardInner">
        <h2 className="sectionTitle">Create match scenario</h2>
        <p className="sectionSub">
          Set the chase situation, then simulate ball-by-ball decisions.
        </p>

        <div className="grid2">
          <div className="field">
            <div className="label">Runs needed</div>
            <input
              className="input"
              type="number"
              value={runsNeeded}
              onChange={(e) => setRunsNeeded(Number(e.target.value))}
              disabled={loading}
            />
          </div>

          <div className="field">
            <div className="label">Balls left</div>
            <input
              className="input"
              type="number"
              value={ballsLeft}
              onChange={(e) => setBallsLeft(Number(e.target.value))}
              disabled={loading}
            />
          </div>

          <div className="field">
            <div className="label">Wickets down</div>
            <input
              className="input"
              type="number"
              value={wicketsDown}
              onChange={(e) => setWicketsDown(Number(e.target.value))}
              disabled={loading}
            />
          </div>

          <div className="field">
            <div className="label">Lineup</div>
            <div className="rowWrap">
              <span className="pill pillStrong">
                Your XI: {Array.isArray(myPlayingXI) ? myPlayingXI.length : 0}
              </span>
              <span className="pill">
                Opponent XI: {Array.isArray(opponentXI) ? opponentXI.length : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="rowWrap" style={{ marginTop: 16 }}>
          <span className="pill">
            Note: Wickets down must be &lt; 10
          </span>
          <span className="spacer" />
          <button className="btn btnPrimary" onClick={handleStart} disabled={loading}>
            {loading ? "Starting Match..." : "Start Match"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Scenario;
