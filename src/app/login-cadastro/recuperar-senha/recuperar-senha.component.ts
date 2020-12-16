import { Component, OnInit } from '@angular/core';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { Usuario } from './../../Usuarios/usuario';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent implements OnInit {

  userLogin : Usuario = {};

  constructor(public loginservico : LoginServiceService) { }

  ngOnInit() {
    
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

}
