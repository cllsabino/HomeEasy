import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprofissioanlComponent } from './addprofissioanl.component';

describe('AddprofissioanlComponent', () => {
  let component: AddprofissioanlComponent;
  let fixture: ComponentFixture<AddprofissioanlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddprofissioanlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddprofissioanlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
