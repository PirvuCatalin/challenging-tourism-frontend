import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  lat: number;
  lng: number;
  zoom: number;
  lat2: number = 44.382801;
  lng2: number = 26.005373;



  ngOnInit() {
    this.setCurrentLocation();
  }

    // Get Current Location Coordinates
    private setCurrentLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.zoom = 15;
        });
      }
    }

}
