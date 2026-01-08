// src/logic/matchInit.js

const getBowlerForDifficulty = require("./getBowlerForDifficulty");

function initializeMatchState(preState, selectedPlayers, opponentXI) {
    const wicketsDown = preState.wicketsDown;

    let strikerIndex = wicketsDown;
    let nonStrikerIndex = wicketsDown + 1;
    let nextIndex = wicketsDown + 2;

    if (strikerIndex >= selectedPlayers.length - 1) {
        strikerIndex = selectedPlayers.length - 2;
        nonStrikerIndex = selectedPlayers.length - 1;
        nextIndex = selectedPlayers.length;
    }

    const oversRemaining = Math.floor(preState.ballsLeft / 6);
    const matchOverNumber = 20 - oversRemaining;

    const firstDiff = "medium";
    const firstBowler = getBowlerForDifficulty(opponentXI, firstDiff);

    return {
        runsNeeded: preState.runsNeeded,
        ballsLeft: preState.ballsLeft,
        wicketsLeft: 10 - wicketsDown,

        players: selectedPlayers,
        opponentXI,

        strikerIndex,
        nonStrikerIndex,
        nextIndex,
        allOut: false,

        currentOverIndex: 0,
        oversRemaining,
        matchOverNumber,

        bowlerDifficulty: firstDiff,
        currentBowler: firstBowler ? firstBowler.name : "Unknown"
    };
}

module.exports = { initializeMatchState };
