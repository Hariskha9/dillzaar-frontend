import { TestBed } from '@angular/core/testing';

import { Typeservice } from './typeservice';

describe('Typeservice', () => {
  let service: Typeservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Typeservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
