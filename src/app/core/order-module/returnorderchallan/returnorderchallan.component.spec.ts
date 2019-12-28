import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnorderchallanComponent } from './returnorderchallan.component';

describe('ReturnorderchallanComponent', () => {
  let component: ReturnorderchallanComponent;
  let fixture: ComponentFixture<ReturnorderchallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnorderchallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnorderchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
