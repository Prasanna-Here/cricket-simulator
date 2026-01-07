const IPLTeams = require("../teams");

// Base score according to batting role
const baseTypeScore = {
    power: 90,
    anchor: 75,
    tail: 50
};

// Calculate player strength score using type + confidence
function calculateScore(player) {
    const typeScore = baseTypeScore[player.type] || 50;
    const confidenceScore = player.confidence || 0.5;

    // Weighted formula
    return (typeScore * 0.7) + (confidenceScore * 0.3);
}

function getBestXI(teamId) {
    const teamKey = teamId.toUpperCase();
    const squad = IPLTeams[teamKey];

    if (!squad) return [];

    // Assign score to every player
    const rankedPlayers = squad
        .map(player => ({
            ...player,
            score: calculateScore(player)
        }))
        .sort((a, b) => b.score - a.score);

    // Pick top 11
    return rankedPlayers.slice(0, 11);
}

module.exports = { getBestXI };
