export type StockTransactionType = 'bid' | 'ask';
export type StockTransactionStatus = 'pending' | 'completed' | 'cancelled';

export class StockTransaction {
  pokemonKey: string;
  shareCount: number;
  sharePricePokeDollars: number;
  ownerUsername: string;
  type: 'bid' | 'ask';
  status: 'pending' | 'completed' | 'cancelled';
  completedDate?: Date;

  constructor(params: StockTransactionParams) {
    this.pokemonKey = params.pokemonKey;
    this.shareCount = params.shareCount;
    this.sharePricePokeDollars = params.sharePricePokeDollars;
    this.ownerUsername = params.ownerUsername;
    this.type = params.type;
    this.status = params.status;
    this.completedDate = params.completedDate;
  }

  get totalCostPokeDollars() {
    return this.shareCount * this.sharePricePokeDollars;
  }
}

export interface StockTransactionParams {
  pokemonKey: string;
  shareCount: number;
  sharePricePokeDollars: number;
  ownerUsername: string;
  type: 'bid' | 'ask';
  status: 'pending' | 'completed' | 'cancelled';
  completedDate?: Date;
}
