import { delay, Observable, of } from 'rxjs';
import { mockDatabase } from './database';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { StockTransaction } from '../model/stock-transaction';
import { Pokemon } from '../model/pokemon';
import { PokemonOverview } from '../model/pokemon-overview';
import { PositionQuote, Portfolio } from '../model/portfolio';
import { Position } from '../model/position';

@Injectable({
  providedIn: 'root',
})
export class MockApi {
  call(params: OperationParams): Observable<any> {
    const { operationName, payload } = params;
    const operation = this.routeRequest({ operationName }).bind(this);
    return of(operation(payload)).pipe(delay(250 + 1500 * Math.random()));
  }

  routeRequest(params: { operationName: string }) {
    const { operationName } = params;
    switch (operationName) {
      case 'getAsksForPokemon':
        return this.getAsksForPokemon;
      case 'getBidsForPokemon':
        return this.getBidsForPokemon;
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
      case 'getCurrentUserPortfolio':
        return this.getCurrentUserPortfolio;
      case 'acceptAsk':
        return this.acceptAsk;
      default:
        throw new Error(`Unknown operation: ${operationName}`);
    }
  }

  getAsksForPokemon(params: { pokemonKey: string }): StockTransaction[] {
    const { pokemonKey } = params;
    const matchedTransactions = mockDatabase.stockTransactionsTable.select(
      (transaction) =>
        transaction.pokemonKey === pokemonKey && transaction.isAsk,
    );
    return matchedTransactions;
  }
  getBidsForPokemon(params: { pokemonKey: string }): StockTransaction[] {
    const { pokemonKey } = params;
    const matchedTransactions = mockDatabase.stockTransactionsTable.select(
      (transaction) =>
        transaction.pokemonKey === pokemonKey && transaction.isBid,
    );
    return matchedTransactions;
  }

