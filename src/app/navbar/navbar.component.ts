import {Component, OnInit} from '@angular/core';
import {IProfile} from "../interface/iprofile";
import {ProfileService} from "../services/profile.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  profile: IProfile = {
    Chips: 0, ChipsWon: 0, Email: "", LoggedIn: false, Name: "", PlayerKnockedOut: 0
  };

  constructor(private profileService: ProfileService) {
  }

  ngOnInit() {
    this.profile = this.profileService.profile;
  }

}
