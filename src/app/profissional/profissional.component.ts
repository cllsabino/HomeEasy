import { getCurrentFirebaseUser } from '../shared/utils/firebase-auth.utils';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../Servicos/login-service.service';
import { UsuarioService } from '../Servicos/usuario.service';
import { ServicosService } from '../Servicos/servicos.service';
import { Usuario } from './../Usuarios/usuario';
import { Servico } from './../Usuarios/servico';

@Component({
  standalone: false,
  selector: 'app-profissional',
  templateUrl: './profissional.component.html',
  styleUrls: ['./profissional.component.css']
})
export class ProfissionalComponent implements OnInit {
 entrarSair : boolean;
 userId : string; 

  constructor( 
    public servico : ServicosService, 
    public loginService : LoginServiceService,
    public usuarioService : UsuarioService,
    public afAuth : AngularFireAuth,
    public router : Router,
  ) { }

  ngOnInit() {
    if(getCurrentFirebaseUser() != null){
      this.entrarSair = true;
      this.userId = getCurrentFirebaseUser().uid;
    } else this.entrarSair = false;
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
