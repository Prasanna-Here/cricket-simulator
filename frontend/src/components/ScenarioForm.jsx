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
    <div>
      <h2>Create Match Scenario</h2>

      <label>
        Runs Needed:
        <input
          type="number"
          value={runsNeeded}
          onChange={(e) => setRunsNeeded(Number(e.target.value))}
        />
      </label>

      <br />

      <label>
        Balls Left:
        <input
          type="number"
          value={ballsLeft}
          onChange={(e) => setBallsLeft(Number(e.target.value))}
        />
      </label>

      <br />

      <label>
        Wickets Down:
        <input
          type="number"
          value={wicketsDown}
          onChange={(e) => setWicketsDown(Number(e.target.value))}
        />
      </label>

      <br /><br />

      <button onClick={handleStart} disabled={loading}>
        {loading ? "Starting Match..." : "Start Match"}
      </button>
    </div>
  );
}

export default Scenario;
