import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  testUrl = "https://test-fast-api-mata.herokuapp.com/";
  addPointsUrl = "https://test-fast-api-mata.herokuapp.com/inc_user_city?";
  addAchievementUrl = "https://test-fast-api-mata.herokuapp.com/add_achievement?";
  myInfoUrl = "https://test-fast-api-mata.herokuapp.com/users/me";

  constructor(private http: HttpClient) { }

  getTestJson(): Observable<any> {
    return this.http.get(this.testUrl).pipe(
      map(results => { 
        return results;
      })
    );
  }

  addCityPoints(city, points): Observable<any> {
    return this.http.put(this.addPointsUrl + "city=" + city + "&score=" + parseInt(points), {}).pipe(
      map(results => { 
        results;
      })
    );
  }

  addAchievement(achievement): Observable<any> {
    return this.http.put(this.addAchievementUrl + "achievement=" + achievement, {}).pipe(
      map(results => { 
        results;
      })
    );
  }

  getCityPoints(city): Observable<any> {
    return this.http.get(this.myInfoUrl).pipe(
      map(results => { 
        return results["points_per_city"][city];
      })
    );
  }
}
