import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import {
  Chessboard,
  type PieceDropHandlerArgs,
  type ChessboardOptions,
} from "react-chessboard";
import { Chess } from "chess.js";
import { type BotMoveResponse } from "./models/BotMoveResponse";

function App() {
  const [fen, setFen] = useState<string>(() => new Chess().fen());
  const [mode, setMode] = useState<"human_vs_bot" | "bot_vs_bot">(
    "human_vs_bot",
  );

  const BOT_MOVE_URL =
    import.meta.env.VITE_BOT_MOVE_URL ?? "http://127.0.0.1:8000/move";

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

  const fenRef = useRef(fen);
  useEffect(() => {
    fenRef.current = fen;
  }, [fen]);

  useEffect(() => {
    if (mode !== "bot_vs_bot") return;

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
  }, [mode, postBotMove]);

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      if (!targetSquare || mode === "bot_vs_bot") return false;

      const chess = new Chess(fen);
      try {
        const move = chess.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });
        if (!move) return false;
        setFen(chess.fen());
        void postBotMove(chess.fen());
      } catch {
        return false;
      }

      return true;
    },
    [fen, postBotMove, mode],
  );

  const chessboardOptions: ChessboardOptions = useMemo(
    () => ({
      position: fen,
      onPieceDrop,
      boardStyle: { width: 400 },
      allowDragging: mode === "human_vs_bot",
      showNotation: true,
    }),
    [fen, onPieceDrop, mode],
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
      <div style={{ marginBottom: "10px" }}>
        <label>
          Mode:{" "}
          <select
            value={mode}
            onChange={(e) =>
              setMode(e.target.value as "human_vs_bot" | "bot_vs_bot")
            }
          >
            <option value="human_vs_bot">Human vs Bot</option>
            <option value="bot_vs_bot">Bot vs Bot</option>
          </select>
        </label>
      </div>

      <Chessboard options={chessboardOptions} />
    </div>
  );
}

export default App;
