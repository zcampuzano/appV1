import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAthletePage } from './add-athlete.page';

describe('AddAthletePage', () => {
  let component: AddAthletePage;
  let fixture: ComponentFixture<AddAthletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAthletePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAthletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
