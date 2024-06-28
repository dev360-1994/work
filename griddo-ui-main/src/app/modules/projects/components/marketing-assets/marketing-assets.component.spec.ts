import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingAssetsComponent } from './marketing-assets.component';

describe('MarketingAssetsComponent', () => {
  let component: MarketingAssetsComponent;
  let fixture: ComponentFixture<MarketingAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
