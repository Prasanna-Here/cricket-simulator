import TeamSelect from "./components/TeamSelect";
import PlayingXI from "./components/PlayingXI";
import Scenario from "./components/ScenarioForm";
import { useMatch } from "./context/MatchContext";
import MatchScreen from "./components/MatchScreen";

function App() {
  const { screen } = useMatch();

  const steps = [
    { id: "team", label: "Teams" },
    { id: "playingXI", label: "Playing XI" },
    { id: "scenario", label: "Scenario" },
    { id: "match", label: "Match" },
  ];

  return (
    <div className="appShell">
      <header className="appHeader">
        <div className="appHeaderInner">
          <div className="brandTitle">
            <h1>Cricket Simulator</h1>
            <p>Pick XI • Set scenario • Play ball-by-ball</p>
          </div>

          <nav className="stepper" aria-label="Steps">
            {steps.map((s) => (
              <span
                key={s.id}
                className={`step ${screen === s.id ? "stepActive" : ""}`}
              >
                {s.label}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <main className="container">
        {screen === "team" && <TeamSelect />}
        {screen === "playingXI" && <PlayingXI />}
        {screen === "scenario" && <Scenario />}
        {screen === "match" && <MatchScreen />}
      </main>
    </div>
  );
}

export default App;
