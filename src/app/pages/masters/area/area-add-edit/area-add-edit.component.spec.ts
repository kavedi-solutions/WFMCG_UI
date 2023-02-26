import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaAddEditComponent } from './area-add-edit.component';

describe('AreaAddEditComponent', () => {
  let component: AreaAddEditComponent;
  let fixture: ComponentFixture<AreaAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
