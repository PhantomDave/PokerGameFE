import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GameApiService } from '../services/gameapi.service';
import { CryptoService } from '../services/crypto.service';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private gameApi: GameApiService,
    private hashService: CryptoService,
    private profileService: ProfileService,
    private router: Router,
  ) {}
  async onSubmit(loginForm: NgForm) {
    const password = await this.hashService.hashString(this.password);

    this.gameApi.getUserNonce(this.email).subscribe({
      next: (nonce: string) => {
        this.gameApi.loginUser(this.email, nonce + password).subscribe({
          next: (profile) => {

            this.profileService.setName(profile.duser);
            this.profileService.setEmail(profile.demail);
            this.profileService.profile.LoggedIn = true;
            this.profileService.updateLocalStorage();
            this.router.navigateByUrl('/game');
          },
          error: (err) => console.error(err),
          complete: () => console.log('Auth done'),
        });
      },
      error: (err) => console.log("ERRORE NELL'AUTENTICAZIONE " + err),
      complete: () => console.log('Auth Completed'),
    });
  }
}
