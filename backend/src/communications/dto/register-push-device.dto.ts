import { IsIn, IsString, Matches, MaxLength } from 'class-validator';

export class RegisterPushDeviceDto {
  @IsString()
  @MaxLength(255)
  @Matches(/^ExponentPushToken\[[\w-]+\]$|^ExpoPushToken\[[\w-]+\]$/)
  token: string;

  @IsIn(['android', 'ios'])
  platform: string;
}
