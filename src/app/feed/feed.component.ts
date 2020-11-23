import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { ServicosService } from './servicos.service';
import { LoginServiceService } from './../login-cadastro/login-service.service';
import { UsuarioService } from './../perfil/usuario.service';
import { Servico } from './../Usuarios/servico';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  private servicosDomesticosArray = new Array<Servico>();
  private servicosDomesticosSubscription : Subscription;
  private servicosReformaArray = new Array<Servico>();
  private servicosReformaSubscription : Subscription;
  private entrarSair : boolean;
  private userId : string; 
 
  constructor(
    private servico : ServicosService, 
    private loginService : LoginServiceService,
    private usuarioService : UsuarioService,
    private router : Router,
    private afs : AngularFirestore, 
    private afAuth : AngularFireAuth,
    private active : ActivatedRoute
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

  porcurarservico(nome : string){}




}
