import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MockApi } from '../mock/api';
import { Pokemon } from '../model/pokemon';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  constructor(private api: MockApi) {}

  getPokemon(params: { key: string }): Observable<Pokemon> {
    return this.api.call({
      operationName: 'getAPokemon',
      payload: params,
    });
  }

  searchPokemon(query: string): Observable<Pokemon[]> {
    if (!query) {
      return of([]);
    }

    return this.api.call({
      operationName: 'searchPokemon',
      payload: { query },
    });
  }
}
