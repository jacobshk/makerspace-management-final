import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSpaceComponent } from './delete-space.component';

describe('DeleteSpaceComponent', () => {
  let component: DeleteSpaceComponent;
  let fixture: ComponentFixture<DeleteSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSpaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
