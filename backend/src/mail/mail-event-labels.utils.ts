import { CancellationReason } from '../marketplace/marketplace.enums';
import { DisputeReason } from '../moderation/moderation.enums';

const cancellationReasonLabels: Record<CancellationReason, string> = {
  [CancellationReason.ScheduleConflict]: 'Conflito de agenda',
  [CancellationReason.PriceDisagreement]: 'Desacordo sobre o preço',
  [CancellationReason.ProfessionalUnavailable]: 'Profissional indisponível',
  [CancellationReason.ClientUnavailable]: 'Cliente indisponível',
  [CancellationReason.ServiceNoLongerNeeded]: 'Serviço não é mais necessário',
  [CancellationReason.Other]: 'Outro motivo'
};

const disputeReasonLabels: Record<DisputeReason, string> = {
  [DisputeReason.ServiceNotPerformed]: 'Serviço não realizado',
  [DisputeReason.ServiceQuality]: 'Qualidade do serviço',
  [DisputeReason.PriceConflict]: 'Conflito sobre o preço',
  [DisputeReason.PropertyDamage]: 'Dano à propriedade',
  [DisputeReason.Conduct]: 'Conduta durante o atendimento',
  [DisputeReason.Other]: 'Outro motivo'
};

export function resolveCancellationReasonLabel(reason: CancellationReason) {
  return cancellationReasonLabels[reason];
}

export function resolveDisputeReasonLabel(reason: DisputeReason) {
  return disputeReasonLabels[reason];
}
