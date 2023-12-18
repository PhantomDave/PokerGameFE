import { Component, Input, OnInit } from '@angular/core';
import { SetupComponent } from '../setup/setup.component';
import { IGame } from '../../interface/igame';
import { IProfile } from '../../interface/iprofile';
import { ProfileService } from '../../services/profile.service';
import { NextMove, Suits } from '../../enum/enums';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameApiService } from '../../services/gameapi.service';
import { ICard } from '../../interface/icard';
import { Router } from '@angular/router';
import { IWinner } from '../../interface/iwinner';
import { HttpStatusCode } from '@angular/common/http';
import { IOpponent } from '../../interface/iopponent';

@Component({
  selector: 'app-play',
  standalone: true,
  templateUrl: './play.component.html',
  styleUrl: './play.component.css',
  imports: [SetupComponent, FormsModule, CommonModule],
})
export class PlayComponent implements OnInit {
  @Input() game!: IGame;
  raiseAmount: number = 0;
  turnOf: IProfile | IOpponent | undefined;
  currentMessage: any = null;
  turnStart: IProfile | IOpponent | undefined;
  inactivePlayers: number = 0;

  constructor(
    private gameApi: GameApiService,
    private router: Router,
  ) {}

  Suits: Map<number, string> = new Map();

  ngOnInit(): void {
    this.Suits.set(1, 'Diamonds');
    this.Suits.set(2, 'Spades');
    this.Suits.set(3, 'Hearts');
    this.Suits.set(4, 'Clubs');

    this.getTurnOfNextPlayer(true);
  }

  getCardSrc(card: ICard) {
    return `../assets/cards/card${this.Suits.get(card.Suit)}${card.Value}.png`;
  }

  sitUp() {
    this.gameApi.sitUp().subscribe({
      next: () => {
        this.router.navigateByUrl('/game/setup');
      },
      error: () => {
        this.currentMessage = {
          message:
            "There was an error saving the game, you can still situp but the game won't be saved",
          action: 'situp',
          classes: 'center alert alert-warning',
          buttonOk: 'Confirm Situp',
          buttonOkClasses: 'm-1 btn btn-success',
          buttonNotOk: 'Stay in the game',
          buttonNotOkClasses: 'm-1 btn btn-success',
        };
      },
    });
  }

  getGameStage(stage: number): string {
    let stageName = new Map()
      .set(0, 'Compulsory Bets')
      .set(1, 'Pre-Flop')
      .set(2, 'Flop')
      .set(3, 'Turn')
      .set(4, 'River')
      .set(5, 'Showdown');

    return stageName.get(stage);
  }

  getAiMoveName(i: number) {
    let MoveNames = new Map()
      .set(1, 'Check')
      .set(2, 'Bet')
      .set(3, 'Fold')
      .set(4, 'All In');
    return MoveNames.get(i);
  }

  move(move: number, bet?: number) {
    if (this.turnOf != this.game.Player) return;

    if (this.currentMessage != null) this.currentMessage = null;

    if (bet === undefined) bet = 0;
    if (move == 1 && bet == 0) {
      if (this.CanPlayerCheck() != 'Check') {
        move = 2;
        bet = this.getMinRaise(this.game.Pot);
      }
    }

    this.gameApi.makeMove(move, bet).subscribe({
      error: (e) => console.error(e),
      complete: () => {
        this.game.Player.Move = move;
        this.getTurnOfNextPlayer();
      },
    });
  }

  isPlayerTurn() {
    if (this.game.Player.Move != 0) return false;
    return this.turnOf == this.game.Player;
  }

  CanPlayerCheck(): string {
    for (let i = 0; i < this.game.Opponents.length; i++) {
      const p = this.game.Opponents[i];
      if (this.game.Player.Chips <= 0) break;
      if (p.Move == 2 || p.Move == 4)
        return `Call ${this.getMinRaise(this.game.Pot)}`;
    }
    return 'Check';
  }

  getMinRaise(pot: number) {
    if (pot == 0) return 10;
    return Math.round((pot * 10) / 100);
  }

  getMove(id: number): NextMove | undefined {
    return this.game.Opponents[id].Move || undefined;
  }

  clearPopup() {
    this.currentMessage = null;
    if (this.game.Opponents.length == 0) {
      this.handleGameEnd();
    }
  }

  clickResponse(val: boolean) {
    switch (this.currentMessage.action) {
      case 'situp': {
        if (val) {
          this.router.navigateByUrl('/dashboard');
          this.currentMessage = null;
        }
        this.currentMessage = null;
        break;
      }
      case 'end': {
        if (val) {
          this.gameApi.saveToLeaderboard().subscribe({
            next: () => {},
            error: (e) => {
              console.error(e);
            },
          });
          this.router.navigateByUrl('/dashboard');
          this.currentMessage = null;
        }
        break;
      }
      case 'endlost': {
        this.router.navigateByUrl('/dashboard');
        this.currentMessage = null;
        break;
      }
    }
  }

