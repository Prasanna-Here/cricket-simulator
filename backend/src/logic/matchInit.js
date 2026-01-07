function initializeMatchState(preState){
    const players = [
        { name: "Player1", type: "anchor" },
        { name: "Player2", type: "power" },
        { name: "Player3", type: "anchor" },
        { name: "Player4", type: "anchor" },
        { name: "Player5", type: "power" },
        { name: "Player6", type: "power" },
        { name: "Player7", type: "power" },
        { name: "Player8", type: "tail" },
        { name: "Player9", type: "tail" },
        { name: "Player10", type: "tail" },
        { name: "Player11", type: "tail" }
    ];
    
    const wicketsDown=preState.wicketsDown;
    const wicketsLeft=10-wicketsDown;

    const nonStrikerIndex=wicketsDown;
    const strikerIndex=wicketsDown+1;
    const nextIndex=wicketsDown+2;

    return {
        runsNeeded: preState.runsNeeded,
        ballsLeft: preState.ballsLeft,
        wicketsLeft,
        players,
        strikerIndex,
        nonStrikerIndex,
        nextIndex,
        allOut: false 
    }
}

module.exports={initializeMatchState};