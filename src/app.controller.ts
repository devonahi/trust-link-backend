import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { getAppVersion } from './common/version';
import { ConfigService } from './config/config.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: this.configService.get('NODE_ENV'),
      version: getAppVersion(),
    };
  }

  @Get('version')
  @HttpCode(HttpStatus.OK)
  getVersion() {
    return {
      version: getAppVersion(),
      name: '@truestlink/trustlink-backend',
      environment: this.configService.get('NODE_ENV'),
    };
  }
}
