import { Pokemon } from './pokemon';

export class PositionQuote {
  pokemon: Pokemon;
  ownedSharesCount: number;
  sharePricePokeDollars: number;
  constructor(params: PositionQuoteParams) {
    this.pokemon = params.pokemon;
    this.ownedSharesCount = params.ownedSharesCount;
    this.sharePricePokeDollars = params.sharePricePokeDollars;
  }

  get totalValuePokeDollars(): number {
    return this.ownedSharesCount * this.sharePricePokeDollars;
  }
}

export interface PositionQuoteParams {
  pokemon: Pokemon;
  ownedSharesCount: number;
  sharePricePokeDollars: number;
}

export class Portfolio {
  private positionsByPokemonKey: Record<string, PositionQuote> = {};
  private _positionsByTotalDesc: PositionQuote[] | null = null;
  private _totalValuePokeDollars: number | null = null;
  readonly cashPokeDollars: number;

  constructor(params: PortfolioParams) {
    this.positionsByPokemonKey = params.positionsByPokemonKey;
    this.cashPokeDollars = params.cashPokeDollars;
  }

  get positionsByTotalDesc(): PositionQuote[] {
    if (!this._positionsByTotalDesc) {
      this._positionsByTotalDesc = Object.values(
        this.positionsByPokemonKey,
      ).sort((a, b) => {
        return b.totalValuePokeDollars - a.totalValuePokeDollars;
      });
    }
    return this._positionsByTotalDesc;
  }

  get totalValuePokeDollars(): number {
    if (!this._totalValuePokeDollars) {
      this._totalValuePokeDollars = Object.values(
        this.positionsByPokemonKey,
      ).reduce((acc, position) => {
        return acc + position.totalValuePokeDollars;
      }, 0);
    }
    return this._totalValuePokeDollars;
  }

  get hasStocks(): boolean {
    return this.positionsByTotalDesc.length > 0;
  }
}

export interface PortfolioParams {
  positionsByPokemonKey: Record<string, PositionQuote>;
  cashPokeDollars: number;
}
