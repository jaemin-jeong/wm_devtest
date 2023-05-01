import { IsNotEmpty, IsString } from 'class-validator';

export class GetTokenInfoParamDto {
  @IsNotEmpty()
  @IsString()
  tokenSymbol: string;
}
