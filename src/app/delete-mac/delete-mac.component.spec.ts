import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMacComponent } from './delete-mac.component';

describe('DeleteMacComponent', () => {
  let component: DeleteMacComponent;
  let fixture: ComponentFixture<DeleteMacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
