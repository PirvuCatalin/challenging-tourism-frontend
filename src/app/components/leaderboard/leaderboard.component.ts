/// <reference types="@types/googlemaps" />
declare var require: any
import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { types } from 'util';
import { LeaderboardService } from 'src/app/service/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private leaderboardService: LeaderboardService) { }

  lat: number;
  lng: number;
  zoom: number;
  leaderboard = [];
  map;

  selectedCity = null;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  ngOnInit(): void {
    this.leaderboardService.getLeaderboard().subscribe(res => {
      this.leaderboard = res;
    });

    this.setCurrentLocation();

    this.mapsAPILoader.load().then(() => {

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, { types: ["(cities)"] });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            this.leaderboardService.getLeaderboard().subscribe(res => {
              this.leaderboard = res;
            });
            this.selectedCity = null;
            return;
          }
          this.selectedCity = place.name;

          this.leaderboardService.getLeaderboardByCity(this.selectedCity).subscribe(res => {
            this.leaderboard = res;
          });


          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;

        });
      });
    });
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
