import chess
from models.piece_values import PIECE_VALUES

def evaluate_board(board: chess.Board, bots_color: chess.Color):
    score = 0

    for piece_type, value in PIECE_VALUES.items():
        white_count = len(board.pieces(piece_type, chess.WHITE))
        black_count = len(board.pieces(piece_type, chess.BLACK))

        if bots_color == chess.BLACK:
            score += black_count * value
            score -= white_count * value
        else:
            score -= black_count * value
            score += white_count * value

    return score