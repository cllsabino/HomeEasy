import { OrderStatus, Pedido } from '../../Usuarios/pedido';

export interface LegacyOrderFlags {
  clienteCancelou: boolean;
  profissionalCancelou: boolean;
  statusProfissional: boolean;
}

export function getOrderStatus(order: Pedido): OrderStatus {
  if (order && order.status) {
    return order.status;
  }

  if (order && order.clienteCancelou === true) {
    return OrderStatus.CancelledByClient;
  }

  if (order && order.profissionalCancelou === true) {
    return OrderStatus.DeclinedByProfessional;
  }

  if (order && order.statusProfissional === true) {
    return OrderStatus.Accepted;
  }

  return OrderStatus.Requested;
}

export function getLegacyOrderFlags(status: OrderStatus): LegacyOrderFlags {
  return {
    clienteCancelou: status === OrderStatus.CancelledByClient,
    profissionalCancelou: status === OrderStatus.DeclinedByProfessional,
    statusProfissional: isAcceptedOrderStatus(status)
  };
}

export function isPendingOrder(order: Pedido): boolean {
  const status = getOrderStatus(order);

  return status === OrderStatus.Requested || status === OrderStatus.ProposalReceived;
}

export function isAcceptedOrderStatus(status: OrderStatus): boolean {
  return status === OrderStatus.Accepted || status === OrderStatus.InProgress || status === OrderStatus.Completed;
}

export function canTransitionOrder(order: Pedido, nextStatus: OrderStatus, actorId: string): boolean {
  if (!order || !actorId || !isOrderParticipant(order, actorId)) {
    return false;
  }

  const currentStatus = getOrderStatus(order);
  const allowedStatuses = getAllowedStatuses(currentStatus);

  if (allowedStatuses.indexOf(nextStatus) === -1) {
    return false;
  }

  return actorCanApplyStatus(order, nextStatus, actorId);
}

export function getOrderStatusLabel(order: Pedido): string {
  switch (getOrderStatus(order)) {
    case OrderStatus.ProposalReceived:
      return 'Proposta recebida';
    case OrderStatus.Accepted:
      return 'Pedido aceito';
    case OrderStatus.InProgress:
      return 'Serviço em andamento';
    case OrderStatus.Completed:
      return 'Serviço concluído';
    case OrderStatus.CancelledByClient:
      return 'Cancelado pelo cliente';
    case OrderStatus.DeclinedByProfessional:
      return 'Recusado pelo profissional';
    case OrderStatus.Expired:
      return 'Pedido expirado';
    case OrderStatus.Disputed:
      return 'Em análise';
    default:
      return 'Aguardando profissional';
  }
}

export function getOrderStatusClass(order: Pedido): string {
  const status = getOrderStatus(order);

  if (status === OrderStatus.Completed || status === OrderStatus.Accepted || status === OrderStatus.InProgress) {
    return 'status-success';
  }

  if (status === OrderStatus.CancelledByClient || status === OrderStatus.DeclinedByProfessional || status === OrderStatus.Expired) {
    return 'status-danger';
  }

  return 'status-pending';
}

function isOrderParticipant(order: Pedido, actorId: string): boolean {
  return order.idContratante === actorId || order.idServidor === actorId;
}

function actorCanApplyStatus(order: Pedido, status: OrderStatus, actorId: string): boolean {
  if (status === OrderStatus.CancelledByClient) {
    return order.idContratante === actorId;
  }

  if (status === OrderStatus.Accepted || status === OrderStatus.DeclinedByProfessional || status === OrderStatus.InProgress) {
    return order.idServidor === actorId;
  }

  return true;
}

function getAllowedStatuses(status: OrderStatus): OrderStatus[] {
  switch (status) {
    case OrderStatus.Requested:
    case OrderStatus.ProposalReceived:
      return [OrderStatus.Accepted, OrderStatus.CancelledByClient, OrderStatus.DeclinedByProfessional, OrderStatus.Expired];
    case OrderStatus.Accepted:
      return [OrderStatus.InProgress, OrderStatus.Completed, OrderStatus.CancelledByClient, OrderStatus.Disputed];
    case OrderStatus.InProgress:
      return [OrderStatus.Completed, OrderStatus.CancelledByClient, OrderStatus.Disputed];
    case OrderStatus.Completed:
      return [OrderStatus.Disputed];
    default:
      return [];
  }
}
