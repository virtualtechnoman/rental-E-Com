import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistirbutorComponent } from './distirbutor.component';

describe('DistirbutorComponent', () => {
  let component: DistirbutorComponent;
  let fixture: ComponentFixture<DistirbutorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistirbutorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistirbutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
