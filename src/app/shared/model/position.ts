export class Position {
  // UNIQUE KEY
  // pokemonKey + ownerUsername
  pokemonKey: string;
  ownerUsername: string;
  ownedSharesCount: number;

  static empty(params: EmptyPositionParams): Position {
    return new Position({
      ...params,
      ownedSharesCount: 0,
    });
  }

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

export interface EmptyPositionParams {
  pokemonKey: string;
  ownerUsername: string;
}

export interface PositionParams extends EmptyPositionParams {
  ownedSharesCount: number;
}
