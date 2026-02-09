import { useState } from "react";
import { useMatch } from "../context/MatchContext";
import { selectOpponentXI } from "../api/matchApi";

function PlayingXI() {
  const {
    mySquad,
    opponentTeam,
    setMyPlayingXI,
    setOpponentXI,
    setScreen,
  } = useMatch();

  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     TOGGLE PLAYER (SAFE)
  ========================= */
  const togglePlayer = (player) => {
    const exists = selected.some(p => p.name === player.name);

    if (exists) {
      setSelected(selected.filter(p => p.name !== player.name));
    } else {
      if (selected.length === 11) {
        alert("You can select only 11 players");
        return;
      }
      setSelected([...selected, player]);
    }
  };

  /* =========================
     CONTINUE
  ========================= */
  const handleContinue = async () => {
    if (selected.length !== 11) {
      alert("Select exactly 11 players");
      return;
    }

    // ✅ FRONTEND BOWLING RULE
    const bowlers = selected.filter(
      p => p.type?.toLowerCase() === "bowler"
    );

    if (bowlers.length < 3) {
      alert("You must select at least 3 bowlers");
      return;
    }

    setLoading(true);

    try {
      // Save my XI
      setMyPlayingXI(selected);

      // Get opponent best XI
      const res = await selectOpponentXI(opponentTeam);
      setOpponentXI(res.data.playingXI);

      setScreen("scenario");
    } catch (err) {
      console.error("Playing XI error:", err);
      alert(
        err.response?.data?.error ||
        "Failed to prepare match"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div>
      <h2>Select Your Playing XI</h2>
      <p>{selected.length} / 11 selected</p>

      {mySquad.map((player) => (
        <div key={player.name}>
          <label>
            <input
              type="checkbox"
              checked={selected.some(p => p.name === player.name)}
              onChange={() => togglePlayer(player)}
            />
            {player.name} ({player.type})
          </label>
        </div>
      ))}

      <br />

      <button onClick={handleContinue} disabled={loading}>
        {loading ? "Preparing Match..." : "Continue"}
      </button>
    </div>
  );
}

export default PlayingXI;
