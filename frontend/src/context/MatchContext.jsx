import { createContext, useContext, useState } from "react";

const MatchContext = createContext();

export const MatchProvider = ({ children }) => {
  const [screen, setScreen] = useState("team");

  const [myTeam, setMyTeam] = useState(null);
  const [opponentTeam, setOpponentTeam] = useState(null);

  const [mySquad, setMySquad] = useState([]);
  const [opponentSquad, setOpponentSquad] = useState([]);

  const [myPlayingXI, setMyPlayingXI] = useState([]);
  const [opponentXI, setOpponentXI] = useState([]);

  const [matchState, setMatchState] = useState(null);

  return (
    <MatchContext.Provider
      value={{
        screen,
        setScreen,

        myTeam,
        setMyTeam,
        opponentTeam,
        setOpponentTeam,

        mySquad,
        setMySquad,
        opponentSquad,
        setOpponentSquad,

        myPlayingXI,
        setMyPlayingXI,
        opponentXI,
        setOpponentXI,

        matchState,
        setMatchState,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => useContext(MatchContext);
