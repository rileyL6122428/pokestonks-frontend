import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  StockTransaction,
  StockTransactionStatus,
  StockTransactionType,
} from '../model/stock-transaction';
import { MockApi } from '../mock/api';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private api: MockApi) {}

  getTransactionsForOwnerByPokemon(
    ownerUsername: string,
    pokemonKey: string,
    status: StockTransactionStatus,
  ): Observable<StockTransaction[]> {
    return this.api.call({
      operationName: 'getTransactionsForOwnerByPokemon',
      payload: { ownerUsername, pokemonKey, status },
    });
  }

  getTransactionsForPokemon(params: {
    pokemonKey: string;
    status: StockTransactionStatus;
    type: StockTransactionType;
  }): Observable<StockTransaction[]> {
    return this.api.call({
      operationName: 'getTransactionsForPokemon',
      payload: params,
    });
  }

  cancelTransaction(transaction: StockTransaction): Observable<boolean> {
    return this.api.call({
      operationName: 'cancelTransaction',
      payload: transaction,
    });
  }
}
