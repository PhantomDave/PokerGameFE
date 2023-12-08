import { Component } from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {GameApiService} from "../serivecs/gameapi.service";
import {take} from "rxjs";
import {IProfile} from "../iprofile";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string ="";
  password: string = "";

  constructor(private gameApi: GameApiService) {
  }
  async onSubmit(loginForm: NgForm) {
    this.gameApi.getUserNonce(this.email).subscribe({
      next: (nonce: string) => {
        this.gameApi.loginUser(this.email, shajs('sha256').update({this.password}).digest('hex') + nonce).subscribe(
          {next: (profile) => console.table(profile), error: (err) => console.error(err), complete:() => console.log("Auth done")})
      },
      error:(err) => console.log("ERRORE " + err),
      complete:() => console.log("Auth Completed"),
    });
  }
}
