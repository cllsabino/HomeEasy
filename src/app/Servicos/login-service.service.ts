import { RunInFirebaseInjectionContext } from '../shared/utils/firebase-injection-context.utils';
import { EnvironmentInjector, inject, Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../Usuarios/usuario';

@Injectable({
  providedIn: 'root'
})

@RunInFirebaseInjectionContext
export class LoginServiceService {
  readonly firebaseEnvironmentInjector = inject(EnvironmentInjector);

  constructor(public afAuth : AngularFireAuth) { }

  login(user : Usuario){
     return this.afAuth.signInWithEmailAndPassword(user.email, user.senha);
  }

  recuperarsenha(user : Usuario){
     return this.afAuth.sendPasswordResetEmail(user.email);
  }

  getAuthState(){
     return this.afAuth.authState;
  }

  sair(){
     return this.afAuth.signOut();
  }

  isAuth() {
   return this.afAuth.authState.pipe(map(auth => auth));
 }

}
