import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GetTokenInfoParamDto } from './get-tokeninfo-param.dto';

export class GetLatestTokenInfoDto extends PartialType(GetTokenInfoParamDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  source: string;
}
