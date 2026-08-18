import { OrderStatus } from '../../Usuarios/pedido';

export enum ServiceUrgency {
  Flexible = 'flexible',
  ThisWeek = 'thisWeek',
  Urgent = 'urgent'
}

export enum ServiceProposalStatus {
  Sent = 'sent',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Withdrawn = 'withdrawn',
  Expired = 'expired'
}

export class ServiceRequest {
  id?: string;
  clientId?: string;
  serviceId?: string;
  serviceName?: string;
  category?: string;
  description?: string;
  urgency?: ServiceUrgency;
  preferredDate?: string;
  preferredTime?: string;
  address?: string;
  city?: string;
  state?: string;
  budgetMinimum?: number;
  budgetMaximum?: number;
  status?: OrderStatus;
  proposalCount?: number;
  maximumProposals?: number;
  selectedProposalId?: string;
  selectedProfessionalId?: string;
  agreedPrice?: number;
  createdAt?: any;
  updatedAt?: any;
  expiresAt?: any;
}

export class ServiceProposal {
  id?: string;
  requestId?: string;
  professionalId?: string;
  professionalName?: string;
  professionalVerified?: boolean;
  price?: number;
  message?: string;
  estimatedDuration?: string;
  materialsIncluded?: boolean;
  travelFee?: number;
  paymentMethods?: string[];
  validUntil?: any;
  status?: ServiceProposalStatus;
  createdAt?: any;
  updatedAt?: any;
}
