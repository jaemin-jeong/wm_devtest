import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChainlinkTokenDto {
  @IsNotEmpty()
  @IsString()
  feedAddress: string;
}
