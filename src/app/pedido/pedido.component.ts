import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../Servicos/login-service.service';
import { ServicoPedidoService } from './../Servicos/servico-pedido.service';
import { ServicosService } from './../Servicos/servicos.service';
import { UsuarioService } from '../Servicos/usuario.service';
import { OrderStatus, Pedido } from './../Usuarios/pedido';
import { ServicoPedido } from './../Usuarios/serico-pedido';
import { Servico } from './../Usuarios/servico';
import { Usuario } from './../Usuarios/usuario';
import { FeedbackType } from '../shared/action-feedback/action-feedback.component';
import { getCurrentUser } from '../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit, OnDestroy {
  pedido: Pedido = {};
  entrarSair: boolean;
  userId: string;
  serveID: string;
  serveIDSubscription: Subscription;
  serve: Servico = {};
  serveSubscription: Subscription;
  usuarioID: string;
  usuarioIDSubscription: Subscription;
  servidor: Usuario = {};
  servidorSubscription: Subscription;
  cliente: Usuario = {};
  clienteSubscription: Subscription;
  servePedidoSubscription: Subscription;
  servePedido: ServicoPedido = {};
  today = new Date().toJSON().split('T')[0];
  feedbackMessage = '';
  feedbackType: FeedbackType = 'error';
  isSubmitting = false;

  constructor(
    public router: Router,
    public loginService: LoginServiceService,
    public usuarioService: UsuarioService,
    public servico: ServicosService,
    public servicoPedido: ServicoPedidoService,
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

    this.serveIDSubscription = this.active.params.subscribe(
      (params: Params) => { this.serveID = params['id']; }
    );
    this.usuarioIDSubscription = this.active.params.subscribe(
      (params: Params) => { this.usuarioID = params['idd']; }
    );
    this.clienteSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.cliente = data;
    });
    this.serveSubscription = this.servico.getUserServicoPorId(this.usuarioID, this.serveID).subscribe(data => {
      this.serve = data;
    });
    this.servePedidoSubscription = this.servicoPedido.getDetalheServico(this.usuarioID, this.serveID).subscribe(data => {
      this.servePedido = data;
    });
    this.servidorSubscription = this.servico.getServicoUsuario(this.serveID, this.usuarioID).subscribe(data => {
      this.servidor = data;
    });
  }

  ngOnDestroy() {
    this.serveIDSubscription?.unsubscribe();
    this.usuarioIDSubscription?.unsubscribe();
    this.clienteSubscription?.unsubscribe();
    this.servidorSubscription?.unsubscribe();
    this.serveSubscription?.unsubscribe();
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

  async addpedido() {
    if (this.isSubmitting) {
      return;
    }

    if (this.userId !== this.servidor.id) {
      this.feedbackMessage = '';
      this.isSubmitting = true;
      this.pedido.nome = this.serve.nome;
      this.pedido.id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
      this.pedido.idServidor = this.servidor.id;
      this.pedido.idContratante = this.cliente.id;
      this.pedido.preco = this.servePedido.preco;
      this.pedido.clienteCancelou = false;
      this.pedido.profissionalCancelou = false;
      this.pedido.statusProfissional = false;
      this.pedido.status = OrderStatus.Requested;
      this.pedido.idServico = this.serveID;
      try {
        await this.servicoPedido.addPedido(this.cliente, this.servidor, this.pedido);
        this.router.navigate(['/usuario', this.userId, 'pedidos-feitos']);
      } catch (error) {
        this.feedbackType = 'error';
        this.feedbackMessage = 'Não foi possível confirmar o pedido. Verifique sua conexão e tente novamente.';
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.feedbackType = 'error';
      this.feedbackMessage = 'Você não pode solicitar o próprio serviço.';
    }
  }
}
