import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { ServicosService } from './servicos.service';
import { LoginServiceService } from './../login-cadastro/login-service.service';
import { Servico } from './../Usuarios/servico';
import { getTypeNameForDebugging } from '@angular/core/src/change_detection/differs/iterable_differs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  private servicosDomesticoarray = new Array<Servico>();
  private servicosDomesticoSubscription : Subscription;
  private servicosReformaarray = new Array<Servico>();
  private servicosReformaSubscription : Subscription;
  checar;
 
  constructor(
    private servico : ServicosService, 
    private afAuth : LoginServiceService,
    private router : Router) { 
    this.servicosDomesticoSubscription = this.servico.getDomestico().subscribe(data => {
    this.servicosDomesticoarray = data;});
    
    this.servicosReformaSubscription = this.servico.getReforma().subscribe(data => {
    this.servicosReformaarray = data;});

    this.afAuth.getAuth().onAuthStateChanged(user => {
      if(!user){this.checar = false;}
      else{this.checar = true;}
    });
    console.log(this.checar);
 
  }
 
  ngOnInit() {}
 
  ngOnDestroy(){
   this.servicosDomesticoSubscription.unsubscribe();
   this.servicosReformaSubscription.unsubscribe();
  }

  async sair(){
    try{
      await this.afAuth.sair().then(
        (success) => {this.router.navigate(["/home"])});
    }catch(error){
      console.error(error);
    }
  }

}
