import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { environment } from './environments/environment';
 const keyMapBox = environment.keyMapBox;
Mapboxgl.accessToken = keyMapBox;
if(!navigator.geolocation){
  alert('Navegador no soporta la Geolocation');
  throw new Error('Navegador no soporta la Geolocation');
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
