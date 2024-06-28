import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderAdminComponent } from './builder-admin.component';

describe('BuilderAdminComponent', () => {
  let component: BuilderAdminComponent;
  let fixture: ComponentFixture<BuilderAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuilderAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
