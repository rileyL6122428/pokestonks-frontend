import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Pokemon {
  number: number;
  form: string;
  name: string;
  slogan: string;
  operatingMarginPercent: number;
  stockPricePokeDollars: number;
  totalShares: number;
  availableShares: number;
  marketCapPokeDollars: number;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  constructor() {}

  getPokemon(params: { number: number; form: string }): Observable<Pokemon> {
    return of({
      number: params.number,
      form: params.form,
      name: 'Ice Rider Calyrex',
      slogan: 'DLC cost for DLC quality',
      operatingMarginPercent: 80,
      stockPricePokeDollars: 100,
      totalShares: 1000,
      availableShares: 200,
      marketCapPokeDollars: 80000,
    });
  }
}
