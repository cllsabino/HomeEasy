import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServicoPedidoService } from './../../Servicos/servico-pedido.service';
import { UsuarioService } from './../../Servicos/usuario.service';
import { OrderStatus, Pedido } from 'src/app/Usuarios/pedido';
import { AvalicaoService } from './../../Servicos/avaliacao.service';
import { ServicosService } from './../../Servicos/servicos.service';
import { Usuario } from './../../Usuarios/usuario';
import { FeedbackType } from '../../shared/action-feedback/action-feedback.component';
import { canTransitionOrder, getOrderStatusClass, getOrderStatusHistory, getOrderStatusLabel } from '../../shared/utils/order-status.utils';
import {
  CancellationReason,
  professionalCancellationReasons
} from '../../shared/models/cancellation-reason';
import { getCurrentUser } from '../../shared/utils/session-user.utils';
import { ChatService } from '../../Servicos/chat.service';

@Component({
  standalone: false,
  selector: 'app-pedido-recebido-detalhe',
  templateUrl: './pedido-recebido-detalhe.component.html',
  styleUrls: ['./pedido-recebido-detalhe.component.css']
})
export class PedidoRecebidoDetalheComponent implements OnInit, OnDestroy {
  userId: string;
  entrarSair: boolean;
  pedidoId: string;
  pedidoIdSubscription: Subscription;
  pedido: Pedido = {};
  pedidoSubscription: Subscription;
  clienteId: string;
  clienteIdSubscription: Subscription;
  cliente: Usuario = {};
  clienteSubscription: Subscription;
  usuario: Usuario = {};
  usuarioSubscription: Subscription;
  feedbackMessage = '';
  feedbackType: FeedbackType = 'error';
  isSubmitting = false;
  isConfirmingCancellation = false;
  proposalPrice: number;
  proposalMessage = '';
  cancellationReason = CancellationReason.ProfessionalUnavailable;
  cancellationDetails = '';
  readonly cancellationReasons = professionalCancellationReasons;

  constructor(
    public loginService: LoginServiceService,
    public servicoPedido: ServicoPedidoService,
    public usuarioService: UsuarioService,
    public avaliacaoService: AvalicaoService,
    public servicosService: ServicosService,
    public chatService: ChatService,
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

    this.clienteIdSubscription = this.active.params.subscribe(
      (params: Params) => { this.clienteId = params['id']; }
    );
    this.pedidoIdSubscription = this.active.params.subscribe(
      (params: Params) => { this.pedidoId = params['idd']; }
    );
    this.clienteSubscription = this.usuarioService.getPublicUsuario(this.clienteId).subscribe(data => {
      this.cliente = data;
    });
    this.pedidoSubscription = this.servicoPedido.getPedidoRecebido(this.userId, this.pedidoId).subscribe(data => {
      this.pedido = data;
      this.proposalPrice = data.proposalPrice || data.preco;
      this.proposalMessage = data.proposalMessage || '';
    });
    this.usuarioSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.usuario = data;
    });
  }

  ngOnDestroy() {
    this.clienteIdSubscription?.unsubscribe();
    this.pedidoIdSubscription?.unsubscribe();
    this.clienteSubscription?.unsubscribe();
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

  async submitProposal() {
    if (this.isSubmitting) {
      return;
    }

    this.feedbackMessage = '';
    this.isSubmitting = true;
    try {
      await this.servicoPedido.submitProposal(this.pedido, this.proposalPrice, this.proposalMessage, this.userId);
      this.feedbackType = 'success';
      this.feedbackMessage = 'Proposta enviada. O cliente poderá analisar o valor antes de confirmar.';
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = error && error.message ? error.message : 'Não foi possível enviar a proposta. Tente novamente.';
    } finally {
      this.isSubmitting = false;
    }
  }

  async startService() {
    if (this.isSubmitting) {
      return;
    }

    this.feedbackMessage = '';
    this.isSubmitting = true;
    try {
      await this.servicoPedido.updateOrderStatus(this.pedido, OrderStatus.InProgress, this.userId);
      this.feedbackType = 'success';
      this.feedbackMessage = 'Serviço iniciado. O cliente já pode acompanhar a atualização.';
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = error && error.message ? error.message : 'Não foi possível iniciar o serviço.';
    } finally {
      this.isSubmitting = false;
    }
  }

  async openConversation() {
    try {
      const conversation = await firstValueFrom(this.chatService.createFromOrder(this.pedidoId));
      this.router.navigate(['/chat', conversation.id]);
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'Não foi possível abrir a conversa deste serviço.';
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
        OrderStatus.DeclinedByProfessional,
        this.userId,
        this.cancellationReason,
        this.cancellationDetails
      );
      this.router.navigate(['/usuario', this.userId, 'pedidos-recebidos']);
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'Não foi possível recusar o pedido. Tente novamente.';
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

  get canSubmitProposal() {
    return canTransitionOrder(this.pedido, OrderStatus.ProposalReceived, this.userId);
  }

  get canDeclineOrder() {
    return canTransitionOrder(this.pedido, OrderStatus.DeclinedByProfessional, this.userId);
  }

  get canStartService() {
    return canTransitionOrder(this.pedido, OrderStatus.InProgress, this.userId);
  }

  get orderHistory() {
    return getOrderStatusHistory(this.pedido);
  }
}
