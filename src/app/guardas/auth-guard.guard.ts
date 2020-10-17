import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { LoginServiceService } from './../login-cadastro/login-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private afAuth : LoginServiceService, private router : Router){}

  canActivate() : Promise<boolean>  {
    return new Promise(resolve => {
        this.afAuth.getAuth().onAuthStateChanged(user => {
          if(!user) this.router.navigate(['/login']);
          
          resolve(user ? true : false);
        })
    });
  }

}
