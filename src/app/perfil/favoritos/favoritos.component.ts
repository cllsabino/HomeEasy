import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FavoriteProfessional, FavoritesService } from '../../Servicos/favorites.service';
import { LoginServiceService } from '../../Servicos/login-service.service';
import { FeedbackType } from '../../shared/action-feedback/action-feedback.component';
import { getCurrentUser } from '../../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit, OnDestroy {
  authenticated = true;
  userId = '';
  favorites = new Array<FavoriteProfessional>();
  isLoading = true;
  removingProfessionalId = '';
  feedbackMessage = '';
  feedbackType: FeedbackType = 'success';
  private favoritesSubscription: Subscription;

  constructor(
    private favoritesService: FavoritesService,
    private loginService: LoginServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = getCurrentUser()?.uid || '';
    this.loadFavorites();
  }

  ngOnDestroy() {
    this.favoritesSubscription?.unsubscribe();
  }

  removeFavorite(professionalId: string) {
    if (this.removingProfessionalId) {
      return;
    }
    this.removingProfessionalId = professionalId;
    this.favoritesService.removeFavorite(professionalId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(
          favorite => favorite.professional.id !== professionalId
        );
        this.feedbackType = 'success';
        this.feedbackMessage = 'Profissional removido dos favoritos.';
        this.removingProfessionalId = '';
      },
      error: () => {
        this.feedbackType = 'error';
        this.feedbackMessage = 'Não foi possível atualizar seus favoritos.';
        this.removingProfessionalId = '';
      }
    });
  }

  async logout() {
    await this.loginService.sair();
    this.router.navigate(['/home']);
  }

  private loadFavorites() {
    this.favoritesSubscription = this.favoritesService.findFavorites().subscribe({
      next: favorites => {
        this.favorites = favorites;
        this.isLoading = false;
      },
      error: () => {
        this.feedbackType = 'error';
        this.feedbackMessage = 'Não foi possível carregar seus profissionais favoritos.';
        this.isLoading = false;
      }
    });
  }
}
