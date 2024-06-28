import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalBrokersComponent } from './external-brokers.component';

describe('ExternalBrokersComponent', () => {
  let component: ExternalBrokersComponent;
  let fixture: ComponentFixture<ExternalBrokersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalBrokersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalBrokersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
