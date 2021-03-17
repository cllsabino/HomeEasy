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
  selector: 'app-pedido-feito-detalhe',
  templateUrl: './pedido-feito-detalhe.component.html',
  styleUrls: ['./pedido-feito-detalhe.component.css']
})
export class PedidoFeitoDetalheComponent implements OnInit {
  userId : string; //id do usuario
  entrarSair : boolean;
  pedidoId : string; //id do pedido
  pedidoIdSubscription : Subscription;
  pedido : Pedido = {} //o pedido
  pedidoSubscription : Subscription;
  avaliacao : Avaliacao = {}; //avaliacao do servico
  avaliacaoSubscription : Subscription;
  servidorId : string; //id do servidor
  servidorIdSubscription : Subscription;
  servidor : Usuario = {}; //o servidor
  servidorSubscription : Subscription;
  usuario : Usuario = {}; //usuario | cliente
  usuarioSubscription : Subscription;
  mes : number = new Date().getUTCMonth()+1;
  ano : number = new Date().getFullYear(); 
  dia : number = new Date().getDate();
  today = new Date().toJSON().split('T')[0];

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

    this.servidorIdSubscription = this.active.params.subscribe(
      (params : Params) => { this.servidorId = params['id'] }
    );
    this.pedidoIdSubscription = this.active.params.subscribe(
      (params : Params) => { this.pedidoId = params['idd'] }
    );
    this.servidorSubscription = this.usuarioService.getUsuario(this.servidorId).subscribe(data => {
      this.servidor = data;
    });
    this.pedidoSubscription = this.servicoPedido.getPedidoFeito(this.userId, this.pedidoId).subscribe(data => {
      this.pedido = data; 
    });
    this.usuarioSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.usuario = data;
    });
  }
  ngOnDestroy(){
    this.servidorIdSubscription.unsubscribe();
    this.servidorSubscription.unsubscribe();
    this.pedidoIdSubscription.unsubscribe();
    this.pedidoSubscription.unsubscribe();
    this.usuarioSubscription.unsubscribe();
  }
  async sair(){
    try{
      await this.loginService.sair().then(
        (success) => {this.router.navigate(["/home"])});
     }catch(error){
       console.error(error);
    }
  }
  addAvaliacao(){
    this.avaliacao.nomeContratante = this.usuario.nome;
    this.avaliacao.idServidor = this.servidorId;
    this.avaliacao.idPedido = this.pedidoId;
    this.avaliacao.idServico = this.pedido.idServico;
    this.avaliacao.data = this.dia + "/" + this.mes + "/" + this.ano;
    this.avaliacaoService.addAvaliacao(this.avaliacao, this.servidorId, this.pedido.idServico);
    this.servicoPedido.addPedido(this.usuario, this.servidor, this.pedido);
    alert("Avaliação Realizada!");
    this.router.navigate(["/feed"]);
  }
  cancelarPedido(){
    this.pedido.clienteCancelou = true;
    this.servicoPedido.addPedido(this.usuario, this.servidor, this.pedido);
    this.servicoPedido.deletePedidoFeito(this.userId, this.pedido.id);
    alert("Pedido Cancelado!");
    this.router.navigate(["/feed"]);
  }

}
