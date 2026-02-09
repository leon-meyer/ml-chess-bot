from pydantic import BaseModel

class StartGameRequest(BaseModel):
    white_player: str
    black_player: str