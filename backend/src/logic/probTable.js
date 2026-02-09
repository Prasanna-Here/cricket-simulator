// src/logic/probTable.js

const baseTable = {
    power: {
        attack: [
            { outcome: "six", prob: 0.30 },
            { outcome: "four", prob: 0.25 },
            { outcome: "two", prob: 0.10 },
            { outcome: "one", prob: 0.05 },
            { outcome: "dot", prob: 0.10 },
            { outcome: "wicket", prob: 0.20 },
        ],
        rotate: [
            { outcome: "one", prob: 0.40 },
            { outcome: "two", prob: 0.20 },
            { outcome: "dot", prob: 0.20 },
            { outcome: "wicket", prob: 0.20 },
        ],
        defend: [
            { outcome: "dot", prob: 0.60 },
            { outcome: "one", prob: 0.25 },
            { outcome: "wicket", prob: 0.15 },
        ],
    },

    anchor: {
        attack: [
            { outcome: "six", prob: 0.10 },
            { outcome: "four", prob: 0.20 },
            { outcome: "two", prob: 0.30 },
            { outcome: "one", prob: 0.20 },
            { outcome: "dot", prob: 0.10 },
            { outcome: "wicket", prob: 0.10 },
        ],
        rotate: [
            { outcome: "one", prob: 0.50 },
            { outcome: "two", prob: 0.20 },
            { outcome: "dot", prob: 0.15 },
            { outcome: "wicket", prob: 0.15 },
        ],
        defend: [
            { outcome: "dot", prob: 0.60 },
            { outcome: "one", prob: 0.30 },
            { outcome: "wicket", prob: 0.10 },
        ],
    },

    tail: {
        attack: [
            { outcome: "six", prob: 0.05 },
            { outcome: "four", prob: 0.10 },
            { outcome: "two", prob: 0.20 },
            { outcome: "one", prob: 0.20 },
            { outcome: "dot", prob: 0.10 },
            { outcome: "wicket", prob: 0.35 },
        ],
        rotate: [
            { outcome: "one", prob: 0.40 },
            { outcome: "two", prob: 0.20 },
            { outcome: "dot", prob: 0.20 },
            { outcome: "wicket", prob: 0.20 },
        ],
        defend: [
            { outcome: "dot", prob: 0.70 },
            { outcome: "one", prob: 0.15 },
            { outcome: "wicket", prob: 0.15 },
        ],
    },
};

// Keepers behave like anchors
baseTable.keeper = baseTable.power;

// All-rounders behave like anchors (can tune later)
baseTable.allrounder = baseTable.anchor;

module.exports = baseTable;
