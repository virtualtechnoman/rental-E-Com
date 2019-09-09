import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAttributesComponent } from './category-attributes.component';

describe('CategoryAttributesComponent', () => {
  let component: CategoryAttributesComponent;
  let fixture: ComponentFixture<CategoryAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryAttributesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
