import { Param, ParamType } from '@discord-nestjs/core';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ClearDto {
  @Param({
    description: 'Number message to delete ',
    required: false,
    type: ParamType.INTEGER,
  })
  @IsNumber()
  @IsNotEmpty()
  number: number;
}
