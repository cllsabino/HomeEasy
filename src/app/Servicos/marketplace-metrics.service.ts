import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

export interface MarketplaceMetrics {
  totalRequests: number;
  openRequests: number;
  hiredRequests: number;
  pendingVerifications: number;
  conversionRate: number;
  averageProposals: number;
}

@Injectable({ providedIn: 'root' })
export class MarketplaceMetricsService {
  constructor(private http: HttpClient) {}

  getMetrics() {
    return this.http.get<MarketplaceMetrics>(`${environment.apiUrl}/admin/metrics`);
  }
}
