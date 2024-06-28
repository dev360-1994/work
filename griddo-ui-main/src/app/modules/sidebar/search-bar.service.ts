import { Injectable, EventEmitter } from '@angular/core';
import { SearchBarModel } from 'src/app/models/search-bar.model';


@Injectable({
  providedIn: 'root'
})
export class SearchBarService {

  toggleSearchBar: EventEmitter<SearchBarModel> = new EventEmitter();

  constructor() {

  }

}
