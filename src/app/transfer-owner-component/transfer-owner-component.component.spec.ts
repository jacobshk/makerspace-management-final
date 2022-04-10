import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferOwnerComponentComponent } from './transfer-owner-component.component';

describe('TransferOwnerComponentComponent', () => {
  let component: TransferOwnerComponentComponent;
  let fixture: ComponentFixture<TransferOwnerComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferOwnerComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferOwnerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
