import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitPricingDetailComponent } from './unit-pricing-detail.component';

describe('UnitPricingDetailComponent', () => {
  let component: UnitPricingDetailComponent;
  let fixture: ComponentFixture<UnitPricingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitPricingDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitPricingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
