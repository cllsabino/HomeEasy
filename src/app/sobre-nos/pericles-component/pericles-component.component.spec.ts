import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PericlesComponentComponent } from './pericles-component.component';

describe('PericlesComponentComponent', () => {
  let component: PericlesComponentComponent;
  let fixture: ComponentFixture<PericlesComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PericlesComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PericlesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
