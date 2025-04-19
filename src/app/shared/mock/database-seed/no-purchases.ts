import { Pokemon } from '../../model/pokemon';
import { StockTransaction } from '../../model/stock-transaction';
import { User, SPECIAL_USERNAMES } from '../../model/user';
import { MockDatabase } from '../database';

export class NoPurchasesSeed {
  get users(): User[] {
    return [
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
      new User({
        username: SPECIAL_USERNAMES.INVESTMENT_BANKER,
        freeCashPokeDollars: 0,
      }),
    ];
  }

  get pokemon(): Pokemon[] {
    return [
      new Pokemon({
        number: 3,
        form: 'default',
        name: 'Venusaur',
        slogan: 'Sleep powder giveth, sleep powder taketh.',
        operatingMarginPercent: 60,
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
    ];
  }

  get completedStockTransactions(): StockTransaction[] {
    return [];
  }

  get pendingStockTransaction(): StockTransaction[] {
    return [
      new StockTransaction({
        pokemonKey: '3-default',
        shareCount: 100,
        sharePricePokeDollars: 80,
        sellerUsername: SPECIAL_USERNAMES.INVESTMENT_BANKER,
      }),
      new StockTransaction({
        pokemonKey: '898-ice-rider',
        shareCount: 100,
        sharePricePokeDollars: 105,
        sellerUsername: SPECIAL_USERNAMES.INVESTMENT_BANKER,
      }),
      new StockTransaction({
        pokemonKey: '898-shadow-rider',
        shareCount: 100,
        sharePricePokeDollars: 106,
        sellerUsername: SPECIAL_USERNAMES.INVESTMENT_BANKER,
      }),
    ];
  }

  applyTo(mockDatabase: MockDatabase): void {
    mockDatabase.usersTable.insert(this.users);
    mockDatabase.pokemonTable.insert(this.pokemon);
    mockDatabase.stockTransactionsTable.insert(this.completedStockTransactions);
    mockDatabase.stockTransactionsTable.insert(this.pendingStockTransaction);
  }
}
