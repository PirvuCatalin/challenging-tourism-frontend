/// <reference types="@types/googlemaps" />
declare var require: any
import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild, NgZone } from '@angular/core';
import { MapsAPILoader} from '@agm/core';

export class GeoLocation {
  lat: number;
  lng: number;
  name: string;
  rating: number;

  constructor (lat, lng, name, rating) {
    this.lat = lat;
    this.lng = lng;
    this.name = name;
    this.rating = rating;

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
    private ngZone: NgZone) { }

  lat: number;
  lng: number;
  zoom: number;
  locations: GeoLocation[] = [];

  @ViewChild('search')
  public searchElementRef: ElementRef;

  ngOnInit() {
    this.setCurrentLocation();
    this.get_stuff(this.lat, this.lng);

    this.mapsAPILoader.load().then(() => { 

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
          
          this.get_stuff(this.lat, this.lng);

        }); 
      });
    });

  }

  public async get_stuff(lat, lng) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const yourUrl: string = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=15000&keyword=historic&key=AIzaSyAC5jNrcEmMrHo4h9GKBbk0novGz97WBqE`;
    const axios = require('axios');
    try {
        const response = await axios.get(proxyurl + yourUrl);
        console.log(response['data']['results'])
        for (let entry of response['data']['results']) {
          this.locations.push(new GeoLocation(entry['geometry']['location']['lat'], 
                                              entry['geometry']['location']['lng'],
                                              entry['name'],
                                              entry['rating']));
          // console.log(entry);
          // console.log(response)
          
        }
    } catch (exception) {
        //process.stderr.write(`ERROR received from ${yourUrl}: ${exception}\n`);
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

    onMouseOver(infoWindow, gm) {

      if (gm.lastOpen != null) {
          gm.lastOpen.close();
      }
        
      gm.lastOpen = infoWindow;

      infoWindow.open();
  }

  onClickInfoView(id) {
    console.log(id)
  }

}
