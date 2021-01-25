import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoFeitoDetalheComponent } from './pedido-feito-detalhe.component';

describe('PedidoFeitoDetalheComponent', () => {
  let component: PedidoFeitoDetalheComponent;
  let fixture: ComponentFixture<PedidoFeitoDetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoFeitoDetalheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoFeitoDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
