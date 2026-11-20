import { TestBed } from '@angular/core/testing';

import { Seasonservice } from './seasonservice';

describe('Seasonservice', () => {
  let service: Seasonservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Seasonservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
