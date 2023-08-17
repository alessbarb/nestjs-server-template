import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Get API information' })
  @ApiResponse({ status: 200, description: 'Returns the API information' })
  @Get()
  getHello(): any {
    return this.appService.getHello();
  }
}
