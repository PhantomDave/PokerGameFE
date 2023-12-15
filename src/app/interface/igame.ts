import { ICard } from './icard';
import { IOpponent } from './iopponent';
import { IProfile } from './iprofile';

export interface IGame {
  Deck: { _cards: ICard[] };
  Pot: number;
  Player: IProfile;
  Opponents: IOpponent[];
  CurrentStage: number;
  Blinds: number[];
  TableCards: ICard[];
}
