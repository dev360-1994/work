import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoDModelComponent } from './two-d-model.component';

describe('TwoDModelComponent', () => {
  let component: TwoDModelComponent;
  let fixture: ComponentFixture<TwoDModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoDModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoDModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
