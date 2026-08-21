import { getCurrentFirebaseUser } from '../../shared/utils/firebase-auth.utils';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServiceRequestService } from '../../Servicos/service-request.service';
import { FeedbackType } from '../../shared/action-feedback/action-feedback.component';
import { ServiceProposal, ServiceProposalStatus, ServiceRequest } from '../../shared/models/service-request';
import { OrderStatus } from '../../Usuarios/pedido';
import { getStatusClass, getStatusLabel } from '../../shared/utils/order-status.utils';

@Component({
  standalone: false,
  selector: 'app-service-request-detail',
  templateUrl: './service-request-detail.component.html',
  styleUrls: ['./service-request-detail.component.css']
})
export class ServiceRequestDetailComponent implements OnInit, OnDestroy {
  authenticated = false;
  userId: string;
  requestId: string;
  request: ServiceRequest = {};
  proposals = new Array<ServiceProposal>();
  selectedProposal: ServiceProposal;
  isLoading = true;
  isSubmitting = false;
  isConfirmingProposal = false;
  isConfirmingCancellation = false;
  feedbackMessage = '';
  feedbackType: FeedbackType = 'error';
  readonly sentProposalStatus = ServiceProposalStatus.Sent;
  readonly acceptedProposalStatus = ServiceProposalStatus.Accepted;
  private routeSubscription: Subscription;
  private requestSubscription: Subscription;
  private proposalsSubscription: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private activeRoute: ActivatedRoute,
    private loginService: LoginServiceService,
    private requestService: ServiceRequestService,
    private router: Router
  ) { }

  ngOnInit() {
    const currentUser = getCurrentFirebaseUser();
    this.authenticated = currentUser != null;
    this.userId = currentUser ? currentUser.uid : '';
    this.routeSubscription = this.activeRoute.params.subscribe((params: Params) => {
      this.requestId = params['requestId'];
      this.loadRequest();
      this.loadProposals();
    });
  }

  ngOnDestroy() {
    this.unsubscribe(this.routeSubscription);
    this.unsubscribe(this.requestSubscription);
    this.unsubscribe(this.proposalsSubscription);
  }

  requestProposalAcceptance(proposal: ServiceProposal) {
    this.selectedProposal = proposal;
    this.isConfirmingProposal = true;
  }

  dismissProposalAcceptance() {
    this.isConfirmingProposal = false;
    this.selectedProposal = null;
  }

  async acceptProposal() {
    if (!this.selectedProposal || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    try {
      await this.requestService.acceptProposal(this.requestId, this.selectedProposal.id, this.userId);
      this.feedbackType = 'success';
      this.feedbackMessage = 'Proposta aceita. O profissional foi informado e o pedido está confirmado.';
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = error && error.message ? error.message : 'Não foi possível aceitar a proposta.';
    } finally {
      this.isSubmitting = false;
      this.dismissProposalAcceptance();
    }
  }

  async cancelRequest() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    try {
      await this.requestService.cancelRequest(this.request, this.userId);
      this.feedbackType = 'success';
      this.feedbackMessage = 'Solicitação cancelada e mantida no seu histórico.';
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = error && error.message ? error.message : 'Não foi possível cancelar a solicitação.';
    } finally {
      this.isSubmitting = false;
      this.isConfirmingCancellation = false;
    }
  }

  get statusLabel() {
    return getStatusLabel(this.request.status);
  }

  get statusClass() {
    return getStatusClass(this.request.status);
  }

  get canCancel() {
    return this.request.status === OrderStatus.Requested || this.request.status === OrderStatus.ProposalReceived;
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

  private loadProposals() {
    this.unsubscribe(this.proposalsSubscription);
    this.proposalsSubscription = this.requestService.getRequestProposals(this.requestId).subscribe(proposals => {
      this.proposals = proposals;
    });
  }

  private unsubscribe(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
