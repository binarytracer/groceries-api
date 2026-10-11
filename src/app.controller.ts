import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';

@ApiTags('Health')
@Public()
@Controller('health')
export class AppController {
  @Get()
  health() {
    return { status: 'ok' };
  }
}
