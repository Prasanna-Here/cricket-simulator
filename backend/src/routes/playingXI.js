const express = require("express");
const router = express.Router();
const IPLTeams = require("../teams");

router.post("/", (req, res) => {

    const { team, selectedXI } = req.body;

    if (!team || !selectedXI) {
        return res.status(400).json({ error: "team and selectedXI required" });
    }

    const teamKey = team.toUpperCase();

    if (!IPLTeams[teamKey]) {
        return res.status(404).json({ error: "Invalid team" });
    }

    const squad = IPLTeams[teamKey];

    if (!Array.isArray(selectedXI) || selectedXI.length !== 11) {
        return res.status(400).json({ error: "You must select exactly 11 players" });
    }

    // Validate selected players exist in squad
    const isValid = selectedXI.every(p =>
        squad.some(s => s.name === p.name)
    );

    if (!isValid) {
        return res.status(400).json({ error: "Invalid players selected" });
    }

    /* =========================
       AT LEAST 3 BOWLERS RULE
    ========================= */

    const bowlingOptions = selectedXI.filter(p => {
        console.log(p.name, p.type);
        return p.type?.toLowerCase() === "bowler";
    });


    if (bowlingOptions.length < 3) {
        return res.status(400).json({
            error: "At least 3 bowlers are required in Playing XI"
        });
    }

    return res.json({
        message: "Playing XI selected successfully",
        team: teamKey,
        playingXI: selectedXI
    });
});

module.exports = router;
