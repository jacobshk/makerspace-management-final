import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineCalendarComponent } from './machine-calendar.component';

describe('MachineCalendarComponent', () => {
  let component: MachineCalendarComponent;
  let fixture: ComponentFixture<MachineCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
