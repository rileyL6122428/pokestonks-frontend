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
}
