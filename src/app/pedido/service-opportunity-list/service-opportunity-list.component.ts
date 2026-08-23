import { getCurrentUser } from '../../shared/utils/session-user.utils';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServiceRequestService } from '../../Servicos/service-request.service';
import { ServicosService } from '../../Servicos/servicos.service';
import { UsuarioService } from '../../Servicos/usuario.service';
import { Servico } from '../../Usuarios/servico';
import { Usuario } from '../../Usuarios/usuario';
import { ServiceRequest, ServiceUrgency } from '../../shared/models/service-request';
import { normalizeBrazilStateCode } from '../../shared/utils/brazil-state.utils';

@Component({
  standalone: false,
  selector: 'app-service-opportunity-list',
  templateUrl: './service-opportunity-list.component.html',
  styleUrls: ['./service-opportunity-list.component.css']
})
export class ServiceOpportunityListComponent implements OnInit, OnDestroy {
  authenticated = false;
  userId: string;
  user: Usuario = {};
  services = new Array<Servico>();
  requests = new Array<ServiceRequest>();
  isLoading = true;
  private requestsSubscription: Subscription;

  constructor(
    private loginService: LoginServiceService,
    private requestService: ServiceRequestService,
    private router: Router,
    private servicesService: ServicosService,
    private userService: UsuarioService
  ) { }

  ngOnInit() {
    const currentUser = getCurrentUser();
    this.authenticated = currentUser != null;
    this.userId = currentUser ? currentUser.uid : '';
    this.requestsSubscription = combineLatest(
      this.userService.getUsuario(this.userId),
      this.servicesService.getUserServico(this.userId)
    ).pipe(switchMap(([user, services]) => {
      this.user = user || {};
      this.services = services;
      const serviceIds = services.filter(service => service.available !== false).map(service => service.id);

      return this.requestService.getAvailableRequests(
        this.userId,
        serviceIds,
        this.user.cidade,
        normalizeBrazilStateCode(this.user.estado)
      );
    })).subscribe(requests => {
      this.requests = requests;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.requestsSubscription) {
      this.requestsSubscription?.unsubscribe();
    }
  }

  getUrgencyLabel(urgency: ServiceUrgency) {
    if (urgency === ServiceUrgency.Urgent) {
      return 'Urgente';
    }

    if (urgency === ServiceUrgency.ThisWeek) {
      return 'Esta semana';
    }

    return 'Flexível';
  }

  async logout() {
    await this.loginService.sair();
    this.router.navigate(['/home']);
  }
}
