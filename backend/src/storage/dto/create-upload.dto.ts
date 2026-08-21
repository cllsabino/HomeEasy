import { IsEnum, IsInt, IsString, Length, Max, Min } from 'class-validator';

import { MediaPurpose } from '../media-purpose.enum';

export class CreateUploadDto {
  @IsString()
  @Length(1, 180)
  fileName: string;

  @IsString()
  @Length(3, 100)
  contentType: string;

  @IsInt()
  @Min(1)
  @Max(10 * 1024 * 1024)
  size: number;

  @IsEnum(MediaPurpose)
  purpose: MediaPurpose;
}
