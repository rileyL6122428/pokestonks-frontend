import { Injectable } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';

export type StockTransactionType = 'bid' | 'ask';
export type StockTransactionStatus = 'pending' | 'completed' | 'cancelled';

export class StockTransaction {
  pokemonKey: string;
  shareAmount: number;
  pricePerSharePokeDollars: number;
  ownerUsername: string;
  type: 'bid' | 'ask';
  status: 'pending' | 'completed' | 'cancelled';

  constructor(params: StockTransactionParams) {
    this.pokemonKey = params.pokemonKey;
    this.shareAmount = params.shareAmount;
    this.pricePerSharePokeDollars = params.pricePerSharePokeDollars;
    this.ownerUsername = params.ownerUsername;
    this.type = params.type;
    this.status = params.status;
  }

  get totalCostPokeDollars() {
    return this.shareAmount * this.pricePerSharePokeDollars;
  }
}

export interface StockTransactionParams {
  pokemonKey: string;
  shareAmount: number;
  pricePerSharePokeDollars: number;
  ownerUsername: string;
  type: 'bid' | 'ask';
  status: 'pending' | 'completed' | 'cancelled';
}

const SEED_STOCK_TRANSACTIONS: StockTransaction[] = [
  new StockTransaction({
    pokemonKey: '3-default',
    shareAmount: 100,
    pricePerSharePokeDollars: 100,
    ownerUsername: 'red',
    type: 'bid',
    status: 'pending',
  }),
  new StockTransaction({
    pokemonKey: '898-ice-rider',
    shareAmount: 100,
    pricePerSharePokeDollars: 100,
    ownerUsername: 'red',
    type: 'ask',
    status: 'pending',
  }),
];

const TRANSACTIONS_BY_OWNER_THEN_POKEMON_KEY: {
  [username: string]: { [key: string]: StockTransaction[] };
} = {};
SEED_STOCK_TRANSACTIONS.forEach((transaction) => {
  if (!TRANSACTIONS_BY_OWNER_THEN_POKEMON_KEY[transaction.ownerUsername]) {
    TRANSACTIONS_BY_OWNER_THEN_POKEMON_KEY[transaction.ownerUsername] = {};
  }
  if (!TRANSACTIONS_BY_OWNER_THEN_POKEMON_KEY[transaction.ownerUsername][transaction.pokemonKey]) {
    TRANSACTIONS_BY_OWNER_THEN_POKEMON_KEY[transaction.ownerUsername][transaction.pokemonKey] = [];
  }
  TRANSACTIONS_BY_OWNER_THEN_POKEMON_KEY[transaction.ownerUsername][transaction.pokemonKey].push(
    transaction,
  );
});

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  getTransactions(
    ownerUsername: string,
    pokemonKey: string,
    status: StockTransactionStatus,
  ): Observable<StockTransaction[]> {
    const matched = TRANSACTIONS_BY_OWNER_THEN_POKEMON_KEY[ownerUsername]?.[pokemonKey]?.filter(
      (transaction) => transaction.status === status,
    );
    return of(matched ?? []).pipe(
      delay(1000),
      tap((transaction) => console.log('Retrieved transaction', transaction)),
    );
  }

  cancelTransaction(transaction: StockTransaction): Observable<boolean> {
    const foundTransaction =
      TRANSACTIONS_BY_OWNER_THEN_POKEMON_KEY[transaction.ownerUsername]?.[transaction.pokemonKey];
    if (foundTransaction) {
      delete TRANSACTIONS_BY_OWNER_THEN_POKEMON_KEY[transaction.ownerUsername][
        transaction.pokemonKey
      ];
    }
    return of(!!foundTransaction).pipe(delay(1000));
  }
}
