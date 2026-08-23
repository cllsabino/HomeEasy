import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../Servicos/login-service.service';
import { ServicoPedidoService } from './../Servicos/servico-pedido.service';
import { ServicosService } from './../Servicos/servicos.service';
import { UsuarioService } from '../Servicos/usuario.service';
import { Servico } from './../Usuarios/servico';
import { Usuario } from './../Usuarios/usuario';
import { FeedbackType } from '../shared/action-feedback/action-feedback.component';
import { getCurrentUser } from '../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.css']
})
export class ServicoComponent implements OnInit, OnDestroy {
  userId: string;
  usuario: Usuario = {};
  userSubscription: Subscription;
  entrarSair: boolean;
  servicosArray = new Array<Servico>();
  servicosSubscription: Subscription;
  servicePendingDeletion: Servico;
  isDeletingService = false;
  serviceAvailabilityInProgressId = '';
  feedbackMessage = '';
  feedbackType: FeedbackType = 'success';

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
    this.servicosSubscription = this.servico.getUserServico(this.userId).subscribe(data => {
      this.servicosArray = data;
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.servicosSubscription?.unsubscribe();
  }

  requestServiceDeletion(service: Servico) {
    this.servicePendingDeletion = service;
    this.feedbackMessage = '';
  }

  dismissServiceDeletion() {
    this.servicePendingDeletion = null;
  }

  get serviceDeletionTitle(): string {
    if (!this.servicePendingDeletion) {
      return 'Remover serviço';
    }

    return 'Remover ' + this.servicePendingDeletion.nome + '?';
  }

  async confirmServiceDeletion() {
    if (!this.servicePendingDeletion || this.isDeletingService) {
      return;
    }

    const serviceToDelete = this.servicePendingDeletion;
    this.isDeletingService = true;

    try {
      await this.servico.apagarServico(this.usuario, serviceToDelete);
      this.feedbackType = 'success';
      this.feedbackMessage = 'O serviço foi removido do seu perfil.';
      this.servicePendingDeletion = null;
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'Não foi possível remover o serviço. Verifique sua conexão e tente novamente.';
    } finally {
      this.isDeletingService = false;
    }
  }

  async toggleServiceAvailability(service: Servico) {
    if (!service || this.serviceAvailabilityInProgressId) {
      return;
    }

    const nextAvailability = service.available === false;
    this.serviceAvailabilityInProgressId = service.id;
    this.feedbackMessage = '';

    try {
      await this.servico.setServiceAvailability(this.usuario, service, nextAvailability);
      this.feedbackType = 'success';
      this.feedbackMessage = nextAvailability
        ? 'O serviço voltou a receber novas oportunidades.'
        : 'O serviço foi pausado e não receberá novas oportunidades.';
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'Não foi possível alterar a disponibilidade deste serviço.';
    } finally {
      this.serviceAvailabilityInProgressId = '';
    }
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
