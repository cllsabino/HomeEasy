import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoRecebidoComponent } from './pedido-recebido.component';

describe('PedidoRecebidoComponent', () => {
  let component: PedidoRecebidoComponent;
  let fixture: ComponentFixture<PedidoRecebidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoRecebidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoRecebidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
