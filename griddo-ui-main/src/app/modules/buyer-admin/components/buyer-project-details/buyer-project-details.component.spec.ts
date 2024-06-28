import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerProjectDetailsComponent } from './buyer-project-details.component';

describe('BuyerProjectDetailsComponent', () => {
  let component: BuyerProjectDetailsComponent;
  let fixture: ComponentFixture<BuyerProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerProjectDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
