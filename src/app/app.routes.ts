import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { tokenGuard } from './token-guard.guard';
import { SetupComponent } from './game/setup/setup.component';
import { PlayComponent } from './game/play/play.component';

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
];
