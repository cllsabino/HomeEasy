import { BadRequestException } from '@nestjs/common';

import { OrderStatus, ServiceRequestStatus } from './marketplace.enums';
import {
  canServiceRequestReceiveProposal,
  canTransitionOrder,
  validateServiceRequest
} from './marketplace.utils';
import { Order } from './order.entity';
import { ServiceRequest } from './service-request.entity';

describe('marketplace rules', () => {
  it('rejects an inverted budget range', () => {
    expect(() =>
      validateServiceRequest({
        serviceId: 'cleaning',
        description: 'Preciso de uma limpeza residencial completa.',
        answers: {},
        address: 'Rua de exemplo, 10',
        city: 'Recife',
        state: 'PE',
        budgetMinimum: 300,
        budgetMaximum: 100
      })
    ).toThrow(BadRequestException);
  });

  it('stops proposals after the configured limit', () => {
    const request = {
      status: ServiceRequestStatus.ProposalReceived,
      expiresAt: new Date(Date.now() + 60_000),
      proposalCount: 4,
      maximumProposals: 4
    } as ServiceRequest;
    expect(canServiceRequestReceiveProposal(request)).toBe(false);
  });

  it('allows only the professional to complete an in-progress order', () => {
    const order = {
      clientId: 'client-id',
      professionalId: 'professional-id',
      status: OrderStatus.InProgress
    } as Order;
    expect(canTransitionOrder(order, 'client-id', OrderStatus.Completed)).toBe(false);
    expect(canTransitionOrder(order, 'professional-id', OrderStatus.Completed)).toBe(true);
  });
});
