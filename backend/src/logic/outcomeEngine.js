const probabilityTable = require("./probTable");
const randomBowlerDifficulty = require("./randomBowlerDifficulty");
const getBowlerForDifficulty = require("./getBowlerForDifficulty");
const generateCommentary = require("./commentary");
const calculateWinProbability = require("./winProbability");

/* =========================
   HELPERS
========================= */

function normalize(prob) {
  const total = prob.reduce((s, e) => s + e.prob, 0);
  return prob.map(e => ({ ...e, prob: e.prob / total }));
}

function pickOutcome(prob) {
  let acc = 0;
  const r = Math.random();
  for (let p of prob) {
    acc += p.prob;
    if (r <= acc) return p.outcome;
  }
}

function swapStrike(state) {
  const t = state.strikerIndex;
  state.strikerIndex = state.nonStrikerIndex;
  state.nonStrikerIndex = t;
}

/* =========================
   END MATCH (FIXED)
========================= */
function endMatch(state, result, message) {
  return {
    success: true,
    ballSummary: {
      outcome: result,
      runs: 0,
      wicket: false,
      commentary: message
    },
    matchState: {
      ...state,
      matchOver: true,
      outcome: result,
      winProbability: calculateWinProbability(state)
    }
  };
}

/* =========================
   FORMAT RESPONSE (FIXED)
========================= */
function formatResponse(updatedState, outcome, commentary) {
  return {
    success: true,
    ballSummary: {
      outcome,
      runs: { six: 6, four: 4, two: 2, one: 1 }[outcome] || 0,
      wicket: outcome === "wicket",
      commentary
    },
    matchState: {
      ...updatedState,
      striker: updatedState.players[updatedState.strikerIndex]?.name || null,
      nonStriker: updatedState.players[updatedState.nonStrikerIndex]?.name || null,
      currentBowler: updatedState.currentBowler || "Unknown",
      winProbability: calculateWinProbability(updatedState)
    }
  };
}

/* =========================
   MAIN ENGINE
========================= */

function simulateBall(state, choice) {

  /* ---------- SAFETY ---------- */
  if (!state || !Array.isArray(state.players)) {
    return { success: false, error: "Invalid match state" };
  }

  if (state.matchOver) return state;

  /* ---------- MATCH END ---------- */
  if (state.runsNeeded <= 0)
    return endMatch(state, "you_win", "🏆 You chased the target!");

  if (state.ballsLeft <= 0 || state.allOut)
    return endMatch(state, "you_lose", "💔 Innings over!");

  let newState = {
    ...state,
    attackStreak: state.attackStreak || 0
  };

  const pressure = newState.runsNeeded / newState.ballsLeft;

  /* =========================
     RISK ALL
  ========================= */
  if (choice === "risk") {
    const riskProb = normalize([
      { outcome: "six", prob: 0.40 },
      { outcome: "four", prob: 0.20 },
      { outcome: "wicket", prob: 0.35 },
      { outcome: "dot", prob: 0.05 }
    ]);

    const outcome = pickOutcome(riskProb);
    newState.ballsLeft--;

    if (outcome === "six") newState.runsNeeded -= 6;
    if (outcome === "four") newState.runsNeeded -= 4;
    if (newState.runsNeeded < 0) newState.runsNeeded = 0;

    if (outcome === "wicket") {
      newState.wicketsLeft--;
      if (newState.wicketsLeft <= 0)
        return endMatch(newState, "you_lose", "💀 Risk backfired!");
      newState.strikerIndex = newState.nextIndex++;
    }

    if (newState.runsNeeded <= 0)
      return endMatch(newState, "you_win", "🔥 RISK PAID OFF!");

    return formatResponse(newState, outcome, "🟥 RISK ALL!");
  }

  /* =========================
     NORMAL BALL
  ========================= */

  const striker = newState.players[newState.strikerIndex];
  const type = probabilityTable[striker.type] ? striker.type : "anchor";

  if (!probabilityTable[type]?.[choice]) {
    return formatResponse(newState, "dot", "⚠️ Invalid shot");
  }

  let prob = probabilityTable[type][choice].map(e => ({ ...e }));

  /* ATTACK STREAK */
  if (choice === "attack") newState.attackStreak++;
  else newState.attackStreak = 0;

  if (newState.attackStreak >= 3) {
    prob = prob.map(e => {
      if (e.outcome === "six") return { ...e, prob: e.prob * 0.6 };
      if (e.outcome === "four") return { ...e, prob: e.prob * 0.7 };
      if (e.outcome === "wicket") return { ...e, prob: e.prob * 1.5 };
      return e;
    });
  }

  /* ROTATE SAFETY */
  if (choice === "rotate") {
    prob = prob.map(e =>
      e.outcome === "wicket" ? { ...e, prob: e.prob * 0.5 } : e
    );
  }

  /* CLUTCH */
  const isClutch = newState.ballsLeft <= 12 && pressure >= 2.5;
  if (isClutch && choice === "attack") {
    prob = prob.map(e => {
      if (e.outcome === "six") return { ...e, prob: e.prob * 1.3 };
      if (e.outcome === "four") return { ...e, prob: e.prob * 1.15 };
      if (e.outcome === "wicket") return { ...e, prob: e.prob * 0.85 };
      return e;
    });
  }

  /* BOWLER DIFFICULTY */
  const diff = newState.bowlerDifficulty || "medium";
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

  prob = normalize(prob);
  const outcome = pickOutcome(prob);
  
  const runMap = { six: 6, four: 4, two: 2, one: 1 };
  // runs for batsman
  // ✅ BALL FACED
  striker.balls += 1;

  // ✅ RUNS
  if (runMap[outcome]) {
    striker.runs += runMap[outcome];
    newState.runsNeeded -= runMap[outcome];
  }

  // Clamp
  if (newState.runsNeeded < 0) newState.runsNeeded = 0;

  /* APPLY OUTCOME */
  newState.ballsLeft--;
  if (runMap[outcome]) newState.runsNeeded -= runMap[outcome];
  if (newState.runsNeeded < 0) newState.runsNeeded = 0;

  if (outcome === "one") swapStrike(newState);

  if (outcome === "wicket") {
    striker.out = true;
    newState.wicketsLeft--;

    if (newState.wicketsLeft <= 0) {
      newState.allOut = true;
      return endMatch(newState, "you_lose", "💔 All out!");
    }

    newState.strikerIndex = newState.nextIndex++;
  }


  /* OVER END */
  if (newState.ballsLeft % 6 === 0 && newState.ballsLeft > 0) {
    swapStrike(newState);
    newState.matchOverNumber++;
    const newDiff = randomBowlerDifficulty(newState.matchOverNumber);
    newState.bowlerDifficulty = newDiff;
    const bowler = getBowlerForDifficulty(
      newState.opponentXI,
      newDiff,
      newState.currentBowler
    );
    newState.currentBowler = bowler?.name || "Unknown";
  }

  /* FINAL CHECK */
  if (newState.runsNeeded <= 0)
    return endMatch(newState, "you_win", "🏆 You chased it!");

  if (newState.ballsLeft <= 0)
    return endMatch(newState, "you_lose", "💔 Time’s up!");

  return formatResponse(
    newState,
    outcome,
    generateCommentary(outcome, striker, newState.currentBowler)
  );
}

module.exports = { simulateBall };
