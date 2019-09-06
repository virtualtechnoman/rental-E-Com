import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingMaterialComponent } from './marketing-material.component';

describe('MarketingMaterialComponent', () => {
  let component: MarketingMaterialComponent;
  let fixture: ComponentFixture<MarketingMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
