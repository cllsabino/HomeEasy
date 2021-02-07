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
import { UsuarioService } from './../../Servicos/usuario.service';

@Component({
  selector: 'app-editar-info',
  templateUrl: './editar-info.component.html',
  styleUrls: ['./editar-info.component.css']
})
export class EditarInfoComponent implements OnInit {
  userId : string; //id do usuario
  entrarSair : boolean;
  servicoped : ServicoPedido = {}; //detalhe do serviço
  serveId : string; //id do serviço
  serveIdSubscription : Subscription;
  servico : Servico = {}; //o serviço
  servicoSubscription : Subscription;
  usuario : Usuario = {};
  usuarioSubscription : Subscription;

  constructor(
    public afs : AngularFirestore, 
    public afAuth : AngularFireAuth,
    public storage : AngularFireStorage,
    public loginService : LoginServiceService,
    public servicoService : ServicosService, 
    public servicoPedido : ServicoPedidoService,
    public usuarioService : UsuarioService,
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
    this.servicoSubscription = this.servicoService.getUserServicoPorId(this.userId, this.serveId).subscribe(data => {
      this.servico = data}
    );
    this.usuarioSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.usuario = data;
    });

  }
  ngOnDestroy(){
    this.serveIdSubscription.unsubscribe();
    this.servicoSubscription.unsubscribe();
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
  editarInfo(){
    this.servicoped.id = this.serveId;
    this.servicoPedido.addServicoPedido(this.usuario, this.servico, this.servicoped);
    alert("Informações Editadas");
    this.router.navigate(["/feed"]);
  }

}
