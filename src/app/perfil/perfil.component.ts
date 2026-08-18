import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProfessionalVerificationStatus, Usuario } from './../Usuarios/usuario';
import { Pedido } from './../Usuarios/pedido';
import { Servico } from './../Usuarios/servico';
import { UsuarioService } from '../Servicos/usuario.service';
import { ServicosService } from './../Servicos/servicos.service';
import { LoginServiceService } from '../Servicos/login-service.service';
import { ServicoPedidoService } from './../Servicos/servico-pedido.service';
import { ProfessionalVerificationService } from '../Servicos/professional-verification.service';
import { FeedbackType } from '../shared/action-feedback/action-feedback.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
 usuario : Usuario = {};
 userId : string;
 userSubscription : Subscription;
 entrarSair : boolean;
 servicosArray = new Array<Servico>();
 servicosSubscription : Subscription;
 feedbackMessage = '';
 feedbackType: FeedbackType = 'success';
 isRequestingVerification = false;
  
  constructor(
    public afs : AngularFirestore, 
    public afAuth : AngularFireAuth,
    public router : Router,
    public loginService : LoginServiceService,
    public usuarioService : UsuarioService,
    public servicoPedido : ServicoPedidoService,
    public verificationService : ProfessionalVerificationService,
    public servico : ServicosService, 
    public active : ActivatedRoute
    ) { }

  ngOnInit() {
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    }else this.entrarSair = false;
 
    this.userSubscription = this.usuarioService.getUserWithProfilePhoto(this.userId).subscribe(data => {
      this.usuario = data; 
    });
    this.servicosSubscription = this.servico.getUserServico(this.userId).subscribe(data => {
      this.servicosArray = data;
    });
  }

  get verificationStatusLabel() {
    if (this.usuario.verificationStatus === ProfessionalVerificationStatus.Verified) {
      return 'Perfil verificado';
    }

    if (this.usuario.verificationStatus === ProfessionalVerificationStatus.Pending) {
      return 'Verificação em análise';
    }

    if (this.usuario.verificationStatus === ProfessionalVerificationStatus.Rejected) {
      return 'Verificação precisa de ajustes';
    }

    return 'Perfil ainda não verificado';
  }

  get canRequestVerification() {
    return this.usuario.verificationStatus !== ProfessionalVerificationStatus.Pending &&
      this.usuario.verificationStatus !== ProfessionalVerificationStatus.Verified;
  }

  async requestVerification() {
    if (this.isRequestingVerification) {
      return;
    }

    this.isRequestingVerification = true;
    this.feedbackMessage = '';
    try {
      await this.verificationService.requestVerification(this.userId);
      this.feedbackType = 'success';
      this.feedbackMessage = 'Solicitação enviada. Seu perfil entrará na fila de revisão.';
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = error && error.message ? error.message : 'Não foi possível solicitar a verificação.';
    } finally {
      this.isRequestingVerification = false;
    }
  }

  ngOnDestroy(){ 
    this.userSubscription.unsubscribe();
    this.servicosSubscription.unsubscribe();
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
