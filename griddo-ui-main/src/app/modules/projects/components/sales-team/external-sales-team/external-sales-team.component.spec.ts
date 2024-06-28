import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalSalesTeamComponent } from './external-sales-team.component';

describe('ExternalSalesTeamComponent', () => {
  let component: ExternalSalesTeamComponent;
  let fixture: ComponentFixture<ExternalSalesTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalSalesTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalSalesTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
