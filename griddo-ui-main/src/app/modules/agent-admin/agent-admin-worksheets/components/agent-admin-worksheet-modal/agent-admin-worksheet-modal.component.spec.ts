import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentAdminWorksheetModalComponent } from './agent-admin-worksheet-modal.component';
 

describe('WorksheetModalComponent', () => {
  let component: AgentAdminWorksheetModalComponent;
  let fixture: ComponentFixture<AgentAdminWorksheetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentAdminWorksheetModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentAdminWorksheetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
