import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServicoPedidoService } from './../../Servicos/servico-pedido.service';
import { ServicosService } from '../../Servicos/servicos.service';
import { UsuarioService } from './../../Servicos/usuario.service';
import { AvalicaoService } from './../../Servicos/avaliacao.service';
import { Avaliacao } from './../../Usuarios/avaliacao';
import { getCurrentUser } from '../../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-avaliacoes',
  templateUrl: './avaliacoes.component.html',
  styleUrls: ['./avaliacoes.component.css']
})
export class AvaliacoesComponent implements OnInit, OnDestroy {
  userId: string;
  entrarSair: boolean;
  servidorId: string;
  servidorIdSubscription: Subscription;
  AvaliacoesArray = new Array<Avaliacao>();
  AvaliacoesArraySubscription: Subscription;
  serveId: string;
  serveIdSubscription: Subscription;

  constructor(
    public router: Router,
    public loginService: LoginServiceService,
    public usuarioService: UsuarioService,
    public servicoPedido: ServicoPedidoService,
    public servico: ServicosService,
    public avaliacaoService: AvalicaoService,
    public active: ActivatedRoute
  ) {}

  ngOnInit() {
    const currentUser = getCurrentUser();
    if (currentUser != null) {
      this.userId = currentUser.uid || currentUser.id;
      this.entrarSair = true;
    } else {
      this.entrarSair = false;
    }

    this.servidorIdSubscription = this.active.params.subscribe(
      (params: Params) => { this.servidorId = params['idd']; }
    );
    this.serveIdSubscription = this.active.params.subscribe(
      (params: Params) => { this.serveId = params['id']; }
    );
    this.AvaliacoesArraySubscription = this.avaliacaoService.getAvaliacoes(this.servidorId, this.serveId).subscribe(data => {
      this.AvaliacoesArray = data;
    });
  }

  ngOnDestroy() {
    this.servidorIdSubscription?.unsubscribe();
    this.serveIdSubscription?.unsubscribe();
    this.AvaliacoesArraySubscription?.unsubscribe();
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
