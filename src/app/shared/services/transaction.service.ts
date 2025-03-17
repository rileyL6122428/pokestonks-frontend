import { Injectable } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import {
  StockTransaction,
  StockTransactionStatus,
  StockTransactionType,
} from '../model/stock-transaction';
import { mockDatabase } from '../mock/database';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  getTransactionsForOwner(
    ownerUsername: string,
    pokemonKey: string,
    status: StockTransactionStatus,
  ): Observable<StockTransaction[]> {
    const matched = mockDatabase.stockTransactionsTable.select(
      (transaction) =>
        transaction.ownerUsername === ownerUsername &&
        transaction.pokemonKey === pokemonKey &&
        transaction.status === status,
    );
    return of(matched ?? []).pipe(
      delay(1000),
      tap((transaction) => console.log('Retrieved transaction', transaction)),
    );
  }

  getTransactionsForPokemon(params: {
    pokemonKey: string;
    status: StockTransactionStatus;
    type: StockTransactionType;
  }): Observable<StockTransaction[]> {
    const { pokemonKey, status, type } = params;
    const matched = mockDatabase.stockTransactionsTable.select(
      (transaction) =>
        transaction.pokemonKey === pokemonKey &&
        transaction.status === status &&
        transaction.type === type,
    );

    return of(matched).pipe(
      delay(1000),
      tap((transaction) => console.log('Retrieved transaction', transaction)),
    );
  }

  cancelTransaction(transaction: StockTransaction): Observable<boolean> {
    const rowsUpdatedCount = mockDatabase.stockTransactionsTable.update(
      (row) => row === transaction,
      (row) => new StockTransaction({ ...row, status: 'cancelled' }),
    );
    return of(!!rowsUpdatedCount).pipe(delay(1000));
  }
}
