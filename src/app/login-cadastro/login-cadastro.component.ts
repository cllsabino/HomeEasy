import { Component, OnInit } from '@angular/core';

import { Usuario } from './../Usuarios/usuario';
import { LoginServiceService } from './login-service.service';

@Component({
  selector: 'app-login-cadastro',
  templateUrl: './login-cadastro.component.html',
  styleUrls: ['./login-cadastro.component.css']
})
export class LoginCadastroComponent implements OnInit {
  userLogin : Usuario = {}; 
  userRegister : Usuario = {};

  constructor(private loginservico : LoginServiceService) { }

  ngOnInit() {
  }

  async login(){
    try { 
      await this.loginservico.login(this.userLogin);
    } catch (error) { 
      console.error(error); 
    }
  }

  async register(){
    try { 
     await this.loginservico.register(this.userRegister);
    } catch (error) { 
      console.error(error); 
    }
  }
}
