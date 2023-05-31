import { Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from "mapbox-gl";

interface MarkerAndColor {
  marker: Marker;
  color: string;
}

interface PlainMarker {
  color: string;
  lngLat: number[]
}

@Component({
  selector: 'app-markers-page',
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent {

  @ViewChild('map') divMap?: ElementRef;
  public zoom: number = 14;
  public map?: Map;
  public currentCenter: LngLat = new LngLat(-4.527998092315215, 42.00867968426047);
  public markers: MarkerAndColor[] = [];

  ngAfterViewInit(): void {
    if (!this.divMap) throw 'HTML element not found';

    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentCenter, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    this.readFromLocalStorage();

    /* const marker = new Marker({
      color: 'red'
    })
    .setLngLat(this.currentCenter)
    .addTo(this.map); */
  }

  saveToLocalStorage() {
    const plainMarkers :PlainMarker [] = this.markers.map( ({color, marker})=>{
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers',JSON.stringify(plainMarkers));
  }

  readFromLocalStorage() {

    const plainMarkers: PlainMarker[] = JSON.parse(localStorage.getItem('plainMarkers') ?? '[]');
    
    plainMarkers.forEach(plainMarker => {
      const [ lng , lat ] = plainMarker.lngLat;
      const coords = new LngLat (lng, lat);
      this.addMarker( coords, plainMarker.color);
    });
  }

  createMarker() {
    if (!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const lngLat = this.map!.getCenter();
    this.addMarker(lngLat, color);
  }


  addMarker(lngLat: LngLat, color: string) {
    if (!this.map) return;

    const marker = new Marker({
      color: color,
      draggable: true
    })
      .setLngLat(lngLat)
      .addTo(this.map);

    this.markers.push({ marker, color });
    this.saveToLocalStorage();

    marker.on('dragend', ()=>{
      this.saveToLocalStorage();
    })
  }

  removeMarker(index: number){
    this.markers[index].marker.remove();
    this.markers.splice(index,1);
    this.saveToLocalStorage();
  }

  flyTo(marker: Marker){
    if(!this.map) return;

    this.map.flyTo({
      zoom: 15,
      center: marker.getLngLat()
    })
  }
}
