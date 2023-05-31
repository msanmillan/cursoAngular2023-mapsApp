import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Map, Marker } from "mapbox-gl";

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit {

  @ViewChild('map') divMap?: ElementRef;
  @Input() lngLat?: [number, number];
  public zoom: number = 13;
  public map?: Map;

  ngAfterViewInit(): void {
    //map
    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
      interactive: false
    });

    if (!this.lngLat) throw "LngLat can't be null";
    if (!this.map) throw "Map is not defined"

    //marker
    new Marker({
      color: 'red',
      draggable: false
    })
      .setLngLat(this.lngLat)
      .addTo(this.map);
  }
}
