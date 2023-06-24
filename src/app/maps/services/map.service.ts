import { DirectcionApiClient } from './../api';
import { Injectable, computed, inject } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { DirectionResponse, Feature, Route } from '../interfaces';
@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: Map;
  private markers?:Marker[];
  private directcionApiClient = inject(DirectcionApiClient);
  public  isMapReady          = computed(()=> !!this.map);

  setMap( map: Map ){
    this.map = map;
  }

  flyTo(coords:LngLatLike){
    if(!this.isMapReady) throw Error('El Mapa no esta inicilizado');
    this.map?.flyTo({
      zoom:14,
      center:coords
    })
  }
  createMarkersFromPlaces( places:Feature[], userLocation:[number, number] ){

    if(!this.map) throw Error('El Mapa no esta inicilizado');

    this.markers?.forEach(marker => marker.remove());
    const newMarkerts = [];
    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup()
                          .setHTML(`
                          <h6>${place.text}</h6>
                          <span>${place.place_name}</span>
                          `);
      const newMarker = new Marker()
                              .setLngLat([lng, lat])
                              .setPopup(popup)
                              .addTo(this.map);
      newMarkerts.push(newMarker);
    }
    this.markers = newMarkerts;

    if(places.length===0) return;

    const bounnds = new LngLatBounds( );
    newMarkerts.forEach(markers => bounnds.extend(markers.getLngLat()) );
    bounnds.extend(userLocation);
    this.map.fitBounds(bounnds,{
      padding:200
    });
  }

  getRouteBetweenPoints( strar:[number, number], end:[number, number] ) {

    this.directcionApiClient.get<DirectionResponse>(`/${strar.join(',')};${end.join(',')}`)
                            .subscribe(resp=> this.drawPolyline(resp.routes[0]) );

  }

  private drawPolyline( route:Route ){
    if(!this.map) throw Error('El Mapa no esta inicilizado');
    const coords = route.geometry.coordinates;
    const start  = coords[0] as [number, number];
    const bounds = new LngLatBounds();

    coords.forEach(([lng, lat]) =>{
      bounds.extend([lng, lat]);
    });

    this.map?.fitBounds( bounds , {
      padding:200
    });

    if(this.map.getLayer('RouterString')){
      this.map.removeLayer('RouterString');
      this.map.removeSource('RouterString');
    }

    const sourceData: AnySourceData = {
      type:'geojson',
      data:{
        type:'FeatureCollection',
        features:[
          {
            type:'Feature',
            properties:{},
            geometry:{
              type:'LineString',
              coordinates:coords
            }
          }
        ]
      }
    };

    this.map.addSource('RouterString', sourceData);
    this.map.addLayer({
      id:'RouterString',
      type:'line',
      source:'RouterString',
      layout:{
        "line-cap": 'round',
        "line-join":'round'
      },
      paint:{
        "line-color":'purple',
        "line-width":3
      }
    });

  }

}
