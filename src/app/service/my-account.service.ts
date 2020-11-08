import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, shareReplay, tap } from "rxjs/operators";
import * as moment from "moment";
import jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyAccountService {

  myInfo = "https://test-fast-api-mata.herokuapp.com/users/me";

  constructor(private http: HttpClient) { }

  getMyInfo(): Observable<any> {
    return this.http.get(this.myInfo).pipe(
      map(results => {
        var sortable = [];
        for (var key in results["points_per_city"]) {
          sortable.push([key, results["points_per_city"][key]]);
        }

        sortable.sort(function (a, b) {
          return b[1] - a[1];
        });
        console.log(sortable);
        
        results["points_per_city"] = sortable;

        return results;
      })
    );
  }
}
