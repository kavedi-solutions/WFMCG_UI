import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleAddEditComponent } from './role-add-edit.component';

describe('UserRoleAddEditComponent', () => {
  let component: UserRoleAddEditComponent;
  let fixture: ComponentFixture<UserRoleAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoleAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoleAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
