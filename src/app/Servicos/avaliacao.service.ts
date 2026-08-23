import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Avaliacao } from '../Usuarios/avaliacao';

interface ApiReviewsResponse {
  reviews: Array<{
    id: string;
    orderId: string;
    clientName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class AvalicaoService {
  constructor(private http: HttpClient) {}

  getAvaliacoes(professionalId: string, serviceId: string) {
    return this.http
      .get<ApiReviewsResponse>(`${environment.apiUrl}/professionals/${professionalId}/reviews`)
      .pipe(
        map(response =>
          response.reviews.map(review => ({
            idPedido: review.orderId,
            nomeContratante: review.clientName,
            idServidor: professionalId,
            avaliacao: review.comment,
            avaliacaoNota: review.rating,
            idServico: serviceId,
            data: review.createdAt
          } as Avaliacao))
        )
      );
  }

  addAvaliacao(review: Avaliacao, professionalId: string, serviceId: string) {
    return firstValueFrom(
      this.http.post(`${environment.apiUrl}/orders/${review.idPedido}/reviews`, {
        rating: Number(review.avaliacaoNota),
        comment: review.avaliacao
      })
    );
  }
}
