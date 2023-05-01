import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as moment from 'moment';
import { aggregatorV3InterfaceABI } from 'src/utils/abi';
import { removeSpecialSymbol } from 'src/utils/convert';
import { Repository } from 'typeorm';
import { CreateBitfinexTokenDto } from './dto/create-bf-token.dto';
import { CreateChainlinkTokenDto } from './dto/create-cl-token.dto';
import { GetLatestTokenInfoDto } from './dto/get-latest-tokeninfo.dto';
import { GetMidPirceDto } from './dto/get-midprice.dto';
import { Token } from './entities/token.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

const web3 = new Web3('https://rpc.ankr.com/bsc_testnet_chapel');

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  // 최신 토큰 조회
  async getTokenLatestInfo(
    getLatestTokenInfoDto: GetLatestTokenInfoDto,
  ): Promise<any> {
    const { tokenSymbol, source } = getLatestTokenInfoDto;
    const tokenQB = this.tokenRepository.createQueryBuilder('Token');
    let result = {};

    if (source) {
      result = await tokenQB
        .where('symbol = :tokenSymbol', { tokenSymbol })
        .andWhere('source = :source', { source })
        .orderBy('idx', 'DESC')
        .getOne();
    } else {
      result = await tokenQB
        .select([
          'Token.idx AS idx',
          'Token.symbol AS symbol',
          'Token.price AS price',
          'Token.source AS source',
          'Token.regTime AS regTime',
        ])
        .innerJoinAndSelect(
          (qb) =>
            qb
              .select('MAX(idx)', 'idx')
              .from(Token, 'tk')
              .where('symbol = :tokenSymbol', { tokenSymbol })
              .groupBy('source'),
          'subQB',
          'Token.idx=subQB.idx',
        )
        .getRawMany();
    }

    return result;
  }

  // 특정 시간 구간이 주어졌을 때 해당 시간 동안의 평균 가격 조회
  async getTokenMidPrice(getMidPirceDto: GetMidPirceDto): Promise<any> {
    const { tokenSymbol, startTime, endTime } = getMidPirceDto;
    const tokenQB = this.tokenRepository.createQueryBuilder('Token');

    const startTimeValue = moment(startTime).format('YYYY-MM-DD');
    const endTimeValue = moment(endTime).format('YYYY-MM-DD 23:59:29');

    // 시작일이 종료일 이후인 경우 에러 발생
    if (startTimeValue > endTimeValue) {
      throw new Error('Wrong date range.');
    }

    const result = await tokenQB
      .select(['symbol', 'source'])
      .addSelect('SUM(price)/COUNT(idx)', 'mid_price')
      .where('symbol = :tokenSymbol', { tokenSymbol })
      .andWhere('regTime >= :startTime', {
        startTime: moment(startTime).format('YYYY-MM-DD'),
      })
      .andWhere('regTime <= :endTime', {
        endTime: moment(endTime).format('YYYY-MM-DD 23:59:29'),
      })
      .groupBy('source')
      .orderBy('regTime', 'DESC')
      .getRawOne();

    return result;
  }

  // ChainLink에서 토큰 정보 조회 및 저장
  async saveTokenFromChainLink(
    createChainlinkTokenDto: CreateChainlinkTokenDto,
  ): Promise<any> {
    const priceFeed = new web3.eth.Contract(
      aggregatorV3InterfaceABI,
      createChainlinkTokenDto['feedAddress'],
    );

    const getFeedInfo = async () => {
      return await Promise.all([
        priceFeed.methods.description().call(),
        priceFeed.methods.latestRoundData().call(),
        priceFeed.methods.decimals().call(),
      ]);
    };

    // 토큰 정보 조회
    const feedInfo = await getFeedInfo();

    // DB 저장
    const result = await this.tokenRepository.save({
      // 공백, 특수문자 제거 & 소문자로 변경
      symbol: removeSpecialSymbol(feedInfo[0]).toLowerCase(),
      price: feedInfo[1]['answer'] / 10 ** feedInfo[2],
      source: 'chainlink',
      timeStamp: feedInfo[1]['updatedAt'],
    });

    return result;
  }

  // Bitfinex에서 토큰 정보 조회 및 저장
  async saveTokenFromBitfinex(
    createBitfinexTokenDto: CreateBitfinexTokenDto,
  ): Promise<any> {
    // 토큰 정보 조회
    const feedInfo = await axios.get(
      'https://api.bitfinex.com/v1/pubticker/' +
        createBitfinexTokenDto['symbol'],
    );

    // DB 저장
    const result = this.tokenRepository.save({
      symbol: createBitfinexTokenDto['symbol'],
      price: feedInfo['data']['last_price'],
      source: 'bitfinex',
      timeStamp: feedInfo['data']['timestamp'],
    });

    return result;
  }
}
