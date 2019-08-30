import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRouteManagementComponent } from './customer-route-management.component';

describe('CustomerRouteManagementComponent', () => {
  let component: CustomerRouteManagementComponent;
  let fixture: ComponentFixture<CustomerRouteManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerRouteManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRouteManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
