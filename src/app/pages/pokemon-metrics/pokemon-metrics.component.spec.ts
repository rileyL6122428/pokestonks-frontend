import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonMetricsComponent } from './pokemon-metrics.component';

describe('PokemonMetricsComponent', () => {
  let component: PokemonMetricsComponent;
  let fixture: ComponentFixture<PokemonMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonMetricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
