/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WorksheetPriceComponent } from './worksheet-price.component';

describe('WorksheetPriceComponent', () => {
  let component: WorksheetPriceComponent;
  let fixture: ComponentFixture<WorksheetPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksheetPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
