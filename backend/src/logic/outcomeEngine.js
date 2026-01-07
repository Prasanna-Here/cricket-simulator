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
            { outcome: "wicket", prob: 0.15 },
        ],
    }
};

const bowlerDifficultyMultiplier = {
    easy: { wicket: 0.7, boundary: 1.3, dot: 0.9 },
    medium: { wicket: 1.0, boundary: 1.0, dot: 1.0 },
    hard: { wicket: 1.3, boundary: 0.7, dot: 1.2 }
};

function normalizeProbabilities(p) {
    const total = p.reduce((sum, x) => sum + x.prob, 0);
    return p.map(x => ({ ...x, prob: x.prob / total }));
}

function randomBowlerDifficulty(matchOverNumber) {
    const r = Math.random();

    if (matchOverNumber >= 18) {
        if (r < 0.4) return "hard";
        if (r < 0.8) return "medium";
        return "easy";
    }

    if (r < 0.25) return "hard";
    if (r < 0.65) return "medium";
    return "easy";
}

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

function swapStrike(state) {
    let temp = state.strikerIndex;
    state.strikerIndex = state.nonStrikerIndex;
    state.nonStrikerIndex = temp;
}

function simulateBall(state, choice) {

    if (state.runsNeeded <= 0) {
        return {
            ...state,
            outcome: "you_win",
            matchOver: true
        };
    }

    if (state.ballsLeft <= 0 || state.allOut) {
        return {
            ...state,
            outcome: "you_lose",
            matchOver: true
        };
    }

    let newState = { ...state };

    const striker = newState.players[newState.strikerIndex];
    const strikerType = striker.type;

    let probabilities = probabilityTable[strikerType][choice].map(e => ({ ...e }));

    probabilities = probabilities.map(entry => {

        const diff = bowlerDifficultyMultiplier[newState.bowler];

        if (entry.outcome == "wicket")
            return { ...entry, prob: entry.prob * diff.wicket }

        if (entry.outcome === "six" || entry.outcome === "four")
            return { ...entry, prob: entry.prob * diff.boundary };

        if (entry.outcome === "dot")
            return { ...entry, prob: entry.prob * diff.dot };

        return entry;

    });

    probabilities = normalizeProbabilities(probabilities);

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

        newState.currentOverIndex += 1;
        newState.matchOverNumber += 1;
        newState.oversRemaining -= 1;

        newState.bowler = randomBowlerDifficulty(newState.matchOverNumber);
    }

    if (outcome == "wicket") {
        newState.wicketsLeft -= 1;

        if (newState.nextIndex >= newState.players.length) {
            newState.allOut = true;
        }
        else {
            newState.strikerIndex = newState.nextIndex;
            newState.nextIndex += 1;
        }

    }

    if (newState.runsNeeded <= 0) {
    newState.runsNeeded = 0;
    return {
        ...newState,
        outcome: "you_win",
        matchOver: true
    }
    }
    if (newState.ballsLeft <= 0 && newState.runsNeeded > 0) {
    return {
        ...newState,
        outcome: "you_lose",
        matchOver: true
    };
}

    return { ...newState, outcome };
}

module.exports = { simulateBall };