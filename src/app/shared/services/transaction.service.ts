import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockApi } from '../mock/api';
import { StockTransaction } from '../model/stock-transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private api: MockApi) {}

  getAsksForPokemon(params: {
    pokemonKey: string;
  }): Observable<StockTransaction[]> {
    return this.api.call({
      operationName: 'getAsksForPokemon',
      payload: params,
    });
  }

  cancelTransaction(transaction: StockTransaction): Observable<boolean> {
    return this.api.call({
      operationName: 'cancelTransaction',
      payload: transaction,
    });
  }

  acceptAsk(params: {
    pokemonKey: string;
    askOwnerUsername: string;
  }): Observable<boolean> {
    return this.api.call({
      operationName: 'acceptAsk',
      payload: params,
    });
  }
}
