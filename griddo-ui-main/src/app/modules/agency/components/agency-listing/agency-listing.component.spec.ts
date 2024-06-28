import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyListingComponent } from './agency-listing.component';

describe('AgentsComponent', () => {
  let component: AgencyListingComponent;
  let fixture: ComponentFixture<AgencyListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
