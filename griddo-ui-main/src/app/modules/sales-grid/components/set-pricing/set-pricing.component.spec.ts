import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPricingComponent } from './set-pricing.component';

describe('SetPricingComponent', () => {
  let component: SetPricingComponent;
  let fixture: ComponentFixture<SetPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetPricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
