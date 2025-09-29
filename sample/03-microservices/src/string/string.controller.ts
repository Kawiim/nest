import { Controller, Get, Inject, Logger, Req } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Observable, switchMap, of } from 'rxjs';
import { STRING_SERVICE } from './string.constants';
import { MATH_SERVICE } from '../math/math.constants';
import { TraceIdService } from '../common/services/trace-id.service';

@Controller()
export class StringController {
  private readonly logger = new Logger(StringController.name);

  constructor(
    @Inject(STRING_SERVICE) private readonly stringClient: ClientProxy,
    @Inject(MATH_SERVICE) private readonly mathClient: ClientProxy,
    private readonly traceIdService: TraceIdService
  ) {}

  @Get('generate')
  generateChain(@Req() request: Request): Observable<string> {
    const traceId = (request as any).traceId || 'no-trace-id';
    const randomString = this.generateRandomString(4);
    
    const mathPattern = { cmd: 'addRandom' };
    const requestData = { traceId, data: randomString };
    
    return this.mathClient.send<string>(mathPattern, requestData).pipe(
      switchMap((result) => {
        const finalResult = `toto${result}`;
        return of(finalResult);
      })
    );
  }

  @MessagePattern({ cmd: 'convert' })
  convertToString(requestData: { traceId: string; value: number }): string {
    const { traceId, value } = requestData;
    const result = `toto${value}`;
    return result;
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
