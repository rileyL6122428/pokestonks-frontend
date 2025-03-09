import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonPositionComponent } from './pokemon-position.component';

describe('PokemonPositionComponent', () => {
  let component: PokemonPositionComponent;
  let fixture: ComponentFixture<PokemonPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonPositionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
