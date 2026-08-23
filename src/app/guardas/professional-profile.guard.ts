import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

import { ApiSessionService } from '../Servicos/api-session.service';
import { UsuarioService } from '../Servicos/usuario.service';
import { NotificationService } from '../shared/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalProfileGuard implements CanActivate {
  constructor(
    private sessionService: ApiSessionService,
    private usuarioService: UsuarioService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  async canActivate(): Promise<boolean> {
    const currentUser = this.sessionService.currentUser;
    if (!currentUser) {
      return false;
    }

    try {
      const user = await firstValueFrom(this.usuarioService.getUsuario(currentUser.id).pipe(take(1)));
      if (user.telefone && user.estado && user.cidade) {
        return true;
      }

      this.notificationService.showInfo(
        'Complete seu perfil primeiro',
        'Antes de cadastrar um serviço, informe seu telefone, estado e cidade. Você foi direcionado para completar esses dados.'
      );
      await this.router.navigate(['/editar']);
      return false;
    } catch {
      this.notificationService.showError(
        'Não foi possível verificar seu perfil',
        'Atualize a página e tente acessar o cadastro de serviço novamente.'
      );
      return false;
    }
  }
}
