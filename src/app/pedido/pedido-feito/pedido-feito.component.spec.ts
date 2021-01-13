import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoFeitoComponent } from './pedido-feito.component';

describe('PedidoFeitoComponent', () => {
  let component: PedidoFeitoComponent;
  let fixture: ComponentFixture<PedidoFeitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoFeitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoFeitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
