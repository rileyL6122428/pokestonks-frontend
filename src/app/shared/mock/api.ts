import { delay, Observable, of } from 'rxjs';
import { mockDatabase } from './database';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { StockTransaction } from '../model/stock-transaction';
import { Pokemon } from '../model/pokemon';
import { PokemonOverview } from '../model/pokemon-overview';

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
      case 'getPokemonOverviewForUser':
        return this.getPokemonOverviewForUser;
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
    return mockDatabase.usersTable.selectOne(
      (user) => user.username === 'red',
    )!;
  }

  getAPokemon(params: { key: string }): Pokemon {
    return mockDatabase.pokemonTable.selectOne(
      (pokemon) => pokemon.key === params.key,
    )!;
  }

  searchPokemon(params: { query: string }): Pokemon[] {
    const { query } = params;
    return mockDatabase.pokemonTable
      .select((pokemon) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 5);
  }

  getPokemonOverviewForUser(params: {
    ownerUsername: string;
    pokemonKey: string;
  }) {
    const { ownerUsername, pokemonKey } = params;

    const pokemon = mockDatabase.pokemonTable.selectOne(
      (pokemon) => pokemon.key === pokemonKey,
    )!;
    const position = mockDatabase.positionsTable.selectOne(
      (position) =>
        position.ownerUsername === ownerUsername &&
        position.pokemonKey === pokemonKey,
    );
    const lastTransaction = mockDatabase.stockTransactionsTable.selectOne(
      (transaction) =>
        transaction.pokemonKey === pokemonKey &&
        transaction.status === 'completed',
    )!;
    const lowestAsk = mockDatabase.stockTransactionsTable.selectOne(
      (transaction) =>
        transaction.pokemonKey === pokemonKey &&
        transaction.type === 'ask' &&
        transaction.status === 'pending',
    );
    const highestBid = mockDatabase.stockTransactionsTable.selectOne(
      (transaction) =>
        transaction.pokemonKey === pokemonKey &&
        transaction.type === 'bid' &&
        transaction.status === 'pending',
    );

    const pendingTransaction = mockDatabase.stockTransactionsTable.selectOne(
      (transaction) =>
        transaction.pokemonKey === pokemonKey &&
        transaction.status === 'pending' &&
        (transaction.type === 'bid' || transaction.type === 'ask') &&
        transaction.ownerUsername === ownerUsername,
    );

    const positionsInPokemon = mockDatabase.positionsTable.select(
      (position) => position.pokemonKey === pokemonKey,
    );

    const availableShares =
      pokemon.totalShares -
      positionsInPokemon.reduce(
        (acc, position) => acc + position.ownedSharesCount,
        0,
      );

    return new PokemonOverview({
      pokemon,
      position,
      lastTransaction,
      lowestAsk,
      highestBid,
      pendingTransaction,
      availableShares,
    });
  }
}

export interface OperationParams {
  operationName: string;
  payload?: any;
}
