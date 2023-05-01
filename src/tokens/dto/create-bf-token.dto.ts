import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBitfinexTokenDto {
  @IsNotEmpty()
  @IsString()
  symbol: string;
}
