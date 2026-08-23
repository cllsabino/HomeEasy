import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { FeedbackType } from '../../shared/action-feedback/action-feedback.component';

@Component({
  standalone: false,
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent implements OnInit {
  token = '';
  password = '';
  passwordConfirmation = '';
  feedbackMessage = '';
  feedbackType: FeedbackType = 'info';
  isSubmitting = false;
  passwordChanged = false;

  constructor(
    private loginService: LoginServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'Este link de recuperação é inválido. Solicite um novo link.';
    }
  }

  async resetPassword() {
    if (!this.token || this.isSubmitting || this.passwordChanged) {
      return;
    }
    if (this.password !== this.passwordConfirmation) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'As senhas informadas não são iguais.';
      return;
    }

    this.isSubmitting = true;
    this.feedbackMessage = '';
    try {
      await this.loginService.redefinirSenha(this.token, this.password);
      this.passwordChanged = true;
      this.feedbackType = 'success';
      this.feedbackMessage = 'Senha atualizada. Você já pode entrar com a nova senha.';
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'O link expirou ou já foi utilizado. Solicite uma nova recuperação.';
    } finally {
      this.isSubmitting = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
