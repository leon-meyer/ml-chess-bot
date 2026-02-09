import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import {
  Chessboard,
  type PieceDropHandlerArgs,
  type ChessboardOptions,
} from "react-chessboard";
import { Chess } from "chess.js";
import { type BotMoveResponse } from "../models/BotMoveResponse";
import type { PlayerConfig } from "../models/PlayerConfig";
import { getPlayerLabel } from "../models/PlayerTypes";

interface GameProps {
  gameConfig: PlayerConfig;
  onBack: () => void;
}

function Game({ gameConfig, onBack }: GameProps) {
  const [fen, setFen] = useState<string>(() => new Chess().fen());
  const [gameStarted, setGameStarted] = useState(false);

  const BASE_URL = "http://127.0.0.1:8000";
  const BOT_MOVE_URL = `${BASE_URL}/move`;
  const START_GAME_URL = `${BASE_URL}/start-game`;

  const startGameSession = useCallback(async () => {
    try {
      const res = await fetch(START_GAME_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gameConfig),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const data = await res.json();
      if (data.success) {
        setFen(data.fen);
        setGameStarted(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error starting game:", err);
      return false;
    }
  }, [gameConfig, START_GAME_URL]);

  const postBotMove = useCallback(
    async (currentFen: string): Promise<boolean> => {
      try {
        const res = await fetch(BOT_MOVE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fen: currentFen }),
        });

        if (!res.ok) throw new Error(`Bot responded ${res.status}`);

        const data: BotMoveResponse = await res.json();
        if (data.move) {
          const chess = new Chess(currentFen);
          chess.move(data.move);
          setFen(chess.fen());
          return true;
        } else {
          alert("Game over!");
          return false;
        }
      } catch (err) {
        console.error("Bot Error:", err);
        return false;
      }
    },
    [BOT_MOVE_URL],
  );

  useEffect(() => {
    void startGameSession();
  }, [startGameSession]);

  const fenRef = useRef(fen);
  useEffect(() => {
    fenRef.current = fen;
  }, [fen]);

  useEffect(() => {
    if (!gameStarted) return;

    const chess = new Chess(fen);
    const currentPlayerColor = chess.turn() === "w" ? "white" : "black";
    const currentPlayerType =
      currentPlayerColor === "white"
        ? gameConfig.white_player
        : gameConfig.black_player;

    if (currentPlayerType !== "human") {
      void postBotMove(fen);
    }
  }, [gameStarted, gameConfig, postBotMove, fen]);

  useEffect(() => {
    const isBotVsBot =
      gameConfig.white_player !== "human" &&
      gameConfig.black_player !== "human";

    if (!isBotVsBot || !gameStarted) return;

    let cancelled = false;

    const loop = async () => {
      while (!cancelled) {
        const made = await postBotMove(fenRef.current);
        if (!made) break;
        await new Promise((r) => setTimeout(r, 200));
      }
    };

    void loop();

    return () => {
      cancelled = true;
    };
  }, [gameConfig, gameStarted, postBotMove]);

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      if (!targetSquare) return false;

      const chess = new Chess(fen);
      const currentPlayerColor = chess.turn() === "w" ? "white" : "black";
      const currentPlayerType =
        currentPlayerColor === "white"
          ? gameConfig.white_player
          : gameConfig.black_player;

      if (currentPlayerType === "human") {
        try {
          const move = chess.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
          });
          if (!move) return false;
          setFen(chess.fen());
          const nextPlayerColor = chess.turn() === "w" ? "white" : "black";
          const nextPlayerType =
            nextPlayerColor === "white"
              ? gameConfig.white_player
              : gameConfig.black_player;
          if (nextPlayerType !== "human") {
            void postBotMove(chess.fen());
          }
        } catch {
          return false;
        }
        return true;
      }

      return false;
    },
    [fen, postBotMove, gameConfig],
  );

  const isHumanTurn =
    (fen && new Chess(fen).turn() === "w"
      ? gameConfig.white_player === "human"
      : gameConfig.black_player === "human") || false;

  const chessboardOptions: ChessboardOptions = useMemo(
    () => ({
      position: fen,
      onPieceDrop,
      boardStyle: { width: 400 },
      allowDragging: isHumanTurn,
      showNotation: true,
    }),
    [fen, onPieceDrop, isHumanTurn],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <h1>
        {getPlayerLabel(gameConfig.white_player)} vs{" "}
        {getPlayerLabel(gameConfig.black_player)}
      </h1>
      <div>Black:</div>
      <Chessboard options={chessboardOptions} />
      <div>White:</div>
      <button
        onClick={onBack}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Back to Start
      </button>
    </div>
  );
}

export default Game;
