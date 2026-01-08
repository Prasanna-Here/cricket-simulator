// src/logic/randomBowlerDifficulty.js

function randomBowlerDifficulty(currentOver) {
    const r = Math.random();

    if (currentOver >= 18) {
        if (r < 0.5) return "hard";
        if (r < 0.85) return "medium";
        return "easy";
    }

    if (r < 0.25) return "hard";
    if (r < 0.65) return "medium";
    return "easy";
}

module.exports = randomBowlerDifficulty;
