import { StockTransaction } from '../model/stock-transaction';

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
}

class StockTransactionTable extends MockDatabaseTable<StockTransaction> {}

export class MockDatabase {
  readonly stockTransactionsTable = new StockTransactionTable();

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
        ownerUsername: 'Oak',
        type: 'ask',
        status: 'pending',
      }),
      new StockTransaction({
        pokemonKey: '898-ice-rider',
        shareCount: 100,
        sharePricePokeDollars: 106,
        ownerUsername: 'Lorelei',
        type: 'ask',
        status: 'pending',
      }),
    ]);
  }
}

export const mockDatabase = new MockDatabase();
mockDatabase.seed();
