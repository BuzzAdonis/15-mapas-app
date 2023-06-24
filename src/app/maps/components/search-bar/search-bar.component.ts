import { PlacesService } from './../../services';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  private placesService = inject( PlacesService )
  private debounceTimer?: NodeJS.Timeout;

  onQueryChanged(query: string) {

    if( this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(()=>{
      this.placesService.getPlacesByQuery(query);
    }),350;

  }
}
