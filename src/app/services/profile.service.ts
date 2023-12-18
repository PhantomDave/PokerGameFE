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
    Token: '',
    Hand: [],
    CurrentRole: 0,
    Move: 0,
  };

  getToken() {
    return localStorage.getItem('token');
  }

  ngOnInit() {
    if (localStorage.getItem('token') != undefined) {
      this.profile = this.loadProfile();
    }
  }

  setToken(dtoken: string) {
    this.profile.Token = dtoken;
    localStorage.setItem('token', dtoken);
  }

  loadProfile(): IProfile {
    return JSON.parse(localStorage.getItem('profile') || '');
  }

  updateLocalStorage() {
    localStorage.setItem('profile', JSON.stringify(this.profile));
  }

  setName(name: string) {
    this.profile.Name = name;
  }

  checkUserToken(): string | null {
    return localStorage.getItem('token');
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
