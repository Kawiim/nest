import { Controller, Get, Inject, Logger, Req, Request } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Observable, switchMap } from 'rxjs';
import { MATH_SERVICE } from './math.constants';
import { STRING_SERVICE } from '../string/string.constants';
import { ConfigService } from '@nestjs/config';
import { TraceIdService } from '../common/services/trace-id.service';

@Controller()
export class MathController {
  private readonly logger = new Logger(MathController.name);

  constructor(
    @Inject(MATH_SERVICE) private readonly mathClient: ClientProxy,
    @Inject(STRING_SERVICE) private readonly stringClient: ClientProxy,

  ) {}

  @Get()
  execute(@Req() request: Request): Observable<string> {
    const traceId = (request as any).traceId || 'no-trace-id';
    const mathPattern = { cmd: 'sum' };
    const stringPattern = { cmd: 'convert' };
    const data = [1, 2, 3, 4, 5, 3];

    throw new Error('test');
    
    return this.mathClient.send<number>(mathPattern, { traceId, data }).pipe(
      switchMap((sumResult) => {
        return this.stringClient.send<string>(stringPattern, { traceId, value: sumResult });
      })
    );
  }

  @MessagePattern({ cmd: 'sum' })
  sum(requestData: { traceId: string; data: number[] }): number {
    const { traceId, data } = requestData;
    const result = (data || []).reduce((a, b) => a + b);
    this.logger.log( { traceId, data, result });
    return result;
  }

  @MessagePattern({ cmd: 'addRandom' })
  addRandomToString(requestData: { traceId: string; data: string }): string {
    const { traceId, data: inputString } = requestData;
    const randomNumber = Math.floor(Math.random() * 1000); // Random number 0-999
    const result = `${inputString}${randomNumber}`;
    this.logger.log('addRandomToString', { traceId, input: inputString, randomNumber, result });
    return result;
  }
}
