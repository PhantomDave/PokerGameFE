import { Injectable } from '@angular/core';
import {APIService} from "./api.service";
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";
import {IProfile} from "../iprofile";

@Injectable({
  providedIn: 'root'
})
export class GameApiService {

  constructor(private api: APIService) { }

  gameEndpoint:string = environment.gameEndpoint;
  getUserNonce(email: string): Observable<string>
  {
      return this.api.get(this.gameEndpoint+'/login/'+email);
  }

  loginUser(email: string, noncedPassword: string): Observable<IProfile>
  {
    /* Here I would hash the password + nonce to be sent back to the backend and be the most secure version of this
    However I found out by Mr. Grassia telling me and testing on my own, that the BCrypt library is too old and uses
    a different version of SHA256 hashing and any other lib that I found needs a valid SSL Certificate
     */
    const json: string = JSON.stringify({email: email, password: noncedPassword});
    return this.api.post(this.gameEndpoint+"/login/", json);
  }

}
