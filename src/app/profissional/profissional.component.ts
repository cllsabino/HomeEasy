import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from './../login-cadastro/login-service.service';
import { UsuarioService } from './../perfil/usuario.service';
import { ServicosService } from './../feed/servicos.service';
import { Usuario } from './../Usuarios/usuario';
import { Servico } from './../Usuarios/servico';

@Component({
  selector: 'app-profissional',
  templateUrl: './profissional.component.html',
  styleUrls: ['./profissional.component.css']
})
export class ProfissionalComponent implements OnInit {
  private entrarSair : boolean;
  private userId : string; 
  private usuario : Usuario = {};
  private userSubscription : Subscription;
  private servicosArray = new Array<Servico>();
  private servicosSubscription : Subscription;
  private servicoSelecionado : Servico;

  constructor( 
    private servico : ServicosService, 
    private loginService : LoginServiceService,
    private usuarioService : UsuarioService,
    private afAuth : AngularFireAuth,
    private router : Router,
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
      this.servicosArray = data;});
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
