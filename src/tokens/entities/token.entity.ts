import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  BaseEntity,
} from 'typeorm';

@Entity({ name: 'Tokens' })
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  // 1. 토큰 이름(Symbol)
  @Column('varchar', { length: 32 })
  @Index()
  symbol: string;

  // 2. 토큰 가격
  @Column('decimal', { precision: 18, scale: 8 })
  price: number;

  // 3. 가격 출처 (ex. chainlink or bitfinex)
  @Column('varchar', { length: 32 })
  @Index()
  source: string;

  // 4. 데이터 조회 당시의 블록 넘버 또는 타임스탬프
  @Column('varchar', { length: 32 })
  timeStamp: string;

  // 5. 토큰정보 저장시간
  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  @Index()
  regTime: Date;
}
