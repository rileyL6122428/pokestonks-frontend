export class Position {
  // UNIQUE KEY
  // pokemonKey + ownerUsername
  pokemonKey: string;
  ownerUsername: string;
  ownedSharesCount: number;

  constructor(
    params: PositionParams = {
      pokemonKey: '',
      ownedSharesCount: 0,
      ownerUsername: '',
    },
  ) {
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
