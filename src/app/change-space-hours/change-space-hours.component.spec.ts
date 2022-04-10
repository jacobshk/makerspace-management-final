import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSpaceHoursComponent } from './change-space-hours.component';

describe('ChangeSpaceHoursComponent', () => {
  let component: ChangeSpaceHoursComponent;
  let fixture: ComponentFixture<ChangeSpaceHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeSpaceHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSpaceHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
