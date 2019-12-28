import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLeadComponent } from './event-lead.component';

describe('EventLeadComponent', () => {
  let component: EventLeadComponent;
  let fixture: ComponentFixture<EventLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
