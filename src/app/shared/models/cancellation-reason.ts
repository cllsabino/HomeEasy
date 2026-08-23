export enum CancellationReason {
  ScheduleConflict = 'schedule_conflict',
  PriceDisagreement = 'price_disagreement',
  ProfessionalUnavailable = 'professional_unavailable',
  ClientUnavailable = 'client_unavailable',
  ServiceNoLongerNeeded = 'service_no_longer_needed',
  Other = 'other'
}

export const clientCancellationReasons = [
  { value: CancellationReason.ServiceNoLongerNeeded, label: 'Não preciso mais do serviço' },
  { value: CancellationReason.ScheduleConflict, label: 'Conflito de agenda' },
  { value: CancellationReason.PriceDisagreement, label: 'Não concordei com o preço' },
  { value: CancellationReason.ClientUnavailable, label: 'Não estarei disponível' },
  { value: CancellationReason.Other, label: 'Outro motivo' }
];

export const professionalCancellationReasons = [
  { value: CancellationReason.ProfessionalUnavailable, label: 'Não estou disponível' },
  { value: CancellationReason.ScheduleConflict, label: 'Conflito de agenda' },
  { value: CancellationReason.PriceDisagreement, label: 'Não foi possível combinar o preço' },
  { value: CancellationReason.Other, label: 'Outro motivo' }
];
