import { IsEnum } from 'class-validator';

import { ProfessionalVerificationStatus } from '../../professionals/professional-verification-status.enum';

export class SetVerificationStatusDto {
  @IsEnum(ProfessionalVerificationStatus)
  status: ProfessionalVerificationStatus;
}
