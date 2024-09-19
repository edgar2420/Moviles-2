import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  center: google.maps.LatLngLiteral = {
    lat: -17.78327,
    lng: -63.18213
  };


  points: any[] = [
    {
      position: {
        lat: -17.77037,
        lng: -63.18247,
      }
    },
    {
      position: {
        lat: -17.76895,
        lng: -63.18281,
      }
    },
    {
      position: {
        lat: -17.78327,
        lng: -63.18213,
      }
    },
    {
      position: {
        lat: -17.77748,
        lng: -63.18052,
      }
    },

    {
      position: {
        lat: -17.77196,
        lng:  -63.18811,
      }
    }
  ];

  constructor() {}

}
