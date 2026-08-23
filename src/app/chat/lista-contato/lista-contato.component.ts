import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServicoPedidoService } from './../../Servicos/servico-pedido.service';
import { ServicosService } from '../../Servicos/servicos.service';
import { Usuario } from 'src/app/Usuarios/usuario';
import { ChatService } from './../../Servicos/chat.service';
import { UsuarioService } from './../../Servicos/usuario.service';
import { getCurrentUser } from '../../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-lista-contato',
  templateUrl: './lista-contato.component.html',
  styleUrls: ['./lista-contato.component.css']
})
export class ListaContatoComponent implements OnInit, OnDestroy {
  listaContatos = new Array<Usuario>();
  listaContatosSubscription: Subscription;
  userId: string;
  entrarSair: boolean;
  usuario: Usuario = {};
  userSubscription: Subscription;
  isLoading = true;

  constructor(
    public loginService: LoginServiceService,
    public servico: ServicosService,
    public servicoPedido: ServicoPedidoService,
    public chatService: ChatService,
    public usuarioService: UsuarioService,
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

    this.listaContatosSubscription = this.chatService.getContatos(this.userId).pipe(
      switchMap(contacts => this.usuarioService.resolveProfilePhotos(contacts))
    ).subscribe(data => {
      this.listaContatos = data;
      this.isLoading = false;
    });
    this.userSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.usuario = data;
    });
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

  ngOnDestroy() {
    this.listaContatosSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}
