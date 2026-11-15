import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestArrivals } from './latest-arrivals';

describe('LatestArrivals', () => {
  let component: LatestArrivals;
  let fixture: ComponentFixture<LatestArrivals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestArrivals],
    }).compileComponents();

    fixture = TestBed.createComponent(LatestArrivals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
