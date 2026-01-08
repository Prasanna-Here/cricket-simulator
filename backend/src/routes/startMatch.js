const express = require("express");
const router = express.Router();

const { initializeMatchState } = require("../logic/matchInit");

router.post("/", (req, res) => {
    const { runsNeeded, ballsLeft, wicketsDown, selectedPlayers, opponentXI } = req.body;

    if (!selectedPlayers || !Array.isArray(selectedPlayers)) {
        return res.status(400).json({ error: "selectedPlayers array missing" });
    }

    if (!opponentXI || !Array.isArray(opponentXI)) {
        return res.status(400).json({ error: "opponentXI array missing" });
    }

    const preState = {
        runsNeeded,
        ballsLeft,
        wicketsDown
    };

    const result = initializeMatchState(preState, selectedPlayers, opponentXI);

    return res.json(result);
});

module.exports = router;
