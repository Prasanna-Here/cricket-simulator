import { useEffect } from "react";
import { getTeams } from "./api/matchApi";

function App() {
  useEffect(() => {
    getTeams().then(res => {
      console.log("Teams:", res.data);
    });
  }, []);

  return <h1>Cricket Simulator</h1>;
}

export default App;
