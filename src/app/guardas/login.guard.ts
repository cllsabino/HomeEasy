import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginServiceService } from '../Servicos/login-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private afAuth : LoginServiceService, private router : Router){}

  canActivate() : Promise<boolean>  {
    return new Promise(resolve => {
        this.afAuth.getAuth().onAuthStateChanged(user => {
          if(user) this.router.navigate(['/feed']);
          
          resolve(!user ? true : false);
        })
    });
  }

}
