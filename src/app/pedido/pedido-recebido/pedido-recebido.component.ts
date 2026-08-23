import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from './../../Servicos/login-service.service';
import { ServicoPedidoService } from './../../Servicos/servico-pedido.service';
import { ServicosService } from './../../Servicos/servicos.service';
import { UsuarioService } from './../../Servicos/usuario.service';
import { Pedido } from './../../Usuarios/pedido';
import { Usuario } from './../../Usuarios/usuario';
import { getOrderStatusClass, getOrderStatusLabel } from '../../shared/utils/order-status.utils';
import { getCurrentUser } from '../../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-pedido-recebido',
  templateUrl: './pedido-recebido.component.html',
  styleUrls: ['./pedido-recebido.component.css']
})
export class PedidoRecebidoComponent implements OnInit, OnDestroy {
  usuario: Usuario = {};
  userSubscription: Subscription;
  userId: string;
  entrarSair: boolean;
  pedidosRecebidosArray = new Array<Pedido>();
  pedidosRecebidosSubscription: Subscription;
  pedidoEstado = false;
  pedidoDetalhe: Pedido = {};
  isLoading = true;

  constructor(
    public router: Router,
    public loginService: LoginServiceService,
    public usuarioService: UsuarioService,
    public servicoPedido: ServicoPedidoService,
    public servico: ServicosService,
    public active: ActivatedRoute
  ) {}

  ngOnInit() {
    const currentUser = getCurrentUser();
    if (currentUser != null) {
      this.entrarSair = true;
      this.userId = currentUser.uid || currentUser.id;
    } else {
      this.entrarSair = false;
    }

    this.userSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.usuario = data;
    });
    this.pedidosRecebidosSubscription = this.servicoPedido.getPedidosRecebidos(this.userId).subscribe(data => {
      this.pedidosRecebidosArray = data;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.pedidosRecebidosSubscription?.unsubscribe();
  }

  async sair() {
    try {
      await this.loginService.sair().then(() => {
        this.router.navigate(['/home']);
      });
    } catch (error) {
      return;
    }
  }

  mostrarBotaoDetalhe(event, serve) {
    this.pedidoEstado = true;
    this.pedidoDetalhe = serve;
  }

  limparBotao() {
    this.pedidoEstado = false;
  }

  getStatusLabel(order: Pedido) {
    return getOrderStatusLabel(order);
  }

  getStatusClass(order: Pedido) {
    return getOrderStatusClass(order);
  }
}
