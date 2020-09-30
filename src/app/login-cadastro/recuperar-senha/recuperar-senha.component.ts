import { Component, OnInit } from '@angular/core';

import { LoginServiceService } from '../login-service.service';
import { Usuario } from './../../Usuarios/usuario';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent implements OnInit {

  userLogin : Usuario = {};

  constructor(private loginservico : LoginServiceService) { }

  ngOnInit() {
    
  }

  recuperarsenha(){
    try { 
       this.loginservico.recuperarsenha(this.userLogin);
    } catch (error) { 
      console.error(error); 
    }
  }

}
