import chess

PIECE_VALUES = {
    chess.PAWN: 1,
    chess.KNIGHT: 3,
    chess.BISHOP: 3,
    chess.ROOK: 5,
    chess.QUEEN: 9,
    chess.KING: 100
}

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