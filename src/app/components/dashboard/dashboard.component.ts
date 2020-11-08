/// <reference types="@types/googlemaps" />
declare var require: any
// declare var google: any
import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { CommonService } from 'src/app/service/common.service';
// import { google } from '@types/googlemaps';

export class Achievement {
  name: string;

  constructor(name) {
    this.name = name;
  }
}

export class GeoLocation {
  lat: number;
  lng: number;
  name: string;
  rating: number;
  visited: boolean;
  city: string;
  photo_url: number;

  constructor(lat, lng, name, rating, visited, city, photo_url) {
    this.lat = lat;
    this.lng = lng;
    this.name = name;
    this.rating = Math.round((rating * 100 / 23) * 100) / 100;
    this.visited = visited;
    this.city = city;
    this.photo_url = photo_url;
  }

}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private commonService: CommonService) { }

  lat: number;
  lng: number;
  zoom: number;
  locations: GeoLocation[] = [];
  achievements: Achievement[] = [];
  achievements_locations: GeoLocation[] = [
    new GeoLocation(44.453063, 26.0981233, "Unknown Hero Statue", -1, false, "Bucharest", ""),
    new GeoLocation(44.4671777, 26.078116, "The Arch Of Triumph", -1, false, "Bucharest", ""),
    new GeoLocation(44.5276558, 25.9926667, "Mogoşoaia Palace", -1, false, "Bucharest", ""),
    new GeoLocation(44.4226721, 26.1029368, "18th-century townsman house", -1, false, "Bucharest", ""),
    new GeoLocation(44.4126574, 26.0944944, "Monument istoric Mine si Cariere", -1, false, "Bucharest", ""),
    new GeoLocation(44.4441413, 26.1412125, "The monument of the Armenian Heroes", -1, false, "Bucharest", ""),
    new GeoLocation(44.4456823, 26.1082433, "Casa Barbu Brezianu", -1, false, "Bucharest", ""),
    new GeoLocation(44.43198049999999, 26.0999081, "Palatul Pinacotecii", -1, false, "Bucharest", ""),
    new GeoLocation(44.4301472, 26.1009639, "Curtea Veche", -1, false, "Bucharest", ""),
    new GeoLocation(44.4463067, 26.1194244, "Casa Alexandru Dimitriu", -1, false, "Bucharest", ""),
    new GeoLocation(44.43635829999999, 26.1011647, "National Liberal Party Memorial", -1, false, "Bucharest", "")
  ];
  map;
  city: string;
  random_year: string;

  populate_achievements() {
    for (let item of this.achievements_locations) {
      this.achievements.push(new Achievement("Visitor of " + item.name))
    }
  }

  is_achievement(location) {
    for (let item of this.achievements_locations) {
      if (item.lat === location.lat && item.lng === location.lng) {
        return true;
      }
    }
    return false;
  }

  @ViewChild('search')
  public searchElementRef: ElementRef;

  numberOfPoints = 0;

  ngOnInit() {
    this.setCurrentLocation();
    this.populate_achievements()

    this.mapsAPILoader.load().then(() => {

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, { types: ["(cities)"] });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.city = place.name;

          this.commonService.getCityPoints(this.city).subscribe(res => {
            this.numberOfPoints = res;
          })

          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
          this.get_stuff(this.lat, this.lng);

        });
      });
    });

  }

  async get_stuff(lat, lng) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const yourUrl: string = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=15000&keyword=historic&key=AIzaSyAC5jNrcEmMrHo4h9GKBbk0novGz97WBqE`;
    const axios = require('axios');
    try {
      const response = await axios.get(proxyurl + yourUrl);
      console.log(response['data'])
      for (let entry of response['data']['results']) {
        this.locations.push(new GeoLocation(entry['geometry']['location']['lat'],
          entry['geometry']['location']['lng'],
          entry['name'],
          entry['rating'],
          false,
          this.city,
          ""));

      }
    } catch (exception) {
      console.log(exception);
    }

    console.log(this.locations);
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

  onClickInfoView(id) {
    console.log(id)
  }



  markerClicked(marker) {
    this.getNumber()
    if (this.is_achievement(marker)) {
      this.commonService.addAchievement("Visitor of " + marker.name).subscribe(res => {
        console.log(res);
      });
    }
    console.log(this.random_year)
    this.locations.forEach(x => {
      if (x.lat === marker.lat && x.lng === marker.lng && x.visited === false) {
        x.visited = true;
        this.commonService.addCityPoints(this.city, x.rating).subscribe(res => {
          console.log(res);
          this.commonService.getCityPoints(this.city).subscribe(res => {
            this.numberOfPoints = res;
          })
        });
      }
    });
  };

  getNumber() {

    var start = new Date(1200, 0, 1);
    var end = new Date(1990, 0, 1);
    var d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.random_year = [year, month, day].join('-');
  }

  showCurrent = false;
  showPast = false;
  showJourney = true;

  onCurrentClick() {
    this.showCurrent = true;
    this.showPast = false;
    this.showJourney = false;
  }

  onPastClick() {
    this.showCurrent = false;
    this.showPast = true;
    this.showJourney = false;
  }

  onJourneyClick() {
    this.showCurrent = false;
    this.showPast = false;
    this.showJourney = true;
  }
}
