const probabilityTable = {
    power: {
        attack: [
            { outcome: "six", prob: 0.30 },
            { outcome: "four", prob: 0.25 },
            { outcome: "two", prob: 0.10 },
            { outcome: "one", prob: 0.05 },
            { outcome: "dot", prob: 0.10 },
            { outcome: "wicket", prob: 0.20 },
        ],
        rotate: [
            { outcome: "one", prob: 0.40 },
            { outcome: "two", prob: 0.20 },
            { outcome: "dot", prob: 0.20 },
            { outcome: "wicket", prob: 0.20 },
        ],
        defend: [
            { outcome: "dot", prob: 0.60 },
            { outcome: "one", prob: 0.25 },
            { outcome: "wicket", prob: 0.15 },
        ],
    },

    anchor: {
        attack: [
            { outcome: "six", prob: 0.10 },
            { outcome: "four", prob: 0.20 },
            { outcome: "two", prob: 0.30 },
            { outcome: "one", prob: 0.20 },
            { outcome: "dot", prob: 0.10 },
            { outcome: "wicket", prob: 0.10 },
        ],
        rotate: [
            { outcome: "one", prob: 0.50 },
            { outcome: "two", prob: 0.20 },
            { outcome: "dot", prob: 0.15 },
            { outcome: "wicket", prob: 0.15 },
        ],
        defend: [
            { outcome: "dot", prob: 0.60 },
            { outcome: "one", prob: 0.30 },
            { outcome: "wicket", prob: 0.10 },
        ],
    },

    tail: {
        attack: [
            { outcome: "six", prob: 0.05 },
            { outcome: "four", prob: 0.10 },
            { outcome: "two", prob: 0.20 },
            { outcome: "one", prob: 0.20 },
            { outcome: "dot", prob: 0.10 },
            { outcome: "wicket", prob: 0.35 },
        ],
        rotate: [
            { outcome: "one", prob: 0.40 },
            { outcome: "two", prob: 0.20 },
            { outcome: "dot", prob: 0.20 },
            { outcome: "wicket", prob: 0.20 },
        ],
        defend: [
            { outcome: "dot", prob: 0.70 },
            { outcome: "one", prob: 0.15 },
            { outailtcome: "wicket", prob: 0.15 },
        ],
    }
};


function pickOutcome(probabilities) {
    let cumulative = 0;
    let randomNum = Math.random();

    for (let entry of probabilities) {
        cumulative += entry.prob;
        if (randomNum <= cumulative) {
            return entry.outcome;
        }
    }
}

function swapStrike(state){
    const temp = state.strikerIndex;
    state.strikerIndex = state.nonStrikerIndex;
    state.nonStrikerIndex = temp;    
}

function simulateBall(state, choice) {
    let newState = { ...state };

    const striker=newState.players[newState.strikerIndex];
    const strikerType = striker.type;

    const probabilities = probabilityTable[strikerType][choice];

    const outcome = pickOutcome(probabilities);

    newState.ballsLeft -= 1;

    if (outcome === "six") newState.runsNeeded -= 6;
    if (outcome === "four") newState.runsNeeded -= 4;
    if (outcome === "two") newState.runsNeeded -= 2;
    if (outcome === "one") newState.runsNeeded -= 1;

    if (outcome === "one" || outcome === "two") {
        swapStrike(newState);
    }

    if (newState.ballsLeft % 6 === 0) {
        swapStrike(newState);
    }

    if (outcome == "wicket") {
        newState.wicketsLeft -= 1;

        if(newState.nextIndex>=newState.players.length){
            newState.allOut=true;
        }
        else{
            newState.strikerIndex=newState.nextIndex;
            newState.nextIndex+=1;
        }

    }

    return { ...newState, outcome };
}

module.exports = { simulateBall };