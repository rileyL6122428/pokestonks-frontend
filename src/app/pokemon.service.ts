import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export class Pokemon {
  number: number;
  form: string;
  name: string;
  slogan: string;
  operatingMarginPercent: number;
  totalShares: number;
  availableShares: number;
  bidPokeDollars: number;
  askPokeDollars: number;
  lastTradePokeDollars: number;

  constructor(
    params: PokemonParams = {
      number: 0,
      form: '',
      name: '',
      slogan: '',
      operatingMarginPercent: 0,
      totalShares: 0,
      availableShares: 0,
      bidPokeDollars: 0,
      askPokeDollars: 0,
      lastTradePokeDollars: 0,
    },
  ) {
    this.number = params.number;
    this.form = params.form;
    this.name = params.name;
    this.slogan = params.slogan;
    this.operatingMarginPercent = params.operatingMarginPercent;
    this.totalShares = params.totalShares;
    this.availableShares = params.availableShares;
    this.bidPokeDollars = params.bidPokeDollars;
    this.askPokeDollars = params.askPokeDollars;
    this.lastTradePokeDollars = params.lastTradePokeDollars;
  }

  get marketCapPokeDollars() {
    return (this.totalShares - this.availableShares) * this.lastTradePokeDollars;
  }

  get key(): string {
    return `${this.number}-${this.form}`;
  }
}

export interface PokemonParams {
  number: number;
  form: string;
  name: string;
  slogan: string;
  operatingMarginPercent: number;
  totalShares: number;
  availableShares: number;
  bidPokeDollars: number;
  askPokeDollars: number;
  lastTradePokeDollars: number;
}

const ALL_POKEMON: Pokemon[] = [
  new Pokemon({
    number: 898,
    form: 'ice-rider',
    name: 'Ice Rider Calyrex',
    slogan: 'DLC cost for DLC quality',
    operatingMarginPercent: 80,
    totalShares: 1000,
    availableShares: 200,
    bidPokeDollars: 99,
    askPokeDollars: 105,
    lastTradePokeDollars: 100,
  }),
  new Pokemon({
    number: 898,
    form: 'shadow-rider',
    name: 'Shadow Rider Calyrex',
    slogan: 'Eclipsing Mewtwo since October 23rd, 2020.',
    operatingMarginPercent: 80,
    totalShares: 1000,
    availableShares: 200,
    bidPokeDollars: 99,
    askPokeDollars: 105,
    lastTradePokeDollars: 100,
  }),
];

const POKEMON_BY_NUMBER_FORM: { [key: string]: Pokemon } = {
  '898-ice-rider': ALL_POKEMON[0],
  '898-shadow-rider': ALL_POKEMON[1],
};

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  getPokemon(params: { key: string }): Observable<Pokemon> {
    return of(POKEMON_BY_NUMBER_FORM[params.key]);
  }

  searchPokemon(query: string): Observable<Pokemon[]> {
    if (!query) {
      return of([]);
    }

    const lowerCaseQuery = query.toLowerCase();
    return of(
      ALL_POKEMON.filter((pokemon) => pokemon.name.toLowerCase().includes(lowerCaseQuery)).slice(
        0,
        5,
      ),
    );
  }
}
