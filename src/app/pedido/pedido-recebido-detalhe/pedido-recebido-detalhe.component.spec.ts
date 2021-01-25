import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoRecebidoDetalheComponent } from './pedido-recebido-detalhe.component';

describe('PedidoRecebidoDetalheComponent', () => {
  let component: PedidoRecebidoDetalheComponent;
  let fixture: ComponentFixture<PedidoRecebidoDetalheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoRecebidoDetalheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoRecebidoDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
