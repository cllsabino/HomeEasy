import { BadRequestException } from '@nestjs/common';

import { MediaPurpose } from './media-purpose.enum';
import { sanitizeFileName, validateMediaType } from './storage.utils';

describe('storage rules', () => {
  it('allows PDF only for private verification documents', () => {
    expect(() => validateMediaType(MediaPurpose.VerificationDocument, 'application/pdf')).not.toThrow();
    expect(() => validateMediaType(MediaPurpose.ChatAttachment, 'application/pdf')).toThrow(
      BadRequestException
    );
  });

  it('removes unsafe characters from an object file name', () => {
    expect(sanitizeFileName('../../Comprovante de residência.png')).toBe(
      '..-..-Comprovante-de-residencia.png'
    );
  });
});
