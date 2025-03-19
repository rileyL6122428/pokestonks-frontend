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

export class MockDatabase {
  readonly stockTransactionsTable = new StockTransactionTable();
  readonly usersTable = new UserTable();

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
  }
}

export const mockDatabase = new MockDatabase();
mockDatabase.seed();
