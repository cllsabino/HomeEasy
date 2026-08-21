import { getCurrentFirebaseUser } from '../../shared/utils/firebase-auth.utils';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';

import { ServicosService } from '../../Servicos/servicos.service';
import { LoginServiceService } from '../../Servicos/login-service.service';
import { Servico } from './../../Usuarios/servico';

@Component({
  standalone: false,
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
  servicosDisponiveis = new Array<Servico>();
  servicosDisponiveisSubscription : Subscription; 

  constructor(
    public afs : AngularFirestore, 
    public afAuth : AngularFireAuth,
    public loginService : LoginServiceService,
    public servicoService : ServicosService, 
    public router : Router,
    public active : ActivatedRoute
  ) {}

  ngOnInit() {
    if(getCurrentFirebaseUser() != null){
      this.entrarSair = true;
      this.userId = getCurrentFirebaseUser().uid;
    } else this.entrarSair = false;

    this.nomeDoServicoSubscription = this.active.params.subscribe(
      (params : Params) => { this.nomeDoServico = params['nome'] }
    );
    if (this.nomeDoServico) {
      this.servicosArraySubscription = this.servicoService.getServicoPorNome(this.nomeDoServico).subscribe(data => {
        this.servicosArray = data;
      });
    }
    this.servicosDisponiveisSubscription = this.servicoService.getServicos().subscribe(data => {
      this.servicosDisponiveis = data;
    });
  }
  ngOnDestroy(){
    this.nomeDoServicoSubscription?.unsubscribe();
    this.servicosArraySubscription?.unsubscribe();
    this.servicosDisponiveisSubscription?.unsubscribe();
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
