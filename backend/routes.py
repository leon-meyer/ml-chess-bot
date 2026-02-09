from fastapi import APIRouter
from pydantic import BaseModel
from bots.minimax_bot import choose_move as minimax_choose_move
from bots.minimax_prune_bot import choose_move as minimax_prune_choose_move
from bots.random_bot import choose_move as random_choose_move
from game_manager import GameManager
from models.player_types import PlayerType
import chess
import logging
from requests.start_game_request import StartGameRequest
from requests.bot_move_request import BotMoveRequest

logger = logging.getLogger("ml_chess_bot")
router = APIRouter()

game_manager = GameManager()

@router.post("/start-game")
def start_game(request: StartGameRequest):
    logger.info(f"Starting new game: white={request.white_player}, black={request.black_player}")
    game_manager.start_game(request.white_player, request.black_player)
    
    return {
        "success": True,
        "fen": game_manager.board.fen(),
        "white_player": request.white_player,
        "black_player": request.black_player,
    }

@router.post("/move")
def get_move(request: BotMoveRequest):
    logger.info(f"Received /move request, fen={request.fen}")
    try:
        board = chess.Board(request.fen)
    except Exception as e:
        logger.exception("Invalid FEN in request")
        return {"move": None}

    current_player_config = game_manager.get_player_config(board.turn)
    
    if current_player_config == PlayerType.HUMAN:
        logger.info(f"Current player is human, no move generated")
        return {"move": None}

    if current_player_config == PlayerType.MINIMAX_BOT:
        move = minimax_choose_move(board)
    if current_player_config == PlayerType.MINIMAX_PRUNE_BOT:
        move = minimax_prune_choose_move(board)
    elif current_player_config == PlayerType.RANDOM_BOT:
        move = random_choose_move(board)
    else:
        logger.warning(f"Unknown player config: {current_player_config}, defaulting to random")
        move = random_choose_move(board)

    if move:
        uci = move.uci()
        logger.info(f"Bot selected move: {uci}")
        return {"move": uci}

    logger.info("No move returned by bot (game over or no legal moves)")
    return {"move": None}