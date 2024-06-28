import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesGridComponent } from './sales-grid.component';

describe('SalesGridComponent', () => {
  let component: SalesGridComponent;
  let fixture: ComponentFixture<SalesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
