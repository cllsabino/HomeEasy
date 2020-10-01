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
  error : any;
  
  constructor(private loginservico : LoginServiceService, private router : Router) { }

  ngOnInit() {
  }

  async login(){
    await this.loginservico.login(this.userLogin)
    .then(
      (success) => {
        this.router.navigate(["/perfil"])
      }).catch(
        (err) => {
          console.log(err);
          this.error = err;
        }
      )
  }

  async register(){
    await this.loginservico.register(this.userRegister)
    .then(
      (success) => {
        this.router.navigate(["/perfil"])
      }).catch(
        (err) => {
          console.log(err);
          this.error = err;
        }
      )
  }
  
}
