import { useState } from "react";
import Start from "./pages/Start";
import Game from "./pages/Game";
import type { PlayerConfig } from "./models/PlayerConfig";

type Screen = "start" | "game";

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [gameConfig, setGameConfig] = useState<PlayerConfig>({
    white_player: "human",
    black_player: "minimax_bot",
  });

  const handleGameSelect = (config: PlayerConfig) => {
    setGameConfig(config);
    setScreen("game");
  };

  const handleBackToStart = () => {
    setScreen("start");
  };

  return (
    <>
      {screen === "start" && <Start onGameSelect={handleGameSelect} />}
      {screen === "game" && (
        <Game gameConfig={gameConfig} onBack={handleBackToStart} />
      )}
    </>
  );
}

export default App;
