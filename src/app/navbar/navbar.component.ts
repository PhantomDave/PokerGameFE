import { Component } from '@angular/core';
import {IProfile} from "../iprofile";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  profile: IProfile = {
    Chips: 0, ChipsWon: 0, PlayerKnockedOut: 0, name: "Dave"

  }
}
