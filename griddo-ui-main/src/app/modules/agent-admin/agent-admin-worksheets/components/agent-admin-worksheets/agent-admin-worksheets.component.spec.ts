import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentAdminWorksheetsComponent } from './agent-admin-worksheets.component';

 

describe('WorksheetsComponent', () => {
  let component: AgentAdminWorksheetsComponent;
  let fixture: ComponentFixture<AgentAdminWorksheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentAdminWorksheetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentAdminWorksheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
