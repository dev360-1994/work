import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyDashboardComponent } from './agency-dashboard.component';

describe('BuilderDashboardComponent', () => {
  let component: AgencyDashboardComponent;
  let fixture: ComponentFixture<AgencyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
