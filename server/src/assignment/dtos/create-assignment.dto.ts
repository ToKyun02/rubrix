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

class RubricItemDto {
  @IsString()
  name!: string;

  @IsInt()
  @Min(0)
  points!: number;

  @IsString()
  aiGuide!: string;
}

export class CreateAssignmentDto {
  @IsString()
  title!: string;

  @IsEnum(Tier)
  tier!: Tier;

  @IsEnum(Track)
  track!: Track;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsInt()
  @Min(0)
  hoursEstimate!: number;

  @IsString()
  requirementsMd!: string;

  @ValidateNested({ each: true })
  @Type(() => RubricItemDto)
  rubricItems!: RubricItemDto[];
}
