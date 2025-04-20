export interface Player {
    id: number;
    name: string;
    rank: number;
    image?: string;
  }

  export interface UIPlayer extends Player {
    color: string;
    width: number;
    selected: boolean;
  }