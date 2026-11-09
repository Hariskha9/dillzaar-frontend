import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelBody } from './panel-body';

describe('PanelBody', () => {
  let component: PanelBody;
  let fixture: ComponentFixture<PanelBody>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelBody],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelBody);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
