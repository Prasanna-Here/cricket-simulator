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
    <div className="card">
      <div className="cardInner">
        <h2 className="sectionTitle">Select teams</h2>
        <p className="sectionSub">Pick your team and the opponent team.</p>

        <div className="grid2">
          <div className="field">
            <div className="label">My team</div>
            <select
              className="select"
              value={myTeamLocal}
              onChange={(e) => setMyTeamLocal(e.target.value)}
              disabled={loading}
            >
              <option value="">Select My Team</option>
              {teams.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <div className="label">Opponent team</div>
            <select
              className="select"
              value={opponentTeamLocal}
              onChange={(e) => setOpponentTeamLocal(e.target.value)}
              disabled={loading}
            >
              <option value="">Select Opponent Team</option>
              {teams.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rowWrap" style={{ marginTop: 16 }}>
          <span className="pill">
            Tip: Choose two different teams
          </span>
          <span className="spacer" />
          <button className="btn btnPrimary" onClick={handleContinue} disabled={loading}>
            {loading ? "Loading..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamSelect;
