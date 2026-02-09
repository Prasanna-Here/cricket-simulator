// src/logic/getBowlerForDifficulty.js

function getBowlerForDifficulty(opponentXI, difficulty, lastBowlerName) {
  if (!Array.isArray(opponentXI)) return null;

  // Only players who can bowl
  const bowlers = opponentXI.filter(p =>
    p.type === "bowler" || p.type === "allrounder"
  );

  if (bowlers.length === 0) return null;

  // Remove last over bowler if possible
  let available = bowlers;
  if (lastBowlerName && bowlers.length > 1) {
    available = bowlers.filter(b => b.name !== lastBowlerName);
  }

  // Sort by confidence (high → low)
  const sorted = [...available].sort(
    (a, b) => (b.confidence || 0) - (a.confidence || 0)
  );

  // Pick based on difficulty
  if (difficulty === "hard") return sorted[0];
  if (difficulty === "medium") return sorted[Math.floor(sorted.length / 2)] || sorted[0];
  if (difficulty === "easy") return sorted[sorted.length - 1];

  return sorted[0];
}

module.exports = getBowlerForDifficulty;
