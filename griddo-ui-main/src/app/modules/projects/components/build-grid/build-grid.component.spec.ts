import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildGridComponent } from './build-grid.component';

describe('BuildGridComponent', () => {
  let component: BuildGridComponent;
  let fixture: ComponentFixture<BuildGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
