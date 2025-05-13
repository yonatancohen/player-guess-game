export interface Player {
  id: number;
  name: string;
  // image?: string;
}

export interface GamePlayer extends Player {
  rank: number;
}
export interface UIGamePlayer extends GamePlayer {
  color: string;
  width: number;
  selected: boolean;
}

export interface Game {
  id: number;
  game_number: number;
  max_game_number: number;
  max_rank: number;
  hint: string;
  players: Array<Player>;
}

export interface League {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface FullPlayer {
  id: number;
  first_name_he: string;
  last_name_he: string;
  display_name_he: string;
  shirt_number: number;
  nationality_id: number;
}

export interface AdminGame {
  id: number;
  player_name: string;
  player_id: number;
  activate_at: string;
  hint: string
}
export interface AdminGameResponse {
  game: AdminGame;
  leagues: Array<League>
}

