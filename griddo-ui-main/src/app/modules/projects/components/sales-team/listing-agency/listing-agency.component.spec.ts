import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingAgencyComponent } from './listing-agency.component';

describe('ListingAgencyComponent', () => {
  let component: ListingAgencyComponent;
  let fixture: ComponentFixture<ListingAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingAgencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
