import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashbored } from './dashbored';

describe('Dashbored', () => {
  let component: Dashbored;
  let fixture: ComponentFixture<Dashbored>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashbored],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashbored);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
