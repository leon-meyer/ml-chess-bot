import chess
from evaluate_board import evaluate_board

def choose_move(board: chess.Board):
    legal_moves = list(board.legal_moves)
    if len(legal_moves) == 0:
        return None
    
    best_score = -1000
    best_move: chess.Move = None
    bots_color = board.turn

    for move in legal_moves:
        board.push(move)
        score = minimax(board, 3, False, bots_color)
        if(score > best_score):
            best_score = score
            best_move = move
        board.pop()
    return best_move

def minimax(board: chess.Board, depth: int, is_maximizing: bool, bots_color: chess.Color):
    legal_moves = list(board.legal_moves)
    if depth == 0 or len(legal_moves) == 0:
        return evaluate_board(board, bots_color)
    
    if is_maximizing:
        max_evaluation = -1000
        for move in legal_moves:
            board.push(move)
            evaluation = minimax(board, depth - 1, False, bots_color)
            board.pop()
            max_evaluation = max(max_evaluation, evaluation)
        return max_evaluation
    else:
        min_evaluation = 1000
        for move in legal_moves:
            board.push(move)
            evaluation = minimax(board, depth - 1, True, bots_color)
            board.pop()
            min_evaluation = min(min_evaluation, evaluation)
        return min_evaluation