import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentAdminWorksheetViewComponent } from './agent-admin-worksheet-view.component';

 

describe('WorksheetViewComponent', () => {
  let component: AgentAdminWorksheetViewComponent;
  let fixture: ComponentFixture<AgentAdminWorksheetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentAdminWorksheetViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentAdminWorksheetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
