import { Component, OnInit } from '@angular/core';
import { GameApiService } from '../services/gameapi.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css',
})
export class LeaderboardComponent implements OnInit {
  constructor(private gameApi: GameApiService) {}

  scoreboard$ = this.gameApi.getScoreboard();

  ngOnInit(): void {
    this.scoreboard$.subscribe(console.table);
  }
}
