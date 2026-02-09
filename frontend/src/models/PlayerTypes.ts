export type PlayerType =
  | "human"
  | "random_bot"
  | "minimax_bot"
  | "minimax_prune_bot";

export const playerTypes: PlayerType[] = [
  "human",
  "random_bot",
  "minimax_bot",
  "minimax_prune_bot",
];

export const getPlayerLabel = (player: PlayerType): string => {
  switch (player) {
    case "human":
      return "Human";
    case "random_bot":
      return "Random Bot";
    case "minimax_bot":
      return "Minimax Bot";
    case "minimax_prune_bot":
      return "Minimax Prune Bot";
  }
};
