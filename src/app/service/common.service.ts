import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  testUrl = "https://test-fast-api-mata.herokuapp.com/";

  constructor(private http: HttpClient) { }

  getTestJson(): Observable<any> {
    return this.http.get(this.testUrl).pipe(
      map(results => { 
        return results;
      })
    );
  }
}
