/// <reference types="@types/googlemaps" />
declare var require: any

/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>
declare var $: any

// declare var google: any
import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { CommonService } from 'src/app/service/common.service';
// import { google } from '@types/googlemaps';
import { timer } from 'rxjs';

export class Achievement {
  name: string;
  lat: number;
  lng: number;
  visited: boolean;

  constructor(name, lat, lng, visited) {
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.visited = visited;
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
  vicinity: string;
  user_ratings_total: number;

  constructor(lat, lng, name, rating, visited, city, photo_url, vicinity, user_ratings_total) {
    this.lat = lat;
    this.lng = lng;
    this.name = name;
    this.rating = Math.round((rating * 100 / 23) * 100) / 100;
    this.visited = visited;
    this.city = city;
    this.photo_url = photo_url;
    this.vicinity = vicinity;
    this.user_ratings_total = user_ratings_total;
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
    public commonService: CommonService) { }

  lat: number;
  lng: number;
  zoom: number;
  locations: GeoLocation[] = [];
  achievements: Achievement[] = [];
  achievements_locations: GeoLocation[] = [
    new GeoLocation(44.453063, 26.0981233, "Unknown Hero Statue", -1, false, "Bucharest", "", "", ""),
    new GeoLocation(44.4671777, 26.078116, "The Arch Of Triumph", -1, false, "Bucharest", "", "", ""),
    new GeoLocation(44.5276558, 25.9926667, "Mogoşoaia Palace", -1, false, "Bucharest", "", "", ""),
    new GeoLocation(44.4226721, 26.1029368, "18th-century townsman house", -1, false, "Bucharest", "", "", ""),
    new GeoLocation(44.4126574, 26.0944944, "Monument istoric Mine si Cariere", -1, false, "Bucharest", "", "", ""),
    new GeoLocation(44.4441413, 26.1412125, "The monument of the Armenian Heroes", -1, false, "Bucharest", "", "", ""),
    new GeoLocation(44.4456823, 26.1082433, "Casa Barbu Brezianu", -1, false, "Bucharest", "", "", ""),
    new GeoLocation(44.43198049999999, 26.0999081, "Palatul Pinacotecii", -1, false, "Bucharest", "", "", ""),
    new GeoLocation(44.4301472, 26.1009639, "Curtea Veche", -1, false, "Bucharest", "", "", ""),
    new GeoLocation(44.4463067, 26.1194244, "Casa Alexandru Dimitriu", -1, false, "Bucharest", "", "", ""),
    new GeoLocation(44.43635829999999, 26.1011647, "National Liberal Party Memorial", -1, false, "Bucharest", "", "", "")
  ];
  map;
  city: string;
  random_year: string;

  populate_achievements() {
    for (let item of this.achievements_locations) {
      this.achievements.push(new Achievement("Visitor of " + item.name, item.lat, item.lng, false))
    }
  }

  is_achievement(location) {
    let flag = false;
    console.log('Identified an achievement')
    this.achievements_locations.forEach(x => {
      if (x.lat === location.lat && x.lng === location.lng && x.visited === false) {
        console.log("Identified not visited achievement");
        console.log(x.name)
        console.log(x.lat)
        console.log(x.lng)
        x.visited = true;
        flag = true;
      }
    });
    return flag;
  }

  @ViewChild('search')
  public searchElementRef: ElementRef;

  numberOfPoints = 0;

  subscribeTimer = 0;

  challengeSuccess = false;

  challengeEnded = false;

  ngOnInit() {
    if (this.commonService.activeChallenge && this.commonService.activeChallenge.isActive == true) {
      this.challengeEnded = true;
      this.commonService.activeChallenge.isActive = false;
      const source = timer(1000, 1000);
      const abc = source.subscribe(val => {
        if (this.commonService.activeChallenge != null) {
          let time = this.commonService.activeChallenge.expiresInSeconds - val;
          if (time > 0) {
            this.subscribeTimer = time;
          } else if (time == 0) {
            console.log("done");

            if (this.commonService.activeChallenge.currentNumOfWaypoints >=  this.commonService.activeChallenge.numOfWaypoints) {
              this.challengeSuccess = true;
              console.log("making request!");
              console.log(this.city);
              console.log(this.commonService.activeChallenge.bonusPoints);
              this.commonService.addCityPoints(this.city, this.commonService.activeChallenge.bonusPoints).subscribe(res => {
                // console.log(res);
              });
            } else {
              this.challengeSuccess = false;
            }

            // this.challengeEnded = false;
            this.commonService.activeChallenge = null;
          }
        }
      });
    }




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
            this.numberOfPoints = res ? res : 0;
          })

          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
          this.get_stuff(this.lat, this.lng);

          this.showCurrent = true;
          this.showPast = false;
          this.showJourney = false;
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
          "",
          entry["vicinity"],
          entry["user_ratings_total"]));

      }
    } catch (exception) {
      console.log(exception);
    }
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

  markerClicked(marker) {
    console.log(marker);
    this.getNumber()
    if (this.is_achievement(marker)) {
      this.commonService.addAchievement("Visitor of " + marker.name).subscribe(res => {
        console.log("This was an achievement");
      });
    }
    console.log(this.random_year)
    this.locations.forEach(x => {
      if (x.lat === marker.lat && x.lng === marker.lng && x.visited === false) {
        if (this.commonService.activeChallenge && marker.city === this.commonService.activeChallenge.city) {
          this.commonService.activeChallenge.currentNumOfWaypoints++;
        }
        x.visited = true;
        this.commonService.addCityPoints(this.city, x.rating).subscribe(res => {
          console.log(res);
          this.commonService.getCityPoints(this.city).subscribe(res => {
            this.numberOfPoints = res ? res : 0;
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
