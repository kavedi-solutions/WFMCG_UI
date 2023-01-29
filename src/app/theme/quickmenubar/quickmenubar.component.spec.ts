import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickmenubarComponent } from './quickmenubar.component';

describe('QuickmenubarComponent', () => {
  let component: QuickmenubarComponent;
  let fixture: ComponentFixture<QuickmenubarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickmenubarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickmenubarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
