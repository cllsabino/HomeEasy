import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServicoPedidoService } from './../../Servicos/servico-pedido.service';
import { UsuarioService } from './../../Servicos/usuario.service';
import { Usuario } from 'src/app/Usuarios/usuario';
import { OrderStatus, Pedido } from 'src/app/Usuarios/pedido';
import { AvalicaoService } from './../../Servicos/avaliacao.service';
import { Avaliacao } from './../../Usuarios/avaliacao';
import { ServicosService } from './../../Servicos/servicos.service';
import { FeedbackType } from '../../shared/action-feedback/action-feedback.component';
import { canTransitionOrder, getOrderStatus, getOrderStatusClass, getOrderStatusHistory, getOrderStatusLabel } from '../../shared/utils/order-status.utils';
import {
  CancellationReason,
  clientCancellationReasons
} from '../../shared/models/cancellation-reason';
import { getCurrentUser } from '../../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-pedido-feito-detalhe',
  templateUrl: './pedido-feito-detalhe.component.html',
  styleUrls: ['./pedido-feito-detalhe.component.css']
})
export class PedidoFeitoDetalheComponent implements OnInit, OnDestroy {
  userId: string;
  entrarSair: boolean;
  pedidoId: string;
  pedidoIdSubscription: Subscription;
  pedido: Pedido = {};
  pedidoSubscription: Subscription;
  avaliacao: Avaliacao = {};
  avaliacaoSubscription: Subscription;
  servidorId: string;
  servidorIdSubscription: Subscription;
  servidor: Usuario = {};
  servidorSubscription: Subscription;
  usuario: Usuario = {};
  usuarioSubscription: Subscription;
  mes: number = new Date().getUTCMonth() + 1;
  ano: number = new Date().getFullYear();
  dia: number = new Date().getDate();
  today = new Date().toJSON().split('T')[0];
  feedbackMessage = '';
  feedbackType: FeedbackType = 'error';
  isSubmitting = false;
  isConfirmingCancellation = false;
  cancellationReason = CancellationReason.ServiceNoLongerNeeded;
  cancellationDetails = '';
  readonly cancellationReasons = clientCancellationReasons;

  constructor(
    public loginService: LoginServiceService,
    public servicoPedido: ServicoPedidoService,
    public usuarioService: UsuarioService,
    public avaliacaoService: AvalicaoService,
    public servicosService: ServicosService,
    public router: Router,
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

    this.servidorIdSubscription = this.active.params.subscribe(
      (params: Params) => { this.servidorId = params['id']; }
    );
    this.pedidoIdSubscription = this.active.params.subscribe(
      (params: Params) => { this.pedidoId = params['idd']; }
    );
    this.servidorSubscription = this.usuarioService.getPublicUsuario(this.servidorId).subscribe(data => {
      this.servidor = data;
    });
    this.pedidoSubscription = this.servicoPedido.getPedidoFeito(this.userId, this.pedidoId).subscribe(data => {
      this.pedido = data;
    });
    this.usuarioSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.usuario = data;
    });
  }

  ngOnDestroy() {
    this.servidorIdSubscription?.unsubscribe();
    this.servidorSubscription?.unsubscribe();
    this.pedidoIdSubscription?.unsubscribe();
    this.pedidoSubscription?.unsubscribe();
    this.usuarioSubscription?.unsubscribe();
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

  async addAvaliacao() {
    if (this.isSubmitting) {
      return;
    }

    this.feedbackMessage = '';
    this.isSubmitting = true;
    this.avaliacao.nomeContratante = this.usuario.nome;
    this.avaliacao.idServidor = this.servidorId;
    this.avaliacao.idPedido = this.pedidoId;
    this.avaliacao.idServico = this.pedido.idServico;
    this.avaliacao.data = this.dia + '/' + this.mes + '/' + this.ano;
    let serviceCompleted = false;
    try {
      await this.servicoPedido.updateOrderStatus(this.pedido, OrderStatus.Completed, this.userId);
      serviceCompleted = true;
      await this.avaliacaoService.addAvaliacao(this.avaliacao, this.servidorId, this.pedido.idServico);
      this.feedbackType = 'success';
      this.feedbackMessage = 'Avaliação publicada com sucesso.';
    } catch (error) {
      this.feedbackType = 'error';
      if (serviceCompleted) {
        this.feedbackMessage = 'O serviço foi concluído, mas a avaliação não foi publicada. Tente enviá-la novamente.';
      } else {
        this.feedbackMessage = 'Não foi possível publicar a avaliação. Tente novamente.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  async acceptProposal() {
    if (this.isSubmitting) {
      return;
    }

    this.feedbackMessage = '';
    this.isSubmitting = true;
    try {
      await this.servicoPedido.updateOrderStatus(this.pedido, OrderStatus.Accepted, this.userId);
      this.feedbackType = 'success';
      this.feedbackMessage = 'Proposta aceita. Use a conversa para combinar os últimos detalhes.';
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = error && error.message ? error.message : 'Não foi possível aceitar a proposta. Tente novamente.';
    } finally {
      this.isSubmitting = false;
    }
  }

  requestCancellation() {
    this.isConfirmingCancellation = true;
    this.feedbackMessage = '';
  }

  dismissCancellation() {
    this.isConfirmingCancellation = false;
  }

  async cancelarPedido() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    try {
      await this.servicoPedido.updateOrderStatus(
        this.pedido,
        OrderStatus.CancelledByClient,
        this.userId,
        this.cancellationReason,
        this.cancellationDetails
      );
      this.router.navigate(['/usuario', this.userId, 'pedidos-feitos']);
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'Não foi possível cancelar o pedido. Tente novamente.';
    } finally {
      this.isSubmitting = false;
      this.isConfirmingCancellation = false;
    }
  }

  get orderStatusLabel() {
    return getOrderStatusLabel(this.pedido);
  }

  get orderStatusClass() {
    return getOrderStatusClass(this.pedido);
  }

  get canCancelOrder() {
    return canTransitionOrder(this.pedido, OrderStatus.CancelledByClient, this.userId);
  }

  get canReviewOrder() {
    const status = getOrderStatus(this.pedido);
    const serviceCanBeReviewed = status === OrderStatus.Accepted || status === OrderStatus.InProgress;

    return serviceCanBeReviewed && this.today >= this.pedido.data;
  }

  get canAcceptProposal() {
    return canTransitionOrder(this.pedido, OrderStatus.Accepted, this.userId) && getOrderStatus(this.pedido) === OrderStatus.ProposalReceived;
  }

  get orderHistory() {
    return getOrderStatusHistory(this.pedido);
  }
}
