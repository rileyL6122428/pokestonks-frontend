import { Pokemon } from '../model/pokemon';
import { StockTransaction } from '../model/stock-transaction';
import { User } from '../model/user';

export class MockDatabaseTable<T> {
  private rows: T[] = [];

  insert(rows: T[]) {
    this.rows.push(...rows);
  }

  delete(predicate: (row: T) => boolean) {
    this.rows = this.rows.filter((row) => !predicate(row));
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

export class MockDatabase {
  readonly stockTransactionsTable = new StockTransactionTable();
  readonly usersTable = new UserTable();
  readonly pokemonTable = new PokemonTable();

  seed() {
    this.stockTransactionsTable.insert([
      new StockTransaction({
        pokemonKey: '3-default',
        shareCount: 100,
        sharePricePokeDollars: 100,
        ownerUsername: 'red',
        type: 'bid',
        status: 'pending',
      }),
      new StockTransaction({
        pokemonKey: '898-ice-rider',
        shareCount: 100,
        sharePricePokeDollars: 105,
        ownerUsername: 'red',
        type: 'ask',
        status: 'pending',
      }),
      new StockTransaction({
        pokemonKey: '898-ice-rider',
        shareCount: 200,
        sharePricePokeDollars: 105,
        ownerUsername: 'oak',
        type: 'ask',
        status: 'pending',
      }),
      new StockTransaction({
        pokemonKey: '898-ice-rider',
        shareCount: 100,
        sharePricePokeDollars: 106,
        ownerUsername: 'lorelei',
        type: 'ask',
        status: 'pending',
      }),
    ]);

    this.usersTable.insert([
      new User({
        username: 'red',
      }),
      new User({
        username: 'oak',
      }),
      new User({
        username: 'lorelei',
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
        availableShares: 200,
        bidPokeDollars: 99,
        askPokeDollars: 105,
        lastTradePokeDollars: 100,
      }),
      new Pokemon({
        number: 898,
        form: 'ice-rider',
        name: 'Ice Rider Calyrex',
        slogan: 'DLC cost for DLC quality',
        operatingMarginPercent: 80,
        totalShares: 1000,
        availableShares: 200,
        bidPokeDollars: 99,
        askPokeDollars: 105,
        lastTradePokeDollars: 100,
      }),
      new Pokemon({
        number: 898,
        form: 'shadow-rider',
        name: 'Shadow Rider Calyrex',
        slogan: 'Eclipsing Mewtwo since October 23rd, 2020.',
        operatingMarginPercent: 80,
        totalShares: 1000,
        availableShares: 200,
        bidPokeDollars: 99,
        askPokeDollars: 105,
        lastTradePokeDollars: 100,
      }),
    ]);
  }
}

export const mockDatabase = new MockDatabase();
mockDatabase.seed();
