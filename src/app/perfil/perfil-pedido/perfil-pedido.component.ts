import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';

import { ServicosService } from '../../Servicos/servicos.service';
import { LoginServiceService } from '../../Servicos/login-service.service';
import { Usuario } from 'src/app/Usuarios/usuario';

@Component({
  selector: 'app-perfil-pedido',
  templateUrl: './perfil-pedido.component.html',
  styleUrls: ['./perfil-pedido.component.css']
})
export class PerfilPedidoComponent implements OnInit {
 serveID : string;
 serveIDSubscription : Subscription;
 usuarioID : string;
 usuarioIDSubscription : Subscription;
 usuario : Usuario = {};
 userId : string;
 userSubscription : Subscription;
 imgSubscription : Subscription;

  constructor(
    public afs : AngularFirestore, 
    public afAuth : AngularFireAuth,
    public storage : AngularFireStorage,
    public loginService : LoginServiceService,
    public servico : ServicosService, 
    public router : Router,
    public active : ActivatedRoute
  ) { }

  ngOnInit() {
    this.serveIDSubscription = this.active.params.subscribe(
      (params : Params) => { this.serveID = params['id'] }
    );
    this.usuarioIDSubscription = this.active.params.subscribe(
      (params : Params) => { this.usuarioID = params['idd'] }
    );
    this.userSubscription = this.servico.getServicoUsuario(this.serveID, this.usuarioID).subscribe(data => {
      this.usuario = data;}
    );
    this.imgSubscription = this.storage.ref('Usuarios/' + this.usuarioID + '/fotoPerfil.jpg').getDownloadURL().subscribe(data => {
      this.usuario.foto = data;
    });
    
  }
  ngOnDestroy(){
    this.serveIDSubscription.unsubscribe();
    this.usuarioIDSubscription.unsubscribe();
    this.userSubscription.unsubscribe();

  }

}
