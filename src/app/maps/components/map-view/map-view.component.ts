import { MapService } from './../../services/map.service';
import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Map, Marker, Popup } from 'mapbox-gl';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit{
private mapService    = inject( MapService );
private placesService = inject( PlacesService );

@ViewChild('mapDiv') mapDivElement!: ElementRef

 ngAfterViewInit(): void {
      if(!this.placesService.userLocation()) throw new Error('No hay placesService.userLocation');
  const map =  new Map({
    container: this.mapDivElement.nativeElement, // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: this.placesService.userLocation(), // starting position [lng, lat]
    zoom: 14, // starting zoom
    });

  const popup = new Popup()
                    .setHTML(`
                    <h6>Aquí estoy<h6>
                    <span>Estoy en este lugar del mundo</span>
                    `);

  new Marker({color:'red'})
      .setLngLat( this.placesService.userLocation()! )
      .setPopup( popup )
      .addTo( map );

      this.mapService.setMap( map );

}
} 
