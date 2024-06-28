import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorksheetComponent } from './edit-worksheet.component';

describe('EditWorksheetComponent', () => {
  let component: EditWorksheetComponent;
  let fixture: ComponentFixture<EditWorksheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWorksheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorksheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
