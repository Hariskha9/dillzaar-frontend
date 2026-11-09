import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuratedOccasions } from './curated-occasions';

describe('CuratedOccasions', () => {
  let component: CuratedOccasions;
  let fixture: ComponentFixture<CuratedOccasions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuratedOccasions],
    }).compileComponents();

    fixture = TestBed.createComponent(CuratedOccasions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
