import { Injectable } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';

export class Bid {
  pokemonKey: string;
  shareAmount: number;
  pricePerSharePokeDollars: number;
  ownerUsername: string;

  constructor(params: BidParams) {
    this.pokemonKey = params.pokemonKey;
    this.shareAmount = params.shareAmount;
    this.pricePerSharePokeDollars = params.pricePerSharePokeDollars;
    this.ownerUsername = params.ownerUsername;
  }

  get totalCostPokeDollars() {
    return this.shareAmount * this.pricePerSharePokeDollars;
  }
}

export interface BidParams {
  pokemonKey: string;
  shareAmount: number;
  pricePerSharePokeDollars: number;
  ownerUsername: string;
}

const SEED_BIDS: Bid[] = [
  new Bid({
    pokemonKey: '3-default',
    shareAmount: 100,
    pricePerSharePokeDollars: 100,
    ownerUsername: 'red',
  }),
];

const BIDS_BY_OWNER_THEN_POKEMON_KEY: { [username: string]: { [key: string]: Bid } } = {};
SEED_BIDS.forEach((bid) => {
  if (!BIDS_BY_OWNER_THEN_POKEMON_KEY[bid.ownerUsername]) {
    BIDS_BY_OWNER_THEN_POKEMON_KEY[bid.ownerUsername] = {};
  }
  BIDS_BY_OWNER_THEN_POKEMON_KEY[bid.ownerUsername][bid.pokemonKey] = bid;
});

export class Ask {
  pokemonKey: string;
  shareAmount: number;
  pricePerSharePokeDollars: number;
  ownerUsername: string;

  constructor(params: AskParams) {
    this.pokemonKey = params.pokemonKey;
    this.shareAmount = params.shareAmount;
    this.pricePerSharePokeDollars = params.pricePerSharePokeDollars;
    this.ownerUsername = params.ownerUsername;
  }

  get totalCostPokeDollars() {
    return this.shareAmount * this.pricePerSharePokeDollars;
  }
}

export interface AskParams {
  pokemonKey: string;
  shareAmount: number;
  pricePerSharePokeDollars: number;
  ownerUsername: string;
}

const SEED_ASKS: Ask[] = [
  new Ask({
    pokemonKey: '898-ice-rider',
    shareAmount: 100,
    pricePerSharePokeDollars: 100,
    ownerUsername: 'red',
  }),
];

const ASKS_BY_OWNER_THEN_POKEMON_KEY: { [username: string]: { [key: string]: Bid } } = {};
SEED_ASKS.forEach((ask) => {
  if (!ASKS_BY_OWNER_THEN_POKEMON_KEY[ask.ownerUsername]) {
    ASKS_BY_OWNER_THEN_POKEMON_KEY[ask.ownerUsername] = {};
  }
  ASKS_BY_OWNER_THEN_POKEMON_KEY[ask.ownerUsername][ask.pokemonKey] = ask;
});

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor() {}

  getBid(ownerUsername: string, pokemonKey: string): Observable<Bid | null> {
    return of(BIDS_BY_OWNER_THEN_POKEMON_KEY[ownerUsername]?.[pokemonKey] ?? null).pipe(
      delay(1000),
      tap((bid) => console.log('Retrieved bid', bid)),
    );
  }

  cancelBid(bid: Bid): Observable<boolean> {
    const foundBid = BIDS_BY_OWNER_THEN_POKEMON_KEY[bid.ownerUsername]?.[bid.pokemonKey];
    if (foundBid) {
      delete BIDS_BY_OWNER_THEN_POKEMON_KEY[bid.ownerUsername][bid.pokemonKey];
    }
    return of(!!foundBid).pipe(delay(1000));
  }

  getAsk(ownerUsername: string, pokemonKey: string): Observable<Ask | null> {
    return of(ASKS_BY_OWNER_THEN_POKEMON_KEY[ownerUsername]?.[pokemonKey] ?? null).pipe(
      delay(1000),
      tap((ask) => console.log('Retrieved ask', ask)),
    );
  }

  cancelAsk(ask: Ask): Observable<boolean> {
    const foundAsk = ASKS_BY_OWNER_THEN_POKEMON_KEY[ask.ownerUsername]?.[ask.pokemonKey];
    if (foundAsk) {
      delete ASKS_BY_OWNER_THEN_POKEMON_KEY[ask.ownerUsername][ask.pokemonKey];
    }
    return of(!!foundAsk).pipe(delay(1000));
  }
}
