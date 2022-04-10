import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewViewspacesComponent } from './new-viewspaces.component';

describe('NewViewspacesComponent', () => {
  let component: NewViewspacesComponent;
  let fixture: ComponentFixture<NewViewspacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewViewspacesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewViewspacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
