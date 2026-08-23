import { getCurrentUser } from '../shared/utils/session-user.utils';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Usuario } from './../Usuarios/usuario';
import { LoginServiceService } from '../Servicos/login-service.service';
import { FeedbackType } from '../shared/action-feedback/action-feedback.component';
import { resolveAuthErrorMessage } from '../shared/utils/auth-error.utils';
import { getLatestAdultBirthDate } from '../shared/utils/birth-date.utils';

type AuthMode = 'login' | 'register';

@Component({
  standalone: false,
  selector: 'app-login-cadastro',
  templateUrl: './login-cadastro.component.html',
  styleUrls: ['./login-cadastro.component.css']
})
export class LoginCadastroComponent implements OnInit {
  loginUser: Usuario = {};
  registrationUser: Usuario = {};
  feedbackMessage = '';
  feedbackType: FeedbackType = 'error';
  authMode: AuthMode = 'login';
  isLoginSubmitting = false;
  isRegistrationSubmitting = false;
  authenticated = false;
  userId: string;
  returnUrl = '/feed';
  maximumBirthDate = getLatestAdultBirthDate();

  constructor(
    private loginService: LoginServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const requestedReturnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (requestedReturnUrl && requestedReturnUrl.startsWith('/')) {
      this.returnUrl = requestedReturnUrl;
    }

    const currentUser = getCurrentUser();

    if (currentUser) {
      this.authenticated = true;
      this.userId = currentUser.uid;
    }
  }

  setAuthMode(authMode: AuthMode) {
    this.authMode = authMode;
    this.feedbackMessage = '';
  }

  async signIn() {
    if (this.isLoginSubmitting) {
      return;
    }

    this.feedbackMessage = '';
    this.isLoginSubmitting = true;

    try {
      await this.loginService.login(this.loginUser);
      this.router.navigateByUrl(this.returnUrl);
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = resolveAuthErrorMessage(error.code, 'login');
    } finally {
      this.isLoginSubmitting = false;
    }
  }

  async createAccount() {
    if (this.isRegistrationSubmitting) {
      return;
    }

    this.feedbackMessage = '';
    this.isRegistrationSubmitting = true;

    try {
      await this.loginService.register(this.registrationUser);
      this.router.navigateByUrl(this.returnUrl);
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = resolveAuthErrorMessage(error.code, 'register');
    } finally {
      this.isRegistrationSubmitting = false;
    }
  }

  async logout() {
    await this.loginService.sair();
    this.router.navigate(['/home']);
  }
}
