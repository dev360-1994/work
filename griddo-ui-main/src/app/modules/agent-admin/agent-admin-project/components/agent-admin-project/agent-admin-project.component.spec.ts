import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentAdminProjectComponent } from './agent-admin-project.component';

describe('BuilderAdminProjectComponent', () => {
  let component: AgentAdminProjectComponent;
  let fixture: ComponentFixture<AgentAdminProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentAdminProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentAdminProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
