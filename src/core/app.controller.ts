import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthResponse, HelloResponse } from './dto/responses';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): HelloResponse {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): HealthResponse {
    return this.appService.getHealth();
  }
}
