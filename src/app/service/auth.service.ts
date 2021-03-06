import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, shareReplay, tap } from "rxjs/operators";
import * as moment from "moment";
import jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUrl = "https://test-fast-api-mata.herokuapp.com/auth/jwt/login";
  emailUrl = "https://test-fast-api-mata.herokuapp.com/users/me";
  registerUrl = "https://test-fast-api-mata.herokuapp.com/auth/register";

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json'
    });
    let options = { headers: headers };

    //{ username: email, password: password }
    return this.http.post(this.loginUrl, "username=" + email + "&password=" + password, options).pipe(
      tap(res => this.setSession(res)),
      // this is just the HTTP call, 
      // we still need to handle the reception of the token
      shareReplay()
    );
  }

  private setSession(authResult) {
    console.log(authResult);
    // const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.access_token);
    // localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    const expiresAt = this.getDecodedAccessToken(authResult.access_token).exp;
    console.log(expiresAt);
    localStorage.setItem("expires_at", expiresAt);


    // console.log(this.getDecodedAccessToken(authResult.access_token));
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }

  public isLoggedIn() {
    return moment().unix() < (this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {

    const expiration = localStorage.getItem("expires_at");
    // const expiresAt = JSON.parse(expiration);
    return parseInt(expiration);
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  getEmail(): Observable<any> {
    if(this.isLoggedIn()) {
      return this.http.get(this.emailUrl).pipe(
        map(results => {
          return results["email"];
        })
      );
    } else {
      return of(null);
    } 
  }

  register(email: string, password: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };

    //{ username: email, password: password }
    return this.http.post(this.registerUrl, {email: email, password: password}, options).pipe(
      // tap(res => this.setSession(res)),
      // // this is just the HTTP call, 
      // // we still need to handle the reception of the token
      // shareReplay()
    );
  }
}