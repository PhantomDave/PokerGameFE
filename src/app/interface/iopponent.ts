import { NextMove, PlayerRole } from '../enum/enums';

export interface IOpponent {
  Name: string;
  Chips: number;
  Bet: number;
  Move: NextMove;
  CurrentRole: PlayerRole;
  HandValue: number;
}
