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
import { Servico } from './../../Usuarios/servico';
import { ServicoPedido } from './../../Usuarios/serico-pedido';

@Component({
  selector: 'app-servico-detalhe',
  templateUrl: './servico-detalhe.component.html',
  styleUrls: ['./servico-detalhe.component.css']
})
export class ServicoDetalheComponent implements OnInit {
  userId : string; //id do usuario
  entrarSair : boolean;
  servicoped : ServicoPedido = {}; //detalhe do serviço
  servicopedSubscription : Subscription;
  serveId : string; //id do serviço
  serveIdSubscription : Subscription;
  servico : Servico = {}; //o serviço
  servicoSubscription : Subscription;

  constructor(
    public afs : AngularFirestore, 
    public afAuth : AngularFireAuth,
    public storage : AngularFireStorage,
    public loginService : LoginServiceService,
    public servicoService : ServicosService, 
    public servicoPedido : ServicoPedidoService,
    public router : Router,
    public active : ActivatedRoute
  ) { }

  ngOnInit() {
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    }else this.entrarSair = false;

    this.serveIdSubscription = this.active.params.subscribe(
      (params : Params) => { this.serveId = params['idd'] }
    );
    this.servicopedSubscription = this.servicoPedido.getDetalheServico(this.userId, this.serveId).subscribe(data => {
      this.servicoped = data}
    );
    this.servicoSubscription = this.servicoService.getUserServicoPorId(this.userId, this.serveId).subscribe(data => {
      this.servico = data}
    );
  }
  ngOnDestroy(){
    this.serveIdSubscription.unsubscribe();
    this.servicopedSubscription.unsubscribe();
    this.servicoSubscription.unsubscribe();
  }

}
