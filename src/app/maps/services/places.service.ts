import { MapService } from './';
import { Injectable, WritableSignal, computed, inject, signal } from '@angular/core';
import { Feature, MapBoxRespose } from '../interfaces';
import { MapBoxApiClient } from '../api';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private mapboxApi      = inject( MapBoxApiClient );
  private mapService     = inject( MapService );

  public userLocation:WritableSignal<[number,number]| undefined> = signal(undefined);
  public isLoadingPlaces = signal<boolean>(false);
  public places = signal<[]|Feature[]>([]);
  public isUserLocationReady = computed(() => !!this.userLocation());
  constructor() {
    this.getUserLocation();
   }

 public async getUserLocation(): Promise<[number,number]| undefined>  {
  return  new Promise((resolve,rejet)=>{

    navigator.geolocation.getCurrentPosition(
      ({coords}) =>{
        this.userLocation.set([coords.longitude, coords.latitude]);
        resolve( this.userLocation() );
      },(err) => {
        alert('No se pudo obtener la geolocalización')
        console.log(err);
      }
    );
  });
 }
public getPlacesByQuery(query:string = ''){ 
  if(query.length === 0){
    this.places.set([]);
    this.isLoadingPlaces.set(false);
    return;
  }
  if(!this.userLocation()) throw Error('No hay userLocation');
  this.isLoadingPlaces.set(true);
  this.mapboxApi.get<MapBoxRespose>(`/${ query.trim() }.json`, {params:{
    proximity:this.userLocation()!.join(',')
  }
  })
            .subscribe((resp) =>{
              this.isLoadingPlaces.set(false);
              this.places.set(resp.features);
              this.mapService.createMarkersFromPlaces(this.places(), this.userLocation()!);
            });
}

deletePlaces(){
  this.places.set([]);
}
}

