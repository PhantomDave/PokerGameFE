import { Injectable, importProvidersFrom } from '@angular/core';
import { APIService } from './api.service';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ILogin } from '../interface/ilogin';
import { ProfileService } from './profile.service';
import { IGame } from '../interface/igame';
import { IProfile } from '../interface/iprofile';
import { HttpParams, HttpStatusCode } from '@angular/common/http';
import { IWinner } from '../interface/iwinner';
import { IScoreboard } from '../interface/i-scoreboard';
import { IOpponent } from '../interface/iopponent';

@Injectable({
  providedIn: 'root',
})
export class GameApiService {
  constructor(
    private api: APIService,
    private profile: ProfileService,
  ) {}

  gameEndpoint: string = environment.gameEndpoint;

  getUserNonce(email: string): Observable<string> {
    return this.api.get(this.gameEndpoint + '/login/' + email);
  }

  getGame(): Observable<IGame> {
    const profile: IProfile = this.profile.loadProfile();
    let params: HttpParams = new HttpParams()
      .set('email', profile.Email)
      .set('token', profile.Token);

    let options = { params: params };
    return this.api.get(this.gameEndpoint + '/game/getsavedgame', options);
  }

  clearSavedGame() {
    const profile: IProfile = this.profile.loadProfile();
    let params: HttpParams = new HttpParams()
      .set('email', profile.Email)
      .set('token', profile.Token);

    let options = { params: params };
    return this.api.get(this.gameEndpoint + '/game/clearSavedGame', options);
  }

  getRoundWinner(): Observable<IWinner> {
    const profile: IProfile = this.profile.loadProfile();
    let params: HttpParams = new HttpParams()
      .set('email', profile.Email)
      .set('token', profile.Token);

    let options = { params: params };

    return this.api.get(this.gameEndpoint + `/game/getRoundWinner/`, options);
  }

  loginUser(email: string, noncedPassword: string): Observable<ILogin> {
    /* Here I would hash the password + nonce to be sent back to the backend and be the most secure version of this
    However I found out by Mr. Grassia telling me and testing on my own, that the BCrypt library is too old and uses
    a different version of SHA256 hashing and any other lib that I found needs a valid SSL Certificate
     */
    const json: string = JSON.stringify({
      email: email,
      password: noncedPassword,
    });
    return this.api.post(this.gameEndpoint + '/login/', json);
  }

  setUsername(name: string) {
    const profile: IProfile = this.profile.loadProfile();
    let params: HttpParams = new HttpParams()
      .set('username', name)
      .set('email', profile.Email)
      .set('token', profile.Token);

    let options = { params: params };
    return this.api.get(this.gameEndpoint + `/game/setusername/`, options);
  }

  setupGame(
    numplayers: number,
    smallbind: number,
    bigblind: number,
    chips: number,
  ): Observable<IGame> {
    const profile: IProfile = this.profile.loadProfile();
    let params: HttpParams = new HttpParams()
      .set('email', profile.Email)
      .set('token', profile.Token);

    let options = { params: params };
    return this.api.get(
      this.gameEndpoint +
        `/game/start/${numplayers}/${smallbind}/${bigblind}/${chips}`,
      options,
    );
  }

  advanceGame(): Observable<IGame> {
    const profile: IProfile = this.profile.loadProfile();
    let params: HttpParams = new HttpParams().set('email', profile.Email);
    let options = { params: params };
    return this.api.get(this.gameEndpoint + `/game/advance`, options);
  }

  getAiMove(id: number): Observable<IOpponent> {
    const profile: IProfile = this.profile.loadProfile();
    let params: HttpParams = new HttpParams()
      .set('email', profile.Email)
      .set('id', id);
    let options = { params: params };
    return this.api.get(this.gameEndpoint + `/game/getaimove`, options);
  }

  makeMove(move: number, bet: number) {
    const profile: IProfile = this.profile.loadProfile();
    let params: HttpParams = new HttpParams()
      .set('email', profile.Email)
      .set('move', move)
      .set('bet', bet);
    let options = { params: params };
    return this.api.get(this.gameEndpoint + `/game/move`, options);
  }

  sitUp(): Observable<unknown> {
    const profile: IProfile = this.profile.loadProfile();
    let params: HttpParams = new HttpParams()
      .set('token', profile.Token)
      .set('email', profile.Email);

    let options = { params: params };
    return this.api.get(this.gameEndpoint + `/game/situp`, options);
  }

  saveToLeaderboard(): Observable<HttpStatusCode> {
    const profile: IProfile = this.profile.loadProfile();
    let params: HttpParams = new HttpParams()
      .set('token', profile.Token)
      .set('email', profile.Email);

    let options = { params: params };
    return this.api.get(this.gameEndpoint + `/game/addtoScores`, options);
  }

  getScoreboard(): Observable<IScoreboard[]> {
    const profile: IProfile = this.profile.loadProfile();
    let params: HttpParams = new HttpParams().set('token', profile.Token);

    let options = { params: params };

    return this.api.get(this.gameEndpoint + `/game/getScores`, options);
  }
}
