import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteFabComponent } from './athlete-fab.component';

describe('AthleteFabComponent', () => {
  let component: AthleteFabComponent;
  let fixture: ComponentFixture<AthleteFabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteFabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
