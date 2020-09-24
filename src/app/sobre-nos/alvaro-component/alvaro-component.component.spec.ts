import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlvaroComponentComponent } from './alvaro-component.component';

describe('AlvaroComponentComponent', () => {
  let component: AlvaroComponentComponent;
  let fixture: ComponentFixture<AlvaroComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlvaroComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlvaroComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
