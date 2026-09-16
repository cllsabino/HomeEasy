import { CancellationReason } from '../marketplace/marketplace.enums';
import { DisputeReason } from '../moderation/moderation.enums';
import { resolveCancellationReasonLabel, resolveDisputeReasonLabel } from './mail-event-labels.utils';

describe('mail event labels', () => {
  it('formats cancellation reasons for recipients', () => {
    expect(resolveCancellationReasonLabel(CancellationReason.PriceDisagreement)).toBe(
      'Desacordo sobre o preço'
    );
  });

  it('formats dispute reasons for recipients', () => {
    expect(resolveDisputeReasonLabel(DisputeReason.PropertyDamage)).toBe('Dano à propriedade');
  });
});