  cancelTransaction(transaction: StockTransaction): boolean {
    const deletedCount = mockDatabase.stockTransactionsTable.delete(
      (row) => row === transaction,
    );

    return !!deletedCount;
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
    const lastTransaction = mockDatabase.stockTransactionsTable
      .select(
        (transaction) =>
          transaction.pokemonKey === pokemonKey && transaction.isCompleted,
      )
      .reduce(
        (acc: StockTransaction | null, transaction: StockTransaction) =>
          !acc ||
          (transaction.completedDate &&
            transaction.completedDate >
              (acc as StockTransaction)!.completedDate!)
            ? transaction
            : (acc as StockTransaction),
        null,
      ) as StockTransaction | null;

    const lowestAsk = mockDatabase.stockTransactionsTable
      .select(
        (transaction) =>
          transaction.pokemonKey === pokemonKey && transaction.isAsk,
      )
      .reduce(
        (acc: StockTransaction | null, transaction: StockTransaction) =>
          !acc ||
          transaction.sharePricePokeDollars <
            (acc as StockTransaction)!.sharePricePokeDollars
            ? transaction
            : (acc as StockTransaction),
        null,
      );

    const highestBid = mockDatabase.stockTransactionsTable
      .select(
        (transaction) =>
          transaction.pokemonKey === pokemonKey && transaction.isBid,
      )
      .reduce(
        (acc: StockTransaction | null, transaction: StockTransaction) =>
          !acc ||
          transaction.sharePricePokeDollars >
            (acc as StockTransaction)!.sharePricePokeDollars
            ? transaction
            : (acc as StockTransaction),
        null,
      );

    const pendingTransaction = mockDatabase.stockTransactionsTable.selectOne(
      (transaction) =>
        transaction.pokemonKey === pokemonKey &&
        transaction.isOpen &&
        (transaction.buyerUsername === ownerUsername ||
          transaction.sellerUsername === ownerUsername),
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

  getCurrentUserPortfolio(): Portfolio {
    const currentUser = this.getCurrentUser();

    const ownedPositions = mockDatabase.positionsTable.select(
      (position) => position.ownerUsername === currentUser.username,
    );
    const ownedPositionsByPokemonKey: Record<string, Position> = {};
    ownedPositions.forEach((position) => {
      ownedPositionsByPokemonKey[position.pokemonKey] = position;
    });

    const stakedPokemonKeys = ownedPositions.reduce(
      (acc, position) => acc.add(position.pokemonKey),
      new Set<string>(),
    );

    const stakedPokemon = mockDatabase.pokemonTable.select((pokemon) =>
      stakedPokemonKeys.has(pokemon.key),
    );

    const lastTransactions = mockDatabase.stockTransactionsTable
      .select(
        (transaction) =>
          transaction.isCompleted &&
          stakedPokemonKeys.has(transaction.pokemonKey),
      )
      .reduce((acc: Map<string, StockTransaction>, transaction) => {
        const existingTransaction = acc.get(transaction.pokemonKey);

        const isNewerTransaction =
          !existingTransaction ||
          (transaction.completedDate &&
            existingTransaction.completedDate &&
            transaction.completedDate > existingTransaction.completedDate);

        if (isNewerTransaction) {
          acc.set(transaction.pokemonKey, transaction);
        }
        return acc;
      }, new Map<string, StockTransaction>());

    const positionsByPokemonKey: Record<string, PositionQuote> = stakedPokemon
      .map((pokemon) => {
        const position = ownedPositionsByPokemonKey[pokemon.key];
        const lastTransaction = lastTransactions.get(pokemon.key);

        return new PositionQuote({
          pokemon,
          ownedSharesCount: position?.ownedSharesCount || 0,
          sharePricePokeDollars: lastTransaction?.sharePricePokeDollars || 0,
        });
      })
      .reduce((acc: Record<string, PositionQuote>, position) => {
        acc[position.pokemon.key] = position;
        return acc;
      }, {});

    return new Portfolio({
      positionsByPokemonKey,
      cashPokeDollars: currentUser.freeCashPokeDollars,
    });
  }

  acceptAsk(params: { pokemonKey: string; askOwnerUsername: string }) {
    const { pokemonKey, askOwnerUsername } = params;

    const askTransaction = mockDatabase.stockTransactionsTable.selectOne(
      (transaction) =>
        transaction.pokemonKey === pokemonKey &&
        transaction.isAsk &&
        transaction.sellerUsername === askOwnerUsername,
    );

    const buyer = this.getCurrentUser();
    const seller = mockDatabase.usersTable.selectOne(
      (user) => user.username === askOwnerUsername,
    );

    if (
      !buyer ||
      !seller ||
      !askTransaction ||
      buyer.freeCashPokeDollars < askTransaction.totalCostPokeDollars
    ) {
      return false;
    }

    mockDatabase.stockTransactionsTable.update(
      (transaction) => transaction === askTransaction,
      (transaction) =>
        new StockTransaction({
          ...transaction,
          buyerUsername: buyer.username,
          completedDate: new Date(),
        } as StockTransaction),
    );

    mockDatabase.usersTable.update(
      (user) => user.username === buyer.username,
      (user) =>
        new User({
          ...user,
          freeCashPokeDollars:
            user.freeCashPokeDollars - askTransaction.totalCostPokeDollars,
        }),
    );
    mockDatabase.usersTable.update(
      (user) => user.username === seller.username,
      (user) =>
        new User({
          ...user,
          freeCashPokeDollars:
            user.freeCashPokeDollars + askTransaction.totalCostPokeDollars,
        }),
    );
    mockDatabase.positionsTable.update(
      (position) =>
        position.pokemonKey === pokemonKey &&
        position.ownerUsername === seller.username,
      (position) =>
        new Position({
          ...position,
          ownedSharesCount:
            position.ownedSharesCount - askTransaction.shareCount,
        }),
    );
    const sellerUpdatedPosition = mockDatabase.positionsTable.selectOne(
      (position) =>
        position.pokemonKey === pokemonKey &&
        position.ownerUsername === seller.username,
    );
    if (sellerUpdatedPosition && sellerUpdatedPosition.ownedSharesCount === 0) {
      mockDatabase.positionsTable.delete(
        (position) =>
          position.pokemonKey === pokemonKey &&
          position.ownerUsername === seller.username,
      );
    }

    const buyersCurrentPosition = mockDatabase.positionsTable.selectOne(
      (position) =>
        position.pokemonKey === pokemonKey &&
        position.ownerUsername === buyer.username,
    );
    if (buyersCurrentPosition) {
      mockDatabase.positionsTable.update(
        (position) =>
          position.pokemonKey === pokemonKey &&
          position.ownerUsername === buyer.username,
        (position) =>
          new Position({
            ...position,
            ownedSharesCount:
              position.ownedSharesCount + askTransaction.shareCount,
          }),
      );
    } else {
      mockDatabase.positionsTable.insert([
        new Position({
          pokemonKey,
          ownerUsername: buyer.username,
          ownedSharesCount: askTransaction.shareCount,
        }),
      ]);
    }
    return true;
  }
}

export interface OperationParams {
  operationName: string;
  payload?: any;
}
