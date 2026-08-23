import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Mensagem } from '../Usuarios/mensagem';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  constructor(private http: HttpClient) {}

  salvarmensagem(mensagem: Mensagem) {
    return firstValueFrom(
      this.http.post(`${environment.apiUrl}/contact`, {
        name: mensagem.nome,
        email: mensagem.email,
        phone: mensagem.telefone,
        subject: mensagem.assunto,
        message: mensagem.mensagem
      })
    );
  }
}