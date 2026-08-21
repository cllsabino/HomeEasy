import { RunInFirebaseInjectionContext } from '../shared/utils/firebase-injection-context.utils';
import { EnvironmentInjector, inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { OrderStatus } from '../Usuarios/pedido';
import { ProfessionalVerificationStatus, Usuario } from '../Usuarios/usuario';
import { ServiceRequest } from '../shared/models/service-request';

export interface MarketplaceMetrics {
  totalRequests: number;
  openRequests: number;
  hiredRequests: number;
  pendingVerifications: number;
  conversionRate: number;
  averageProposals: number;
}

@Injectable({ providedIn: 'root' })
@RunInFirebaseInjectionContext
export class MarketplaceMetricsService {
  readonly firebaseEnvironmentInjector = inject(EnvironmentInjector);
  constructor(private afs: AngularFirestore) { }

  getMetrics() {
    return combineLatest(
      this.afs.collection<ServiceRequest>('Orders').valueChanges(),
      this.afs.collection<Usuario>('Usuarios', reference =>
        reference.where('verificationStatus', '==', ProfessionalVerificationStatus.Pending)).valueChanges()
    ).pipe(map(([requests, pendingProfessionals]) => this.calculateMetrics(requests, pendingProfessionals.length)));
  }

  private calculateMetrics(requests: ServiceRequest[], pendingVerifications: number): MarketplaceMetrics {
    let openRequests = 0;
    let hiredRequests = 0;
    let proposalTotal = 0;

    requests.forEach(request => {
      if (request.status === OrderStatus.Requested || request.status === OrderStatus.ProposalReceived) {
        openRequests += 1;
      }

      if (request.status === OrderStatus.Accepted || request.status === OrderStatus.InProgress || request.status === OrderStatus.Completed) {
        hiredRequests += 1;
      }

      proposalTotal += Number(request.proposalCount || 0);
    });

    const totalRequests = requests.length;

    return {
      totalRequests,
      openRequests,
      hiredRequests,
      pendingVerifications,
      conversionRate: totalRequests ? Math.round((hiredRequests / totalRequests) * 100) : 0,
      averageProposals: totalRequests ? Number((proposalTotal / totalRequests).toFixed(1)) : 0
    };
  }
}
