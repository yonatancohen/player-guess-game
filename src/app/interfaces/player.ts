export interface Player {
  id: number;
  name: string;
  image?: string;
}

export interface GamePlayer extends Player {
  rank: number;
}
export interface UIGamePlayer extends GamePlayer {
  color: string;
  width: number;
  selected: boolean;
}

