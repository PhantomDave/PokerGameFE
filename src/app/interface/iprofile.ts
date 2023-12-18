import { NextMove } from '../enum/enums';
import { ICard } from './icard';

export interface IProfile {
  Name: string;
  Email: string;
  Chips: number;
  ChipsWon: number;
  PlayerKnockedOut: number;
  LoggedIn: boolean;
  Token: string;
  Hand: ICard[];
  CurrentRole: number;
  Move: NextMove;
}
