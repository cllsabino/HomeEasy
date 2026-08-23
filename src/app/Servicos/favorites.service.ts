import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

export interface FavoriteProfessional {
  createdAt: string;
  professional: {
    id: string;
    name: string;
    bio: string;
    city: string;
    state: string;
    verificationStatus: string;
    metrics?: {
      averageRating: number;
      completedServices: number;
    };
    services: Array<{ id: string; name: string; basePrice?: number }>;
  };
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  constructor(private http: HttpClient) {}

  findFavorites() {
    return this.http.get<FavoriteProfessional[]>(`${environment.apiUrl}/favorites`);
  }

  addFavorite(professionalId: string) {
    return this.http.put<{ isFavorite: boolean }>(
      `${environment.apiUrl}/favorites/${professionalId}`,
      {}
    );
  }

  removeFavorite(professionalId: string) {
    return this.http.delete<{ isFavorite: boolean }>(
      `${environment.apiUrl}/favorites/${professionalId}`
    );
  }
}
