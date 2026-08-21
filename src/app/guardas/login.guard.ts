import { RunInFirebaseInjectionContext } from '../shared/utils/firebase-injection-context.utils';
import { EnvironmentInjector, inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { LoginServiceService } from '../Servicos/login-service.service';

@Injectable({
  providedIn: 'root'
})
@RunInFirebaseInjectionContext
export class LoginGuard implements CanActivate {
  readonly firebaseEnvironmentInjector = inject(EnvironmentInjector);

  constructor(private afAuth : LoginServiceService, private router : Router){}

  canActivate() : Promise<boolean>  {
    return firstValueFrom(this.afAuth.getAuthState().pipe(
      take(1),
      map(user => {
        if (user) {
          void this.router.navigate(['/feed']);
        }

        return !user;
      })
    ));
  }

}
