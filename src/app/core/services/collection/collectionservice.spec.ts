import { TestBed } from '@angular/core/testing';

import { Collectionservice } from './collectionservice';

describe('Collectionservice', () => {
  let service: Collectionservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Collectionservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
