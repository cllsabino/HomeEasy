import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { ContatoService } from '../Servicos/contato.service';
import { Mensagem } from './../Usuarios/mensagem';
import { LoginServiceService } from '../Servicos/login-service.service';


@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {
  mensagem : Mensagem = {};
  entrarSair : boolean;
  userId : string;

  constructor(
    public contatoServico : ContatoService, 
    public afAuth : AngularFireAuth, 
    public loginService : LoginServiceService,
    public router : Router
    ) { }

  ngOnInit() {
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    }else this.entrarSair = false;
  }
  enviarmensagem(){
    this.contatoServico.salvarmensagem(this.mensagem).then((success) =>{
      alert("Mensagem Enviada!");
    });
  }
  async sair(){
    try{
      await this.loginService.sair().then(
        (success) => {this.router.navigate(["/home"])});
     }catch(error){
       console.error(error);
    }
  }
}
