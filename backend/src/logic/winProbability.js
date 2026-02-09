function calculateWinProbability(state) {
  const {
    runsNeeded,
    ballsLeft,
    wicketsLeft,
    attackStreak = 0
  } = state;

  if (runsNeeded <= 0) return 100;
  if (ballsLeft <= 0 || wicketsLeft <= 0) return 0;

  const reqPerBall = runsNeeded / ballsLeft;

  // Base probability from run rate
  let probability = 100 - (reqPerBall * 20);

  // Wickets buffer
  probability += wicketsLeft * 4;

  // Late pressure penalty
  if (ballsLeft <= 6 && reqPerBall > 2) probability -= 15;

  // Momentum bonus
  probability += attackStreak * 3;

  // Clamp 0–100
  probability = Math.max(0, Math.min(100, probability));

  return Math.round(probability);
}

module.exports = calculateWinProbability;
