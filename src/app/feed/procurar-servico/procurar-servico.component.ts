import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import { ServicosService } from '../../Servicos/servicos.service';
import { LoginServiceService } from '../../Servicos/login-service.service';
import { Servico } from './../../Usuarios/servico';

@Component({
  selector: 'app-procurar-servico',
  templateUrl: './procurar-servico.component.html',
  styleUrls: ['./procurar-servico.component.css']
})
export class ProcurarServicoComponent implements OnInit {
  entrarSair : boolean;
  userId : string;
  nomeDoServico : string;
  nomeDoServicoSubscription : Subscription;
  servicosArray = new Array<Servico>();
  servicosArraySubscription : Subscription;

  constructor(
    public afs : AngularFirestore, 
    public afAuth : AngularFireAuth,
    public loginService : LoginServiceService,
    public servicoService : ServicosService, 
    public router : Router,
    public active : ActivatedRoute
  ) {}

  ngOnInit() {
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    } else this.entrarSair = false;

    this.nomeDoServicoSubscription = this.active.params.subscribe(
      (params : Params) => { this.nomeDoServico = params['nome'] }
    );
    this.servicosArraySubscription = this.servicoService.getServicoPorNome(this.nomeDoServico).subscribe(data => {
      this.servicosArray = data;
    });
  }
  ngOnDestroy(){
    this.nomeDoServicoSubscription.unsubscribe();
    this.servicosArraySubscription.unsubscribe();
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
