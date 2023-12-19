import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GameApiService } from '../services/gameapi.service';
import { CryptoService } from '../services/crypto.service';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';
import { ILogin } from '../interface/ilogin';
import { CommonModule, NgIf } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, FormsModule, NgIf, LoadingComponent],
})
export class LoginComponent {
  invalidCredentials: boolean = false;
  loading: boolean = false;

  constructor(
    private gameApi: GameApiService,
    private hashService: CryptoService,
    private profileService: ProfileService,
    private router: Router,
  ) {}

  async onSubmit(loginForm: NgForm) {
    const email: string = loginForm.value.email.toLowerCase();
    const password: string = loginForm.value.password;

    //hasing disabled for security reasons
    //await this.hashService.hashString(this.password);
    this.loading = true;
    this.gameApi.getUserNonce(email).subscribe({
      next: (nonce: string) => {
        this.gameApi.loginUser(email, nonce + password).subscribe({
          next: (profile: ILogin) => {
            this.profileService.setName(profile.duser.username);
            this.profileService.setEmail(profile.duser.email);
            this.profileService.setToken(profile.dtoken);
            this.profileService.profile.LoggedIn = true;
            this.profileService.updateLocalStorage();
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            console.log('ERRORE: ', err);
            this.invalidCredentials = true;
            setTimeout(() => {
              this.invalidCredentials = false;
              this.loading = false;
            }, 5000);
          },
          complete: () => (this.loading = false),
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
