import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { UsuarioService } from '../../Servicos/usuario.service';
import { ServicosService } from '../../Servicos/servicos.service';
import { Usuario } from './../../Usuarios/usuario';
import { Servico } from './../../Usuarios/servico';

@Component({
  selector: 'app-addprofissioanl',
  templateUrl: './addprofissioanl.component.html',
  styleUrls: ['./addprofissioanl.component.css']
})
export class AddprofissioanlComponent implements OnInit {
 entrarSair : boolean;
 userId : string; 
 usuario : Usuario = {};
 userSubscription : Subscription;
 servicosArray = new Array<Servico>();
 servicosSubscription : Subscription;
 servicoSelecionado : Servico;

  constructor( 
    public servico : ServicosService, 
    public loginService : LoginServiceService,
    public usuarioService : UsuarioService,
    public afAuth : AngularFireAuth,
    public router : Router,
  ) { }

  ngOnInit() {
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    } else this.entrarSair = false;

    this.userSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.usuario = data; 
    });

    this.servicosSubscription = this.servico.getServicos().subscribe(data => {
      this.servicosArray = data;
    });
  }
  ngOnDestroy(){
    if(this.afAuth.auth.currentUser != null){
      this.userSubscription.unsubscribe();
      this.servicosSubscription.unsubscribe();
    }
  }
  async sair(){
    try{
      await this.loginService.sair().then(
        (success) => {this.router.navigate(["/home"])});
     }catch(error){
       console.error(error);
    }
  }
  inscreverServico(){
    this.servico.addUsuario(this.usuario, this.servicoSelecionado);
    alert("Inscrição Concluida!");
  }
}
