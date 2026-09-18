import { IsString, Matches, MaxLength } from 'class-validator';

export class UnregisterPushDeviceDto {
  @IsString()
  @MaxLength(255)
  @Matches(/^ExponentPushToken\[[\w-]+\]$|^ExpoPushToken\[[\w-]+\]$/)
  token: string;
}
