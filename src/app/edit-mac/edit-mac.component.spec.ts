import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMacComponent } from './edit-mac.component';

describe('EditMacComponent', () => {
  let component: EditMacComponent;
  let fixture: ComponentFixture<EditMacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
