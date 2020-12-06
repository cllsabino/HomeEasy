import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import { ServicosService } from '../../Servicos/servicos.service';
import { LoginServiceService } from '../../Servicos/login-service.service';
import { Usuario } from 'src/app/Usuarios/usuario';

@Component({
  selector: 'app-servico-detalhe',
  templateUrl: './servico-detalhe.component.html',
  styleUrls: ['./servico-detalhe.component.css']
})
export class ServicoDetalheComponent implements OnInit {
  private usuariosArray = new Array<Usuario>();
  private usuariosSubscription : Subscription;
  private serveID : string;
  private serveIDSubscription : Subscription;
  private entrarSair : boolean;
  private userId : string;

  constructor(
    private afs : AngularFirestore, 
    private afAuth : AngularFireAuth,
    private loginService : LoginServiceService,
    private servico : ServicosService, 
    private router : Router,
    private active : ActivatedRoute
  ) {}

  ngOnInit() {
    this.serveIDSubscription = this.active.params.subscribe(
    (params : Params) => { this.serveID = params['id'] });

    this.usuariosSubscription = this.servico.getUsuarios(this.serveID).subscribe(data => {
    this.usuariosArray = data;});

    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    } else this.entrarSair = false;
  }

  ngOnDestroy(){
    this.usuariosSubscription.unsubscribe();
    this.serveIDSubscription.unsubscribe();
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
