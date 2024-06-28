import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetModalComponent } from './worksheet-modal.component';

describe('WorksheetModalComponent', () => {
  let component: WorksheetModalComponent;
  let fixture: ComponentFixture<WorksheetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorksheetModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
