import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServicosService } from '../../Servicos/servicos.service';
import { Servico } from './../../Usuarios/servico';
import { getCurrentUser } from '../../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-procurar-servico',
  templateUrl: './procurar-servico.component.html',
  styleUrls: ['./procurar-servico.component.css']
})
export class ProcurarServicoComponent implements OnInit, OnDestroy {
  entrarSair: boolean;
  userId: string;
  nomeDoServico: string;
  nomeDoServicoSubscription: Subscription;
  servicosArray = new Array<Servico>();
  servicosArraySubscription: Subscription;
  servicosDisponiveis = new Array<Servico>();
  servicosDisponiveisSubscription: Subscription;

  constructor(
    public loginService: LoginServiceService,
    public servicoService: ServicosService,
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

    this.nomeDoServicoSubscription = this.active.params.subscribe(
      (params: Params) => { this.nomeDoServico = params['nome']; }
    );
    if (this.nomeDoServico) {
      this.servicosArraySubscription = this.servicoService.getServicoPorNome(this.nomeDoServico).subscribe(data => {
        this.servicosArray = data;
      });
    }
    this.servicosDisponiveisSubscription = this.servicoService.getServicos().subscribe(data => {
      this.servicosDisponiveis = data;
    });
  }

  ngOnDestroy() {
    this.nomeDoServicoSubscription?.unsubscribe();
    this.servicosArraySubscription?.unsubscribe();
    this.servicosDisponiveisSubscription?.unsubscribe();
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
