import { Feature } from '../../interfaces';
import { MapService, PlacesService } from './../../services';
import { Component, computed, inject, signal } from '@angular/core';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {
private placesService  = inject( PlacesService );
private mapService     = inject( MapService );
public selectedId      = signal('');
public isLoadingPlaces = computed(() => this.placesService.isLoadingPlaces() );
public places          = computed(() => this.placesService.places());

flyTo( place:Feature ){
  this.selectedId.set(place.id);
  const[lng, lat] = place.center;
  this.mapService.flyTo([lng, lat]);
}

getDirections( place:Feature){
  if (!this.placesService.userLocation()) throw Error('No hay userLocatino');
  this.placesService.deletePlaces();
  const start = this.placesService.userLocation()!; 
  const end   = place.center as [number, number];
  this.mapService.getRouteBetweenPoints(start, end);
}
}
