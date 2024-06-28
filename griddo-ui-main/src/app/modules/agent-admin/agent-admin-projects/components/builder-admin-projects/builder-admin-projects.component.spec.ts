import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderAdminProjectsComponent } from './builder-admin-projects.component';

describe('BuilderAdminProjectsComponent', () => {
  let component: BuilderAdminProjectsComponent;
  let fixture: ComponentFixture<BuilderAdminProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuilderAdminProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderAdminProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
