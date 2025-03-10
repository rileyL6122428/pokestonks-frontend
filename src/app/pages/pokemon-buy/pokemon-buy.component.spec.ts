import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonBuyComponent } from './pokemon-buy.component';

describe('PokemonBuyComponent', () => {
  let component: PokemonBuyComponent;
  let fixture: ComponentFixture<PokemonBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonBuyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
