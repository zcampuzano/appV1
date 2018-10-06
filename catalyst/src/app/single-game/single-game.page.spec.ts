import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleGamePage } from './single-game.page';

describe('SingleGamePage', () => {
  let component: SingleGamePage;
  let fixture: ComponentFixture<SingleGamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleGamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
