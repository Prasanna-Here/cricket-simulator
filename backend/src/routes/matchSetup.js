const express = require("express");
const router = express.Router();
const IPLTeams = require("../teams");

router.post("/setup", (req, res) => {
    const { myTeam, opponentTeam } = req.body;

    if (!myTeam || !opponentTeam) {
        return res.status(400).json({ error: "Both myTeam and opponentTeam are required" });
    }

    const myTeamKey = myTeam.toUpperCase();
    const opponentTeamKey = opponentTeam.toUpperCase();

    if (!IPLTeams[myTeamKey]) {
        return res.status(404).json({ error: "Invalid myTeam" });
    }

    if (!IPLTeams[opponentTeamKey]) {
        return res.status(404).json({ error: "Invalid opponentTeam" });
    }

    return res.json({
        message: "Teams selected successfully",
        myTeam: myTeamKey,
        opponentTeam: opponentTeamKey,
        mySquad: IPLTeams[myTeamKey],
        opponentSquad: IPLTeams[opponentTeamKey]
    });
});

module.exports = router;
