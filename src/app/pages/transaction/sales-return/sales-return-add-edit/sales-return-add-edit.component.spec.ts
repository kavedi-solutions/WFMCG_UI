import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnAddEditComponent } from './sales-return-add-edit.component';

describe('SalesReturnAddEditComponent', () => {
  let component: SalesReturnAddEditComponent;
  let fixture: ComponentFixture<SalesReturnAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesReturnAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesReturnAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
