import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../Servicos/login-service.service';
import { ServicoPedidoService } from './../Servicos/servico-pedido.service';
import { ServicosService } from './../Servicos/servicos.service';
import { UsuarioService } from '../Servicos/usuario.service';
import { ChatService } from './../Servicos/chat.service';
import { Chat } from './../Usuarios/chat';
import { Usuario } from './../Usuarios/usuario';
import { FeedbackType } from '../shared/action-feedback/action-feedback.component';
import { getCurrentUser } from '../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  servidor: Usuario = {};
  servidorSubscription: Subscription;
  servidorId: string;
  servidorIdSubscription: Subscription;
  entrarSair: boolean;
  mensagensArray = new Array<Chat>();
  mensagensArraySubscription: Subscription;
  mensagem: Chat = {};
  userId: string;
  usuario: Usuario = {};
  userSubscription: Subscription;
  feedbackMessage = '';
  feedbackType: FeedbackType = 'error';
  isSending = false;

  constructor(
    public loginService: LoginServiceService,
    public servico: ServicosService,
    public servicoPedido: ServicoPedidoService,
    public usuarioService: UsuarioService,
    public chatService: ChatService,
    public router: Router,
    public active: ActivatedRoute
  ) {}

  ngOnInit() {
    const currentUser = getCurrentUser();
    if (currentUser != null) {
      this.entrarSair = true;
      this.userId = currentUser.uid || currentUser.id;
    } else {
      this.entrarSair = false;
    }

    this.servidorIdSubscription = this.active.params.subscribe(
      (params: Params) => { this.servidorId = params['id']; }
    );
    this.servidorSubscription = this.usuarioService.getUserWithProfilePhoto(this.servidorId).subscribe(data => {
      this.servidor = data;
    });
    this.userSubscription = this.usuarioService.getUserWithProfilePhoto(this.userId).subscribe(data => {
      this.usuario = data;
    });
    this.mensagensArraySubscription = this.chatService.getMensagens(this.userId, this.servidorId).subscribe(data => {
      this.mensagensArray = data;
    });
  }

  async enviarMensagem() {
    if (this.isSending) {
      return;
    }

    if (this.usuario.id === this.servidor.id) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'Você não pode enviar uma mensagem para si mesmo.';
      return;
    }

    const currentDate = new Date();
    const messageToSend: Chat = {
      mensagem: this.mensagem.mensagem,
      data: currentDate.getTime(),
      id: this.userId,
      hora: currentDate.getHours() + ':' + currentDate.getMinutes().toString().padStart(2, '0')
    };

    this.feedbackMessage = '';
    this.isSending = true;

    try {
      await this.chatService.sendMessage(this.usuario, this.servidor, messageToSend);
      this.mensagem.mensagem = '';
    } catch (error) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'A mensagem não foi enviada. Verifique sua conexão e tente novamente.';
    } finally {
      this.isSending = false;
    }
  }

  ngOnDestroy() {
    this.servidorIdSubscription?.unsubscribe();
    this.servidorSubscription?.unsubscribe();
    this.mensagensArraySubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

  async sair() {
    try {
      await this.loginService.sair().then(() => {
        this.router.navigate(['/home']);
      });
    } catch (error) {
      return;
    }
  }
}
