import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTableNewComponent } from './transaction-table-new.component';

describe('TransactionTableNewComponent', () => {
  let component: TransactionTableNewComponent;
  let fixture: ComponentFixture<TransactionTableNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionTableNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTableNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
