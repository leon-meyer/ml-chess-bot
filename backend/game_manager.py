import chess
from models.player_types import PlayerType

class GameManager:
    def __init__(self):
        self.white_player = None
        self.black_player = None
        self.board = chess.Board()

    def start_game(self, white_player: str, black_player: str):
        self.white_player = PlayerType(white_player)
        self.black_player = PlayerType(black_player)
        self.board = chess.Board()

    def get_player_config(self, color: bool) -> PlayerType:
        return self.white_player if color else self.black_player