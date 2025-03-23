import { Injectable } from '@angular/core';
import { MockApi } from '../mock/api';
import { Observable } from 'rxjs';
import { PokemonOverview } from '../model/pokemon-overview';

@Injectable({
  providedIn: 'root',
})
export class PokemonOverviewService {
  constructor(private api: MockApi) {}

  getPokemonOverviewForUser(params: {
    ownerUsername: string;
    pokemonKey: string;
  }): Observable<PokemonOverview> {
    return this.api.call({
      operationName: 'getPokemonOverviewForUser',
      payload: params,
    });
  }
}
