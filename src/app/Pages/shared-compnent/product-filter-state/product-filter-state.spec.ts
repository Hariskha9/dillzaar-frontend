import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilterState } from './product-filter-state';

describe('ProductFilterState', () => {
  let component: ProductFilterState;
  let fixture: ComponentFixture<ProductFilterState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFilterState],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFilterState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
