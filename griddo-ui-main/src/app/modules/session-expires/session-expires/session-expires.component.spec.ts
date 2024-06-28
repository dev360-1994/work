import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpiresComponent } from './session-expires.component';

describe('SessionExpiresComponent', () => {
  let component: SessionExpiresComponent;
  let fixture: ComponentFixture<SessionExpiresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionExpiresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpiresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