  handleGameEnd(lost?: boolean) {
    if (!lost) {
      let p: IProfile | IOpponent | undefined;

      if (this.game.Player != undefined) p = this.game.Player;
      else p = this.game.Opponents[0];

      this.currentMessage = {
        message: `The Game was won by: ${p.Name} with a total chips ${p.Chips}`,
        action: 'end',
        classes: 'center alert alert-success',
        buttonOk: 'Add To Leaderboard',
        buttonOkClasses: 'm-1 btn btn-success',
        buttonNotOk: 'Go back without saving',
        buttonNotOkClasses: 'm-1 btn btn-success',
      };
    } else {
      this.currentMessage = {
        message: `The Game was lost`,
        action: 'endlost',
        classes: 'center alert alert-success',
        buttonNotOk: 'Go back',
        buttonNotOkClasses: 'm-1 btn btn-success',
      };
    }
  }

  getTurnOfNextPlayer(first?: boolean) {
    if (this.turnOf == this.game.Player) this.turnOf = this.game.Opponents[0];
    else {
      const idx: number = this.game.Opponents.findIndex(
        (o: IOpponent): boolean => o.Name == this.turnOf?.Name,
      );

      if (idx == this.game.Opponents.length - 1) this.turnOf = this.game.Player;
      else this.turnOf = this.game.Opponents[idx + 1];
    }
    if (first) this.turnStart = this.turnOf;
    this.moveLogic();
  }

  moveLogic() {
    if (this.turnOf === undefined) this.turnOf = this.turnStart;
    if (!this.CanPlayerMove(this.turnOf!) || this.playerMoved(this.turnOf!)) {
      if (this.canGameAdvance()) {
        this.checkGameAdvance();
        return;
      }
      this.getTurnOfNextPlayer();
      return;
    }
    if (!this.isPlayerTurn()) {
      this.getAiMove();
      return;
    }

    this.checkGameAdvance();
  }

  canGameAdvance(): boolean {
    for (let p of this.game.Opponents) {
      if (p.Move == 0) return false;
    }

    return this.game.Player.Move != 0;
  }

  playerMoved(p: IProfile | IOpponent): boolean {
    return p.Move != 0;
  }

  CanPlayerMove(p: IProfile | IOpponent): boolean {
    return !(p?.Move == 3 || p?.Move == 4);
  }

  getAiMove() {
    if (this.isPlayerTurn()) {
      return;
    }
    if (!this.CanPlayerMove(this.turnOf!)) {
      this.getTurnOfNextPlayer();
      return;
    }
    const idx = this.game.Opponents.findIndex(
      (p) => p.Name == this.turnOf?.Name,
    );
    this.gameApi.getAiMove(idx + 1).subscribe({
      next: (ply: IOpponent) => (this.game.Opponents[idx] = ply),
      error: (err) => {
        this.turnOf = this.turnStart;
      },
      complete: () => {
        this.getTurnOfNextPlayer();
      },
    });
  }

  checkGameAdvance() {
    if (this.game.Opponents.length == 0) {
      this.handleGameEnd();
    }

    if (this.AllPlayerMadeAMove()) {
      this.gameApi.advanceGame().subscribe({
        next: (updatedGame: IGame) => {
          if (updatedGame == null) {
            this.turnOf = this.turnStart;
            return;
          }
          this.game = updatedGame;
        },
        error: (e) => console.error(e),
        complete: () => {
          if (this.game.CurrentStage == 0) {
            this.getLastRoundWinner();
            if (this.game.Player.Chips <= 0) this.handleGameEnd(true);
          }
          this.getTurnOfNextPlayer();
        },
      });
    }
  }

  AllPlayerMadeAMove(): boolean {
    if (this.game.Player.Move == 0) return false;
    for (let i = 0; i < this.game.Opponents.length; i++) {
      if (this.game.Opponents[i].Move == 0) return false;
    }
    return true;
  }

  getLastRoundWinner() {
    this.gameApi.getRoundWinner().subscribe({
      next: (winner: IWinner) => {
        this.currentMessage = {
          message: `Round won by ${winner.dName} Won: ${
            winner.dPot
          }, with: ${this.getHand(winner.Comb)}`,
          classes: 'center alert alert-success bg-blur',
          clearBtnOk: 'Ok',
          buttonClearClasses: 'm-1 btn btn-success',
          clearTxt: 'Ok',
        };
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  getHand(handValue: number) {
    if (handValue > 100) return 'Royal Flush';
    else if (handValue > 80) return 'Straight Flush';
    else if (handValue > 65) return 'Poker';
    else if (handValue > 59) return 'Color Flush';
    else if (handValue > 50) return 'KIASTOFUL';
    else if (handValue > 30) return 'Tris';
    else if (handValue > 14) return 'Pair';
    else return 'High Card';
  }

  /*
  }

  getDealer(): IProfile | IOpponent | undefined {
    if (this.game.Player.CurrentRole == 1) return this.game.Player;
    return this.game.Opponents.find((p) => p.CurrentRole == 1) || undefined;
  }

*/
  protected readonly Math = Math;
}
