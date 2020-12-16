import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { ServicosService } from '../Servicos/servicos.service';
import { LoginServiceService } from '../Servicos/login-service.service';
import { UsuarioService } from '../Servicos/usuario.service';
import { Servico } from './../Usuarios/servico';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
 servicosDomesticosArray = new Array<Servico>();
 servicosDomesticosSubscription : Subscription;
 servicosReformaArray = new Array<Servico>();
 servicosReformaSubscription : Subscription;
 entrarSair : boolean;
 userId : string; 
 pesquisarServico : string;
 mostrarContentDO : boolean = false;
 mostrarContentRE : boolean = false;
 
  constructor(
    public servico : ServicosService, 
    public loginService : LoginServiceService,
    public usuarioService : UsuarioService,
    public router : Router,
    public afs : AngularFirestore, 
    public afAuth : AngularFireAuth,
    public active : ActivatedRoute
    ) { }
 
  ngOnInit() {
    this.servicosDomesticosSubscription = this.servico.getDomestico().subscribe(data => {
    this.servicosDomesticosArray = data;});

    this.servicosReformaSubscription = this.servico.getReforma().subscribe(data => {
    this.servicosReformaArray = data;});
  
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    } else this.entrarSair = false;
  }
 
  ngOnDestroy(){
    this.servicosDomesticosSubscription.unsubscribe();
    this.servicosReformaSubscription.unsubscribe();
  }
  
  async sair(){
    try{
      await this.loginService.sair().then(
        (success) => {this.router.navigate(["/home"])});
     }catch(error){
       console.error(error);
    }
  }

  mostrarConteudoDO(){
    this.mostrarContentDO = !this.mostrarContentDO;
  }
  mostrarConteudoRE(){
    this.mostrarContentRE = !this.mostrarContentRE;
  }




}
