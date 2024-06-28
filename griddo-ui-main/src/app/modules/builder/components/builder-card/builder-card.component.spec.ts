import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderCardComponent } from './builder-card.component';

describe('BuilderCardComponent', () => {
  let component: BuilderCardComponent;
  let fixture: ComponentFixture<BuilderCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuilderCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
