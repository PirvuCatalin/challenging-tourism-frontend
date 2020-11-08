import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, shareReplay, tap } from "rxjs/operators";
import * as moment from "moment";
import jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  leaderboardByCityUrl = "http://test-fast-api-mata.herokuapp.com/leader_board_by_city";
  leaderboard = "http://test-fast-api-mata.herokuapp.com/leader_board";

  constructor(private http: HttpClient) { }

  getLeaderboardByCity(city): Observable<any> {
    let params = new HttpParams().set("city", city);

    return this.http.get(this.leaderboardByCityUrl, { params: params }).pipe(
      map(results => {
        return results;
      })
    );
  }

  getLeaderboard(): Observable<any> {
    return this.http.get(this.leaderboard).pipe(
      map(results => {
        return results;
      })
    );
  }
}
