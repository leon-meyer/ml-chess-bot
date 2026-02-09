from enum import Enum

class PlayerType(Enum):
    HUMAN = "human"
    RANDOM_BOT = "random_bot"
    MINIMAX_BOT = "minimax_bot"
    MINIMAX_PRUNE_BOT = "minimax_prune_bot"