import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditWorksheetAgentAdminComponent } from './edit-worksheet-agent-admin.component';
 

describe('EditWorksheetComponent', () => {
  let component: EditWorksheetAgentAdminComponent;
  let fixture: ComponentFixture<EditWorksheetAgentAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWorksheetAgentAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorksheetAgentAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
