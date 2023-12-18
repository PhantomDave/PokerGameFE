import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { tokenGuard } from './token-guard.guard';
import { SetupComponent } from './game/setup/setup.component';
import { PlayComponent } from './game/play/play.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LoadingComponent } from './loading/loading.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'game',
    canActivate: [tokenGuard],
    canActivateChild: [tokenGuard],
    children: [
      { path: 'setup', component: SetupComponent },
      { path: 'play', component: PlayComponent },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    canActivate: [tokenGuard],
    component: DashboardComponent,
  },
  {
    path: 'leaderboard',
    canActivate: [tokenGuard],
    component: LeaderboardComponent,
  },
];
