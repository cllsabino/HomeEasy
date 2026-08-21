import { BadRequestException } from '@nestjs/common';

import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { OrderStatus, ServiceRequestStatus } from './marketplace.enums';
import { Order } from './order.entity';
import { ServiceRequest } from './service-request.entity';

export function validateServiceRequest(dto: CreateServiceRequestDto) {
  const hasLatitude = dto.latitude !== undefined;
  const hasLongitude = dto.longitude !== undefined;
  if (hasLatitude !== hasLongitude) {
    throw new BadRequestException('latitude e longitude devem ser informadas juntas.');
  }
  if (
    dto.budgetMinimum !== undefined &&
    dto.budgetMaximum !== undefined &&
    dto.budgetMinimum > dto.budgetMaximum
  ) {
    throw new BadRequestException('O orçamento mínimo não pode ser maior que o máximo.');
  }
  if (dto.preferredAt && new Date(dto.preferredAt) <= new Date()) {
    throw new BadRequestException('A data preferida precisa estar no futuro.');
  }
}

export function canServiceRequestReceiveProposal(request: ServiceRequest, now = new Date()) {
  return (
    [ServiceRequestStatus.Requested, ServiceRequestStatus.ProposalReceived].includes(request.status) &&
    request.expiresAt > now &&
    request.proposalCount < request.maximumProposals
  );
}

export function canTransitionOrder(order: Order, actorId: string, nextStatus: OrderStatus) {
  if (nextStatus === OrderStatus.Disputed) {
    return [OrderStatus.Scheduled, OrderStatus.InProgress].includes(order.status);
  }
  if (actorId !== order.professionalId) {
    return false;
  }
  if ([OrderStatus.Accepted, OrderStatus.Scheduled].includes(order.status)) {
    return nextStatus === OrderStatus.InProgress;
  }
  return order.status === OrderStatus.InProgress && nextStatus === OrderStatus.Completed;
}
