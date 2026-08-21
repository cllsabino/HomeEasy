import { IsEnum, IsUUID } from 'class-validator';

import { VerificationDocumentType } from '../moderation.enums';

export class SubmitDocumentDto {
  @IsUUID()
  mediaId: string;

  @IsEnum(VerificationDocumentType)
  type: VerificationDocumentType;
}
