import { useMemo, useState } from "react";
import { useMatch } from "../context/MatchContext";
import { selectOpponentXI } from "../api/matchApi";

const TYPE_ORDER = ["bowler", "allrounder", "keeper", "anchor", "power"];

function formatTypeId(type) {
  const t = (type || "").toLowerCase().trim();
  if (!t) return "unknown";
  return t;
}

function formatTypeLabel(type) {
  const t = formatTypeId(type);
  if (t === "allrounder") return "All-rounder";
  if (t === "bowler") return "Bowler";
  if (t === "keeper") return "Keeper";
  if (t === "anchor") return "Anchor";
  if (t === "power") return "Power";
  if (t === "unknown") return "Unknown";
  return t;
}

function badgeClass(type) {
  const t = formatTypeId(type);
  if (t === "bowler") return "badge badgeBowler";
  if (t === "keeper") return "badge badgeKeeper";
  if (t === "allrounder") return "badge badgeAllrounder";
  if (t === "anchor") return "badge badgeAnchor";
  if (t === "power") return "badge badgePower";
  return "badge";
}

function PlayingXI() {
  const {
    mySquad,
    opponentTeam,
    setMyPlayingXI,
    setOpponentXI,
    setScreen,
  } = useMatch();

  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  /* =========================
     TOGGLE PLAYER (SAFE)
  ========================= */
  const togglePlayer = (player) => {
    setSelected((prev) => {
      const exists = prev.some((p) => p.name === player.name);

      if (exists) {
        return prev.filter((p) => p.name !== player.name);
      }

      if (prev.length === 11) {
        alert("You can select only 11 players");
        return prev;
      }

      return [...prev, player];
    });
  };

  /* =========================
     CONTINUE
  ========================= */
  const handleContinue = async () => {
    if (selected.length !== 11) {
      alert("Select exactly 11 players");
      return;
    }

    // ✅ FRONTEND BOWLING RULE
    const bowlers = selected.filter(
      p => p.type?.toLowerCase() === "bowler"
    );

    if (bowlers.length < 3) {
      alert("You must select at least 3 bowlers");
      return;
    }

    setLoading(true);

    try {
      // Save my XI
      setMyPlayingXI(selected);

      // Get opponent best XI
      const res = await selectOpponentXI(opponentTeam);
      setOpponentXI(res.data.playingXI);

      setScreen("scenario");
    } catch (err) {
      console.error("Playing XI error:", err);
      alert(
        err.response?.data?.error ||
        "Failed to prepare match"
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = selected.length;
  const selectedBowlerCount = selected.filter(
    (p) => (p.type || "").toLowerCase() === "bowler"
  ).length;

  const filteredSquad = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = Array.isArray(mySquad) ? mySquad : [];

    const matches = base.filter((p) => {
      const nameOk = !q || (p.name || "").toLowerCase().includes(q);
      const t = formatTypeId(p.type);
      const typeOk = typeFilter === "all" || t === typeFilter;
      return nameOk && typeOk;
    });

    // Stable-ish ordering: selected first, then by type order, then name
    const isSelected = (p) => selected.some((s) => s.name === p.name);
    const typeRank = (t) => {
      const idx = TYPE_ORDER.indexOf(formatTypeId(t));
      return idx === -1 ? 999 : idx;
    };

    return matches.slice().sort((a, b) => {
      const sa = isSelected(a) ? 0 : 1;
      const sb = isSelected(b) ? 0 : 1;
      if (sa !== sb) return sa - sb;

      const ta = typeRank(a.type);
      const tb = typeRank(b.type);
      if (ta !== tb) return ta - tb;

      return (a.name || "").localeCompare(b.name || "");
    });
  }, [mySquad, query, typeFilter, selected]);

  /* =========================
     UI
  ========================= */
  return (
    <div className="card">
      <div className="cardInner">
        <div className="rowWrap">
          <div>
            <h2 className="sectionTitle">Select your Playing XI</h2>
            <p className="sectionSub">
              Click a player card to select/deselect. You need exactly 11 players and at least 3 bowlers.
            </p>
          </div>
          <span className="spacer" />
          <span className="pill pillStrong">
            {selectedCount} / 11 selected • Bowlers: {selectedBowlerCount}
          </span>
        </div>

        <div className="grid2" style={{ marginTop: 10 }}>
          <div className="field">
            <div className="label">Search player</div>
            <input
              className="input"
              placeholder="Type a name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="field">
            <div className="label">Quick filter</div>
            <div className="rowWrap">
              {[
                { id: "all", label: "All" },
                { id: "bowler", label: "Bowler" },
                { id: "allrounder", label: "All-rounder" },
                { id: "keeper", label: "Keeper" },
                { id: "anchor", label: "Anchor" },
                { id: "power", label: "Power" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="btn btnChip"
                  aria-pressed={typeFilter === t.id}
                  onClick={() => setTypeFilter(t.id)}
                  disabled={loading}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="helpText">
          Keyboard: focus a card and press <span className="kbdHint">Enter</span> / <span className="kbdHint">Space</span>.
        </div>

        <div className="playerGrid">
          {filteredSquad.map((player) => {
            const isPicked = selected.some((p) => p.name === player.name);
            return (
              <div
                key={player.name}
                className={`playerCard ${isPicked ? "playerCardSelected" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => togglePlayer(player)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    togglePlayer(player);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={isPicked}
                  onChange={() => togglePlayer(player)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select ${player.name}`}
                />

                <div className="playerMain">
                  <p className="playerName">{player.name}</p>
                  <div className="playerMeta">
                    <span className={badgeClass(player.type)}>
                      {formatTypeLabel(player.type)}
                    </span>
                    {typeof player.confidence === "number" && (
                      <span className="pill">
                        Conf: {Math.round(player.confidence * 100)}%
                      </span>
                    )}
                    {isPicked && <span className="pill pillStrong">Selected</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rowWrap" style={{ marginTop: 16 }}>
          <span className="pill">
            Opponent XI will be auto-picked after Continue
          </span>
          <span className="spacer" />
          <button className="btn btnPrimary" onClick={handleContinue} disabled={loading}>
            {loading ? "Preparing Match..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayingXI;
