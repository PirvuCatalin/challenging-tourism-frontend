import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  testUrl = "https://test-fast-api-mata.herokuapp.com/";
  addPointsUrl = "https://test-fast-api-mata.herokuapp.com/inc_user_city/";

  constructor(private http: HttpClient) { }

  getTestJson(): Observable<any> {
    return this.http.get(this.testUrl).pipe(
      map(results => { 
        return results;
      })
    );
  }

  addCityPoints(city, points): Observable<any> {
    let params = new HttpParams().set("city", city).set("score", points)
    return this.http.put(this.addPointsUrl, {params: params}).pipe(
      map(results => { 
        results;
      })
    );
  }
}
