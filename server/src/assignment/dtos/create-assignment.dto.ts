import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Tier, Track } from '../../generated/prisma/enums';

export class RubricItemDto {
  @ApiProperty({ example: '요구사항 구현 완성도' })
  @IsString()
  name!: string;

  @ApiProperty({ minimum: 0, example: 40 })
  @IsInt()
  @Min(0)
  points!: number;

  @ApiProperty({ example: '명세에 정의된 기능이 모두 동작하는지 확인' })
  @IsString()
  aiGuide!: string;
}

export class CreateAssignmentDto {
  @ApiProperty({ example: 'REST API 서버 구현하기' })
  @IsString()
  title!: string;

  @ApiProperty({ enum: Tier, enumName: 'Tier', example: Tier.SILVER })
  @IsEnum(Tier)
  tier!: Tier;

  @ApiProperty({ enum: Track, enumName: 'Track', example: Track.BACKEND })
  @IsEnum(Track)
  track!: Track;

  @ApiProperty({ type: [String], example: ['nestjs', 'prisma'] })
  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @ApiProperty({ minimum: 0, example: 8 })
  @IsInt()
  @Min(0)
  hoursEstimate!: number;

  @ApiProperty({ example: '## 요구사항\n- 게시글 CRUD API를 구현합니다.' })
  @IsString()
  requirementsMd!: string;

  @ApiProperty({ type: [RubricItemDto] })
  @ValidateNested({ each: true })
  @Type(() => RubricItemDto)
  rubricItems!: RubricItemDto[];
}
