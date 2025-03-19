import { delay, Observable, of } from 'rxjs';
import { mockDatabase } from './database';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { StockTransaction } from '../model/stock-transaction';

@Injectable({
  providedIn: 'root',
})
export class MockApi {
  callOperation(params: OperationParams): Observable<any> {
    const { name, payload } = params;
    const operation = this.routeRequest({ name });
    return of(operation(payload)).pipe(delay(250 + 1750 * Math.random()));
  }

  routeRequest(params: { name: string }) {
    const { name } = params;
    switch (name) {
      case 'getTransactionsForPokemon':
        return this.getTransactionsForPokemon;
      case 'getTransactionsForOwnerByPokemon':
        return this.getTransactionsForOwnerByPokemon;
      case 'getCurrentUser':
        return this.getCurrentUser;
      case 'cancelTransaction':
        return this.cancelTransaction;
      default:
        throw new Error(`Unknown operation: ${name}`);
    }
  }

  getTransactionsForOwnerByPokemon(params: {
    ownerUsername: string;
    pokemonKey: string;
    status: string;
  }): StockTransaction[] {
    const { ownerUsername, pokemonKey, status } = params;
    const matchedTransactions = mockDatabase.stockTransactionsTable.select(
      (transaction) =>
        transaction.ownerUsername === ownerUsername &&
        transaction.pokemonKey === pokemonKey &&
        transaction.status === status,
    );

    return matchedTransactions;
  }

  getTransactionsForPokemon(params: {
    pokemonKey: string;
    status: string;
    type: string;
  }): StockTransaction[] {
    const { pokemonKey, status, type } = params;
    const matchedTransactions = mockDatabase.stockTransactionsTable.select(
      (transaction) =>
        transaction.pokemonKey === pokemonKey &&
        transaction.status === status &&
        transaction.type === type,
    );

    return matchedTransactions;
  }

  cancelTransaction(transaction: StockTransaction): boolean {
    const rowsUpdatedCount = mockDatabase.stockTransactionsTable.update(
      (row) => row === transaction,
      (row) => new StockTransaction({ ...row, status: 'cancelled' }),
    );
    return !!rowsUpdatedCount;
  }

  getCurrentUser(): User {
    return mockDatabase.usersTable.selectOne((user) => user.username === 'red')!;
  }
}

export interface OperationParams {
  name: string;
  payload?: any;
}
