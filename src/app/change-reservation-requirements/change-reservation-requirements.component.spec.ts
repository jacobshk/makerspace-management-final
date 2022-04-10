import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeReservationRequirementsComponent } from './change-reservation-requirements.component';

describe('ChangeReservationRequirementsComponent', () => {
  let component: ChangeReservationRequirementsComponent;
  let fixture: ComponentFixture<ChangeReservationRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeReservationRequirementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeReservationRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
