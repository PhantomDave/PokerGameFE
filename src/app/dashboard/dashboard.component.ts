import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private router: Router) {}

  protected readonly faX = faX;

  showRulesDiv: boolean = false;

  play() {
    this.router.navigateByUrl('/game/setup');
  }

  leaderboard() {
    this.router.navigateByUrl('/leaderboard');
  }

  showRules() {
    this.showRulesDiv = !this.showRulesDiv;
  }
}
