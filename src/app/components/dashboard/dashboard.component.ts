/// <reference types="@types/googlemaps" />
declare var require: any
// declare var google: any
import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild, NgZone } from '@angular/core';
import { MapsAPILoader} from '@agm/core';
import { CommonService } from 'src/app/service/common.service';
// import { google } from '@types/googlemaps';

export class GeoLocation {
  lat: number;
  lng: number;
  name: string;
  rating: number;
  visited: boolean;
  city: string;

  constructor (lat, lng, name, rating, visited, city) {
    this.lat = lat;
    this.lng = lng;
    this.name = name;
    this.rating = Math.round((rating * 100 / 23)*100)/100;
    this.visited = visited;
    this.city = city;
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
  map;
  city: string;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  ngOnInit() {
    this.setCurrentLocation();

    this.mapsAPILoader.load().then(() => { 

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {types: ["(cities)"]});
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.city = place.name;

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
        // console.log(response['data'])
        for (let entry of response['data']['results']) {
          this.locations.push(new GeoLocation(entry['geometry']['location']['lat'], 
                                              entry['geometry']['location']['lng'],
                                              entry['name'],
                                              entry['rating'],
                                              false,
                                              this.city));
          
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

    this.locations.forEach(x =>  {
      if (x.lat === marker.lat && x.lng === marker.lng && x.visited === false) {
        x.visited = true;
        this.commonService.addCityPoints(this.city, x.rating).subscribe(res => {
          console.log(res);
        });
      }
   });
  };


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
