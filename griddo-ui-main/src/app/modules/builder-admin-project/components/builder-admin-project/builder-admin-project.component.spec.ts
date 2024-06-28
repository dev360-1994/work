import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderAdminProjectComponent } from './builder-admin-project.component';

describe('BuilderAdminProjectComponent', () => {
  let component: BuilderAdminProjectComponent;
  let fixture: ComponentFixture<BuilderAdminProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuilderAdminProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderAdminProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
