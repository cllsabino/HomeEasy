import { IsString, Length } from 'class-validator';

export class RespondReviewDto {
  @IsString()
  @Length(2, 1000)
  response: string;
}
