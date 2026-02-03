import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

/* =========================
   TEAM & MATCH SETUP
========================= */

export const getTeams = () =>
  API.get("/teams");

export const getTeamSquad = (teamId) =>
  API.get(`/teams/${teamId}`);

export const setupMatch = (myTeam, opponentTeam) =>
  API.post("/match/setup", {
    myTeam,
    opponentTeam,
  });

export const selectOpponentXI = (opponentTeam) =>
  API.post("/opponentXI", {
    opponentTeam,
  });

export const startMatch = (payload) =>
  API.post("/startMatch", payload);

/* =========================
   GAMEPLAY
========================= */

export const simulateBall = (state, choice) =>
  API.post("/simulate", {
    state,
    choice,
  });
