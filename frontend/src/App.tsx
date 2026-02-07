import { useCallback, useMemo, useState } from "react";
import {
  Chessboard,
  type PieceDropHandlerArgs,
  type ChessboardOptions,
} from "react-chessboard";
import { Chess } from "chess.js";
import { type BotMoveResponse } from "./models/BotMoveResponse";

function App() {
  const [fen, setFen] = useState<string>(() => new Chess().fen());

  const BOT_MOVE_URL =
    import.meta.env.VITE_BOT_MOVE_URL ?? "http://127.0.0.1:8000/move";

  const postBotMove = useCallback(
    async (currentFen: string) => {
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
        } else {
          alert("Game over!");
        }
      } catch (err) {
        console.error("Bot Error:", err);
      }
    },
    [BOT_MOVE_URL],
  );

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      if (!targetSquare) return false;

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
    [fen, postBotMove],
  );

  const chessboardOptions: ChessboardOptions = useMemo(
    () => ({
      position: fen,
      onPieceDrop,
      boardStyle: { width: 400 },
      allowDragging: true,
      showNotation: true,
    }),
    [fen, onPieceDrop],
  );

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <Chessboard options={chessboardOptions} />
    </div>
  );
}

export default App;
