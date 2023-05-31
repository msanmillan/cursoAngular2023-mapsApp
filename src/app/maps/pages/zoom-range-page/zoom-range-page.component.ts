import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from "mapbox-gl";

@Component({
  selector: 'app-zoom-range-page',
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy{

  @ViewChild('map') divMap?: ElementRef;
  public zoom: number = 10;
  public map ?: Map;
  public currentCenter : LngLat = new LngLat(-4.527998092315215, 42.00867968426047);

  ngAfterViewInit(): void {
    if(!this.divMap) throw 'HTML element not found';

    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentCenter, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
      });

      this.mapListeners();
  }

  mapListeners(){
    if(!this.map) throw 'Not inicializated Map';

    this.map.on('zoom', (ev) =>{
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (ev)=>{

      if(this.map!.getZoom()<18) return;
      this.map?.zoomTo(18);
    
    });

    this.map.on('move', (ev)=>{
      this.currentCenter = this.map!.getCenter();
      const { lng, lat } = this.currentCenter;
    })
  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  zoomChange(value : string){
    this.zoom = parseInt(value);
    this.map?.zoomTo(this.zoom);
  }

  ngOnDestroy(): void {
   this.map?.remove(); 
  }
}


