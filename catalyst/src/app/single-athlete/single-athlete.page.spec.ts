import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAthletePage } from './single-athlete.page';

describe('SingleAthletePage', () => {
  let component: SingleAthletePage;
  let fixture: ComponentFixture<SingleAthletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleAthletePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleAthletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
