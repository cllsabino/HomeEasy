import { getCurrentUser } from '../../shared/utils/session-user.utils';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServiceRequestService } from '../../Servicos/service-request.service';
import { ServiceRequest } from '../../shared/models/service-request';
import { getStatusClass, getStatusLabel } from '../../shared/utils/order-status.utils';

@Component({
  standalone: false,
  selector: 'app-service-request-list',
  templateUrl: './service-request-list.component.html',
  styleUrls: ['./service-request-list.component.css']
})
export class ServiceRequestListComponent implements OnInit, OnDestroy {
  authenticated = false;
  userId: string;
  requests = new Array<ServiceRequest>();
  isLoading = true;
  private requestsSubscription: Subscription;

  constructor(
    private loginService: LoginServiceService,
    private requestService: ServiceRequestService,
    private router: Router
  ) { }

  ngOnInit() {
    const currentUser = getCurrentUser();
    this.authenticated = currentUser != null;
    this.userId = currentUser ? currentUser.uid : '';
    this.requestsSubscription = this.requestService.getClientRequests(this.userId).subscribe(requests => {
      this.requests = requests;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.requestsSubscription) {
      this.requestsSubscription?.unsubscribe();
    }
  }

  getStatusLabel(request: ServiceRequest) {
    return getStatusLabel(request.status);
  }

  getStatusClass(request: ServiceRequest) {
    return getStatusClass(request.status);
  }

  async logout() {
    await this.loginService.sair();
    this.router.navigate(['/home']);
  }
}
