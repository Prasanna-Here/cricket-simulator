// src/logic/getBowlerForDifficulty.js

function getBowlerForDifficulty(opponentXI, difficulty, lastBowler) {
    const bowlers = opponentXI.filter(p =>
        p.type === "bowler" || p.type === "allrounder"
    );

    if (!bowlers.length) return null;

    // Sort highest confidence → lowest
    const sorted = [...bowlers].sort((a, b) => b.confidence - a.confidence);

    let selected;

    // Pick by difficulty
    if (difficulty === "hard") selected = sorted[0];
    else if (difficulty === "medium") selected = sorted[Math.floor(sorted.length / 2)] || sorted[0];
    else selected = sorted[sorted.length - 1];

    // Prevent same bowler bowling consecutive overs
    if (lastBowler && selected.name === lastBowler) {
        const alternative = sorted.find(b => b.name !== lastBowler);
        if (alternative) selected = alternative;
    }

    return selected;
}

module.exports = getBowlerForDifficulty;
