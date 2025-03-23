export class Position {
  pokemonKey: string;
  ownedSharesCount: number;
  ownerUsername: string;

  constructor(params: PositionParams = { pokemonKey: '', ownedSharesCount: 0, ownerUsername: '' }) {
    this.pokemonKey = params.pokemonKey;
    this.ownedSharesCount = params.ownedSharesCount;
    this.ownerUsername = params.ownerUsername;
  }
}

export interface PositionParams {
  pokemonKey: string;
  ownedSharesCount: number;
  ownerUsername: string;
}
