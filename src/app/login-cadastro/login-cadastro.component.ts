import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Usuario } from './../Usuarios/usuario';

@Component({
  selector: 'app-login-cadastro',
  templateUrl: './login-cadastro.component.html',
  styleUrls: ['./login-cadastro.component.css']
})
export class LoginCadastroComponent implements OnInit {
  userLogin : Usuario = {};
  userRegister : Usuario = {};

  constructor(public afAuth : AngularFireAuth) { }

  ngOnInit() {
  }

  async login(){
    const { userLogin } = this;
    try { 
     const res = await this.afAuth.auth.signInWithEmailAndPassword(userLogin.email, userLogin.password);
    } catch (error) { 
      console.error(error); 
    }
  }
  async register(){
    const { userRegister } = this;
    try { 
     const res = await this.afAuth.auth.createUserWithEmailAndPassword(userRegister.email, userRegister.password);
    } catch (error) { 
      console.error(error); 
    }
  }
}
