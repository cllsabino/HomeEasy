import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { Usuario } from './../Usuarios/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(public afAuth : AngularFireAuth) { }

  login(user : Usuario){
     return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  register(user : Usuario){
     return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  recuperarsenha(user : Usuario){
     return this.afAuth.auth.sendPasswordResetEmail(user.email);
  }

  getAuth(){
     return this.afAuth.auth;
  }

  sair(){
     return this.afAuth.auth.signOut();
  }

}
