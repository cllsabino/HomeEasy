import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarlosComponentComponent } from './carlos-component.component';

describe('CarlosComponentComponent', () => {
  let component: CarlosComponentComponent;
  let fixture: ComponentFixture<CarlosComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarlosComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarlosComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
