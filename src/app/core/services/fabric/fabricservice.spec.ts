import { TestBed } from '@angular/core/testing';

import { Fabricservice } from './fabricservice';

describe('Fabricservice', () => {
  let service: Fabricservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fabricservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
