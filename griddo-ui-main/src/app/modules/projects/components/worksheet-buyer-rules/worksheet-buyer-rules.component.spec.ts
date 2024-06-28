import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetBuyerRulesComponent } from './worksheet-buyer-rules.component';

describe('WorksheetBuyerRulesComponent', () => {
  let component: WorksheetBuyerRulesComponent;
  let fixture: ComponentFixture<WorksheetBuyerRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorksheetBuyerRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetBuyerRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
