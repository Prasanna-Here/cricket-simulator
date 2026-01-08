// src/logic/outcomeEngine.js

const probabilityTable = require("./pobTable");
const randomBowlerDifficulty = require("./randomBowlerDifficulty");
const getBowlerForDifficulty = require("./getBowlerForDifficulty");
const generateCommentary = require("./commentary");

// Normalize helper
function normalize(prob) {
    const total = prob.reduce((s, e) => s + e.prob, 0);
    return prob.map(e => ({ ...e, prob: e.prob / total }));
}

// Random pick helper
function pickOutcome(prob) {
    let acc = 0;
    const r = Math.random();
    for (let p of prob) {
        acc += p.prob;
        if (r <= acc) return p.outcome;
    }
}

// Strike change
function swapStrike(state) {
    const t = state.strikerIndex;
    state.strikerIndex = state.nonStrikerIndex;
    state.nonStrikerIndex = t;
}

// Format output for frontend
function formatResponse(state, outcome, commentary) {
    return {
        success: true,
        ballSummary: {
            outcome,
            runs:
                outcome === "six" ? 6 :
                outcome === "four" ? 4 :
                outcome === "two" ? 2 :
                outcome === "one" ? 1 : 0,
            wicket: outcome === "wicket",
            commentary
        },
        matchState: {
            ...state,
            striker: state.players[state.strikerIndex]?.name || null,
            nonStriker: state.players[state.nonStrikerIndex]?.name || null,
            currentBowler: state.currentBowler
        }
    };
}

function simulateBall(state, choice) {
    
    // PRE-MATCH / END CHECKS ------------------------
    if (state.runsNeeded <= 0) {
        return formatResponse(state, "you_win", "You already won the match!");
    }

    if (state.ballsLeft <= 0 || state.allOut) {
        return formatResponse(state, "you_lose", "Innings over — you lost!");
    }

    let newState = { ...state };
    const striker = newState.players[newState.strikerIndex];

    // Adjust type for special roles
    const effectiveType = striker.type === "keeper" ? "anchor" :
                          striker.type === "allrounder" ? "anchor" :
                          striker.type;

    // Copy base probability
    let prob = probabilityTable[effectiveType][choice].map(e => ({ ...e }));

    // Confidence affects hitting/wicket chances
    prob = prob.map(e => {
        let p = e.prob;
        if (e.outcome === "six" || e.outcome === "four") p += striker.confidence * 0.1;
        if (e.outcome === "wicket") p -= striker.confidence * 0.1;
        return { ...e, prob: p };
    });

    // Apply bowler diff
    const diff = newState.bowlerDifficulty;
    prob = prob.map(e => {
        if (e.outcome === "six" || e.outcome === "four") {
            if (diff === "hard") return { ...e, prob: e.prob * 0.7 };
            if (diff === "easy") return { ...e, prob: e.prob * 1.3 };
        }
        if (e.outcome === "wicket") {
            if (diff === "hard") return { ...e, prob: e.prob * 1.3 };
            if (diff === "easy") return { ...e, prob: e.prob * 0.7 };
        }
        return e;
    });

    // Normalize final probabilities
    prob = normalize(prob);

    // Determine outcome
    const outcome = pickOutcome(prob);

    newState.ballsLeft -= 1;

    // RUNS LOGIC
    const runsMap = { six: 6, four: 4, two: 2, one: 1 };
    if (runsMap[outcome]) newState.runsNeeded -= runsMap[outcome];

    if (newState.runsNeeded < 0) newState.runsNeeded = 0;

    // CONFIDENCE UPDATE
    if (outcome === "six" || outcome === "four") striker.confidence += 0.05;
    else if (outcome === "one" || outcome === "two") striker.confidence += 0.01;
    else if (outcome === "dot") striker.confidence -= 0.03;
    else if (outcome === "wicket") striker.confidence = 0.2;

    striker.confidence = Math.min(Math.max(striker.confidence, 0.1), 0.95);

    // STRIKE CHANGE
    if (outcome === "one" || outcome === "two") swapStrike(newState);

    // WICKET LOGIC
    if (outcome === "wicket") {
        newState.wicketsLeft -= 1;
        if (newState.wicketsLeft <= 0) {
            newState.allOut = true;
        } else {
            newState.strikerIndex = newState.nextIndex;
            newState.nextIndex++;
        }
    }

    // END OF OVER HANDLING
    if (newState.ballsLeft % 6 === 0) {
        swapStrike(newState);

        newState.currentOverIndex++;
        newState.matchOverNumber++;
        newState.oversRemaining--;

        // Select difficulty
        const newDiff = randomBowlerDifficulty(newState.matchOverNumber);
        newState.bowlerDifficulty = newDiff;

        // Select bowler by confidence
        const bowlerObj = getBowlerForDifficulty(newState.opponentXI, newDiff);
        newState.currentBowler = bowlerObj ? bowlerObj.name : "Unknown";
    }

    // MATCH RESULT CHECKS (POST BALL)
    if (newState.runsNeeded <= 0) {
        return formatResponse(
            newState,
            "you_win",
            "🏆 You chased the target!"
        );
    }

    if (newState.ballsLeft <= 0 && newState.runsNeeded > 0) {
        return formatResponse(
            newState,
            "you_lose",
            "💔 You couldn’t reach the target."
        );
    }

    // NORMAL BALL RETURN
    return formatResponse(
        newState,
        outcome,
        generateCommentary(outcome, striker, newState.currentBowler)
    );
}

module.exports = { simulateBall };
