const express = require("express");
const router = express.Router();

const IPLTeams = require("../teams");

router.get("/", (req, res) => {
    const teamNames = Object.keys(IPLTeams);
    res.json(teamNames);
});

router.get("/:teamId", (req, res) => {
    const teamId = req.params.teamId.toUpperCase();

    if (!IPLTeams[teamId]) {
        return res.status(404).json({ error: "Team not found" });
    }

    res.json({
        team: teamId,
        squad: IPLTeams[teamId]
    });
})

module.exports=router;