import { delay, Observable, of } from 'rxjs';
import { mockDatabase } from './database';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { StockTransaction } from '../model/stock-transaction';
import { Pokemon } from '../model/pokemon';

@Injectable({
  providedIn: 'root',
})
export class MockApi {
  call(params: OperationParams): Observable<any> {
    const { operationName, payload } = params;
    const operation = this.routeRequest({ operationName });
    return of(operation(payload)).pipe(delay(250 + 1500 * Math.random()));
  }

  routeRequest(params: { operationName: string }) {
    const { operationName } = params;
    switch (operationName) {
      case 'getTransactionsForPokemon':
        return this.getTransactionsForPokemon;
      case 'getTransactionsForOwnerByPokemon':
        return this.getTransactionsForOwnerByPokemon;
      case 'getCurrentUser':
        return this.getCurrentUser;
      case 'cancelTransaction':
        return this.cancelTransaction;
      case 'getAPokemon':
        return this.getAPokemon;
      case 'searchPokemon':
        return this.searchPokemon;
      default:
        throw new Error(`Unknown operation: ${operationName}`);
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

  getAPokemon(params: { key: string }): Pokemon {
    return mockDatabase.pokemonTable.selectOne((pokemon) => pokemon.key === params.key)!;
  }

  searchPokemon(params: { query: string }): Pokemon[] {
    const { query } = params;
    return mockDatabase.pokemonTable
      .select((pokemon) => pokemon.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }
}

export interface OperationParams {
  operationName: string;
  payload?: any;
}
