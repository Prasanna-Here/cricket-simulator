// src/logic/commentary.js

function generateCommentary(outcome, batsman, bowler) {
    switch (outcome) {
        case "six": return `${batsman.name} launches it! SIX off ${bowler}!`;
        case "four": return `${batsman.name} cracks a boundary off ${bowler}!`;
        case "two": return `${batsman.name} runs hard for two.`;
        case "one": return `${batsman.name} takes a single.`;
        case "dot": return `${bowler} bowls a dot ball!`;
        case "wicket": return `OUT! ${batsman.name} falls! ${bowler} gets the wicket!`;
        case "you_win": return "🏆 You chased the target!";
        case "you_lose": return "💔 You lost the match.";
        default: return "";
    }
}

module.exports = generateCommentary;
