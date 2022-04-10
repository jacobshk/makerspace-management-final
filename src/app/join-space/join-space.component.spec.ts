import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinSpaceComponent } from './join-space.component';

describe('JoinSpaceComponent', () => {
  let component: JoinSpaceComponent;
  let fixture: ComponentFixture<JoinSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinSpaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
