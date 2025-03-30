import { Injectable } from '@angular/core';
import { MockApi } from '../mock/api';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private api: MockApi) {}

  getCurrentUserPortfolio() {
    return this.api.call({
      operationName: 'getCurrentUserPortfolio',
      payload: {},
    });
  }
}
