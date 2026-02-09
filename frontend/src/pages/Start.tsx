import { useState } from "react";
import type { PlayerConfig } from "../models/PlayerConfig";
import {
  playerTypes,
  type PlayerType,
  getPlayerLabel,
} from "../models/PlayerTypes";

interface StartProps {
  onGameSelect: (config: PlayerConfig) => void;
}

function Start({ onGameSelect }: StartProps) {
  const [whitePlayer, setWhitePlayer] = useState<PlayerType>("human");
  const [blackPlayer, setBlackPlayer] = useState<PlayerType>("minimax_bot");

  const handleStartGame = () => {
    onGameSelect({
      white_player: whitePlayer,
      black_player: blackPlayer,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>Configure Game</h1>
      <div
        style={{
          display: "flex",
          gap: "3rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem" }}>White Player</h2>
          <select
            value={whitePlayer}
            onChange={(e) => setWhitePlayer(e.target.value as PlayerType)}
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              borderRadius: "4px",
              border: "2px solid #0056b3",
              cursor: "pointer",
              minWidth: "150px",
            }}
          >
            {playerTypes.map((option) => (
              <option key={option} value={option}>
                {getPlayerLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem" }}>Black Player</h2>
          <select
            value={blackPlayer}
            onChange={(e) => setBlackPlayer(e.target.value as PlayerType)}
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              borderRadius: "4px",
              border: "2px solid #0056b3",
              cursor: "pointer",
              minWidth: "150px",
            }}
          >
            {playerTypes.map((option) => (
              <option key={option} value={option}>
                {getPlayerLabel(option)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >
        <button
          onClick={handleStartGame}
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1.1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            minWidth: "120px",
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default Start;
