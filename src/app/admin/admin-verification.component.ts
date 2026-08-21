import { getCurrentFirebaseUser } from '../shared/utils/firebase-auth.utils';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../Servicos/login-service.service';
import { ProfessionalVerificationService } from '../Servicos/professional-verification.service';
import { MarketplaceMetrics, MarketplaceMetricsService } from '../Servicos/marketplace-metrics.service';
import { Usuario } from '../Usuarios/usuario';
import { FeedbackType } from '../shared/action-feedback/action-feedback.component';

@Component({
  standalone: false,
  selector: 'app-admin-verification',
  templateUrl: './admin-verification.component.html',
  styleUrls: ['./admin-verification.component.css']
})
export class AdminVerificationComponent implements OnInit, OnDestroy {
  authenticated = true;
  userId: string;
  professionals = new Array<Usuario>();
  selectedProfessional: Usuario;
  reviewApproved = false;
  reviewNote = '';
  isLoading = true;
  isReviewing = false;
  feedbackMessage = '';
  feedbackType: FeedbackType = 'success';
  metrics: MarketplaceMetrics = {
    totalRequests: 0,
    openRequests: 0,
    hiredRequests: 0,
    pendingVerifications: 0,
    conversionRate: 0,
    averageProposals: 0
  };
  private professionalsSubscription: Subscription;
  private metricsSubscription: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private loginService: LoginServiceService,
    private metricsService: MarketplaceMetricsService,
    private router: Router,
    private verificationService: ProfessionalVerificationService
  ) { }

  ngOnInit() {
    const currentUser = getCurrentFirebaseUser();
    this.userId = currentUser ? currentUser.uid : '';
    this.professionalsSubscription = this.verificationService.getPendingProfessionals().subscribe(professionals => {
      this.professionals = professionals;
      this.isLoading = false;
    });
    this.metricsSubscription = this.metricsService.getMetrics().subscribe(metrics => this.metrics = metrics);
  }

  ngOnDestroy() {
    if (this.professionalsSubscription) {
      this.professionalsSubscription?.unsubscribe();
    }
    if (this.metricsSubscription) {
      this.metricsSubscription?.unsubscribe();
    }
  }

  requestReview(professional: Usuario, approved: boolean) {
    this.selectedProfessional = professional;
    this.reviewApproved = approved;
    this.reviewNote = '';
  }

  dismissReview() {
    this.selectedProfessional = null;
    this.reviewNote = '';
  }

  async confirmReview() {
    if (!this.selectedProfessional || this.isReviewing) {
      return;
    }

    this.isReviewing = true;
    try {
      await this.verificationService.reviewVerification(
        this.userId,
        this.selectedProfessional.id,
        this.reviewApproved,
        this.reviewNote
      );
      this.feedbackType = 'success';
      this.feedbackMessage = this.reviewApproved ? 'Perfil verificado com sucesso.' : 'Ajustes solicitados ao profissional.';
      this.dismissReview();
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = error && error.message ? error.message : 'Não foi possível concluir a revisão.';
    } finally {
      this.isReviewing = false;
    }
  }

  async logout() {
    await this.loginService.sair();
    this.router.navigate(['/home']);
  }

  get reviewDialogTitle() {
    return this.reviewApproved ? 'Aprovar este perfil?' : 'Solicitar ajustes?';
  }
}
