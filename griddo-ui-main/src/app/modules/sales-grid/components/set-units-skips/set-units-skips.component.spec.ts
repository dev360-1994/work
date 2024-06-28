import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUnitsSkipsComponent } from './set-units-skips.component';

describe('SetUnitsSkipsComponent', () => {
  let component: SetUnitsSkipsComponent;
  let fixture: ComponentFixture<SetUnitsSkipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetUnitsSkipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUnitsSkipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
