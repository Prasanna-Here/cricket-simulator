// src/logic/selectBestXI.js

const IPLTeams = require("../teams");

function selectBestXI(teamId) {
    const squad = IPLTeams[teamId.toUpperCase()];
    if (!squad) return [];

    const sorted = [...squad].sort((a, b) => b.confidence - a.confidence);

    const openers = sorted.filter(p =>
        p.type === "anchor" || p.type === "power"
    ).slice(0, 2);

    const middle = sorted.filter(p =>
        (p.type === "anchor" || p.type === "power" || p.type === "keeper")
        && !openers.includes(p)
    ).slice(0, 3);

    const allRounders = sorted.filter(p =>
        p.type === "allrounder"
    ).slice(0, 2);

    const bowlersAll = sorted.filter(p => p.type === "bowler");
    const bowlers = bowlersAll.length >= 4 ? bowlersAll.slice(0, 4) : bowlersAll;

    const XI = [...openers, ...middle, ...allRounders, ...bowlers];

    return XI.slice(0, 11);
}

module.exports = { selectBestXI };
