import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupSalesGridComponent } from './setup-sales-grid.component';

describe('SetupSalesGridComponent', () => {
  let component: SetupSalesGridComponent;
  let fixture: ComponentFixture<SetupSalesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupSalesGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupSalesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
