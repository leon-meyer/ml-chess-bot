export type PlayerType = "human" | "random_bot" | "minimax_bot";

export const playerTypes: PlayerType[] = ["human", "random_bot", "minimax_bot"];

export const getPlayerLabel = (player: PlayerType): string => {
  switch (player) {
    case "human":
      return "Human";
    case "random_bot":
      return "Random Bot";
    case "minimax_bot":
      return "Minimax Bot";
  }
};
