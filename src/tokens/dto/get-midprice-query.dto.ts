import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetMidPriceQueryDto {
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;
}
