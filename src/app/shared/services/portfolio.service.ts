import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export interface PositionParams {
  ownedSharesCount?: number;
  lastPrice?: number;
  portfolioSharesPercentage?: number;
  portfolioValuePercentage?: number;
}

export class Position {
  ownedSharesCount: number;
  lastPrice: number;
  portfolioSharesPercentage: number;
  portfolioValuePercentage: number;

  constructor(params: PositionParams) {
    this.ownedSharesCount = params.ownedSharesCount || 0;
    this.lastPrice = params.lastPrice || 0;
    this.portfolioSharesPercentage = params.portfolioSharesPercentage || 0;
    this.portfolioValuePercentage = params.portfolioValuePercentage || 0;
  }
}

const POSITIONS_BY_USER_POKEMONKEY: {
  [username: string]: {
    [pokemonKey: string]: Position;
  };
} = {
  red: {
    '898-ice-rider': {
      ownedSharesCount: 200,
      lastPrice: 100,
      portfolioSharesPercentage: 25,
      portfolioValuePercentage: 50,
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  getPosition(params: { username: string; pokemonKey: string }): Observable<Position> {
    const { username, pokemonKey } = params;
    const position = POSITIONS_BY_USER_POKEMONKEY[username][pokemonKey] || new Position({});
    return of(position).pipe(delay(1000));
  }
}
