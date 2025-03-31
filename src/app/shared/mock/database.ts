import { Pokemon } from '../model/pokemon';
import { Position } from '../model/position';
import { StockTransaction } from '../model/stock-transaction';
import { User } from '../model/user';

export class MockDatabaseTable<T> {
  private rows: T[] = [];

  insert(rows: T[]) {
    this.rows.push(...rows);
  }

  delete(predicate: (row: T) => boolean): number {
    this.rows = this.rows.filter((row) => !predicate(row));
    return this.rows.length;
  }

  update(predicate: (row: T) => boolean, updater: (row: T) => T): number {
    let updatedRowsCount = 0;
    this.rows = this.rows.map((row) => {
      if (predicate(row)) {
        updatedRowsCount++;
        return updater(row);
      }
      return row;
    });
    return updatedRowsCount;
  }

  selectAll(): T[] {
    return this.rows;
  }

  select(predicate: (row: T) => boolean): T[] {
    return this.rows.filter(predicate);
  }

  selectOne(predicate: (row: T) => boolean): T | null {
    return this.rows.find(predicate) ?? null;
  }
}

class StockTransactionTable extends MockDatabaseTable<StockTransaction> {}
class UserTable extends MockDatabaseTable<User> {}
class PokemonTable extends MockDatabaseTable<Pokemon> {}
class PositionTable extends MockDatabaseTable<Position> {}

export class MockDatabase {
  readonly stockTransactionsTable = new StockTransactionTable();
  readonly usersTable = new UserTable();
  readonly pokemonTable = new PokemonTable();
  readonly positionsTable = new PositionTable();

  seed() {
    this.stockTransactionsTable.insert([
      new StockTransaction({
        pokemonKey: '3-default',
        shareCount: 100,
        sharePricePokeDollars: 100,
        buyerUsername: 'red',
      }),
      new StockTransaction({
        pokemonKey: '898-ice-rider',
        shareCount: 100,
        sharePricePokeDollars: 105,
        sellerUsername: 'red',
      }),
      new StockTransaction({
        pokemonKey: '898-ice-rider',
        shareCount: 200,
        sharePricePokeDollars: 105,
        sellerUsername: 'oak',
      }),
      new StockTransaction({
        pokemonKey: '898-ice-rider',
        shareCount: 100,
        sharePricePokeDollars: 106,
        sellerUsername: 'lorelei',
      }),
      new StockTransaction({
        pokemonKey: '898-ice-rider',
        shareCount: 100,
        sharePricePokeDollars: 100,
        buyerUsername: 'pryce',
        sellerUsername: 'lorelei',
        completedDate: new Date('2023-10-01T00:00:00Z'),
      }),
      new StockTransaction({
        pokemonKey: '3-default',
        shareCount: 100,
        sharePricePokeDollars: 85,
        sellerUsername: 'pryce',
        buyerUsername: 'lorelei',
        completedDate: new Date('2023-10-01T00:00:00Z'),
      }),
      new StockTransaction({
        pokemonKey: '898-ice-rider',
        shareCount: 100,
        sharePricePokeDollars: 98,
        sellerUsername: 'wulfric',
      }),
    ]);

    this.usersTable.insert([
      new User({
        username: 'red',
        freeCashPokeDollars: 50000,
      }),
      new User({
        username: 'oak',
        freeCashPokeDollars: 50000,
      }),
      new User({
        username: 'lorelei',
        freeCashPokeDollars: 50000,
      }),
      new User({
        username: 'wulfric',
        freeCashPokeDollars: 50000,
      }),
    ]);

    this.pokemonTable.insert([
      new Pokemon({
        number: 3,
        form: 'default',
        name: 'Venusaur',
        slogan: 'Sleep powder giveth, sleep powder taketh.',
        operatingMarginPercent: 80,
        totalShares: 1000,
      }),
      new Pokemon({
        number: 898,
        form: 'ice-rider',
        name: 'Ice Rider Calyrex',
        slogan: 'DLC cost for DLC quality',
        operatingMarginPercent: 80,
        totalShares: 1000,
      }),
      new Pokemon({
        number: 898,
        form: 'shadow-rider',
        name: 'Shadow Rider Calyrex',
        slogan: 'Eclipsing Mewtwo since October 23rd, 2020.',
        operatingMarginPercent: 80,
        totalShares: 1000,
      }),
    ]);

    this.positionsTable.insert([
      new Position({
        pokemonKey: '898-ice-rider',
        ownedSharesCount: 200,
        ownerUsername: 'wulfric',
      }),
      new Position({
        pokemonKey: '898-ice-rider',
        ownedSharesCount: 200,
        ownerUsername: 'oak',
      }),
      new Position({
        pokemonKey: '898-ice-rider',
        ownedSharesCount: 200,
        ownerUsername: 'lorelei',
      }),
      new Position({
        pokemonKey: '898-ice-rider',
        ownedSharesCount: 200,
        ownerUsername: 'red',
      }),
      new Position({
        pokemonKey: '3-default',
        ownedSharesCount: 100,
        ownerUsername: 'red',
      }),
      new Position({
        pokemonKey: '898-ice-rider',
        ownedSharesCount: 100,
        ownerUsername: 'pryce',
      }),
    ]);
  }
}

export const mockDatabase = new MockDatabase();
mockDatabase.seed();
