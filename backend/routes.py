from fastapi import APIRouter
from pydantic import BaseModel
from bots.minimax_bot import choose_move as minimax_choose_move
from bots.random_bot import choose_move as random_choose_move
import chess
import logging

logger = logging.getLogger("ml_chess_bot")
router = APIRouter()


class BotMoveRequest(BaseModel):
    fen: str


@router.post("/move")
def get_move(request: BotMoveRequest):
    logger.info(f"Received /move request, fen={request.fen}")
    try:
        board = chess.Board(request.fen)
    except Exception as e:
        logger.exception("Invalid FEN in request")
        return {"move": None}

    if board.turn == chess.WHITE:
        move = random_choose_move(board)
    else:
        move = minimax_choose_move(board)

    if move:
        uci = move.uci()
        logger.info(f"Bot selected move: {uci}")
        return {"move": uci}

    logger.info("No move returned by bot (game over or no legal moves)")
    return {"move": None}