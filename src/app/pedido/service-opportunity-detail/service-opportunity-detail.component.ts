import { getCurrentUser } from '../../shared/utils/session-user.utils';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServiceRequestService } from '../../Servicos/service-request.service';
import { UsuarioService } from '../../Servicos/usuario.service';
import { Usuario } from '../../Usuarios/usuario';
import { FeedbackType } from '../../shared/action-feedback/action-feedback.component';
import { ServiceProposal, ServiceRequest } from '../../shared/models/service-request';

@Component({
  standalone: false,
  selector: 'app-service-opportunity-detail',
  templateUrl: './service-opportunity-detail.component.html',
  styleUrls: ['./service-opportunity-detail.component.css']
})
export class ServiceOpportunityDetailComponent implements OnInit, OnDestroy {
  authenticated = false;
  userId: string;
  requestId: string;
  user: Usuario = {};
  request: ServiceRequest = {};
  proposal: ServiceProposal = { materialsIncluded: false, paymentMethods: [] };
  isLoading = true;
  isSubmitting = false;
  feedbackMessage = '';
  feedbackType: FeedbackType = 'error';
  private routeSubscription: Subscription;
  private requestSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private activeRoute: ActivatedRoute,
    private loginService: LoginServiceService,
    private requestService: ServiceRequestService,
    private router: Router,
    private userService: UsuarioService
  ) { }

  ngOnInit() {
    const currentUser = getCurrentUser();
    this.authenticated = currentUser != null;
    this.userId = currentUser ? currentUser.uid : '';
    this.routeSubscription = this.activeRoute.params.subscribe((params: Params) => {
      this.requestId = params['requestId'];
      this.loadRequest();
    });
    this.userSubscription = this.userService.getUsuario(this.userId).subscribe(user => this.user = user || {});
  }

  ngOnDestroy() {
    this.unsubscribe(this.routeSubscription);
    this.unsubscribe(this.requestSubscription);
    this.unsubscribe(this.userSubscription);
  }

  togglePaymentMethod(paymentMethod: string, checked: boolean) {
    const paymentMethods = this.proposal.paymentMethods || [];
    const paymentMethodIndex = paymentMethods.indexOf(paymentMethod);

    if (checked && paymentMethodIndex === -1) {
      paymentMethods.push(paymentMethod);
    }

    if (!checked && paymentMethodIndex !== -1) {
      paymentMethods.splice(paymentMethodIndex, 1);
    }

    this.proposal.paymentMethods = paymentMethods;
  }

  async submitProposal() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.feedbackMessage = '';
    try {
      await this.requestService.submitProposal(this.requestId, this.proposal, this.userId);
      this.feedbackType = 'success';
      this.feedbackMessage = 'Proposta enviada. O cliente já pode comparar sua oferta.';
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = error && error.message ? error.message : 'Não foi possível enviar sua proposta.';
    } finally {
      this.isSubmitting = false;
    }
  }

  async logout() {
    await this.loginService.sair();
    this.router.navigate(['/home']);
  }

  private loadRequest() {
    this.unsubscribe(this.requestSubscription);
    this.requestSubscription = this.requestService.getRequest(this.requestId).subscribe(request => {
      this.request = request || {};
      this.isLoading = false;
    });
  }

  private unsubscribe(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
