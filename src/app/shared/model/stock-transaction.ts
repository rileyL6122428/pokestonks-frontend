export type StockTransactionType = 'bid' | 'ask';
export type StockTransactionStatus = 'pending' | 'completed' | 'cancelled';

export class StockTransaction {
  pokemonKey: string;
  shareCount: number;
  sharePricePokeDollars: number;
  buyerUsername: string = '';
  sellerUsername: string = '';
  completedDate?: Date;

  constructor(params: StockTransactionParams) {
    this.pokemonKey = params.pokemonKey;
    this.shareCount = params.shareCount;
    this.sharePricePokeDollars = params.sharePricePokeDollars;
    this.completedDate = params.completedDate;

    if (!params.buyerUsername && !params.sellerUsername) {
      throw new Error(
        'Either buyerUsername or sellerUsername must be provided',
      );
    }
    if (params.buyerUsername) {
      this.buyerUsername = params.buyerUsername;
    }
    if (params.sellerUsername) {
      this.sellerUsername = params.sellerUsername;
    }
  }

  get totalCostPokeDollars() {
    return this.shareCount * this.sharePricePokeDollars;
  }

  get isBid() {
    return !!(
      this.buyerUsername &&
      !this.sellerUsername &&
      !this.completedDate
    );
  }

  get isAsk() {
    return !!(
      !this.buyerUsername &&
      this.sellerUsername &&
      !this.completedDate
    );
  }

  get isCompleted() {
    return !!(this.completedDate && this.buyerUsername && this.sellerUsername);
  }

  get isOpen() {
    return !!((this.isBid || this.isAsk) && !this.completedDate);
  }
}

export interface StockTransactionParams {
  pokemonKey: string;
  shareCount: number;
  sharePricePokeDollars: number;
  buyerUsername?: string;
  sellerUsername?: string;
  completedDate?: Date;
}
