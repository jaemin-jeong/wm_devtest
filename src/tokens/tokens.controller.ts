import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateBitfinexTokenDto } from './dto/create-bf-token.dto';
import { CreateChainlinkTokenDto } from './dto/create-cl-token.dto';
import { GetMidPriceQueryDto } from './dto/get-midprice-query.dto';
import { GetTokenInfoParamDto } from './dto/get-tokeninfo-param.dto';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  // (기본과제) 최신 토큰 정보 조회 API
  @Get('/:tokenSymbol/latest')
  async getTokenLatestInfo(
    @Param() getTokenInfoParamDto: GetTokenInfoParamDto,
    @Query('source') source: string,
  ) {
    try {
      const result = await this.tokensService.getTokenLatestInfo({
        tokenSymbol: getTokenInfoParamDto['tokenSymbol'],
        source: source,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: result,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  // (기본과제) 특정 구간의 평균 가격 조회 API
  @Get('/:tokenSymbol/midPirce')
  async getTokenMidPrice(
    @Param() getTokenInfoParamDto: GetTokenInfoParamDto,
    @Query() getMidPriceQueryDto: GetMidPriceQueryDto,
  ) {
    try {
      const result = await this.tokensService.getTokenMidPrice({
        tokenSymbol: getTokenInfoParamDto['tokenSymbol'],
        startTime: getMidPriceQueryDto['startTime'],
        endTime: getMidPriceQueryDto['endTime'],
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: result,
      };
    } catch (error) {
      if (error.message === 'Wrong date range.') {
        throw new BadRequestException('BAD REQUEST', error.message);
      } else {
        throw new Error(error);
      }
    }
  }

  // ChainLink에서 토큰 정보 조회 및 저장
  @Post('/chainLink')
  async saveTokenChainLink(
    @Body() createChainlinkTokenDto: CreateChainlinkTokenDto,
  ) {
    try {
      const result = await this.tokensService.saveTokenFromChainLink(
        createChainlinkTokenDto,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: result,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  // Bitfinex에서 토큰 정보 조회 및 저장
  @Post('/bitfinex')
  async saveTokenBitfinex(
    @Body() createBitfinexTokenDto: CreateBitfinexTokenDto,
  ) {
    try {
      const result = await this.tokensService.saveTokenFromBitfinex(
        createBitfinexTokenDto,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: result,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
