const express = require("express");
const router = express.Router();
const IPLTeams = require("../teams");

router.post("/", (req, res) => {
    const { teamId, selectedPlayers } = req.body;

    if (!teamId || !selectedPlayers) {
        return res.status(400).json({ error: "teamId and selectedPlayers required" });
    }

    const teamKey = teamId.toUpperCase();

    if (!IPLTeams[teamKey]) {
        return res.status(404).json({ error: "Invalid teamId" });
    }

    const squad = IPLTeams[teamKey];

    if (selectedPlayers.length !== 11) {
        return res.status(400).json({ error: "You must select exactly 11 players" });
    }

    // Validate selected players exist in squad
    const isValid = selectedPlayers.every(p =>
        squad.some(s => s.name === p.name)
    );

    if (!isValid) {
        return res.status(400).json({ error: "Invalid players selected" });
    }

    // Success response
    return res.json({
        message: "Playing XI selected successfully",
        team: teamKey,
        playingXI: selectedPlayers
    });
});

module.exports = router;
