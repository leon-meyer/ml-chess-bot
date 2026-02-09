from pydantic import BaseModel

class BotMoveRequest(BaseModel):
    fen: str