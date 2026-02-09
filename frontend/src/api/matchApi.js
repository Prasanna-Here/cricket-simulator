import axios from "axios";

/**
 * Central Axios instance
 * Easy to change baseURL later (prod / env)
 */
const API = axios.create({
  baseURL: "http://localhost:5000",
});

/* =========================
   TEAM & MATCH SETUP
========================= */

/** Get all IPL team names */
export const getTeams = () => API.get("/teams");

/** Get full squad of a team */
export const getTeamSquad = (teamId) =>
  API.get(`/teams/${teamId}`);

/** Select my team & opponent team */
export const setupMatch = (myTeam, opponentTeam) =>
  API.post("/match/setup", {
    myTeam,
    opponentTeam,
  });

/** Auto-select best XI for opponent */
export const selectOpponentXI = (opponentTeam) =>
  API.post("/opponentXI", {
    opponentTeam,
  });

/** Initialize match scenario (runs, balls, wickets) */
export const startMatch = (payload) =>
  API.post("/startMatch", payload);

/* =========================
   GAMEPLAY
========================= */

/** Simulate a single ball */
export const simulateBall = (state, choice) =>
  API.post("/simulate", {
    state,
    choice,
  });

export default API;
