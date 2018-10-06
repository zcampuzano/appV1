import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStatPage } from './game-stat.page';

describe('GameStatPage', () => {
  let component: GameStatPage;
  let fixture: ComponentFixture<GameStatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameStatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
