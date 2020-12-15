import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPedidoComponent } from './perfil-pedido.component';

describe('PerfilPedidoComponent', () => {
  let component: PerfilPedidoComponent;
  let fixture: ComponentFixture<PerfilPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
