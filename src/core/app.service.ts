import { Injectable } from '@nestjs/common';
import { HealthResponse, HelloResponse } from './dto/responses';
import { MESSAGE, STATUS } from '@/common/constants';

@Injectable()
export class AppService {
  getHello(): HelloResponse {
    return {
      status: STATUS.OK,
      message: MESSAGE.GREATINGS,
    };
  }

  getHealth(): HealthResponse {
    return {
      status: STATUS.OK,
      timestamp: new Date().toISOString(),
    };
  }
}
