import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServicoPedidoService } from './../../Servicos/servico-pedido.service';
import { ServicosService } from '../../Servicos/servicos.service';
import { Servico } from './../../Usuarios/servico';
import { ServicoPedido } from './../../Usuarios/serico-pedido';
import { getCurrentUser } from '../../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-servico-detalhe',
  templateUrl: './servico-detalhe.component.html',
  styleUrls: ['./servico-detalhe.component.css']
})
export class ServicoDetalheComponent implements OnInit, OnDestroy {
  userId: string;
  entrarSair: boolean;
  servicoped: ServicoPedido = {};
  servicopedSubscription: Subscription;
  serveId: string;
  serveIdSubscription: Subscription;
  servico: Servico = {};
  servicoSubscription: Subscription;

  constructor(
    public loginService: LoginServiceService,
    public servicoService: ServicosService,
    public servicoPedido: ServicoPedidoService,
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

    this.serveIdSubscription = this.active.params.subscribe(
      (params: Params) => { this.serveId = params['idd']; }
    );
    this.servicopedSubscription = this.servicoPedido.getDetalheServico(this.userId, this.serveId).subscribe(data => {
      this.servicoped = data;
    });
    this.servicoSubscription = this.servicoService.getUserServicoPorId(this.userId, this.serveId).subscribe(data => {
      this.servico = data;
    });
  }

  ngOnDestroy() {
    this.serveIdSubscription?.unsubscribe();
    this.servicopedSubscription?.unsubscribe();
    this.servicoSubscription?.unsubscribe();
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
