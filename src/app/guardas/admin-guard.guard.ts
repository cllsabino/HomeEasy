import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserRole } from '../Usuarios/usuario';
import { ApiSessionService } from '../Servicos/api-session.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private sessionService: ApiSessionService, private router: Router) {}

  canActivate() {
    const currentUser = this.sessionService.currentUser;
    if (!currentUser) {
      void this.router.navigate(['/login']);
      return false;
    }
    if (currentUser.role !== UserRole.Admin) {
      void this.router.navigate(['/feed']);
      return false;
    }
    return true;
  }
}
