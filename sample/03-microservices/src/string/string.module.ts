import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { STRING_SERVICE } from './string.constants';
import { MATH_SERVICE } from '../math/math.constants';
import { StringController } from './string.controller';

@Module({
  imports: [
    ClientsModule.register([
      { name: STRING_SERVICE, transport: Transport.TCP },
      { name: MATH_SERVICE, transport: Transport.TCP }
    ]),
  ],
  controllers: [StringController],
})
export class StringModule {}
