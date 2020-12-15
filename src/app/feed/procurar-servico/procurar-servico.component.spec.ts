import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurarServicoComponent } from './procurar-servico.component';

describe('ProcurarServicoComponent', () => {
  let component: ProcurarServicoComponent;
  let fixture: ComponentFixture<ProcurarServicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcurarServicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurarServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
