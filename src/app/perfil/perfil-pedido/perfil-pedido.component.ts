import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServicoPedidoService } from './../../Servicos/servico-pedido.service';
import { ServicosService } from '../../Servicos/servicos.service';
import { Usuario } from 'src/app/Usuarios/usuario';
import { ServicoPedido } from './../../Usuarios/serico-pedido';
import { UsuarioService } from './../../Servicos/usuario.service';
import { getCurrentUser } from '../../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-perfil-pedido',
  templateUrl: './perfil-pedido.component.html',
  styleUrls: ['./perfil-pedido.component.css']
})
export class PerfilPedidoComponent implements OnInit, OnDestroy {
  serveID: string;
  serveIDSubscription: Subscription;
  usuarioID: string;
  usuarioIDSubscription: Subscription;
  usuario: Usuario = {};
  userId: string;
  entrarSair: boolean;
  userSubscription: Subscription;
  servePedidoSubscription: Subscription;
  servePedido: ServicoPedido = {};

  constructor(
    public loginService: LoginServiceService,
    public servico: ServicosService,
    public servicoPedido: ServicoPedidoService,
    public usuarioService: UsuarioService,
    public router: Router,
    public active: ActivatedRoute
  ) {}

  ngOnInit() {
    const currentUser = getCurrentUser();
    if (currentUser != null) {
      this.userId = currentUser.uid || currentUser.id;
      this.entrarSair = true;
    } else {
      this.entrarSair = false;
    }

    this.serveIDSubscription = this.active.params.subscribe(
      (params: Params) => { this.serveID = params['id']; }
    );
    this.usuarioIDSubscription = this.active.params.subscribe(
      (params: Params) => { this.usuarioID = params['idd']; }
    );
    this.userSubscription = this.usuarioService.getPublicUsuario(this.usuarioID).subscribe(data => {
      this.usuario = data;
    });
    this.servePedidoSubscription = this.servicoPedido.getDetalheServico(this.usuarioID, this.serveID).subscribe(data => {
      this.servePedido = data;
    });
  }

  ngOnDestroy() {
    this.serveIDSubscription?.unsubscribe();
    this.usuarioIDSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
    this.servePedidoSubscription?.unsubscribe();
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
}
