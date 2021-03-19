import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { Usuario } from './../../Usuarios/usuario';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent implements OnInit {
  entrarSair : boolean;
  userId : string;
  userLogin : Usuario = {};

  constructor(
    public loginservico : LoginServiceService,
    public router : Router,
    public afAuth : AngularFireAuth,
  ) { }

  ngOnInit() {    
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    }else this.entrarSair = false
  }

  recuperarsenha(){
    try { 
       this.loginservico.recuperarsenha(this.userLogin).then((success) =>{
        alert("O e-mail de recuperação de senha foi enviado!");
       });
    } catch (error) { 
      console.error(error); 
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
