import { getCurrentUser } from '../shared/utils/session-user.utils';
import { Component, OnInit } from '@angular/core';
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
import { FavoritesService } from '../Servicos/favorites.service';

@Component({
  standalone: false,
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
 usuario : Usuario = {};
 userId : string;
 authenticatedUserId = '';
 userSubscription : Subscription;
 entrarSair : boolean;
 servicosArray = new Array<Servico>();
 servicosSubscription : Subscription;
 feedbackMessage = '';
 feedbackType: FeedbackType = 'success';
 isRequestingVerification = false;
 verificationDocument: File;
 isOwnProfile = true;
 isFavorite = false;
 isUpdatingFavorite = false;
  
  constructor(
    public router : Router,
    public loginService : LoginServiceService,
    public usuarioService : UsuarioService,
    public servicoPedido : ServicoPedidoService,
    public verificationService : ProfessionalVerificationService,
    private favoritesService: FavoritesService,
    public servico : ServicosService, 
    public active : ActivatedRoute
    ) { }

  ngOnInit() {
    if(getCurrentUser() != null){
      this.entrarSair = true;
      const authenticatedUserId = getCurrentUser().uid;
      this.authenticatedUserId = authenticatedUserId;
      this.userId = this.active.snapshot.paramMap.get('id') || authenticatedUserId;
      this.isOwnProfile = this.userId === authenticatedUserId;
    }else this.entrarSair = false;
 
    this.userSubscription = this.usuarioService.getUserWithProfilePhoto(this.userId).subscribe(data => {
      this.usuario = data; 
    });
    this.servicosSubscription = this.servico.getUserServico(this.userId).subscribe(data => {
      this.servicosArray = data;
    });
    if (!this.isOwnProfile) {
      this.favoritesService.findFavorites().subscribe(favorites => {
        this.isFavorite = favorites.some(favorite => favorite.professional.id === this.userId);
      });
    }
  }

  get verificationStatusLabel() {
    if ([
      ProfessionalVerificationStatus.Verified,
      ProfessionalVerificationStatus.IdentityVerified,
      ProfessionalVerificationStatus.ProfessionalVerified,
      ProfessionalVerificationStatus.Featured
    ].includes(this.usuario.verificationStatus)) {
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
      ![
        ProfessionalVerificationStatus.Verified,
        ProfessionalVerificationStatus.IdentityVerified,
        ProfessionalVerificationStatus.ProfessionalVerified,
        ProfessionalVerificationStatus.Featured
      ].includes(this.usuario.verificationStatus);
  }

  onVerificationDocumentSelection(event: Event) {
    const input = event.target as HTMLInputElement;
    this.verificationDocument = input.files?.[0] || null;
  }

  async requestVerification() {
    if (this.isRequestingVerification) {
      return;
    }

    this.isRequestingVerification = true;
    this.feedbackMessage = '';
    try {
      await this.verificationService.requestVerification(this.userId, this.verificationDocument);
      this.feedbackType = 'success';
      this.feedbackMessage = 'Solicitação enviada. Seu perfil entrará na fila de revisão.';
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = error && error.message ? error.message : 'Não foi possível solicitar a verificação.';
    } finally {
      this.isRequestingVerification = false;
    }
  }

  toggleFavorite() {
    if (this.isOwnProfile || this.isUpdatingFavorite) {
      return;
    }
    this.isUpdatingFavorite = true;
    const request = this.isFavorite
      ? this.favoritesService.removeFavorite(this.userId)
      : this.favoritesService.addFavorite(this.userId);
    request.subscribe({
      next: response => {
        this.isFavorite = response.isFavorite;
        this.feedbackType = 'success';
        this.feedbackMessage = this.isFavorite
          ? 'Profissional salvo nos favoritos.'
          : 'Profissional removido dos favoritos.';
        this.isUpdatingFavorite = false;
      },
      error: () => {
        this.feedbackType = 'error';
        this.feedbackMessage = 'Não foi possível atualizar seus favoritos.';
        this.isUpdatingFavorite = false;
      }
    });
  }

  ngOnDestroy(){ 
    this.userSubscription?.unsubscribe();
    this.servicosSubscription?.unsubscribe();
  }
  async sair(){
    try{
      await this.loginService.sair().then(
        (success) => {this.router.navigate(["/home"])});
     } catch {
       this.feedbackType = 'error';
       this.feedbackMessage = 'Não foi possível encerrar a sessão. Tente novamente.';
    }
  }

}
