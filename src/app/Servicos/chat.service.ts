import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Chat } from '../Usuarios/chat';
import { Usuario } from '../Usuarios/usuario';
import { ApiSessionService } from './api-session.service';

interface ApiConversation {
  id: string;
  otherUser: { id: string; name: string };
  unreadCount: number;
  lastMessageAt?: string;
}

interface ApiMessage {
  id: string;
  senderId: string;
  content?: string;
  budgetAmount?: string;
  createdAt: string;
  readAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient, private sessionService: ApiSessionService) {}

  addMensagem(clientId: string, professionalId: string, message: Chat) {
    return this.sendMessageByParticipant(professionalId, message);
  }

  getMensagens(clientId: string, professionalId: string) {
    return this.findConversation(professionalId).pipe(
      switchMap(conversation =>
        this.http.get<ApiMessage[]>(
          `${environment.apiUrl}/conversations/${conversation.id}/messages`
        )
      ),
      map(messages => messages.map(message => this.toChat(message)))
    );
  }

  addCliente(client: Usuario, professional: Usuario) {
    return Promise.resolve({ clientId: client.id, professionalId: professional.id });
  }

  sendMessage(client: Usuario, professional: Usuario, message: Chat) {
    const otherUserId = this.getOtherUserId(client, professional);
    return this.sendMessageByParticipant(otherUserId, message);
  }

  async deleteContato(client: Usuario, professional: Usuario) {
    const blockedUserId = this.getOtherUserId(client, professional);
    await firstValueFrom(this.http.put(`${environment.apiUrl}/blocks/${blockedUserId}`, {}));
  }

  getContatos(userId: string) {
    return this.http.get<ApiConversation[]>(`${environment.apiUrl}/conversations`).pipe(
      map(conversations =>
        conversations.map(conversation => ({
          id: conversation.otherUser.id,
          nome: conversation.otherUser.name,
          conversationId: conversation.id,
          unreadMessageCount: conversation.unreadCount
        } as Usuario))
      )
    );
  }

  private async sendMessageByParticipant(otherUserId: string, message: Chat) {
    const conversation = await firstValueFrom(this.findConversation(otherUserId));
    return firstValueFrom(
      this.http.post(`${environment.apiUrl}/conversations/${conversation.id}/messages`, {
        type: 'text',
        content: message.mensagem
      })
    );
  }

  private findConversation(otherUserId: string) {
    return this.http.get<ApiConversation[]>(`${environment.apiUrl}/conversations`).pipe(
      map(conversations => {
        const conversation = conversations.find(current => current.otherUser.id === otherUserId);
        if (!conversation) {
          throw new Error('Nenhuma conversa ativa foi encontrada com este usuário.');
        }
        return conversation;
      })
    );
  }

  private toChat(message: ApiMessage): Chat {
    const createdAt = new Date(message.createdAt);
    return {
      id: message.id,
      mensagem: message.content || (message.budgetAmount ? `Orçamento: R$ ${message.budgetAmount}` : ''),
      data: createdAt.getTime(),
      hora: createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      senderId: message.senderId,
      readAt: message.readAt
    };
  }

  private getOtherUserId(client: Usuario, professional: Usuario) {
    const currentUserId = this.sessionService.currentUser?.id;
    return client.id === currentUserId ? professional.id : client.id;
  }
}
