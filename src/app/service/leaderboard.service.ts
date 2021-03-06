import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  leaderboardByCityUrl = "https://test-fast-api-mata.herokuapp.com/leader_board_by_city";
  leaderboard = "https://test-fast-api-mata.herokuapp.com/leader_board";

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
