import { BadRequestException } from '@nestjs/common';

import { MessageType } from './communication.enums';
import { OrderStatus } from '../marketplace/marketplace.enums';
import { isConversationWritable, validateMessage } from './communication.utils';

describe('communication rules', () => {
  it('rejects an empty text message', () => {
    expect(() => validateMessage({ type: MessageType.Text, content: '   ' })).toThrow(BadRequestException);
  });

  it('accepts a budget with a value', () => {
    expect(() => validateMessage({ type: MessageType.Budget, budgetAmount: 180 })).not.toThrow();
  });

  it('requires a completed media reference for image messages', () => {
    expect(() => validateMessage({ type: MessageType.Image })).toThrow(BadRequestException);
    expect(() =>
      validateMessage({ type: MessageType.Image, mediaId: '4e107dae-5b0f-4c19-a640-11b3e4be842a' })
    ).not.toThrow();
  });

  it('keeps only ongoing service conversations writable', () => {
    expect(isConversationWritable(OrderStatus.Accepted)).toBe(true);
    expect(isConversationWritable(OrderStatus.InProgress)).toBe(true);
    expect(isConversationWritable(OrderStatus.Completed)).toBe(false);
    expect(isConversationWritable(OrderStatus.CancelledByClient)).toBe(false);
    expect(isConversationWritable(OrderStatus.CancelledByProfessional)).toBe(false);
  });
});
