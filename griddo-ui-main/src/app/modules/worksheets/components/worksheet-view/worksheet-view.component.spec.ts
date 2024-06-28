import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetViewComponent } from './worksheet-view.component';

describe('WorksheetViewComponent', () => {
  let component: WorksheetViewComponent;
  let fixture: ComponentFixture<WorksheetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorksheetViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
