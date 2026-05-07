import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const id = req.headers['x-correlation-id'] || uuidv4();
    req['correlationId'] = id;
    res.setHeader('x-correlation-id', id);
    next();
  }
}
