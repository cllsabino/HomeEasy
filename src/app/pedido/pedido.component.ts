import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { Subscription } from 'rxjs';

import { Usuario } from './../Usuarios/usuario';
import { Servico } from './../Usuarios/servico';
import { Pedido } from './../Usuarios/pedido';
import { ServicoPedido } from './../Usuarios/serico-pedido';
import { UsuarioService } from '../Servicos/usuario.service';
import { ServicosService } from './../Servicos/servicos.service';
import { LoginServiceService } from '../Servicos/login-service.service';
import { ServicoPedidoService } from './../Servicos/servico-pedido.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  pedido : Pedido = {} //dados do pedido
  entrarSair : boolean;
  userId : string; //id do cliente
  serveID : string; //id do servico
  serveIDSubscription : Subscription;
  serve : Servico = {}; //servico que sera pedido
  serveSubscription : Subscription;
  usuarioID : string; //id do servidor
  usuarioIDSubscription : Subscription;
  servidor : Usuario = {}; //dados do servidor
  servidorSubscription : Subscription;
  cliente : Usuario = {}; //dados do cliente
  clienteSubscription : Subscription;
  servePedidoSubscription : Subscription;
  servePedido : ServicoPedido = {}; //detalhes do serviço

  constructor(
    public afs : AngularFirestore, 
    public afAuth : AngularFireAuth,
    public storage : AngularFireStorage,
    public router : Router,
    public loginService : LoginServiceService,
    public usuarioService : UsuarioService,
    public servico : ServicosService, 
    public servicoPedido : ServicoPedidoService,
    public active : ActivatedRoute
  ) { }
 
  ngOnInit() {
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    }else this.entrarSair = false;

    this.serveIDSubscription = this.active.params.subscribe(
      (params : Params) => { this.serveID = params['id'] }
    );
    this.usuarioIDSubscription = this.active.params.subscribe(
      (params : Params) => { this.usuarioID = params['idd'] }
    );
    this.clienteSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.cliente = data;
    });
    this.serveSubscription = this.servico.getUserServicoPorId(this.usuarioID, this.serveID).subscribe(data => {
    this.serve = data;
    });
    this.servePedidoSubscription = this.servicoPedido.getDetalheServico(this.usuarioID, this.serveID).subscribe(data => {
      this.servePedido = data;}
    );
    this.servidorSubscription = this.servico.getServicoUsuario(this.serveID, this.usuarioID).subscribe(data => {
      this.servidor = data;
    });
  }

  ngOnDestroy(){
    this.serveIDSubscription.unsubscribe();
    this.usuarioIDSubscription.unsubscribe();
    this.clienteSubscription.unsubscribe();
    this.servidorSubscription.unsubscribe();
    this.serveSubscription.unsubscribe();
    this.servidorSubscription.unsubscribe();
  }
  async sair(){
    try{
      await this.loginService.sair().then(
        (success) => {this.router.navigate(["/home"])});
     }catch(error){
       console.error(error);
    }
  }
  addpedido(){
    if(this.userId != this.servidor.id){
      this.pedido.nome = this.serve.nome;
      this.pedido.id = Math.floor(Math.random() * 1000) + this.cliente.id;
      this.pedido.idServidor = this.servidor.id;
      this.pedido.idContratante = this.cliente.id;
      this.pedido.preco = this.servePedido.preco;
      this.pedido.statusContratante = false;
      this.pedido.statusProfissional = false;
      this.pedido.profissionalCancelou = false;
      this.pedido.idServico = this.serveID;
      this.servicoPedido.addPedido(this.cliente, this.servidor, this.pedido);
      alert("Pedido Realizado!");
      this.router.navigate(["/feed"]);
    }else{
      alert("Ação Impossível!");
      this.router.navigate(["/feed"]);
    }
  }


}
