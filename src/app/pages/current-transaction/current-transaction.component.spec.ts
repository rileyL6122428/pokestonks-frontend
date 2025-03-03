import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTransactionComponent } from './current-transaction.component';

describe('CurrentTransactionComponent', () => {
  let component: CurrentTransactionComponent;
  let fixture: ComponentFixture<CurrentTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
