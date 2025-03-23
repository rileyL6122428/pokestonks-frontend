import { TestBed } from '@angular/core/testing';

import { PokemonOverviewService } from './pokemon-overview.service';

describe('PokemonOverviewService', () => {
  let service: PokemonOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
