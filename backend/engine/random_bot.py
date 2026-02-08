import chess
import random

def choose_move(fen: str):
    board = chess.Board(fen)

    legal_moves = list(board.legal_moves)

    if len(legal_moves) == 0:
        return None 
    
    move = random.choice(legal_moves)
    return move.uci()