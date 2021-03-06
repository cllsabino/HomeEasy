import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Usuario } from './../Usuarios/usuario';
import { LoginServiceService } from '../Servicos/login-service.service';

@Component({
  selector: 'app-login-cadastro',
  templateUrl: './login-cadastro.component.html',
  styleUrls: ['./login-cadastro.component.css']
})
export class LoginCadastroComponent implements OnInit {
 userLogin : Usuario = {}; 
 userRegister : Usuario = {};
 mensagemErro : string = null;
 entrarSair : boolean;
 userId : string;
  
  constructor(
    public loginservico : LoginServiceService, 
    public router : Router,
    public afs : AngularFirestore,
    public afAuth : AngularFireAuth,
    ) { }

  ngOnInit() {    
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    }else this.entrarSair = false
  }

  async login(){
    try{
      await this.loginservico.login(this.userLogin).then(
        (success) => {this.router.navigate(["/feed"])})
    }catch(error){
      switch (error.code) {
        case 'auth/wrong-password':
          this.mensagemErro = "Senha Incorreta!";
        break;
        case 'auth/user-not-found':
          this.mensagemErro = "E-mail Não Cadastrado!";
        break;
        case 'auth/invalid-email':
          this.mensagemErro = "E-mail Inválido!";
        break;
      }
    }
  }

  async register(){
    try{
      const novoUsuario = await this.afAuth.auth.createUserWithEmailAndPassword(this.userRegister.email, this.userRegister.senha);

      const usuarioObject = Object.assign({}, this.userRegister);
      usuarioObject.id = novoUsuario.user.uid;
      delete usuarioObject.email;
      delete usuarioObject.senha;

      await this.afs.collection("Usuarios").doc(novoUsuario.user.uid).set(usuarioObject).then(
        (success) => {this.router.navigate(['/feed'])});
    }catch(error){
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.mensagemErro = "E-mail Já Cadastrado!";
        break;
        case 'auth/invalid-email':
          this.mensagemErro = "E-mail Inválido!";
        break;
      }
    }
  }

  async sair(){
    try{
      await this.loginservico.sair().then(
        (success) => {this.router.navigate(["/home"])});
     }catch(error){
       console.error(error);
    }
  }
  
}
