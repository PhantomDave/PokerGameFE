import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GameApiService } from '../../services/gameapi.service';
import { IGame } from '../../interface/igame';
import { PlayComponent } from '../play/play.component';
import { ProfileService } from '../../services/profile.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-setup',
  standalone: true,
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css',
  imports: [FormsModule, PlayComponent],
})
export class SetupComponent implements OnInit {
  needsSetup: boolean = true;
  gameEvent!: IGame;
  resumeGameObj: IGame | null;

  constructor(
    private api: GameApiService,
    private profileService: ProfileService,
  ) {
    this.resumeGameObj = null;
  }

  ngOnInit(): void {
    this.setUsername();
    this.getSavedGame();
  }

  getSavedGame() {
    const savedGame$: Subscription = this.api.getGame().subscribe({
      next: (gg: IGame) => {
        if (gg == null || gg === undefined) return;
        console.table(gg);
        this.resumeGameObj = gg;
        this.needsSetup = false;
      },
      error: () => {
        console.log('No resumable game found');
      },
    });
  }

  resumeGame() {
    this.gameEvent = this.resumeGameObj!;
    this.resumeGameObj = null;
  }

  startNewGame() {
    this.api.clearSavedGame().subscribe({});
    this.resumeGameObj = null;
    this.needsSetup = true;
  }

  setUsername() {
    this.api.setUsername(this.profileService.loadProfile().Name).subscribe({
      error: (err) => {
        console.info(err);
      },
    });
  }

  onSubmit(form: NgForm) {
    const players = form.value.players;
    const smallblind = form.value.smallblind;
    const bigblind = form.value.bigblind;
    const chips = form.value.chips;
    this.api.setupGame(players, smallblind, bigblind, chips).subscribe({
      next: (resp) => {
        this.gameEvent = resp;
        this.needsSetup = false;
      },
      error: (error) => console.log(error),
    });
  }
}
