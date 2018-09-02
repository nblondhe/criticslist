import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaydataComponent } from './displaydata.component';

describe('DisplaydataComponent', () => {
  let component: DisplaydataComponent;
  let fixture: ComponentFixture<DisplaydataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaydataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaydataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
