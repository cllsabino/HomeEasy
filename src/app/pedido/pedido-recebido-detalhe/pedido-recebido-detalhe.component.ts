import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServicoPedidoService } from './../../Servicos/servico-pedido.service';
import { UsuarioService } from './../../Servicos/usuario.service';
import { Usuario } from 'src/app/Usuarios/usuario';
import { Servico } from './../../Usuarios/servico';
import { Pedido } from 'src/app/Usuarios/pedido';
import { AvalicaoService } from './../../Servicos/avaliacao.service';
import { Avaliacao } from './../../Usuarios/avaliacao';
import { ServicosService } from './../../Servicos/servicos.service';

@Component({
  selector: 'app-pedido-recebido-detalhe',
  templateUrl: './pedido-recebido-detalhe.component.html',
  styleUrls: ['./pedido-recebido-detalhe.component.css']
})
export class PedidoRecebidoDetalheComponent implements OnInit {
  userId : string; //id do usuario
  entrarSair : boolean;
  pedidoId : string; //id do pedido
  pedidoIdSubscription : Subscription;
  pedido : Pedido = {} //o pedido
  pedidoSubscription : Subscription;
  clienteId : string; //id do cliente
  clienteIdSubscription : Subscription;
  cliente : Usuario = {}; //o cliente
  clienteSubscription : Subscription;

  constructor(
    public afs : AngularFirestore, 
    public afAuth : AngularFireAuth,
    public storage : AngularFireStorage,
    public loginService : LoginServiceService,
    public servicoPedido : ServicoPedidoService,
    public usuarioService : UsuarioService,
    public avaliacaoService : AvalicaoService,
    public servicosService : ServicosService,
    public router : Router,
    public active : ActivatedRoute
  ) { }

  ngOnInit() {
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    }else this.entrarSair = false;

    this.clienteIdSubscription = this.active.params.subscribe(
      (params : Params) => { this.clienteId = params['id'] }
    );
    this.pedidoIdSubscription = this.active.params.subscribe(
      (params : Params) => { this.pedidoId = params['idd'] }
    );
    this.clienteSubscription = this.usuarioService.getUsuario(this.clienteId).subscribe(data => {
      this.cliente = data;
    });
    this.pedidoSubscription = this.servicoPedido.getPedidoRecebido(this.userId, this.pedidoId).subscribe(data => {
      this.pedido = data; 
    });
  } 
  ngOnDestroy(){
    this.clienteIdSubscription.unsubscribe();
    this.pedidoIdSubscription.unsubscribe();
    this.clienteSubscription.unsubscribe();
    this.pedidoSubscription.unsubscribe();
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
