import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  
  constructor(private loginservico : LoginServiceService, private router : Router) { }

  ngOnInit() {
  }

  async login(){
    try{
      await this.loginservico.login(this.userLogin).then(
        (success) => {this.router.navigate(["/feed"])})
    }catch(error){
      console.error(error);
    }
  }

  async register(){
    try{
      await this.loginservico.register(this.userRegister).then(
        (success) => {this.router.navigate(["/perfil"])})
    }catch(error){
      console.error(error);
    }
  }
  
}
