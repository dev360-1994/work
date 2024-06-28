import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignTwoDModelComponent } from './design-two-d-model.component';

describe('DesignTwoDModelComponent', () => {
  let component: DesignTwoDModelComponent;
  let fixture: ComponentFixture<DesignTwoDModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignTwoDModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignTwoDModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
