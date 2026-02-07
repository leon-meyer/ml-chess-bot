from fastapi import FastAPI
from pydantic import BaseModel
from app.engine.random_bot import choose_move
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class BoardRequest(BaseModel):
    fen: str

@app.post("/move")

def get_move(data: BoardRequest):
    move = choose_move(data.fen)
    if move is None:
        return {"move": None}
    return {"move": move}