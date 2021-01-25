import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';

import { ServicosService } from '../../Servicos/servicos.service';
import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServicoPedidoService } from './../../Servicos/servico-pedido.service';
import { Usuario } from 'src/app/Usuarios/usuario';
import { UsuarioService } from './../../Servicos/usuario.service';
import { AvalicaoService } from './../../Servicos/avaliacao.service';
import { Avaliacao } from './../../Usuarios/avaliacao';

@Component({
  selector: 'app-avaliacoes',
  templateUrl: './avaliacoes.component.html',
  styleUrls: ['./avaliacoes.component.css']
})
export class AvaliacoesComponent implements OnInit {
 userId : string; //id do usuario
 servidorId : string; //id do servidor
 servidorIdSubscription : Subscription;
 AvaliacoesArray = new Array<Avaliacao>(); //avaliações
 AvaliacoesArraySubscription : Subscription;
 serveId : string; //id do serviço
 serveIdSubscription : Subscription;

 constructor(
  public afs : AngularFirestore, 
  public afAuth : AngularFireAuth,
  public storage : AngularFireStorage,
  public router : Router,
  public loginService : LoginServiceService,
  public usuarioService : UsuarioService,
  public servicoPedido : ServicoPedidoService,
  public servico : ServicosService, 
  public avaliacaoService : AvalicaoService,
  public active : ActivatedRoute
  ) { }

  ngOnInit() {
    if(this.afAuth.auth.currentUser != null){
      this.userId = this.afAuth.auth.currentUser.uid;
    }
    this.servidorIdSubscription = this.active.params.subscribe(
      (params : Params) => { this.servidorId = params['idd'] }
    );
    this.serveIdSubscription = this.active.params.subscribe(
      (params : Params) => { this.serveId = params['id'] }
    );
    this.AvaliacoesArraySubscription = this.avaliacaoService.getAvaliacoes(this.servidorId, this.serveId).subscribe(data => {
      this.AvaliacoesArray = data;
    });
  }
  ngOnDestroy(){
    this.servidorIdSubscription.unsubscribe();
    this.serveIdSubscription.unsubscribe();
    this.AvaliacoesArraySubscription.unsubscribe();
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
