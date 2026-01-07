const express = require("express");
const router = express.Router();
const { getBestXI } = require("../logic/selectBestXI");

router.post("/", (req, res) => {
    const { opponentTeam } = req.body;

    if (!opponentTeam) {
        return res.status(400).json({ error: "Opponent team required" });
    }

    const bestXI = getBestXI(opponentTeam);

    if (bestXI.length === 0) {
        return res.status(404).json({ error: "Invalid opponent team" });
    }

    res.json({
        opponentTeam,
        playingXI: bestXI
    });
});

module.exports = router;
