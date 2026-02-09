import { useEffect, useState } from "react";
import { getTeams, setupMatch } from "../api/matchApi";
import { useMatch } from "../context/MatchContext";

function TeamSelect() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    setMyTeam,
    setOpponentTeam,
    setMySquad,
    setOpponentSquad,
    setScreen,
  } = useMatch();

  const [myTeamLocal, setMyTeamLocal] = useState("");
  const [opponentTeamLocal, setOpponentTeamLocal] = useState("");

  useEffect(() => {
    getTeams().then(res => setTeams(res.data));
  }, []);

  const handleContinue = async () => {
    if (!myTeamLocal || !opponentTeamLocal || myTeamLocal === opponentTeamLocal) {
      alert("Select two different teams");
      return;
    }

    setLoading(true);

    const res = await setupMatch(myTeamLocal, opponentTeamLocal);

    setMyTeam(myTeamLocal);
    setOpponentTeam(opponentTeamLocal);
    setMySquad(res.data.mySquad);
    setOpponentSquad(res.data.opponentSquad);

    setScreen("playingXI");
    setLoading(false);
  };

  return (
    <div>
      <h2>Select Teams</h2>

      <select value={myTeamLocal} onChange={(e) => setMyTeamLocal(e.target.value)}>
        <option value="">Select My Team</option>
        {teams.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        value={opponentTeamLocal}
        onChange={(e) => setOpponentTeamLocal(e.target.value)}
      >
        <option value="">Select Opponent Team</option>
        {teams.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <br /><br />

      <button onClick={handleContinue} disabled={loading}>
        {loading ? "Loading..." : "Continue"}
      </button>
    </div>
  );
}

export default TeamSelect;
