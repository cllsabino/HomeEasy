import { RunInFirebaseInjectionContext } from '../shared/utils/firebase-injection-context.utils';
import { getCurrentFirebaseUser } from '../shared/utils/firebase-auth.utils';
import { EnvironmentInjector, inject, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Usuario } from './../Usuarios/usuario';
import { LoginServiceService } from '../Servicos/login-service.service';
import { UsuarioService } from '../Servicos/usuario.service';
import { FeedbackType } from '../shared/action-feedback/action-feedback.component';
import { resolveAuthErrorMessage } from '../shared/utils/auth-error.utils';

type AuthMode = 'login' | 'register';

@Component({
  standalone: false,
  selector: 'app-login-cadastro',
  templateUrl: './login-cadastro.component.html',
  styleUrls: ['./login-cadastro.component.css']
})
@RunInFirebaseInjectionContext
export class LoginCadastroComponent implements OnInit {
  readonly firebaseEnvironmentInjector = inject(EnvironmentInjector);
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

  constructor(
    private loginService: LoginServiceService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    const requestedReturnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (requestedReturnUrl && requestedReturnUrl.startsWith('/')) {
      this.returnUrl = requestedReturnUrl;
    }

    const currentUser = getCurrentFirebaseUser();

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
      const newUser = await this.afAuth.createUserWithEmailAndPassword(
        this.registrationUser.email,
        this.registrationUser.senha
      );
      const userProfile = Object.assign({}, this.registrationUser);
      userProfile.id = newUser.user.uid;
      delete userProfile.email;
      delete userProfile.senha;

      await this.usuarioService.saveUserProfile(userProfile);
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
