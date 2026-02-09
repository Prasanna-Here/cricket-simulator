import TeamSelect from "./components/TeamSelect";
import PlayingXI from "./components/PlayingXI";
import Scenario from "./components/ScenarioForm";
import Match from "./components/MatchScreen";
import { useMatch } from "./context/MatchContext";
import MatchScreen from "./components/MatchScreen";

function App() {
  const { screen } = useMatch();

  return (
    <div style={{ padding: "20px" }}>
      {screen === "team" && <TeamSelect />}
      {screen === "playingXI" && <PlayingXI />}
      {screen === "scenario" && <Scenario />}
      {screen === "match" && <MatchScreen/>}
    </div>
  );
}

export default App;
