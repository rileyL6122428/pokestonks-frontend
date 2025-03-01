import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeDollarsComponent } from './poke-dollars.component';

describe('PokeDollarsComponent', () => {
  let component: PokeDollarsComponent;
  let fixture: ComponentFixture<PokeDollarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokeDollarsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokeDollarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
