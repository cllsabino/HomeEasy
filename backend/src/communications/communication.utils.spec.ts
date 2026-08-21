import { BadRequestException } from '@nestjs/common';

import { MessageType } from './communication.enums';
import { validateMessage } from './communication.utils';

describe('communication rules', () => {
  it('rejects an empty text message', () => {
    expect(() => validateMessage({ type: MessageType.Text, content: '   ' })).toThrow(BadRequestException);
  });

  it('accepts a budget with a value', () => {
    expect(() => validateMessage({ type: MessageType.Budget, budgetAmount: 180 })).not.toThrow();
  });
});
