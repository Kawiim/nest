import { Module } from '@nestjs/common';
import { MathModule } from './math/math.module';
import { StringModule } from './string/string.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    CommonModule,
    MathModule, 
    StringModule
  ],
})
export class AppModule {}
