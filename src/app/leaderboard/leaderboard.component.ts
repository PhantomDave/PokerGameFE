import { Component, OnInit } from '@angular/core';
import { GameApiService } from '../services/gameapi.service';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css',
  imports: [CommonModule, FaIconComponent, LoadingComponent],
})
export class LeaderboardComponent implements OnInit {
  constructor(private gameApi: GameApiService) {}

  scoreboard$ = this.gameApi.getScoreboard();

  ngOnInit(): void {  }

  protected readonly faMedal = faMedal;

  getIconColor(i: number) {
    switch (i) {
      case 0:
        return 'gold';
      case 1:
        return 'silver';
      case 2:
        return 'bronze';
    }
    return '';
  }
}
