import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay, tap } from "rxjs/operators";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUrl = "https://test-fast-api-mata.herokuapp.com/auth/jwt/login"

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json'
    });
    let options = { headers: headers };

    //{ username: email, password: password }
    return this.http.post(this.loginUrl, "username=" + email +"&password=" + password, options).pipe(
      tap(res => this.setSession(res)),
      // this is just the HTTP call, 
      // we still need to handle the reception of the token
      shareReplay()
    );
  }

  private setSession(authResult) {
    // const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.idToken);
    // localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem("expires_at", authResult.exp);
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("exp");
    // const expiresAt = JSON.parse(expiration);
    return moment(expiration);
  }
}