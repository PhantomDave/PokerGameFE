import { Injectable, OnInit } from '@angular/core';
import { IProfile } from '../interface/iprofile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService implements OnInit {
  constructor() {}

  profile: IProfile = {
    Chips: 0,
    ChipsWon: 0,
    PlayerKnockedOut: 0,
    Name: '',
    Email: '',
    LoggedIn: false,
  };

  ngOnInit() {
    if (localStorage.getItem('token') != undefined) {
      this.profile.LoggedIn = true;
    }
  }

  setName(name: string) {
    this.profile.Name = name;
  }

  setEmail(email: string) {
    this.profile.Email = email;
  }

  addPlayerKnockedOut() {
    this.profile.PlayerKnockedOut++;
  }

  getUserProfile(): IProfile {
    return this.profile;
  }

  setChips(chips: number) {
    this.profile.Chips = chips;
  }

  addChips(chips: number) {
    this.profile.Chips += chips;
  }

  removeChips(chips: number) {
    this.profile.Chips -= chips;
  }

  addChipsWon(chips: number) {
    this.profile.ChipsWon += chips;
  }
}
