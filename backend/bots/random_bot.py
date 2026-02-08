import chess
import random

def choose_move(board: chess.Board):
    legal_moves = list(board.legal_moves)

    if len(legal_moves) == 0:
        return None 
    
    move = random.choice(legal_moves)

    return move