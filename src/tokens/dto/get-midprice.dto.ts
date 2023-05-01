import { IntersectionType } from '@nestjs/mapped-types';
import { GetMidPriceQueryDto } from './get-midprice-query.dto';
import { GetTokenInfoParamDto } from './get-tokeninfo-param.dto';

export class GetMidPirceDto extends IntersectionType(
  GetTokenInfoParamDto,
  GetMidPriceQueryDto,
) {}
