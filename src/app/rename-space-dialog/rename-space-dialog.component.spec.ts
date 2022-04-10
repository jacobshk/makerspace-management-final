import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameSpaceDialogComponent } from './rename-space-dialog.component';

describe('RenameSpaceDialogComponent', () => {
  let component: RenameSpaceDialogComponent;
  let fixture: ComponentFixture<RenameSpaceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenameSpaceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameSpaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
