import { Pokemon } from './pokemon';
import { EmptyPositionParams, Position } from './position';
import { StockTransaction } from './stock-transaction';

export class PokemonOverview {
  readonly pokemon: Pokemon;
  readonly position: Position;
  readonly pendingTransaction: StockTransaction | null;
  readonly lastTransaction: StockTransaction | null;
  readonly lowestAsk: StockTransaction | null;
  readonly highestBid: StockTransaction | null;
  readonly availableShares: number;

  static empty(params: EmptyPositionParams): PokemonOverview {
    return new PokemonOverview({
      pokemon: new Pokemon(),
      position: Position.empty(params),
      pendingTransaction: null,
      lastTransaction: null,
      lowestAsk: null,
      highestBid: null,
      availableShares: 0,
    });
  }

  constructor(params: PokemonOverviewParams) {
    this.pokemon = params.pokemon;
    this.position = params.position;
    this.pendingTransaction = params.pendingTransaction;
    this.lastTransaction = params.lastTransaction;
    this.lowestAsk = params.lowestAsk;
    this.highestBid = params.highestBid;
    this.availableShares = params.availableShares;
  }
}

export interface PokemonOverviewParams {
  pokemon: Pokemon;
  position: Position;
  pendingTransaction: StockTransaction | null;
  lastTransaction: StockTransaction | null;
  lowestAsk: StockTransaction | null;
  highestBid: StockTransaction | null;
  availableShares: number;
}
