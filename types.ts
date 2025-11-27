export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];

export type MatchStatus = 'waiting' | 'playing' | 'finished';

export interface MatchData {
  id: string;
  board: Board;
  next_turn: Player;
  status: MatchStatus;
  winner: Player | 'DRAW' | null;
  created_at?: string;
}

export interface MoveRequest {
  index: number;
  player: Player;
}

export interface CreateMatchResponse {
  id: string;
}
