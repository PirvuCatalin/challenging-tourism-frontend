import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild, NgZone } from '@angular/core';
import { MapsAPILoader} from '@agm/core';
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

  @ViewChild('search')
  public searchElementRef: ElementRef;

  ngOnInit() {
    this.setCurrentLocation();

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
